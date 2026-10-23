import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { isAuthorizedAdminRequest } from "@/app/lib/admin-auth";
import {
  CHECKOUT_TAG,
  CHECKOUT_UNAVAILABLE_PATH,
  DEFAULT_MESSAGE,
  getCheckoutState,
  isCheckoutLocked,
  normalizeCheckout,
  saveCheckoutState,
} from "@/app/lib/checkout-availability";

/**
 * GET  /api/checkout-availability -> the brand record, and checkout's state on
 *                                    the domain this request came in on
 * PUT  /api/checkout-availability -> save the record (brand default + domains)
 *
 * Admin-only. A save busts the tag and the checkout paths, so the change is
 * live on the next request rather than whenever a cache happens to expire —
 * which matters more here than for a colour.
 */
export const dynamic = "force-dynamic";

const describe = async (request) => {
  const state = await getCheckoutState(request.headers.get("host"));
  return {
    // The domain this admin screen is open on, and what applies there now.
    host: state.host,
    closed: state.closed,
    source: state.source,
    locked: isCheckoutLocked(),
    record: state.record ?? normalizeCheckout(null),
    defaultMessage: DEFAULT_MESSAGE,
  };
};

export async function GET(request) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await describe(request));
}

export async function PUT(request) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Expected a checkout record" }, { status: 400 });
  }

  try {
    await saveCheckoutState(body);
  } catch (error) {
    console.error("checkout-availability: save failed:", error?.message || error);
    return NextResponse.json({ error: "Couldn't save. The setting is unchanged." }, { status: 502 });
  }
  revalidateTag(CHECKOUT_TAG, { expire: 0 });
  revalidatePath("/checkout");
  revalidatePath(CHECKOUT_UNAVAILABLE_PATH);

  return NextResponse.json(await describe(request));
}
