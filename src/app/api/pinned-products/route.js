import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAuthorizedAdminRequest } from "@/app/lib/admin-auth";
import { fetchProduct } from "@/app/lib/fn_server";
import {
  MAX_PINS_PER_PAGE,
  PINNED_PRODUCTS_TAG,
  getPinnedProducts,
  normalizeHandles,
  savePinnedForPage,
} from "@/app/lib/pinned-products";

/**
 * GET  /api/pinned-products            -> { pages: { url: count } } for this brand
 * GET  /api/pinned-products?page=url   -> that page's pins, with product details
 * PUT  /api/pinned-products            -> { page, handles } replaces that page's pins
 *
 * Admin-only. Per brand: each deployment reads and writes its own record. See
 * docs/pinned-products.md.
 */
export const dynamic = "force-dynamic";

/** Everything a pinned order shows up in: the pins, every listing response,
 *  and the server-rendered first page of each listing. */
const DEPENDENT_TAGS = [PINNED_PRODUCTS_TAG, "searchkit", "plp-initial-hits"];

const fail = (error, status) => NextResponse.json({ status: "error", error }, { status });

/** What the editor shows for one pinned handle. */
async function describe(handle) {
  try {
    const p = await fetchProduct(handle);
    if (!p?.product_id) return { handle, missing: true };
    return {
      handle,
      title: p.title,
      brand: p.brand || null,
      sku: p.variants?.[0]?.sku || null,
      image: p.images?.find(({ position }) => Number(position) === 1)?.src || p.images?.[0]?.src || null,
      published: p.published !== false,
    };
  } catch {
    return { handle, missing: true };
  }
}

export async function GET(request) {
  if (!(await isAuthorizedAdminRequest(request))) return fail("Unauthorized", 401);

  const { pages, updatedAt } = await getPinnedProducts();
  const page = new URL(request.url).searchParams.get("page");

  if (!page) {
    return NextResponse.json({
      status: "ok",
      pages: Object.fromEntries(Object.entries(pages).map(([url, handles]) => [url, handles.length])),
      updatedAt,
      max: MAX_PINS_PER_PAGE,
    });
  }

  const handles = pages[page] ?? [];
  const products = await Promise.all(handles.map(describe));
  return NextResponse.json({ status: "ok", page, products, max: MAX_PINS_PER_PAGE });
}

export async function PUT(request) {
  if (!(await isAuthorizedAdminRequest(request))) return fail("Unauthorized", 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return fail("Body must be JSON.", 400);
  }
  if (typeof body?.page !== "string" || !body.page.trim()) return fail("page is required.", 400);
  if (!Array.isArray(body?.handles)) return fail("handles must be an array.", 400);
  if (normalizeHandles(body.handles).length > MAX_PINS_PER_PAGE || body.handles.length > MAX_PINS_PER_PAGE) {
    return fail(`A page can pin up to ${MAX_PINS_PER_PAGE} products.`, 400);
  }

  try {
    const record = await savePinnedForPage(body.page, body.handles);
    DEPENDENT_TAGS.forEach((tag) => revalidateTag(tag));
    return NextResponse.json({
      status: "ok",
      page: body.page.trim(),
      handles: record.pages[body.page.trim()] ?? [],
      revalidated: DEPENDENT_TAGS,
    });
  } catch (error) {
    console.error("[pinned-products] save failed:", error?.message || error);
    return fail(error?.message === "invalid page" ? "That isn't a listing page." : "Couldn't save the pins. Nothing was changed.", error?.message === "invalid page" ? 400 : 502);
  }
}
