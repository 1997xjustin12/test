import { ES_INDEX, createSlug, isNavVisible } from "./lib/helpers";
import { getCatalogExclusions } from "./lib/catalog-exclusions";
import { keys, redis } from "./lib/redis";

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
const ESURL = process.env.NEXT_ES_URL;
const ESApiKey = `apiKey ${process.env.NEXT_ES_API_KEY}`;

/**
 * Parse an Elasticsearch response, throwing when it is not a result.
 *
 * Elasticsearch reports a bad query as a JSON body with an `error` key, and
 * `data?.hits?.hits || []` turns that into an empty list — indistinguishable
 * from a catalogue with nothing in it. Each fetch below still degrades to an
 * empty section rather than failing the whole sitemap, but now says so loudly.
 */
async function readSearchResponse(response, label) {
  const data = await response.json();
  if (!response.ok || data?.error) {
    const reason = data?.error?.reason || data?.error?.type || `HTTP ${response.status}`;
    throw new Error(`${label}: ${reason}`);
  }
  return data;
}

/**
 * Fetch all published products from Elasticsearch.
 *
 * The exclusions are passed in. They used to be read here as bare variables
 * that only existed inside sitemap(), so this threw a ReferenceError, the catch
 * below swallowed it, and from 31 August 2026 the sitemap shipped with no
 * product URLs at all.
 */
async function fetchAllProducts({ excludedBrands = [], excludedCollections = [] } = {}) {
  try {
    const fetchConfig = {
      method: "POST",
      next: { revalidate: 3600 },
      headers: {
        Authorization: ESApiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        size: 10000, // Adjust based on your product count
        query: {
          bool: {
            must: [
              {
                term: {
                  published: true,
                },
              },
            ],
            must_not: [
              {
                terms: {
                  "brand.keyword": excludedBrands,
                },
              },
              {
                terms: {
                  "collections.name.keyword": excludedCollections,
                },
              },
            ],
            filter: [
              {
                exists: {
                  field: "brand.keyword",
                },
              },
              {
                exists: {
                  field: "handle.keyword",
                },
              },
            ],
          },
        },
        _source: ["handle", "brand", "updated_at"],
      }),
    };

    const response = await fetch(`${ESURL}/${ES_INDEX}/_search`, fetchConfig);
    const data = await readSearchResponse(response, "products");

    return data.hits?.hits?.map((hit) => hit._source) || [];
  } catch (error) {
    console.error("sitemap: product fetch FAILED — the sitemap will contain no product URLs.", error);
    return [];
  }
}

/**
 * Listing pages — /fireplaces, /electric-fireplaces, /napoleon and the rest —
 * from the navigation menu, which is exactly what /[slug] renders from.
 *
 * The sitemap used to guess these instead: one /{brand} URL per brand in
 * Elasticsearch, and no collection pages at all. So /fireplaces, the page the
 * September SEO audit found unknown to Google, was never submitted, while
 * /outdoorkitchenoutlet and /handles were submitted and answer 404 — brands in
 * the catalogue with no page of their own.
 *
 * Same rules as /[slug]: an item hidden in the menu 404s, so it is left out,
 * as is an excluded brand. Only single-segment URLs, because that is all
 * /[slug] serves.
 */
async function fetchMenuPages(excludedBrands = []) {
  try {
    const stored = await redis.get(keys.dev_shopify_menu.value);
    const menu = typeof stored === "string" ? JSON.parse(stored) : stored;
    if (!Array.isArray(menu)) throw new Error("menu is not a list");

    const pages = new Map();
    const walk = (items = [], depth = 0) => {
      for (const item of items) {
        const excluded =
          excludedBrands.includes(item?.name) || excludedBrands.includes(item?.origin_name);
        const url = typeof item?.url === "string" ? item.url.trim() : "";
        if (url && !/[/:?#\s]/.test(url) && isNavVisible(item) && !excluded && !pages.has(url)) {
          pages.set(url, depth);
        }
        walk(item?.children, depth + 1);
      }
    };
    walk(menu);

    return [...pages].map(([url, depth]) => ({ url, depth }));
  } catch (error) {
    console.error("sitemap: menu fetch FAILED — the sitemap will contain no listing pages.", error);
    return [];
  }
}

// Fetch all categories
async function fetchAllCategories() {
  try {
    const fetchConfig = {
      method: "POST",
      next: { revalidate: 3600 },
      headers: {
        Authorization: ESApiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        size: 0,
        aggs: {
          categories: {
            terms: {
              field: "accentuate_data.category",
              size: 1000,
            },
          },
        },
      }),
    };

    const response = await fetch(`${ESURL}/${ES_INDEX}/_search`, fetchConfig);
    const data = await readSearchResponse(response, "categories");

    return data.aggregations?.categories?.buckets?.map((bucket) => bucket.key) || [];
  } catch (error) {
    console.error("sitemap: category fetch FAILED — the sitemap will contain no category URLs.", error);
    return [];
  }
}

export default async function sitemap() {
  const { brands: excludedBrands, collections: excludedCollections } =
    await getCatalogExclusions();
  // Every URL here is absolute. Publishing them against a placeholder domain
  // would hand Google thousands of dead links and they would be cached and
  // crawled before anyone noticed, so an unset base URL yields an empty
  // sitemap instead. Empty is recoverable; wrong is not. Deliberately not a
  // throw: that would fail the whole build, and this variable is scoped to
  // production on some projects, which would take preview deploys down with it.
  if (!BASE_URL) {
    console.error(
      "sitemap: NEXT_PUBLIC_SITE_BASE_URL is not set; emitting an empty sitemap " +
        "rather than URLs on a placeholder domain.",
    );
    return [];
  }

  // Static routes with priorities.
  //
  // /cart and /search are intentionally absent. robots.js disallows /cart, so
  // submitting it asked Google to crawl a path we had already blocked — a
  // contradiction Search Console reports as a coverage error. /search is a
  // thin-content results page with no crawl value.
  const staticRoutes = [
    { url: "", priority: 1.0, changeFrequency: "daily" },
    { url: "/about", priority: 0.8, changeFrequency: "monthly" },
    { url: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { url: "/blogs", priority: 0.7, changeFrequency: "weekly" },
    { url: "/professional-program", priority: 0.7, changeFrequency: "monthly" },
    { url: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
    { url: "/return-policy", priority: 0.5, changeFrequency: "monthly" },
    { url: "/shipping-policy", priority: 0.5, changeFrequency: "monthly" },
  ].map((route) => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Fetch dynamic data
  const [products, menuPages, categories] = await Promise.all([
    fetchAllProducts({ excludedBrands, excludedCollections }),
    fetchMenuPages(excludedBrands),
    fetchAllCategories(),
  ]);

  // Product URLs
  const productUrls = products.map((product) => ({
    url: `${BASE_URL}/${createSlug(product.brand)}/product/${product.handle}`,
    lastModified: product.updated_at || new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Listing pages from the menu; top-level ones rank with products.
  const listingUrls = menuPages.map(({ url, depth }) => ({
    url: `${BASE_URL}/${url}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: depth === 0 ? 0.9 : 0.8,
  }));

  // Category URLs
  const categoryUrls = categories
    .filter((category) => category)
    .map((category) => ({
      url: `${BASE_URL}/category/${createSlug(category)}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  // Combine all URLs
  return [
    ...staticRoutes,
    ...listingUrls,
    ...categoryUrls,
    ...productUrls,
  ];
}
