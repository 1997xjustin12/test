import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { rateLimit } from "@/app/lib/rate-limit";
import { STORE_NAME } from "@/app/lib/store_constants";
import { ORDER_COOKIE, fetchOrderStatus } from "@/app/lib/order-status";
import BrandOrderStatus from "./BrandOrderStatus";

/**
 * /order-status — the guest order page, after the link has been opened.
 *
 * The order's uuid arrives in an HttpOnly cookie set by
 * /order-status/<order_uuid> ([order_uuid]/route.js); it is never in this
 * page's URL. Everything happens on the server — GET /api/orders/status/<uuid>
 * with the storefront's API key — and the browser receives finished HTML: no
 * uuid, no key, no backend address
 * and no raw order data.
 *
 * No cookie, a malformed uuid or an unknown order all show the same "link is
 * no longer valid" message. See docs/reference/guest-order-page.md.
 */

// Per-guest content: never prerendered, never cached.
export const dynamic = "force-dynamic";

export const metadata = {
  title: `Order Status | ${STORE_NAME}`,
  robots: { index: false, follow: false },
};

export default async function OrderStatusPage() {
  const cookieStore = await cookies();

  // A signed-in shopper has the full order history in their account.
  if (cookieStore.get("isLoggedIn")?.value === "true") redirect("/my-account/orders");

  // The link handler throttles clicks; this throttles page views, which a
  // script could otherwise drive directly with a cookie of its own making.
  const limited = await rateLimit({ headers: await headers() }, "orderStatus");
  if (!limited.ok) return <BrandOrderStatus result={{ state: "error" }} />;

  const orderUuid = cookieStore.get(ORDER_COOKIE)?.value;
  const result = orderUuid ? await fetchOrderStatus(orderUuid) : { state: "invalid" };

  return <BrandOrderStatus result={result} />;
}
