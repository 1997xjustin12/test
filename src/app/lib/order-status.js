/**
 * The guest order page — data access. Server-only: the order uuid, the API key
 * and the backend call never reach the browser. Import it from server
 * components and route handlers only; it reads NEXT_SOLANA_BACKEND_URL and
 * NEXT_SOLANA_COLLECTIONS_KEY, which a client bundle has no business knowing.
 *
 * The backend puts a link in the order emails (and returns the uuid with the
 * order from POST /api/orders/checkout):
 *
 *   https://<brand>/order-status/<order_uuid>
 *
 * app/(market)/order-status/[order_uuid]/route.js moves the uuid out of the URL
 * into a short-lived HttpOnly cookie and redirects to /order-status, which
 * reads it here and asks the backend for that order. See
 * docs/reference/guest-order-page.md for the full design and why.
 */

/** Cookie the order uuid travels in between the link and the page. */
export const ORDER_COOKIE = "order_status_uuid";

/** Scoped to the page, so no other route ever receives the uuid. */
export const ORDER_COOKIE_PATH = "/order-status";

/** How long one click of the link keeps the page open, in seconds. */
export const ORDER_COOKIE_MAX_AGE = 30 * 60;

/**
 * A canonical uuid, any version. Anything else is refused before the backend
 * is asked — which matters beyond tidiness: the backend answers a non-uuid path
 * with its HTML debug 404 page rather than JSON.
 */
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isOrderUuid = (value) => typeof value === "string" && UUID_PATTERN.test(value);

/**
 *   GET {BACKEND}/api/orders/status/{order_uuid}
 *   Authorization: Api-Key <the storefront's key>
 *
 * The order's status page data: status and progress, items, totals, payment
 * (with a live payment link while a card or bank order is unpaid), tracking and
 * estimated delivery. No email, phone or street address — the link is emailed
 * and may be forwarded. Side effect: an unpaid order whose payment link has
 * expired, or was made for a different total, gets a fresh one.
 *
 * Checked 15 Oct 2026: no key → 401, unknown uuid → 404
 * {"success": false, "message": "Order not found"}. The key is the one the
 * collections endpoints use; NEXT_SOLANA_BACKEND_KEY is refused.
 */
const STATUS_PATH = "/api/orders/status/";

const TIMEOUT_MS = 15_000;

/**
 * One order, by its uuid.
 *
 * @returns {{ state: "ok", orders: object[] } | { state: "invalid" } | { state: "error" }}
 *   ok      — `orders` holds the one order, so the brand components can render
 *             it the same way they render a list.
 *   invalid — malformed or unknown uuid: the page says the link is not valid.
 *   error   — the backend could not be reached, refused our key, or answered
 *             badly: the page asks the shopper to try again later.
 */
export async function fetchOrderStatus(orderUuid) {
  if (!isOrderUuid(orderUuid)) return { state: "invalid" };

  const backendUrl = process.env.NEXT_SOLANA_BACKEND_URL?.trim();
  const apiKey = process.env.NEXT_SOLANA_COLLECTIONS_KEY?.trim();
  if (!backendUrl || !apiKey) {
    console.error("[order-status] NEXT_SOLANA_BACKEND_URL or NEXT_SOLANA_COLLECTIONS_KEY is not set");
    return { state: "error" };
  }

  let response;
  try {
    response = await fetch(`${backendUrl}${STATUS_PATH}${encodeURIComponent(orderUuid)}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Api-Key ${apiKey}`,
        // Not required by the endpoint; sent so the backend can tell which
        // brand is asking, as every other storefront call does.
        ...(process.env.NEXT_PUBLIC_STORE_DOMAIN
          ? { "X-Store-Domain": process.env.NEXT_PUBLIC_STORE_DOMAIN.trim() }
          : {}),
      },
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    console.error("[order-status] lookup failed:", error?.message || error);
    return { state: "error" };
  }

  if ([400, 404, 410].includes(response.status)) return { state: "invalid" };
  if (!response.ok) {
    // 401/403 mean our key is missing or wrong — our problem, not the shopper's.
    console.error("[order-status] lookup answered", response.status);
    return { state: "error" };
  }

  const data = await response.json().catch(() => null);
  if (data?.success === false) return { state: "invalid" };

  // The success shape is not pinned down yet: the order itself, or wrapped.
  const order = normalizeOrder(data?.order ?? data?.data ?? data);
  if (!order) {
    console.error("[order-status] unexpected response shape");
    return { state: "error" };
  }
  return { state: "ok", orders: [order] };
}

// ─── Normalising the backend's order ─────────────────────────────────────────
//
// The page renders exactly these fields and nothing else, so whatever extra the
// backend sends — internal notes, ids, the customer's phone — never reaches the
// HTML. Field names follow the order serializer as it stands (see OPTIONS
// /api/orders/checkout); the alternatives cover shapes it has not settled on.

const str = (value) => (typeof value === "string" && value.trim() ? value.trim() : null);

const num = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

/** https only — these become link targets. */
const safeHttpsUrl = (value) => {
  const url = str(value);
  if (!url) return null;
  try {
    return new URL(url).protocol === "https:" ? url : null;
  } catch {
    return null;
  }
};

/** A site-relative path or an https URL — these become image sources. */
const safeImage = (value) => {
  const src = str(value);
  if (!src) return null;
  if (src.startsWith("/") && !src.startsWith("//")) return src;
  return safeHttpsUrl(src);
};

const KNOWN_STATUSES = [
  "unpaid",
  "pending",
  "paid",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

function normalizeItem(item) {
  if (!item || typeof item !== "object") return null;
  const quantity = num(item.quantity) ?? 1;
  const price = num(item.price);
  return {
    title: str(item.product_title) ?? str(item.title) ?? str(item.product?.title) ?? "Item",
    image: safeImage(item.image ?? item.product?.image ?? item.product?.images?.[0]?.src),
    quantity,
    price,
    total: num(item.total) ?? (price !== null ? price * quantity : null),
  };
}

export function normalizeOrder(order) {
  if (!order || typeof order !== "object") return null;
  const orderNumber = str(order.order_number) ?? str(String(order.order_number ?? ""));
  if (!orderNumber) return null;

  const status = KNOWN_STATUSES.includes(order.status) ? order.status : "pending";
  const name = [str(order.shipping_first_name), str(order.shipping_last_name)].filter(Boolean).join(" ");
  // The status endpoint may group these as objects; flat fields are read too.
  const tracking = order.tracking && typeof order.tracking === "object" ? order.tracking : {};
  const payment = order.payment && typeof order.payment === "object" ? order.payment : {};
  const trackingNumber =
    str(tracking.tracking_number) ?? str(tracking.number) ?? str(order.tracking_number);
  const trackingUrl = safeHttpsUrl(tracking.tracking_url ?? tracking.url ?? order.tracking_url);

  return {
    orderNumber,
    createdAt: str(order.created_at) ?? str(order.date_created),
    status,
    items: (Array.isArray(order.items) ? order.items : []).map(normalizeItem).filter(Boolean),
    subTotal: num(order.sub_total),
    shipping: num(order.total_shipping),
    tax: num(order.total_tax),
    discount: num(order.points_discount),
    total: num(order.total_price),
    shippingAddress: {
      name: name || null,
      // The status endpoint leaves the street out on purpose (the link may be
      // forwarded); shown only if some other source supplies it.
      address: str(order.shipping_address),
      city: str(order.shipping_city),
      state: str(order.shipping_province),
      zip: str(order.shipping_zip_code),
      country: str(order.shipping_country),
    },
    shippingMethod: str(order.shipping_method),
    estimatedDelivery: str(order.estimated_delivery) ?? str(tracking.estimated_delivery),
    tracking:
      trackingNumber || trackingUrl
        ? {
            carrier: str(tracking.carrier) ?? str(order.carrier) ?? str(order.shipping_carrier),
            number: trackingNumber,
            url: trackingUrl,
          }
        : null,
    // Only an unpaid order can be paid, and only through an https link.
    paymentLink:
      status === "unpaid"
        ? safeHttpsUrl(payment.payment_link ?? payment.link ?? payment.url ?? order.payment_link)
        : null,
  };
}
