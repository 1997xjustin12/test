import { ISBBQ, ISOKO, formatProduct, productIsFreeshipping } from "@/app/lib/helpers";
import { COMPARE_PARAM, parseCompareParam } from "@/app/lib/compare";
import { buildCompareRows } from "@/app/lib/compare-specs";
import { fetchProduct } from "@/app/lib/fn_server";
import { getCatalogExclusions, isExcludedProductBrand } from "@/app/lib/catalog-exclusions";
import { pageMetadata } from "@/app/lib/page-seo";
import NewCompare from "@/app/components/new-design/page/Compare";
import BBQCompare from "@/app/components/bbq-design/page/Compare";
import OKOCompare from "@/app/components/oko-design/page/Compare";

/**
 * /compare?p=handle-1,handle-2 — products side by side. See
 * docs/product-compare.md.
 *
 * Built from the address, not from the compare list, so a comparison can be
 * shared or bookmarked. Products are fetched with fetchProduct (cached per
 * handle); unknown handles and brands excluded in Catalog Exclusions are left
 * out, as their product pages are. noindex: every combination is a different
 * address, and none is worth indexing.
 */
export const generateMetadata = () => pageMetadata("/compare");

/**
 * What a column needs, and what the cart needs to add it — not the whole
 * product record, which would be sent to the browser four times over.
 */
function toCompareProduct(raw) {
  const p = formatProduct(raw, "card");
  return {
    // Cart (context/cart.js buildCartItem)
    product_id: raw.product_id,
    handle: raw.handle,
    brand: raw.brand,
    title: raw.title,
    images: raw.images,
    ratings: raw.ratings,
    variants: raw.variants,
    // Display
    name: p?.name || raw.title,
    url: p?.url || null,
    image: p?.image || raw.images?.find(({ position }) => Number(position) === 1)?.src || null,
    price: p?.price ?? raw.variants?.[0]?.price ?? null,
    was: p?.was || 0,
    save_amt: p?.save_amt || 0,
    rating: p?.ratings ?? null,
    reviews: p?.reviews ?? 0,
    published: raw.published !== false,
    freeShipping: productIsFreeshipping(raw.tags),
    product_category: raw.product_category ?? null,
  };
}

export default async function ComparePage({ searchParams }) {
  const handles = parseCompareParam((await searchParams)?.[COMPARE_PARAM]);

  const [fetched, exclusions] = await Promise.all([
    Promise.all(handles.map((handle) => fetchProduct(handle).catch(() => null))),
    getCatalogExclusions(),
  ]);

  const raws = fetched.filter(
    (product) => product?.product_id && !isExcludedProductBrand(product?.brand, exclusions.brands),
  );
  const products = raws.map(toCompareProduct);
  const groups = buildCompareRows(raws);
  // The handles actually shown, in order — removing one rebuilds the address
  // from these, so skipped handles drop out of it too.
  const shown = products.map((product) => product.handle);

  const props = { products, groups, handles: shown };
  if (ISOKO) return <OKOCompare {...props} />;
  if (ISBBQ) return <BBQCompare {...props} />;
  return <NewCompare {...props} />;
}
