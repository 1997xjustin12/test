import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { isAuthorizedAdminRequest } from "@/app/lib/admin-auth";
import {
  CHECKOUT_TAG,
  DEFAULT_MESSAGE,
  getCheckoutState,
  saveCheckoutState,
} from "@/app/lib/checkout-availability";

/**
 * GET  /api/checkout-availability -> whether this brand is taking orders
 * PUT  /api/checkout-availability -> open or close it
 *
 * Admin-only. A save busts the tag and the checkout paths, so the change is
 * live on the next request rather than whenever a cache happens to expire —
 * which matters more here than for a colour.
 */
export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ checkout: await getCheckoutState(), defaultMessage: DEFAULT_MESSAGE });
}

export async function PUT(request) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Expected a checkout record" }, { status: 400 });
  }

  const checkout = await saveCheckoutState(body);
  revalidateTag(CHECKOUT_TAG);
  revalidatePath("/checkout");
  revalidatePath("/checkout-old");

  return NextResponse.json({ checkout, defaultMessage: DEFAULT_MESSAGE });
}
