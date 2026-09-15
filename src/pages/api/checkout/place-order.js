import gateway from "@/app/lib/braintree";
import { ES_INDEX } from "@/app/lib/helpers";
import { placeOrder } from "@/app/lib/checkout/place-order";

/**
 * POST /api/checkout/place-order
 *
 * The only way the storefront takes a card payment. Re-prices the cart, holds
 * the payment, creates the order, then captures — see
 * lib/checkout/place-order.js for the sequence and why.
 *
 * Body: { nonce, recaptchaToken, expectedTotal, customer, items: [{ product_id, quantity, product_link }] }
 * Header: Authorization: Bearer <access token>, when the shopper is logged in
 *
 * Replaces /api/braintree_checkout, which charged whatever amount the browser sent.
 */

// reCAPTCHA, Elasticsearch, two backend calls and up to two Braintree calls,
// in sequence. The default limit leaves too little room if the backend is slow.
export const config = { maxDuration: 60 };

const TIMEOUT_MS = 20_000;

async function verifyRecaptcha(token) {
  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: process.env.RECAPTCHA_SECRET_KEY || "", response: token }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const data = await response.json();

    if (!data.success) return "reCAPTCHA verification failed. Please refresh the page and try again.";
    // v3 scores run 0.0–1.0; below 0.5 is typically automated traffic.
    if (data.score < 0.5) return "reCAPTCHA score too low. Please try again.";
    if (data.action !== "checkout") return "Invalid reCAPTCHA action.";
    return null;
  } catch (error) {
    console.error("[place-order] reCAPTCHA request failed", error?.message || error);
    return "We couldn't verify reCAPTCHA. Please try again.";
  }
}

async function lookupPrices(productIds) {
  const response = await fetch(`${process.env.NEXT_ES_URL}/${ES_INDEX}/_search`, {
    method: "POST",
    headers: {
      Authorization: `apiKey ${process.env.NEXT_ES_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      size: productIds.length,
      _source: ["product_id", "variants.price"],
      query: { terms: { product_id: productIds } },
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Elasticsearch responded ${response.status}`);

  const data = await response.json();
  return new Map(
    (data?.hits?.hits || []).map(({ _source }) => [
      String(_source.product_id),
      Number(_source.variants?.[0]?.price),
    ]),
  );
}

const backendCaller = (authorization) => async (path, payload, { auth }) => {
  try {
    const response = await fetch(`${process.env.NEXT_SOLANA_BACKEND_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Store-Domain": process.env.NEXT_PUBLIC_STORE_DOMAIN,
        ...(auth && authorization ? { Authorization: authorization } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const isJson = (response.headers.get("content-type") || "").includes("application/json");
    const data = isJson ? await response.json() : null;
    return { ok: response.ok && isJson, status: response.status, data };
  } catch (error) {
    return { ok: false, status: 0, data: null, error: error?.message || String(error) };
  }
};

/** Braintree calls normalised to { success, transaction, message }, never throwing. */
const braintreeCall = async (request) => {
  try {
    const result = await request();
    return { success: Boolean(result?.success), transaction: result?.transaction, message: result?.message };
  } catch (error) {
    return { success: false, message: error?.message || String(error) };
  }
};

const payments = {
  authorize: ({ amount, nonce }) =>
    braintreeCall(() =>
      gateway.transaction.sale({
        amount,
        paymentMethodNonce: nonce,
        options: { submitForSettlement: false },
      }),
    ),
  capture: (transactionId) => braintreeCall(() => gateway.transaction.submitForSettlement(transactionId)),
  void: (transactionId) => braintreeCall(() => gateway.transaction.void(transactionId)),
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  // Only a bearer token is forwarded, and only to order creation.
  const header = req.headers.authorization;
  const authorization = typeof header === "string" && header.startsWith("Bearer ") ? header : null;

  const { status, body } = await placeOrder(req.body, {
    verifyRecaptcha,
    lookupPrices,
    backend: backendCaller(authorization),
    payments,
    storeDomain: process.env.NEXT_PUBLIC_STORE_DOMAIN,
    log: console,
  });

  return res.status(status).json(body);
}
