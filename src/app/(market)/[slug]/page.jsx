import "@/app/styles/product-pages.css";

// Safety-net: pages self-heal after 24h; primary invalidation is on-demand
// via /api/revalidate-plp using revalidatePath + revalidateTag.
export const revalidate = 86400;

// Static (ISR) on every path, including ones first rendered on request.
//
// The product grid's <InstantSearchNext> (react-instantsearch-nextjs) calls
// next/headers' headers() on the server, unconditionally, to read a CSP nonce
// and the host for its URL routing — neither of which this app uses (no
// `routing` prop; the CSP has no nonce). At build that call is tolerated, so
// prebuilt category pages worked. But any category page rendered at runtime —
// a new category, a revalidation, or every page once a build couldn't prebuild
// (Redis out of quota, 19 Oct 2026) — failed with "Route /[slug] couldn't be
// rendered statically because it used `headers`", and the live site answered
// 500. force-static hands headers() an empty value instead of throwing, which
// is what the build effectively did. Nothing on this page reads the request:
// sort, filters and pagination are applied client-side.
export const dynamic = "force-static";

import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";

import { keys, redis } from "@/app/lib/redis";
import { readOrLastKnownGood } from "@/app/lib/upstream";
import { STORE_NAME, fillStoreSlots } from "@/app/lib/store_constants";
import {
  getRootByUrl,
  getPageData,
  BASE_URL,
  BaseNavKeys,
  ES_INDEX,
  ISBBQ,
  ISOKO,
  isNavVisible,
} from "@/app/lib/helpers";
import { excludedMenuUrls, getCatalogExclusions } from "@/app/lib/catalog-exclusions";
import { fetchCollectionsCount } from "@/app/lib/fn_server";
import { internalHeaders } from "@/app/lib/rate-limit";

import NewProductGallery from "@/app/components/new-design/page/ProductGallery";
import BBQProductGallery from "@/app/components/bbq-design/page/ProductGallery";
import OKOProductGallery from "@/app/components/oko-design/page/ProductGallery";
import NewDesignBasePlp from "@/app/components/new-design/page/BasePlp";
import BBQBasePlp from "@/app/components/bbq-design/page/BasePlp";
import OKOBasePlp from "@/app/components/oko-design/page/BasePlp";
import { toClientHits, toListingProducts } from "@/app/lib/listing-data";
import {
  buildBreadcrumbs,
  buildItemList,
  serializeJsonLd,
} from "@/app/lib/structured-data";

// Computes the Elasticsearch filter string from page metadata.
// Mirrors the same logic in ProductsSectionV2 so V2 can receive the correct
// filterString as a prop on the very first render — before its context
// useEffect resolves — preventing a blank→filtered re-render cycle.
function computeFilterString(d) {
  const base = baseFilterString(d);
  // The page's menu address, so the server applies its pinned products
  // (docs/pinned-products.md). Must match ProductsSectionV2.
  return base && d?.url && d?.name !== "Search" ? `${base}:${d.url}` : base;
}

function baseFilterString(d) {
  if (!d) return "";
  if (d.nav_type === "category")
    return `page_category:${d.origin_name}:${d.filter_type}`;
  if (d.nav_type === "brand")
    return `page_brand:${d.origin_name}:${d.filter_type}`;
  if (d.nav_type === "custom_page") {
    if (d.name === "Search") return "custom_page:Search:Search";
    if (BaseNavKeys.includes(d.name))
      return `custom_page:${d.name}:${d.filter_type}`;
    return `custom_page:${d.collection_display?.name || "NA"}:${d.filter_type}`;
  }
  if (d.nav_type === "category1")
    return `page_category1:${d.name}:${d.filter_type}`;
  return "";
}

// Fetches and caches the first-page product hits for a given filter string.
// Cached for 24h (revalidate: 86400) and tagged so the /api/revalidate-plp
// endpoint can bust all PLP caches instantly when product data is updated.
// Throws on failure so unstable_cache never caches an error response.
const getInitialHits = unstable_cache(
  async (filterString) => {
    const body = [
      {
        indexName: ES_INDEX,
        params: {
          hitsPerPage: 30,
          page: 0,
          query: "",
          ...(filterString ? { filter: filterString } : {}),
        },
      },
    ];
    const res = await fetch(
      `${BASE_URL}/api/es/searchkit`,
      {
        method: "POST",
        // App's own SSR call - exempt from rate limiting.
        headers: { "Content-Type": "application/json", ...internalHeaders() },
        body: JSON.stringify(body),
      },
    );
    if (!res.ok) throw new Error(`Searchkit prefetch failed: ${res.status}`);
    const data = await res.json();
    // The endpoint returns { results: [ { hits, ... } ] }. This previously read
    // data?.[0]?.hits — indexing the object, not the array — which is always
    // undefined, so the prefetch threw on every request and the caller's
    // .catch(() => null) hid it. unstable_cache does not cache a thrown error,
    // so every PLP render also paid for a wasted Elasticsearch round-trip.
    // data?.[0] is kept as a fallback in case the endpoint is ever changed to
    // return the bare array this code originally assumed.
    const hits = data?.results?.[0]?.hits ?? data?.[0]?.hits;
    if (!hits?.length) throw new Error("No hits returned");
    return hits;
  },
  ["plp-initial-hits"],
  { revalidate: 86400, tags: ["plp-initial-hits"] },
);

const defaultMenuKey = keys.dev_shopify_menu.value;

// Cached so both generateMetadata and the page function share one Redis read
// per cache window instead of two live round-trips per request.
const getMenuData = unstable_cache(
  () => redis.get(defaultMenuKey),
  ["nav-menu"],
  { revalidate: 86400, tags: ["nav-menu"] },
);

/**
 * The children a listing page should actually show.
 *
 * Two separate reasons an entry is dropped, and they are not interchangeable:
 *
 *   nav_visibility   an operator hid it from the menu builder
 *   exclude_brands   the brand is suppressed catalogue-wide
 *
 * The second is what keeps /brands honest. Excluded brands are filtered out of
 * Elasticsearch by publishedQuery, so their products disappear everywhere —
 * but the brand links on /brands come from the Redis menu, which knows nothing
 * about that list. Left alone, /brands advertises a brand whose page then
 * renders empty, and disagrees with /categories, which reads the same list from
 * the catalogue and does drop it.
 *
 * Harmless on non-brand pages: a category name is never in the brand list.
 *
 * Takes the list as an argument rather than reading it, so this stays a pure
 * function and the single Redis read happens once per render in the caller.
 */
const listingChildren = (children = [], excludedBrands = []) =>
  children.filter(
    (child) =>
      isNavVisible(child) &&
      !excludedBrands.includes(child?.origin_name) &&
      !excludedBrands.includes(child?.name),
  );

const flattenNav = (navItems) => {
  const result = [];
  const extractLinks = (items) => {
    items.forEach(({ children = [], ...rest }) => {
      result.push({ ...rest, children });
      extractLinks(children);
    });
  };
  extractLinks(navItems);
  return result;
};

/**
 * BreadcrumbList + ItemList for a listing page, serialized, or null.
 *
 * The product grid hydrates client-side, so the ItemList is what describes the
 * first page of products to a crawler — see
 * docs/agentic-ai/agentic-ai-readiness.md (Tier 2.1).
 */
const listingJsonLd = ({ name, url, hits }) =>
  serializeJsonLd(
    buildBreadcrumbs([{ name, url: `/${url}` }]),
    buildItemList({ name, url: `/${url}`, products: toListingProducts(hits || []) }),
  );

function ListingJsonLd({ json }) {
  if (!json) return null;
  return (
    // eslint-disable-next-line react/no-danger
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}

/**
 * The menu this page is built from — the stored one, else the last one this
 * instance saw, else the bundled snapshot of 16 Oct 2026.
 *
 * The snapshot is the last resort, and it exists because of what happened
 * without it. With Upstash out of quota a deploy prebuilds no category pages
 * (see generateStaticParams), so each renders on its first request — and with
 * Redis refusing, a fresh instance had no menu at all: every category page on
 * the live site answered 500 (19 Oct 2026). The snapshot is the header's trimmed
 * copy, so it carries everything the listing needs (url, name, nav_type,
 * filter_type, collection_display, visibility) but not the SEO title and
 * description or the editor's sections; those pages fall back to their name
 * as title until Redis is back. Replace it with a fresh snapshot once it is.
 */
async function readMenu() {
  let menu;
  try {
    menu = await readOrLastKnownGood("nav-menu", getMenuData);
  } catch (error) {
    console.error("[slug] menu unavailable, using the bundled snapshot:", error?.message || error);
  }
  // Redis answering with no menu is as unusable as Redis not answering: a new,
  // still-empty database (kv.solanabbqgrills.com before the Nov 1 migration)
  // returns null without throwing, and every category page answered 500.
  if (Array.isArray(menu) && menu.length) return menu;
  if (menu !== undefined) console.error("[slug] stored menu is empty, using the bundled snapshot");
  return (await import("@/app/data/nav-menu-oct-16.json")).default;
}

export async function generateStaticParams() {
  // Prebuilding is an optimisation; a deploy must not depend on it. With Redis
  // unreachable (October 2026: the Upstash quota ran out) this read threw and
  // failed every build, so nothing could ship — not even the fix for the
  // quota. With no menu, build nothing: dynamicParams is on, so every category
  // page renders on first request instead, and the next build prebuilds again.
  let menuData;
  try {
    menuData = await getMenuData();
    // An empty database answers null rather than throwing; flattenNav(null)
    // then failed the build ("Failed to collect page data for /[slug]").
    if (!Array.isArray(menuData) || !menuData.length) {
      console.error("[slug] generateStaticParams: no menu stored, prebuilding no pages");
      return [];
    }
  } catch (error) {
    console.error("[slug] generateStaticParams: menu unreadable, prebuilding no pages:", error?.message || error);
    return [];
  }
  const flatData = flattenNav(menuData);
  const { brands } = await getCatalogExclusions();
  const excluded = excludedMenuUrls(menuData, brands);

  return flatData
    .filter((item) => item.url)
    // No point prebuilding a page that answers 404. Not a security boundary —
    // dynamicParams is on, so an un-hidden item renders on demand and is picked
    // up by the next build rather than staying missing.
    .filter(isNavVisible)
    // Same rule for a brand excluded catalogue-wide, and for the same reason —
    // but here it is load-bearing rather than an optimisation. A prebuilt 404
    // cannot be re-rendered on demand: Next answers the revalidation with
    // "couldn't be rendered statically because it used headers" and serves 500,
    // permanently, until the next deploy. So re-including a brand would have
    // left its pages broken rather than restored. Measured 13 Oct 2026: with
    // the page prebuilt, un-excluding gave 500 on every attempt; left out of
    // the build, it renders on demand and comes straight back.
    .filter((item) => !excluded.has(item.url))
    .map((item) => ({ slug: item.url }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const menuData = await readMenu();
  const flatData = flattenNav(menuData);
  const pageData = getPageData(slug, flatData);

  // Hidden items 404 below, so they must not advertise a title and description
  // — metadata for a page that does not exist is what puts it in a search
  // result that then dead-ends.
  if (!pageData || !isNavVisible(pageData)) return {};

  // An excluded brand 404s below, so it gets no title or description either.
  const { brands } = await getCatalogExclusions();
  if (excludedMenuUrls(menuData, brands).has(slug)) return {};

  return {
    // Pagination, sorting and filters live in the query string and are applied
    // client-side, so /electric-fireplaces?page=2, ?sort=… and ?filter:…=…
    // all server-render page one's HTML. Without a canonical each was a
    // separate, duplicate URL. Product and /category pages already set theirs.
    alternates: { canonical: `${BASE_URL}/${slug}` },
    // The menu is shared by all three brands, so its meta copy is written with
    // {store} for the brand name (fillStoreSlots). Without any, the fallbacks
    // name this brand and this page — they used to be Solana's fireplace line
    // ("wood, gas, and electric designs") on every page of every brand.
    title:
      fillStoreSlots(pageData.meta_title) ||
      (pageData.name ? `${pageData.name} | ${STORE_NAME}` : STORE_NAME),
    description:
      fillStoreSlots(pageData.meta_description) ||
      `Shop ${pageData.name || "our collection"} at ${STORE_NAME}. Browse our full selection with expert advice, competitive pricing, and free shipping on selected items.`,
  };
}

export default async function GenericCategoryPage({ params }) {
  const { slug } = await params;
  // A listing page is built from the menu, and an unreadable menu must not
  // answer notFound(): a 404 for a real URL can be cached and indexed. readMenu
  // serves the stored menu, else the one this instance last saw, else the
  // bundled snapshot — see above. See also lib/upstream.js.
  const menuData = await readMenu();
  if (!Array.isArray(menuData)) {
    throw new Error(`nav menu unavailable while rendering /${slug}`);
  }
  const flatData = flattenNav(
    menuData.map((i) => ({
      ...i,
      is_base_nav: !["On Sale", "New Arrivals"].includes(i?.name),
    })),
  );
  const rawPageData = getPageData(slug, flatData);
  const url = rawPageData?.url;

  if (!rawPageData || !url) return notFound();

  const { brands: excludedBrands } = await getCatalogExclusions();

  // Hidden in the menu means gone, not merely unlinked.
  //
  // Left reachable, these rendered as a real page with a heading, a filter
  // sidebar and no products — which reads as a broken storefront rather than a
  // deliberate removal, and stays indexable. The case that forced it: a brand
  // added to exclude_brands still had its menu pages, so every one of them
  // became a live, empty, crawlable page.
  //
  // Only the listing route. A product still sells at its own URL — hiding a
  // menu entry is a navigation decision and must not silently unpublish the
  // catalogue underneath it.
  if (!isNavVisible(rawPageData)) return notFound();

  // An excluded brand has no pages either — nor do its sub-collections.
  //
  // Excluding one used to remove its links and leave the pages behind:
  // /sole-gourmet and its six sub-collections each answered 200 with a heading,
  // a filter sidebar and no products, which reads as a broken storefront rather
  // than a deliberate removal, and stayed indexable. The guard above catches a
  // brand hidden in the menu builder; this one catches a brand excluded
  // catalogue-wide, which is a different switch in a different screen.
  //
  // Unlike the menu-visibility case, this takes the products with it — see
  // isExcludedProductBrand. Hiding a menu entry is a navigation decision;
  // excluding a brand is a statement about the catalogue.
  if (excludedMenuUrls(menuData, excludedBrands).has(url)) return notFound();

  // Filtered once here rather than in each theme's BasePlp, so the three
  // storefronts cannot drift on which brands they list.
  const pageData = {
    ...rawPageData,
    children: listingChildren(rawPageData.children, excludedBrands),
  };

  if (pageData.is_base_nav) {
    // Top-level pages — /fireplaces and its siblings — used to render their
    // product grid without the filter or first page the gallery routes below
    // pass in. ProductsSectionV2 only works the filter out in a useEffect, so
    // the server HTML held the first 30 products of the whole catalogue —
    // identical on /fireplaces, /patio-heaters, /built-in-grills,
    // /freestanding-grills and /open-box — and crawlers read the five as
    // duplicates. They also returned before any structured data was built.
    // Both now match the gallery routes.
    const baseFilterString = computeFilterString(pageData);
    const baseHits = await getInitialHits(baseFilterString).catch(() => null);
    const baseJsonLd = listingJsonLd({ name: pageData.name || slug, url, hits: baseHits });
    const basePlpProps = {
      page_details: pageData,
      initialFilterString: baseFilterString,
      // Trimmed: the grid is a client component, so these are serialised into
      // the page. The JSON-LD above is built from the untrimmed hits.
      initialHits: toClientHits(baseHits),
    };

    if (ISOKO) {
      return (
        <div className="min-h-svh bg-ash dark:bg-char">
          <ListingJsonLd json={baseJsonLd} />
          <OKOBasePlp {...basePlpProps} />
        </div>
      );
    }
    if (ISBBQ) {
      return (
        <div className="min-h-svh bg-ash dark:bg-char">
          <ListingJsonLd json={baseJsonLd} />
          <BBQBasePlp {...basePlpProps} />
        </div>
      );
    }
    return (
      <div className="min-h-svh bg-white dark:bg-gray-950">
        <ListingJsonLd json={baseJsonLd} />
        <NewDesignBasePlp {...basePlpProps} />
      </div>
    );
  }

  const rootNav = getRootByUrl(menuData, url);
  if (!rootNav) return notFound();

  // Same filter as the listing above. These become the subcategory tabs on a
  // gallery page, and they come from getRootByUrl rather than pageData — so
  // without this a hidden item stays out of the menu and the /brands list, then
  // reappears as a tab here.
  const children = listingChildren(rootNav?.children, excludedBrands);
  const collection_ids = children
    .map((item) => item?.collection_display?.id)
    .filter(Boolean);

  const filterString = computeFilterString(pageData);

  // Always prefetch page-0 hits. ProductsSectionV2 checks window.location
  // client-side and ignores these when URL params are active, so there is
  // no wrong-results flash and the server component stays param-free
  // (required for generateStaticParams / full-page ISR caching to work).
  const [collection_aggs, initialHits] = await Promise.all([
    fetchCollectionsCount(collection_ids),
    getInitialHits(filterString).catch(() => null),
  ]);

  const buckets =
    collection_aggs?.aggregations?.counts_per_collection?.buckets || [];

  const countMap = new Map(buckets.map((b) => [String(b.key), b.doc_count]));

  const subs = children.map((item) => {
    const col_id = item?.collection_display?.id;
    return {
      id: col_id,
      name: item?.name,
      count: countMap.get(String(col_id)) || 0,
      url: `${BASE_URL}/${item?.url}`,
    };
  });

  const jsonLd = listingJsonLd({ name: rootNav?.name || slug, url, hits: initialHits });
  // Trimmed for the client grid; the JSON-LD above uses the untrimmed hits.
  const clientHits = toClientHits(initialHits);

  if (ISOKO) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <ListingJsonLd json={jsonLd} />
        <OKOProductGallery
          slug={slug}
          config={{ root: rootNav, url, subs }}
          filterType={pageData?.filter_type ?? null}
          initialFilterString={filterString}
          initialHits={clientHits}
        />
      </div>
    );
  }

  if (ISBBQ) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <ListingJsonLd json={jsonLd} />
        <BBQProductGallery
          slug={slug}
          config={{ root: rootNav, url, subs }}
          filterType={pageData?.filter_type ?? null}
          initialFilterString={filterString}
          initialHits={clientHits}
        />
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-white dark:bg-gray-950">
      <ListingJsonLd json={jsonLd} />
      <NewProductGallery
        slug={slug}
        config={{ root: rootNav, url, subs }}
        filterType={pageData?.filter_type ?? null}
        initialFilterString={filterString}
        initialHits={clientHits}
      />
    </div>
  );
}
