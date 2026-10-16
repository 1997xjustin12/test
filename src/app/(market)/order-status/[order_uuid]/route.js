import { NextResponse } from "next/server";
import { rateLimit } from "@/app/lib/rate-limit";
import {
  ORDER_COOKIE,
  ORDER_COOKIE_MAX_AGE,
  ORDER_COOKIE_PATH,
  isOrderUuid,
} from "@/app/lib/order-status";

/**
 * GET /order-status/<order_uuid> — the link in the order emails.
 *
 * Renders nothing. It moves the order's uuid out of the URL into an HttpOnly
 * cookie scoped to /order-status, then redirects to the clean /order-status.
 * The uuid is what unlocks the order, so it is gone from the address bar before
 * any page — and so any third-party script on it (analytics, pixels, chat) —
 * can read it, and it never lands in browser history, a bookmark, or a Referer.
 *
 * The uuid is not checked against the backend here: the page does that, and
 * shows the same "link is no longer valid" for anything that does not resolve.
 *
 * /order-status/demo is a page of its own (order-status/demo/page.jsx) and never
 * reaches this handler: a static segment wins over a dynamic one.
 */

const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
};

export async function GET(request, { params }) {
  const { order_uuid: orderUuid } = await params;
  const destination = new URL("/order-status", request.url);

  const limited = await rateLimit(request, "orderStatus");
  if (!limited.ok) {
    return new NextResponse("Too many requests. Please wait a minute and try again.", {
      status: 429,
      headers: { ...PRIVATE_HEADERS, "Retry-After": String(limited.resetSeconds) },
    });
  }

  // A signed-in shopper has the full order history in their account.
  if (request.cookies.get("isLoggedIn")?.value === "true") {
    return NextResponse.redirect(new URL("/my-account/orders", request.url), {
      status: 303,
      headers: PRIVATE_HEADERS,
    });
  }

  const response = NextResponse.redirect(destination, { status: 303, headers: PRIVATE_HEADERS });

  if (isOrderUuid(orderUuid)) {
    response.cookies.set(ORDER_COOKIE, orderUuid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // Lax, not Strict: the link is opened from an email client, a cross-site
      // navigation, and the cookie has to survive the redirect that follows.
      sameSite: "lax",
      path: ORDER_COOKIE_PATH,
      maxAge: ORDER_COOKIE_MAX_AGE,
    });
  } else {
    // A malformed link clears any earlier one, so the page shows "not valid"
    // rather than a different order from a previous click.
    response.cookies.delete({ name: ORDER_COOKIE, path: ORDER_COOKIE_PATH });
  }

  return response;
}
