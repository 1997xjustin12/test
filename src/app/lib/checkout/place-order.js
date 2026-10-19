/**
 * Placing an order, on the server.
 *
 *   1. validate the request
 *   2. verify reCAPTCHA
 *   3. create the order on the backend as UNPAID
 *   4. hand back the order's payment link — the shopper pays there, on our
 *      payment app, not on this site
 *
 * WHAT THIS REPLACED
 *
 * Braintree: the card was authorized here, the order created as "paid", then
 * the payment captured. With Braintree gone the storefront takes no payment at
 * all. It creates the order and the payment app collects the money against it,
 * so nothing here can leave a customer charged without an order.
 *
 * WHAT THE BACKEND DECIDES
 *
 * Prices and totals. Item price and total are read-only on the order
 * serializer — the backend resolves them from its own records — so the request
 * carries only product_id and quantity, and nothing the browser sends can
 * change what is owed.
 *
 * The payment link. The backend issues one for card and ACH orders on a store
 * that has payment settings, which is why every order is sent as "card". It
 * can still come back null; the order exists either way, so that is reported
 * as an order placed without a link, not as a failure.
 *
 * Status is a choice field and the match is exact: "unpaid" is accepted,
 * "Unpaid" is refused as "not a valid choice". Checked against the live backend.
 *
 * PURE ON PURPOSE
 *
 * No imports. reCAPTCHA and the backend are passed in as `deps`, so each
 * failure path can be tested without creating an order.
 */

const ADDRESS_PARTS = [
  "first_name",
  "last_name",
  "email",
  "phone",
  "address",
  "city",
  "province",
  "zip_code",
  "country",
];

/**
 * The customer fields forwarded to the backend — the checkout form's own
 * fields. Anything else in the request is dropped, so a client cannot set
 * status, payment_method, payment_status or store_domain.
 */
export const CUSTOMER_FIELDS = [
  ...["billing", "shipping"].flatMap((side) => ADDRESS_PARTS.map((part) => `${side}_${part}`)),
  "notes",
  "newsletter",
  "save_information",
  "shipping_to_billing",
  "is_valid_billing_zip",
  "is_valid_shipping_zip",
];

export const MAX_ITEMS = 100;
export const MAX_QUANTITY = 999;

/** What every order is created as. Lowercase on purpose; see above. */
export const ORDER_STATUS = "unpaid";
export const PAYMENT_METHOD = "card";

const fail = (status, code, error, extra = {}) => ({
  status,
  body: { success: false, code, error, ...extra },
});

/** Returns { value } with only the fields placeOrder uses, or { error }. */
export function parseCheckoutRequest(body) {
  const { recaptchaToken, customer, items } = body || {};

  if (typeof recaptchaToken !== "string" || !recaptchaToken) {
    return { error: "reCAPTCHA token is required." };
  }

  if (!customer || typeof customer !== "object" || Array.isArray(customer)) {
    return { error: "Customer details are missing." };
  }
  if (typeof customer.shipping_email !== "string" || !customer.shipping_email.includes("@")) {
    return { error: "A valid email address is required." };
  }

  if (!Array.isArray(items) || items.length === 0) return { error: "Your cart is empty." };
  if (items.length > MAX_ITEMS) return { error: "Your cart has too many items." };

  const cleanItems = [];
  for (const item of items) {
    // The backend takes an integer id; a numeric string from the cart is fine.
    const productId = Number(item?.product_id);
    if (!Number.isInteger(productId) || productId < 1) {
      return { error: "An item in your cart is invalid." };
    }

    const quantity = Number(item?.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return { error: "An item in your cart has an invalid quantity." };
    }

    cleanItems.push({ product_id: productId, quantity });
  }

  const cleanCustomer = Object.fromEntries(
    CUSTOMER_FIELDS.filter((field) => field in customer).map((field) => [field, customer[field]]),
  );

  return { value: { recaptchaToken, customer: cleanCustomer, items: cleanItems } };
}

/** "shipping_zip_code" → "Shipping zip code", "billing_province" → "Billing state". */
const fieldLabel = (field) => {
  const words = String(field).replace(/_province$/, "_state").split("_").filter(Boolean);
  const text = words.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const asList = (value) => (Array.isArray(value) ? value : [value]);

/**
 * Django REST error bodies, flattened into sentences a shopper can act on.
 *
 *   { "detail": "…" }                                → ["…"]
 *   { "shipping_phone": ["This field is required."] } → ["Shipping phone: This field is required."]
 *   { "items": [{}, { "product_id": ["…"] }] }        → ["Item 2 — Product id: …"]
 *
 * Unrecognised shapes give [] and the caller falls back to a general message.
 */
export function backendErrorMessages(data) {
  if (!data) return [];
  if (typeof data === "string") return data.trim() ? [data.trim()] : [];
  if (Array.isArray(data)) return data.flatMap(backendErrorMessages);
  if (typeof data !== "object") return [];

  const messages = [];
  for (const [field, value] of Object.entries(data)) {
    if (["detail", "error", "message", "non_field_errors"].includes(field)) {
      messages.push(...asList(value).flatMap(backendErrorMessages));
    } else if (field === "items" && Array.isArray(value) && value.some((v) => v && typeof v === "object")) {
      value.forEach((itemErrors, index) => {
        for (const message of backendErrorMessages(itemErrors)) {
          messages.push(`Item ${index + 1} — ${message}`);
        }
      });
    } else {
      for (const message of asList(value).flatMap(backendErrorMessages)) {
        messages.push(`${fieldLabel(field)}: ${message}`);
      }
    }
  }
  return messages;
}

/** The created order's number, whichever way the backend wraps it. */
const orderNumberOf = (order) =>
  order?.order_number ?? order?.data?.order_number ?? order?.order?.order_number ?? null;

/** The payment link, or null if there is none or it is not a web address. */
const paymentLinkOf = (order) => {
  const link = order?.payment_link ?? order?.data?.payment_link ?? order?.order?.payment_link ?? null;
  if (typeof link !== "string") return null;
  try {
    // The browser is sent here, so nothing but https — never javascript: or data:.
    return new URL(link).protocol === "https:" ? link : null;
  } catch {
    return null;
  }
};

/**
 * @param body  the parsed JSON request body
 * @param deps  {
 *   verifyRecaptcha(token)            → error message, or null when it passes
 *   backend(path, payload)            → { ok, status, data } — never throws
 *   storeDomain                       → this brand's domain, also sent as X-Store-Domain
 *   log                               → { error(...), warn(...) }
 * }
 * @returns { status, body } for the route to send
 */
export async function placeOrder(body, deps) {
  const parsed = parseCheckoutRequest(body);
  if (parsed.error) return fail(400, "INVALID_REQUEST", parsed.error);
  const { recaptchaToken, customer, items } = parsed.value;

  const recaptchaError = await deps.verifyRecaptcha(recaptchaToken);
  if (recaptchaError) return fail(400, "RECAPTCHA_FAILED", recaptchaError);

  const response = await deps.backend("/api/orders/checkout", {
    ...customer,
    status: ORDER_STATUS,
    payment_status: false,
    payment_method: PAYMENT_METHOD,
    store_domain: deps.storeDomain,
    items,
  });

  if (!response.ok) {
    const messages = backendErrorMessages(response.data);

    // The backend's checkout limit (30 a minute per shopper). Said as what it
    // is, with how long to wait, rather than as a failed order — and never
    // retried here.
    if (response.status === 429) {
      deps.log.warn("[place-order] rate limited", { retryAfter: response.retryAfter });
      return fail(
        429,
        "RATE_LIMITED",
        messages.length ? messages.join(" ") : "Too many requests, please wait a moment and try again.",
        response.retryAfter ? { retryAfter: response.retryAfter } : {},
      );
    }

    // Validation and permission problems are the shopper's to fix, so they see
    // the backend's own words. Anything else is ours, and gets a general line.
    if (response.status >= 400 && response.status < 500 && messages.length > 0) {
      deps.log.warn("[place-order] order refused", { status: response.status, messages });
      return fail(response.status, "ORDER_REJECTED", messages.join(" "), { errors: messages });
    }

    deps.log.error("[place-order] order creation failed", {
      status: response.status,
      error: response.error,
      messages,
    });
    return fail(502, "ORDER_FAILED", "We couldn't place your order right now. Please try again, or contact us if this keeps happening.");
  }

  const order = response.data;
  const orderNumber = orderNumberOf(order);
  const paymentLink = paymentLinkOf(order);

  if (!paymentLink) {
    deps.log.error("[place-order] order created without a payment link", { orderNumber });
  }

  return {
    status: 200,
    body: {
      success: true,
      order_number: orderNumber,
      payment_link: paymentLink,
      total_price: order?.total_price ?? null,
    },
  };
}
