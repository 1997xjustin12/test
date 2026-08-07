import { STORE_ID } from "@/app/lib/store";

/**
 * The one place that knows what this app caches.
 *
 * Before this existed the answer was spread across six revalidate endpoints
 * that had each been written for a single caller and then drifted:
 * /api/revalidate-all advertised itself as "clears all unstable_cache entries
 * across the site" while busting 6 of the 14 tags actually in use — product
 * data, reviews, FAQs, store settings, YMAL and the homepage category preloads
 * all survived it. Every clear path now reads this file, so adding a new
 * unstable_cache means adding it here and the admin button picks it up.
 *
 * Group shape:
 *   id      - stable key, used by the API and the UI
 *   label   - what an operator calls it
 *   blurb   - what actually goes stale if this is not cleared
 *   tags    - revalidateTag() targets
 *   paths   - revalidatePath() targets, [path, type] pairs
 *   redis   - SCAN MATCH patterns deleted from Upstash
 *   ttl     - how long an entry lives if nobody clears it
 *   shared  - true when the entry is NOT store-scoped, i.e. clearing it here
 *             also clears it for the other brands on the same Redis
 */
export const CACHE_GROUPS = [
  {
    id: "layout",
    label: "Layout & navigation",
    blurb:
      "Menu tree, logo, theme colour and the unique-category list used by the header, footer and homepage category grid.",
    tags: ["layout-data", "nav-menu", "categories"],
    paths: [],
    redis: [],
    ttl: "24h",
    shared: false,
  },
  {
    id: "home",
    label: "Homepage products",
    blurb: "Featured collection rows on the homepage.",
    tags: ["home-products"],
    paths: [["/", "page"]],
    redis: [],
    ttl: "24h",
    shared: false,
  },
  {
    id: "plp",
    label: "Category & collection pages",
    blurb:
      "First-page product hits prefetched for each PLP, collection counts, and the Elasticsearch filter/pagination responses cached in Redis.",
    tags: ["plp-initial-hits", "collections-count"],
    paths: [],
    // Written by pages/api/es/searchkit.js. 24h for page-0 unfiltered
    // requests, 60s for anything filtered.
    redis: ["searchkit:*"],
    ttl: "24h (Redis: 24h / 60s)",
    shared: true,
  },
  {
    id: "pdp",
    label: "Product pages",
    blurb:
      "Product detail data, review lists, the shared FAQ blocks and You-May-Also-Like rows.",
    tags: ["pdp", "pdp-faqs", "pdp-reviews", "ymal"],
    paths: [["/[slug]/product/[product_path]", "page"]],
    redis: [],
    ttl: "24h (reviews & YMAL: 1h)",
    shared: false,
  },
  {
    id: "settings",
    label: "Store settings & SEO",
    blurb:
      "Store Settings values and the per-route Page SEO overrides. Both are store-scoped in Redis and in the data cache.",
    tags: ["store-settings", "page-seo"],
    paths: [],
    redis: [],
    ttl: "24h",
    shared: false,
  },
  {
    id: "blog",
    label: "Blog",
    blurb: "Resolved blog category id used to list posts.",
    tags: ["blog-category"],
    paths: [],
    redis: [],
    ttl: "24h",
    shared: false,
  },
  {
    id: "feeds",
    label: "Sitemap & merchant feed",
    blurb:
      "sitemap.xml and products_sitemap.xml, plus the hourly fetch cache behind them. Use XML Feeds if you also want to rebuild and verify them now.",
    tags: [],
    paths: [
      ["/sitemap.xml", "page"],
      ["/products_sitemap.xml", "page"],
    ],
    redis: [],
    ttl: "1h",
    shared: false,
  },
];

/**
 * Caches this button provably cannot reach. Listed in the UI on purpose —
 * "clear cache" that silently leaves stale HTML on a CDN is worse than one that
 * tells you where to look next.
 */
export const UNREACHABLE_CACHES = [
  {
    label: "CDN — product pages",
    detail: "Cache-Control: s-maxage=300, stale-while-revalidate=86400",
    why: "Set in next.config.ts. revalidatePath cannot reach a CDN edge; wait 5 minutes or purge at the CDN.",
  },
  {
    label: "CDN — /api/popular_searches",
    detail: "max-age=300, stale-while-revalidate=600",
    why: "Same as above. Self-heals within 5 minutes.",
  },
  {
    label: "Browser & CDN — /_next/static",
    detail: "max-age=31536000, immutable",
    why: "Content-hashed filenames, so a new deploy replaces them. Never needs clearing.",
  },
  {
    label: "Next Image optimizer",
    detail: "minimumCacheTTL: 86400",
    why: "Keyed by source URL. Re-upload under a new filename to force a refresh.",
  },
  {
    label: "In-process search cache",
    detail: "Map in pages/api/es/shopify/search.js, 5 min TTL, 200 entries",
    why: "Lives in one server instance's memory. On Vercel each lambda has its own; only a redeploy clears them all. Expires in 5 minutes regardless.",
  },
  {
    label: "Browser — search autocomplete",
    detail: "In-memory Map in context/search.js, 5 min TTL",
    why: "Per visitor, per tab. Cleared by a page reload.",
  },
];

/** Every revalidateTag target, deduped. */
export const ALL_TAGS = [
  ...new Set(CACHE_GROUPS.flatMap((g) => g.tags)),
];

/** Every revalidatePath target, deduped by path. */
export const ALL_PATHS = (() => {
  const seen = new Map();
  for (const g of CACHE_GROUPS) {
    for (const [path, type] of g.paths) seen.set(path, type);
  }
  return [...seen.entries()];
})();

/** Every Redis SCAN pattern, deduped. */
export const ALL_REDIS_PATTERNS = [
  ...new Set(CACHE_GROUPS.flatMap((g) => g.redis)),
];

export const getGroups = (ids) =>
  !ids?.length
    ? CACHE_GROUPS
    : CACHE_GROUPS.filter((g) => ids.includes(g.id));

export const CACHE_STORE_ID = STORE_ID;
