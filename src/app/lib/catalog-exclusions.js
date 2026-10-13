import { unstable_cache } from "next/cache";
import { readOrDegrade } from "@/app/lib/upstream";
import { keys, redis } from "@/app/lib/redis";
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

/**
 * The menu, for working out which search terms belong to an excluded brand.
 *
 * Its own cached read rather than the one in /[slug], so the two API routes
 * that need it do not have to import a page. Same "nav-menu" tag, so a menu
 * edit busts both.
 */
const readMenuForExclusions = unstable_cache(
  async () => {
    const stored = await redis.get(keys.dev_shopify_menu.value);
    const menu = typeof stored === "string" ? JSON.parse(stored) : stored;
    return Array.isArray(menu) ? menu : [];
  },
  ["exclusions-menu"],
  { revalidate: 86400, tags: ["nav-menu"] },
);

const normalizeTerm = (value) =>
  String(value ?? "").toLowerCase().replace(/\s+/g, " ").trim();

/**
 * A test for whether a search term belongs to an excluded brand.
 *
 * The popular-searches list is free text people typed, so the exact-name rule
 * used everywhere else does not reach it: excluding "Bull Outdoor Products"
 * has to catch "bull storage", "bull open box" and plain "bull", none of which
 * contain the brand's name.
 *
 * Two rules, and the second is the one that needs care:
 *
 *   the brand's full name, anywhere in the term
 *   the brand's first word, at the start of the term — but only when nothing
 *   we still sell begins with that word
 *
 * That condition is what makes the prefix rule safe, and it is derived from the
 * menu rather than assumed. Measured on 13 October 2026: "bull", "sole" and
 * "cedar" begin no menu entry outside their own excluded subtree, so they are
 * usable; "american" begins nine — American Outdoor Grill, American Fyre
 * Designs and their collections — so excluding "American Fire Glass" falls back
 * to full-name matching and leaves searches for the others alone. A hardcoded
 * list of prefixes would have got that wrong, and would get it wrong again the
 * first time two brands share a first word.
 *
 * Names inside an excluded brand's own subtree are not counted as collisions —
 * "Bull Grills" must not be what stops "bull" being usable.
 */
export function buildExcludedTermTest(menu = [], excludedBrands = []) {
  if (!Array.isArray(menu) || excludedBrands.length === 0) return () => false;

  const names = new Set();
  for (const brand of excludedBrands) {
    const name = normalizeTerm(brand);
    if (name) names.add(name);
  }

  // Menu names split by whether they sit inside an excluded brand's subtree.
  const stillSold = new Set();
  const withdrawn = new Set();
  const collect = (items = [], within = false) => {
    for (const item of items) {
      const inside = within || isExcludedBrand(item, excludedBrands);
      const name = normalizeTerm(item?.name);
      if (name) (inside ? withdrawn : stillSold).add(name);
      if (inside) {
        const origin = normalizeTerm(item?.origin_name);
        if (origin) names.add(origin);
      }
      collect(item?.children, inside);
    }
  };
  collect(menu);

  const prefixes = new Set();
  for (const brand of excludedBrands) {
    const first = normalizeTerm(brand).split(" ")[0];
    // Two characters is not a brand, it is a coincidence waiting to happen.
    if (!first || first.length < 3) continue;

    // Nothing we still sell may begin with it.
    const collides = [...stillSold].some(
      (name) => name === first || name.startsWith(`${first} `),
    );
    if (collides) continue;

    // And the catalogue must show the word standing for the brand on its own:
    // at least one collection inside the brand's subtree has to begin with it.
    // Without this the rule reads a brand's first word as its property whether
    // or not the shop ever uses it that way — "Cedar Creek Fireplaces" has no
    // collections at all, so "cedar" would have swallowed "cedar plank", an
    // ordinary grilling search with nothing to do with the brand.
    const standsAlone = [...withdrawn].some((name) => name.startsWith(`${first} `));
    if (standsAlone) prefixes.add(first);
  }

  return (term) => {
    const value = normalizeTerm(term);
    if (!value) return false;
    for (const name of names) if (name && value.includes(name)) return true;
    for (const prefix of prefixes) {
      if (value === prefix || value.startsWith(`${prefix} `)) return true;
    }
    return false;
  };
}

/**
 * The same test, reading the menu and the exclusion list for you.
 *
 * Degrades to "nothing is excluded" rather than throwing: a search box that
 * shows one brand too many is a smaller failure than one that shows nothing.
 */
export async function getExcludedTermTest() {
  try {
    const [menu, { brands }] = await Promise.all([
      readMenuForExclusions(),
      getCatalogExclusions(),
    ]);
    return buildExcludedTermTest(menu, brands);
  } catch (error) {
    console.error("catalog-exclusions: term test unavailable:", error?.message || error);
    return () => false;
  }
}
