import { unstable_cache } from "next/cache";
import { readOrDegrade } from "@/app/lib/upstream";
import { redis } from "@/app/lib/redis";
import { exclude_brands, exclude_collections } from "@/app/lib/helpers";

/**
 * Brands and collections suppressed across the whole catalogue.
 *
 * These were static arrays in helpers.js, so hiding a brand meant editing code
 * and shipping a deploy — and, because the value is inlined at build time, a
 * half-updated dev server could serve one list from the App Router and another
 * from Pages. They now live in Redis and are editable at
 * /admin/catalog-exclusions.
 *
 * DELIBERATELY GLOBAL, not store-scoped. Every other Redis key in this app goes
 * through storeKey() so brands cannot read each other's data; this one does the
 * opposite on purpose, because the exclusion list describes the shared
 * catalogue rather than a brand's presentation of it. One list, three
 * storefronts — which also means an edit here changes all three, and the admin
 * screen says so.
 *
 * The static arrays remain in helpers.js as the fallback beneath this. If Redis
 * is empty or unreachable the old list still applies, so the failure mode is a
 * stale exclusion list rather than every suppressed brand reappearing on
 * production at once.
 */

/** Shared by all brands — no storeKey(). See the note above. */
export const CATALOG_EXCLUSIONS_KEY = "catalog_exclusions";

/** Cache tag, so a save busts every read immediately. */
export const CATALOG_EXCLUSIONS_TAG = "catalog-exclusions";

/** The pre-Redis lists, still the fallback and the seed for a first save. */
export const DEFAULT_EXCLUSIONS = Object.freeze({
  brands: exclude_brands,
  collections: exclude_collections,
});

/** Trimmed, de-duplicated, empties dropped. Order is preserved for the UI. */
export function normalizeList(value) {
  if (!Array.isArray(value)) return null;
  return [...new Set(value.map((v) => String(v ?? "").trim()).filter(Boolean))];
}

/**
 * The live exclusion lists.
 *
 * A stored array wins even when it is empty — that is the admin saying "exclude
 * nothing", and it must not be mistaken for "nothing saved yet". Only a missing
 * record or an unusable one falls back to the defaults, which is why the check
 * is Array.isArray rather than a truthiness test on length.
 */
const readCatalogExclusions = unstable_cache(
  async () => {
    const stored = await redis.get(CATALOG_EXCLUSIONS_KEY);
    if (!stored || typeof stored !== "object") return { ...DEFAULT_EXCLUSIONS };

    return {
      brands: normalizeList(stored.brands) ?? DEFAULT_EXCLUSIONS.brands,
      collections:
        normalizeList(stored.collections) ?? DEFAULT_EXCLUSIONS.collections,
    };
  },
  // No STORE_ID in the cache key, unlike store-settings: one list serves every
  // brand, so one cache entry should too.
  ["catalog-exclusions"],
  { revalidate: 86400, tags: [CATALOG_EXCLUSIONS_TAG] },
);

/**
 * The exclusion lists, or the safest answer available.
 *
 * Failing to the built-in list is deliberate: empty lists would republish every
 * suppressed brand across all three storefronts the moment Redis blinked. What
 * changed is where that decision is made. Catching inside unstable_cache stored
 * the fallback, so one blip ignored the admin's saved lists for 24 hours; now
 * the read fails out of the cache, nothing is written, and this instance's last
 * good answer is preferred over the built-in list. See lib/upstream.js.
 */
export const getCatalogExclusions = () =>
  readOrDegrade("catalog-exclusions", readCatalogExclusions, {
    ...DEFAULT_EXCLUSIONS,
  });

/** Writes both lists. Callers are responsible for busting the cache tag. */
export async function saveCatalogExclusions({ brands, collections } = {}) {
  const record = {
    brands: normalizeList(brands) ?? [],
    collections: normalizeList(collections) ?? [],
    updatedAt: new Date().toISOString(),
  };
  await redis.set(CATALOG_EXCLUSIONS_KEY, record);
  return record;
}

/**
 * Every menu url that belongs to an excluded brand — its own page, and
 * everything beneath it.
 *
 * Excluding a brand removed its links but left its pages reachable: /sole-gourmet
 * and its six sub-collections each answered 200 with a heading, no products and
 * no noindex, and the sub-collections were still in sitemap.xml. Found on 13
 * October 2026 on all three storefronts, so not a deployment quirk — the
 * navigation was filtered and the router was not.
 *
 * Matching happens at the brand node and the subtree is taken whole, rather
 * than testing each descendant. That is the only way it can work: the children
 * are named "Sole Gourmet Grills", "Sole Gourmet Storage" and so on, and the
 * exclusion list holds "Sole Gourmet". A name test on each node matches the
 * parent and misses every child — which is exactly what the sitemap walk did.
 *
 * Still an exact match on the brand itself, for the reason it always was: a
 * looser one would take "American Fyre Designs" down with "American Fire Glass".
 */
export function excludedMenuUrls(menu = [], excludedBrands = []) {
  const urls = new Set();
  if (!Array.isArray(menu) || excludedBrands.length === 0) return urls;

  const takeSubtree = (items = []) => {
    for (const item of items) {
      const url = typeof item?.url === "string" ? item.url.trim() : "";
      if (url) urls.add(url);
      takeSubtree(item?.children);
    }
  };

  const walk = (items = []) => {
    for (const item of items) {
      if (isExcludedBrand(item, excludedBrands)) {
        takeSubtree([item]);
        continue;
      }
      walk(item?.children);
    }
  };

  walk(menu);
  return urls;
}

/** Whether a menu node is one of the excluded brands. */
export const isExcludedBrand = (item, excludedBrands = []) =>
  excludedBrands.includes(item?.origin_name) || excludedBrands.includes(item?.name);

/**
 * Whether a product belongs to an excluded brand.
 *
 * Separate from hiding a menu entry, which deliberately leaves products on sale
 * — see the note in /[slug]. An exclusion says the brand is out of the
 * catalogue, so its products go with it.
 */
export const isExcludedProductBrand = (brand, excludedBrands = []) =>
  Boolean(brand) && excludedBrands.includes(String(brand).trim());
