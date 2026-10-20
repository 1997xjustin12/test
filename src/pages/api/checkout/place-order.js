import { checkoutMessage, getCheckoutState } from "@/app/lib/checkout-availability";
import { placeOrder } from "@/app/lib/checkout/place-order";
import { backendHeaders } from "@/app/lib/backend-headers";

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
//
// Every call it makes follows the backend's rate-limit rule (lib/backend-
// headers.js): the shopper's Bearer token when signed in, otherwise the
// storefront key plus their address — so the 30-a-minute checkout limit counts
// per shopper rather than for the whole storefront.
const backendCaller = (req, storeDomain, authorization) => async (path, payload) => {
  try {
    const response = await fetch(`${process.env.NEXT_SOLANA_BACKEND_URL}${path}`, {
      method: "POST",
      headers: {
        ...backendHeaders(req, { bearer: authorization }),
        Accept: "application/json",
        "X-Store-Domain": storeDomain,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const isJson = (response.headers.get("content-type") || "").includes("application/json");
    const data = isJson ? await response.json() : null;
    const retryAfter = response.headers.get("retry-after") || undefined;
    return { ok: response.ok && isJson, status: response.status, data, retryAfter };
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
  // checkout is closed on this domain, whatever reached this route.
  const checkout = await getCheckoutState(req.headers.host);
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
    backend: backendCaller(req, storeDomain, authorization),
    storeDomain,
    log: console,
  });

  if (body?.retryAfter) res.setHeader("Retry-After", String(body.retryAfter));
  return res.status(status).json(body);
}
