import "@/app/styles/product-pages.css";
import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import { STORE_NAME } from "@/app/lib/store_constants";
import { BASE_URL } from "@/app/lib/helpers";
import { fetchUniqueCategories } from "@/app/lib/fn_server";
import {
  categoryFilterString,
  getListingHits,
  toListingProducts,
} from "@/app/lib/listing-data";
import {
  buildBreadcrumbs,
  buildItemList,
  serializeJsonLd,
} from "@/app/lib/structured-data";
import NewCategory from "@/app/components/new-design/page/Category";
import BBQCategory from "@/app/components/bbq-design/page/Category";
import OKOCategory from "@/app/components/oko-design/page/Category";

function toTitleCase(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Resolves the category from Elasticsearch rather than the client context the
 * page body uses. generateMetadata and the page both call this, and
 * fetchUniqueCategories is already cached upstream, so it is one read per
 * cache window rather than two round-trips per request.
 */
async function resolveCategory(category_slug) {
  try {
    const categories = (await fetchUniqueCategories()) || [];
    return categories.find((c) => c?.slug === category_slug) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { category_slug } = await params;

  // Prefer real category data; fall back to the slug so metadata still renders
  // if Elasticsearch is unavailable.
  const category = await resolveCategory(category_slug);
  const categoryName = category?.name || toTitleCase(category_slug);

  const title = `${categoryName} | ${STORE_NAME}`;
  const description = category?.sub
    ? `Shop ${categoryName} at ${STORE_NAME} — ${category.sub}. ${category.count ? `${category.count} products, ` : ""}expert advice and competitive pricing.`
    : `Shop ${categoryName} at ${STORE_NAME}. Browse our full selection with expert advice, competitive pricing, and free shipping available.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/category/${category_slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/category/${category_slug}`,
      siteName: STORE_NAME,
    },
  };
}

async function page({ params }) {
  const { category_slug } = await params;

  // The visible grid is still rendered by <InstantSearch> on the client, so
  // this page has no server-rendered products. Describing the same first page
  // of results in JSON-LD is what makes the category legible to crawlers and
  // AI agents — see docs/agentic-ai-readiness.md (Tier 2.1).
  const category = await resolveCategory(category_slug);

  const { hits } = category
    ? await getListingHits(categoryFilterString(category))
    : { hits: [] };

  const jsonLd = serializeJsonLd(
    buildBreadcrumbs([
      { name: "Categories", url: "/categories" },
      {
        name: category?.name || toTitleCase(category_slug),
        url: `/category/${category_slug}`,
      },
    ]),
    buildItemList({
      name: category?.name || toTitleCase(category_slug),
      url: `/category/${category_slug}`,
      products: toListingProducts(hits),
    }),
  );

  return (
    <>
      {jsonLd && (
        // eslint-disable-next-line react/no-danger
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      {ISOKO ? (
        <OKOCategory category_slug={category_slug} />
      ) : ISBBQ ? (
        <BBQCategory category_slug={category_slug} />
      ) : (
        <NewCategory category_slug={category_slug} />
      )}
    </>
  );
}

export default page;
