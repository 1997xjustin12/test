/**
 * The guest order page — what every brand shows, minus how it looks.
 *
 * The three brand components (new-design, bbq-design, oko-design /
 * page/OrderStatus.jsx) differ only in styling. Wording, the status steps and
 * formatting live here so the brands cannot drift apart on what an order says.
 */

/**
 * The order's journey. Each backend status sits at one of these steps;
 * cancelled and refunded leave the journey and are shown instead of it.
 */
export const PROGRESS_STEPS = ["Order placed", "Payment received", "Preparing", "Shipped", "Delivered"];

/**
 * label    — the status badge
 * message  — one line under the badge, saying what happens next
 * step     — index into PROGRESS_STEPS, or null when the order left the journey
 * tone     — how the badge is coloured; each brand maps tones to its palette
 */
export const STATUS_META = {
  unpaid: {
    label: "Awaiting payment",
    message: "Your order is reserved. Complete payment to start processing it.",
    step: 0,
    tone: "attention",
  },
  pending: {
    label: "Pending",
    message: "We've received your order and are confirming the details.",
    step: 0,
    tone: "neutral",
  },
  paid: {
    label: "Payment received",
    message: "Thank you — your payment is confirmed and your order is queued for preparation.",
    step: 1,
    tone: "positive",
  },
  preparing: {
    label: "Preparing",
    message: "Your order is being prepared for shipment.",
    step: 2,
    tone: "progress",
  },
  shipped: {
    label: "Shipped",
    message: "Your order is on its way.",
    step: 3,
    tone: "progress",
  },
  delivered: {
    label: "Delivered",
    message: "Your order has been delivered.",
    step: 4,
    tone: "positive",
  },
  cancelled: {
    label: "Cancelled",
    message: "This order was cancelled. Contact us if you have any questions.",
    step: null,
    tone: "negative",
  },
  refunded: {
    label: "Refunded",
    message: "This order was refunded. Refunds can take 5–10 business days to appear.",
    step: null,
    tone: "neutral",
  },
};

export const statusMeta = (status) => STATUS_META[status] ?? STATUS_META.pending;

const SHIPPING_METHODS = {
  tilt_bed: "Tilt-bed truck delivery",
  flat_bed: "Flat-bed truck delivery",
  pickup: "Local pickup",
  additional: "Freight delivery",
};

export const shippingMethodLabel = (method) => SHIPPING_METHODS[method] ?? null;

/** "Oct 14, 2026". Fixed to en-US and UTC so server and client agree. */
export function formatOrderDate(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "$1,299.00", or null when there is no amount to show. */
export function formatMoney(amount) {
  if (amount === null || amount === undefined || !Number.isFinite(Number(amount))) return null;
  return Number(amount).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

/** The address as display lines, skipping whatever is missing. */
export function addressLines(address) {
  if (!address) return [];
  const cityLine = [address.city, [address.state, address.zip].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
  return [address.name, address.address, cityLine, address.country].filter(Boolean);
}

/** Copy for the states that have no orders to show. */
export const EMPTY_STATES = {
  invalid: {
    title: "This link is no longer valid",
    message:
      "The order link may have expired or been replaced by a newer one. Please use the most recent link we emailed you, or contact our team and we'll be glad to help.",
  },
  error: {
    title: "We couldn't load your orders",
    message:
      "Something went wrong on our end while retrieving your orders. Please try again in a few minutes, or contact our team for an update.",
  },
};
