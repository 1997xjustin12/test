/**
 * Placing a card order, on the server, in an order that cannot leave a
 * customer charged without an order.
 *
 *   1. validate the request
 *   2. verify reCAPTCHA
 *   3. price every item from the catalogue — never from the request
 *   4. ask the backend for the total, and refuse if it differs from the total
 *      the shopper was shown
 *   5. AUTHORIZE the card for that total (a hold, not a charge)
 *   6. create the order
 *   7. CAPTURE the payment — or, if the order could not be created, VOID the
 *      authorization so the customer is never charged
 *
 * WHAT THIS REPLACED
 *
 * The browser called /api/braintree_checkout with an `amount` it computed
 * itself, and that route charged it as sent: an edited request could pay $1
 * for a $1,000 order. The sale also settled immediately, and only then did the
 * browser create the order — so if order creation failed, the customer had
 * paid for an order that did not exist.
 *
 * WHY THE BACKEND TOTAL CAN BE TRUSTED
 *
 * POST /api/orders/get-total prices each product from the backend's own
 * records. Checked against the live backend: an item sent at $1.00 instead of
 * $522 came back with the same $522 subtotal, an item with no price at all
 * too, and an unknown product_id was rejected.
 *
 * PURE ON PURPOSE
 *
 * No imports. Every outside call — reCAPTCHA, Elasticsearch, the backend,
 * Braintree — is passed in as `deps`, so each failure path above can be tested
 * without charging a card or creating an order.
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
 * fields, as the browser sent them before. Anything else in the request is
 * dropped, so a client cannot set status, payment_details or store_domain.
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

// Half a cent: the totals are two-decimal numbers, so anything larger is a real
// change, not floating-point noise.
const TOTAL_TOLERANCE = 0.005;

const NOT_CHARGED = "Your card has not been charged.";

const fail = (status, code, error, extra = {}) => ({
  status,
  body: { success: false, code, error, ...extra },
});

/** Returns { value } with only the fields placeOrder uses, or { error }. */
export function parseCheckoutRequest(body) {
  const { nonce, recaptchaToken, expectedTotal, customer, items } = body || {};

  if (typeof nonce !== "string" || !nonce) return { error: "Payment details are missing." };
  if (typeof recaptchaToken !== "string" || !recaptchaToken) {
    return { error: "reCAPTCHA token is required." };
  }

  const expected = Number(expectedTotal);
  if (!Number.isFinite(expected) || expected <= 0) return { error: "Order total is missing." };

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
    const productId = item?.product_id;
    const validId =
      (typeof productId === "number" && Number.isFinite(productId)) ||
      (typeof productId === "string" && productId.trim() !== "");
    if (!validId) return { error: "An item in your cart is invalid." };

    const quantity = Number(item?.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return { error: "An item in your cart has an invalid quantity." };
    }

    cleanItems.push({
      product_id: productId,
      quantity,
      product_link: typeof item.product_link === "string" ? item.product_link : "",
    });
  }

  const cleanCustomer = Object.fromEntries(
    CUSTOMER_FIELDS.filter((field) => field in customer).map((field) => [field, customer[field]]),
  );

  return {
    value: {
      nonce,
      recaptchaToken,
      expectedTotal: expected,
      customer: cleanCustomer,
      items: cleanItems,
    },
  };
}

/** The created order's number, whichever way the backend wraps it. */
const orderNumberOf = (order) =>
  order?.order_number ?? order?.data?.order_number ?? order?.order?.order_number ?? null;

/**
 * @param body  the parsed JSON request body
 * @param deps  {
 *   verifyRecaptcha(token)            → error message, or null when it passes
 *   lookupPrices(productIds)          → Map<String(product_id), number>
 *   backend(path, payload, { auth })  → { ok, status, data } — never throws
 *   payments.authorize({ amount, nonce }) / capture(id) / void(id)
 *                                     → { success, transaction?, message? } — never throw
 *   storeDomain
 *   log                               → { error(...), warn(...) }
 * }
 * @returns { status, body } for the route to send
 */
export async function placeOrder(body, deps) {
  const parsed = parseCheckoutRequest(body);
  if (parsed.error) return fail(400, "INVALID_REQUEST", parsed.error);
  const { nonce, recaptchaToken, expectedTotal, customer, items } = parsed.value;

  const recaptchaError = await deps.verifyRecaptcha(recaptchaToken);
  if (recaptchaError) return fail(400, "RECAPTCHA_FAILED", recaptchaError);

  // ── Price every item from the catalogue ───────────────────────────────────
  let prices;
  try {
    prices = await deps.lookupPrices(items.map((item) => item.product_id));
  } catch (error) {
    deps.log.error("[place-order] price lookup failed", error?.message || error);
    return fail(503, "PRICING_UNAVAILABLE", `We couldn't confirm prices right now. ${NOT_CHARGED} Please try again.`);
  }

  const unavailable = items.filter((item) => !Number.isFinite(prices.get(String(item.product_id))));
  if (unavailable.length > 0) {
    return fail(409, "ITEM_UNAVAILABLE", `An item in your cart is no longer available. ${NOT_CHARGED}`, {
      product_ids: unavailable.map((item) => item.product_id),
    });
  }

  const orderItems = items.map(({ product_id, quantity, product_link }) => {
    const price = prices.get(String(product_id));
    return { product_id, product_link, price, quantity, total: Number((price * quantity).toFixed(2)) };
  });

  // ── The amount to charge comes from the backend ───────────────────────────
  // Sent without the shopper's token, exactly as the checkout page asks for
  // the total it displays. A logged-in customer's token could change the result
  // (points), and then the two would never agree.
  const totalsResponse = await deps.backend("/api/orders/get-total", { ...customer, items: orderItems }, { auth: false });
  const totals = totalsResponse.ok ? totalsResponse.data : null;
  const amount = Number(totals?.total_price);

  if (!Number.isFinite(amount) || amount <= 0) {
    deps.log.error("[place-order] totals unavailable", { status: totalsResponse.status });
    return fail(502, "TOTALS_UNAVAILABLE", `We couldn't calculate your total right now. ${NOT_CHARGED} Please try again.`);
  }

  // Never charge a figure the shopper did not see. A price change between
  // loading checkout and pressing pay lands here, as does a tampered request.
  if (Math.abs(amount - expectedTotal) > TOTAL_TOLERANCE) {
    return fail(409, "TOTAL_CHANGED", `Your order total has changed. ${NOT_CHARGED}`, { totals });
  }

  // ── Hold the payment ──────────────────────────────────────────────────────
  const authorization = await deps.payments.authorize({ amount: amount.toFixed(2), nonce });
  if (!authorization.success || !authorization.transaction?.id) {
    return fail(
      402,
      "PAYMENT_DECLINED",
      authorization.message || "Your payment was declined. Please check your card details and try again.",
      // Braintree nonces are single-use: the page must ask for the card again.
      { nonceUsed: true },
    );
  }
  const transactionId = authorization.transaction.id;

  // ── Create the order ──────────────────────────────────────────────────────
  const orderResponse = await deps.backend(
    "/api/orders/checkout",
    {
      ...customer,
      status: "paid",
      payment_status: true,
      payment_method: "braintree",
      payment_details: transactionId,
      store_domain: deps.storeDomain,
      items: orderItems,
    },
    { auth: true },
  );

  if (!orderResponse.ok) {
    // A timeout lands here too, when the backend may in fact have created the
    // order. Releasing the hold is still the right call: an order without a
    // capture is fixable by staff, a charge without an order is the customer's
    // problem. The transaction id in the log is the thread to pull.
    const released = await deps.payments.void(transactionId);
    deps.log.error("[place-order] order creation failed; authorization released:", released.success, {
      status: orderResponse.status,
      transactionId,
      voidError: released.success ? undefined : released.message,
    });

    if (released.success) {
      return fail(
        502,
        "ORDER_FAILED",
        `We couldn't create your order. ${NOT_CHARGED} Please try again, or contact us if this keeps happening.`,
        { nonceUsed: true },
      );
    }
    return fail(
      502,
      "ORDER_FAILED",
      "We couldn't create your order. Your card was authorized but not charged, and your bank will release the hold. " +
        `Please contact us and quote reference ${transactionId}.`,
      { nonceUsed: true, reference: transactionId },
    );
  }

  const order = orderResponse.data;
  const orderNumber = orderNumberOf(order);

  // ── Take the payment ──────────────────────────────────────────────────────
  // The order exists, so the customer is told it succeeded even if capture
  // fails: the funds are held and staff can capture them in Braintree.
  const capture = await deps.payments.capture(transactionId);
  if (!capture.success) {
    deps.log.error(
      "[place-order] CAPTURE FAILED — the order exists but the payment is only authorized. Capture it in Braintree.",
      { orderNumber, transactionId, amount: amount.toFixed(2), message: capture.message },
    );
  }

  return {
    status: 200,
    body: {
      success: true,
      order,
      order_number: orderNumber,
      transaction_id: transactionId,
      totals,
    },
  };
}
