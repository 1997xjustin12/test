import { BASE_URL } from "@/app/lib/helpers";

/**
 * Product comparison: the small, client-safe part. The compare list
 * (context/compare_product.js) and the /compare page both use these, so the
 * limit and the address format are defined once. The spec rows live in
 * lib/compare-specs.js, which pulls in the whole filter config and is for
 * server code only. See docs/product-compare.md.
 */

/** How many products can be compared at once. */
export const COMPARE_LIMIT = 4;

/** The /compare query parameter holding the product handles. */
export const COMPARE_PARAM = "p";

/** Handles are slugs (letters, digits, hyphens, underscores); anything else is ignored. */
const HANDLE = /^[a-z0-9][a-z0-9_-]*$/i;

/**
 * The handles in a /compare address: split on commas, trimmed, deduplicated,
 * malformed ones dropped, capped at COMPARE_LIMIT.
 *
 *   parseCompareParam("a-1, b-2,a-1,,../x")  → ["a-1", "b-2"]
 */
export function parseCompareParam(value) {
  const raw = Array.isArray(value) ? value.join(",") : String(value ?? "");
  const handles = [];
  for (const part of raw.split(",")) {
    const handle = part.trim();
    if (HANDLE.test(handle) && !handles.includes(handle)) handles.push(handle);
    if (handles.length === COMPARE_LIMIT) break;
  }
  return handles;
}

/** The /compare address for these handles ("" for none). */
export function compareUrl(handles = []) {
  const clean = parseCompareParam(handles);
  return clean.length ? `${BASE_URL}/compare?${COMPARE_PARAM}=${clean.join(",")}` : "";
}

/**
 * The little the compare list keeps per product: enough to draw the tray
 * without refetching. The /compare page fetches full data itself. Accepts a
 * raw Elasticsearch product or a formatProduct() one.
 */
export function compareSnapshot(product) {
  if (!product?.handle) return null;
  // Loose match on purpose: the search index stores position as "1" (a string),
  // which is why the product cards compare with == too.
  const image =
    product.image ||
    product.images?.find(({ position }) => Number(position) === 1)?.src ||
    product.images?.[0]?.src ||
    null;
  const price = product.price ?? product.variants?.[0]?.price ?? null;
  return {
    handle: String(product.handle),
    product_id: product.product_id ?? null,
    title: product.name || product.title || "",
    brand: product.brand || "",
    image,
    price: price == null ? null : Number(price),
  };
}
