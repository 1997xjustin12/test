import { NextResponse } from "next/server";
import { fetchProduct } from "@/app/lib/fn_server";
import { formatProduct } from "@/app/lib/helpers";
import { withRouteRateLimit } from "@/app/lib/rate-limit";

/**
 * GET /api/chat/products?handles=a,b,c — resolve product handles for the chat
 * widget's recommendation cards.
 *
 * The assistant recommends products as bare URLs in its prose, and those URLs
 * are wrong: it emits /product/{handle}, while this storefront's route is
 * /{brand}/product/{handle}. Every such link 404s. Rather than try to repair a
 * URL the model invented, the widget takes only the handle from it and asks
 * here for the real thing — canonical URL, title, price and image, straight
 * from the catalogue.
 *
 * That means the card can never point at a page that does not exist, and can
 * never show a price the assistant hallucinated: an unknown handle simply does
 * not come back, and no card is drawn for it.
 *
 * Reuses fetchProduct (cached per handle) and formatProduct rather than
 * querying Elasticsearch again, so a card, a listing tile and a product page
 * cannot disagree about what a product costs.
 */
export const dynamic = "force-dynamic";

/** A reply recommends a handful of products; this bounds a crafted request. */
const MAX_HANDLES = 8;

async function handler(request) {
  const raw = request.nextUrl.searchParams.get("handles") || "";
  const handles = [
    ...new Set(
      raw
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h && h.length <= 200),
    ),
  ].slice(0, MAX_HANDLES);

  if (!handles.length) {
    return NextResponse.json({ products: [] });
  }

  const resolved = await Promise.all(
    handles.map(async (handle) => {
      try {
        const product = await fetchProduct(handle);
        if (!product) return null;

        // "cart_item" is the shape addToCart already consumes elsewhere, so the
        // card's button hands the cart exactly what a product page would.
        const item = formatProduct(product, "cart_item");
        if (!item?.url || !item?.title) return null;

        return {
          handle: item.handle,
          title: item.title,
          brand: item.brand ?? null,
          price: item.price ?? null,
          was: item.was || null,
          image: item.image ?? null,
          url: item.url,
          // Everything the cart needs, carried through untouched.
          cartItem: item,
        };
      } catch (error) {
        console.error(`chat/products: ${handle} failed:`, error?.message || error);
        return null;
      }
    }),
  );

  return NextResponse.json({ products: resolved.filter(Boolean) });
}

export const GET = withRouteRateLimit(handler, "light");
