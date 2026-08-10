import { unstable_cache } from "next/cache";
import { ES_INDEX, createSlug } from "@/app/lib/helpers";
import { internalHeaders } from "@/app/lib/rate-limit";

/**
 * Server-side product reads for listing pages.
 *
 * Listing grids (category, brand, collection) are rendered by <InstantSearch>
 * on the client, so a crawler or AI agent sees an empty page. These helpers let
 * a server component fetch the same first page of results the user will see, so
 * it can be described in JSON-LD. See docs/agentic-ai-readiness.md.
 *
 * The filter string format mirrors computeFilterString() in [slug]/page.jsx and
 * the useMemo in ProductsSectionV2 — that is deliberate. The ItemList we emit
 * must describe the products actually rendered; a schema that disagrees with the
 * visible grid is cloaking, not optimisation.
 */

export const HITS_PER_PAGE = 30;

/**
 * Unwraps a searchkit response.
 *
 * The endpoint returns `{ results: [ { hits, nbHits, ... } ] }`. The original
 * getInitialHits() in [slug]/page.jsx read `data?.[0]?.hits` — indexing the
 * object rather than the array — which is always undefined, so the prefetch
 * threw on every request and was silently swallowed by its .catch(() => null).
 * Both shapes are accepted here so this keeps working if the endpoint is ever
 * changed to return the bare array its callers originally assumed.
 */
export function unwrapSearchkit(data) {
  const first = data?.results?.[0] ?? data?.[0];
  return {
    hits: first?.hits || [],
    total: first?.nbHits ?? 0,
  };
}

/**
 * Builds the searchkit filter string for a category-root page
 * (/category/[category_slug]).
 *
 * ProductsSectionV2 resolves the same value from client context as
 * `page_category1:${name}:${filter_type}`. Categories from
 * mapCategoryResults() carry no filter_type, so the literal string
 * "undefined" is part of the contract the API already expects — verified
 * against the live endpoint, which returns 1087 hits for
 * "page_category1:Grills & Smokers:undefined", matching the rendered count.
 */
export const categoryFilterString = (category) =>
  category?.name
    ? `page_category1:${category.name}:${category.filter_type}`
    : "";

/** Product URL as the storefront builds it: /{brand-slug}/product/{handle}. */
export const productPath = (hit) => {
  if (!hit?.handle) return null;
  const brandSlug = createSlug(hit.brand || "");
  return brandSlug ? `/${brandSlug}/product/${hit.handle}` : null;
};

/**
 * Reduces raw Elasticsearch hits to the fields buildItemList() consumes.
 * Kept narrow on purpose — an ItemList carrying whole product documents is
 * both enormous and a gift to scrapers.
 */
export function toListingProducts(hits = []) {
  return (hits || [])
    .map((hit) => {
      const url = productPath(hit);
      if (!url || !hit?.title) return null;
      const variant = hit?.variants?.[0];
      const image =
        hit?.images?.find((i) => i?.position === 1)?.src ||
        hit?.images?.[0]?.src ||
        null;
      return {
        title: hit.title,
        url,
        image,
        brand: hit.brand || null,
        sku: variant?.sku || null,
        price: variant?.price ?? null,
        available: hit?.published !== false,
      };
    })
    .filter(Boolean);
}

/**
 * First page of hits for a filter string, cached 24h under the same
 * "plp-initial-hits" tag the admin Cache screen and /api/revalidate-plp bust.
 *
 * Returns an empty result rather than throwing: a listing page must still
 * render if Elasticsearch is unavailable — it just loses its JSON-LD. Note
 * unstable_cache does not cache a thrown error, so the previous throw-on-empty
 * behaviour meant a failing query was re-issued on every single request.
 */
export const getListingHits = unstable_cache(
  async (filterString, hitsPerPage = HITS_PER_PAGE) => {
    const base = process.env.NEXT_PUBLIC_SITE_BASE_URL;
    if (!base) return { hits: [], total: 0 };

    try {
      const res = await fetch(`${base}/api/es/searchkit`, {
        method: "POST",
        // Marks this as the app's own SSR call so it is exempt from rate limiting.
        headers: { "Content-Type": "application/json", ...internalHeaders() },
        body: JSON.stringify([
          {
            indexName: ES_INDEX,
            params: {
              hitsPerPage,
              page: 0,
              query: "",
              ...(filterString ? { filter: filterString } : {}),
            },
          },
        ]),
      });
      if (!res.ok) return { hits: [], total: 0 };
      return unwrapSearchkit(await res.json());
    } catch {
      return { hits: [], total: 0 };
    }
  },
  ["listing-initial-hits"],
  { revalidate: 86400, tags: ["plp-initial-hits"] },
);
