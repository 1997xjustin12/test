import { checkoutMessage, getCheckoutState } from "@/app/lib/checkout-availability";
import { placeOrder } from "@/app/lib/checkout/place-order";

/**
 * POST /api/checkout/place-order
 *
 * Creates the order as unpaid and returns the link to pay for it on the
 * payment app — see lib/checkout/place-order.js for the sequence and why.
 *
 * Body: { recaptchaToken, customer, items: [{ product_id, quantity }] }
 * Header: Authorization: Bearer <access token>, when the shopper is logged in
 *
 * → { success: true, order_number, payment_link, total_price }
 * → { success: false, code, error, errors? }   errors: the backend's messages
 */

// reCAPTCHA and one backend call, in sequence. The default limit leaves too
// little room if the backend is slow.
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

/**
 * X-Store-Domain is what tells the shared backend which brand the order
 * belongs to — Solana, BBQ or OKO — and so which store's payment settings
 * issue the link. Each brand's deployment sets its own NEXT_PUBLIC_STORE_DOMAIN.
 */
const backendCaller = (storeDomain, authorization) => async (path, payload) => {
  try {
    const response = await fetch(`${process.env.NEXT_SOLANA_BACKEND_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Store-Domain": storeDomain,
        ...(authorization ? { Authorization: authorization } : {}),
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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  // The last gate, and the one that matters: no order is created while the
  // checkout is closed, whatever reached this route.
  const checkout = await getCheckoutState();
  if (checkout.closed) {
    return res
      .status(503)
      .json({ success: false, error: checkoutMessage(checkout), checkoutClosed: true });
  }

  // Without it the backend cannot tell which brand is ordering. Refuse rather
  // than create an order filed under no store, or the wrong one.
  const storeDomain = process.env.NEXT_PUBLIC_STORE_DOMAIN?.trim();
  if (!storeDomain) {
    console.error("[place-order] NEXT_PUBLIC_STORE_DOMAIN is not set for this deployment");
    return res.status(503).json({
      success: false,
      code: "STORE_NOT_CONFIGURED",
      error: "We couldn't place your order right now. Please contact us to complete your order.",
    });
  }

  // Only a bearer token is forwarded: a logged-in shopper's order is theirs.
  const header = req.headers.authorization;
  const authorization = typeof header === "string" && header.startsWith("Bearer ") ? header : null;

  const { status, body } = await placeOrder(req.body, {
    verifyRecaptcha,
    backend: backendCaller(storeDomain, authorization),
    storeDomain,
    log: console,
  });

  return res.status(status).json(body);
}
