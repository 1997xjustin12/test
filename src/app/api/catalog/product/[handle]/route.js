import { STORE_NAME } from "@/app/lib/store_constants";
import { STORE_ID } from "@/app/lib/store";
import { fetchProduct } from "@/app/lib/fn_server";
import { productPath } from "@/app/lib/listing-data";
import { stripHtml } from "@/app/lib/structured-data";
import { withRouteRateLimit } from "@/app/lib/rate-limit";

/**
 * GET /api/catalog/product/{handle} — a single product, for agents.
 *
 * Requirement 3 of the client brief. Pairs with /api/catalog/search: search
 * returns handles, this resolves one to full detail including specifications,
 * so an agent can answer "will it fit" without parsing the rendered page.
 *
 * Returns a narrow, stable shape rather than the raw catalogue document —
 * partly to keep the payload sane, partly because a public endpoint that emits
 * everything we know about a product is a competitor's import job.
 *
 * Availability here is the same published/variant signal the storefront uses.
 * It is NOT a live stock feed; the app does not currently have one. The field
 * is named and documented honestly rather than implying a warehouse lookup.
 */
export const dynamic = "force-dynamic";

async function handler(_req, ctx) {
  const { handle } = await ctx.params;

  if (!handle || typeof handle !== "string" || handle.length > 200) {
    return Response.json(
      { error: "Bad Request", message: "A product handle is required." },
      { status: 400 },
    );
  }

  let product;
  try {
    product = await fetchProduct(handle);
  } catch {
    return Response.json(
      { error: "Bad Gateway", message: "Product lookup is temporarily unavailable." },
      { status: 502 },
    );
  }

  if (!product) {
    return Response.json(
      { error: "Not Found", message: `No product with handle "${handle}".` },
      { status: 404 },
    );
  }

  const variant = product?.variants?.[0];
  const base = process.env.NEXT_PUBLIC_SITE_BASE_URL || "";
  const path = productPath(product);

  return Response.json({
    store: { id: STORE_ID, name: STORE_NAME },
    product: {
      title: product.title,
      handle: product.handle,
      brand: product.brand || product.vendor || null,
      category: product?.accentuate_data?.category || null,
      type: product.product_type || null,
      description: stripHtml(product?.body_html || "").slice(0, 4000) || null,
      sku: variant?.sku || null,
      gtin: variant?.barcode || null,
      price: variant?.price ?? null,
      compare_at_price: variant?.compare_at_price ?? null,
      currency: "USD",
      // Derived from the published flag, not a live warehouse feed.
      availability: product?.published === false ? "OutOfStock" : "InStock",
      rating: product?.ratings ? Number(product.ratings) : null,
      review_count: product?.reviews ?? null,
      specifications: (product?.product_specs || [])
        .filter((s) => s?.label && String(s?.value || "").trim())
        .map((s) => ({ name: String(s.label).trim(), value: String(s.value).trim() })),
      images: (product?.images || []).map((i) => i?.src).filter(Boolean).slice(0, 20),
      url: path ? `${base}${path}` : null,
    },
  });
}

export const GET = withRouteRateLimit(handler, "search");
