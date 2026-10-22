import { unstable_cache } from "next/cache";
import { redis } from "@/app/lib/redis";
import { storeKey } from "@/app/lib/store";

/**
 * Pinned products: per listing page, the products an admin has chosen to
 * show first when the page is sorted by Most popular. One record per brand
 * (like Page SEO), so each store merchandises its own pages.
 *
 *   solana_pinned_products, bbq_pinned_products, oko_pinned_products
 *   { pages: { "<menu url>": ["handle-1", "handle-2", …] }, updatedAt }
 *
 * See docs/pinned-products.md.
 */

export const PINNED_PRODUCTS_KEY = storeKey("pinned_products");
export const PINNED_PRODUCTS_TAG = "pinned-products";

/** The most products one page can pin. */
export const MAX_PINS_PER_PAGE = 24;

const HANDLE = /^[a-z0-9][a-z0-9_-]*$/i;
const PAGE = /^[a-z0-9][a-z0-9_/-]*$/i;

const EMPTY = Object.freeze({ pages: {}, updatedAt: null });

/** A page's pin list, cleaned: trimmed, valid handles, no repeats, capped. */
export function normalizeHandles(list) {
  if (!Array.isArray(list)) return [];
  const out = [];
  for (const raw of list) {
    const handle = String(raw ?? "").trim();
    if (HANDLE.test(handle) && !out.includes(handle)) out.push(handle);
    if (out.length === MAX_PINS_PER_PAGE) break;
  }
  return out;
}

/** The whole record, cleaned. Pages with no pins are dropped. */
export function normalizePinned(raw) {
  const pages = {};
  for (const [page, list] of Object.entries(raw?.pages ?? {})) {
    const key = String(page).trim();
    const handles = normalizeHandles(list);
    if (PAGE.test(key) && handles.length) pages[key] = handles;
  }
  return { pages, updatedAt: typeof raw?.updatedAt === "string" ? raw.updatedAt : null };
}

/** Throws on a failed read, so the cache never stores a failure. */
const readPinned = unstable_cache(
  async () => {
    const stored = await redis.get(PINNED_PRODUCTS_KEY);
    if (!stored) return { ...EMPTY };
    return normalizePinned(typeof stored === "string" ? JSON.parse(stored) : stored);
  },
  ["pinned-products", PINNED_PRODUCTS_KEY],
  { revalidate: 86400, tags: [PINNED_PRODUCTS_TAG] },
);

/**
 * This brand's pins. A failed read is "no pins": the page shows its normal
 * order rather than an error — pinning is merchandising, never a reason for a
 * listing to fail.
 */
export async function getPinnedProducts() {
  try {
    return await readPinned();
  } catch (error) {
    console.error("[pinned-products] read failed, showing listings unpinned:", error?.message || error);
    return { ...EMPTY };
  }
}

/** One page's pinned handles, in order ([] for none). */
export async function getPinnedForPage(page) {
  if (!page) return [];
  const { pages } = await getPinnedProducts();
  return pages[String(page).trim()] ?? [];
}

/**
 * Sets one page's pins (an empty list removes the page). Reads the stored
 * record fresh — not through the cache — so a save never resurrects pins
 * another admin removed in the meantime. Callers clear the cache tags.
 */
export async function savePinnedForPage(page, handles) {
  const key = String(page ?? "").trim();
  if (!PAGE.test(key)) throw new Error("invalid page");
  const stored = await redis.get(PINNED_PRODUCTS_KEY);
  const current = normalizePinned(typeof stored === "string" ? JSON.parse(stored) : stored);
  const clean = normalizeHandles(handles);
  if (clean.length) current.pages[key] = clean;
  else delete current.pages[key];
  const record = { pages: current.pages, updatedAt: new Date().toISOString() };
  await redis.set(PINNED_PRODUCTS_KEY, JSON.stringify(record));
  return record;
}

/**
 * The Elasticsearch sort that puts these handles first, in this order: each
 * pinned handle sorts as its position (0, 1, 2…), everything else after them.
 * Use as the first sort key, before the listing's usual ones.
 */
export function pinnedScriptSort(handles) {
  const rank = Object.fromEntries(handles.map((handle, index) => [handle, index]));
  return {
    _script: {
      type: "number",
      script: {
        source: `
          if (doc['handle.keyword'].size() == 0) return params.unpinned;
          def position = params.rank.get(doc['handle.keyword'].value);
          return position == null ? params.unpinned : position;
        `,
        params: { rank, unpinned: MAX_PINS_PER_PAGE + 1 },
      },
      order: "asc",
    },
  };
}
