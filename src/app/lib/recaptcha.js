/**
 * Server-side reCAPTCHA v3 check, for sign-in and the lost-password form.
 *
 * The backend's rate-limit checklist recommends reCAPTCHA on login
 * (docs/reference/storefront-rate-limit-checklist.pdf). v3 is invisible — it
 * scores the visitor in the background and never shows a challenge — so it is
 * asked on every attempt rather than "after a couple of failures", which would
 * need a failure count the browser could simply not send.
 *
 * What fails closed and what fails open, on purpose:
 *   refused  no token, a token Google rejects (forged, reused, expired), the
 *            wrong action, or a score under MIN_SCORE — that is the point
 *   allowed  RECAPTCHA_SECRET_KEY unset, or Google unreachable — logged. An
 *            outage at Google or a configuration slip must not lock every
 *            customer out of their account; the rate limits still apply.
 */

const MIN_SCORE = 0.5;
const TIMEOUT_MS = 5_000;

/** What the shopper is told when the check refuses. */
export const RECAPTCHA_FAILED_MESSAGE =
  "We couldn't confirm this request came from a person. Please refresh the page and try again.";

/**
 * @returns {{ ok: true } | { ok: false, reason: string }}
 */
export async function verifyRecaptcha(token, expectedAction) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error(`[recaptcha] RECAPTCHA_SECRET_KEY is not set; allowing ${expectedAction} unverified`);
    return { ok: true };
  }
  if (!token || typeof token !== "string") return { ok: false, reason: "missing-token" };

  let data;
  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    data = await response.json();
  } catch (error) {
    console.error(`[recaptcha] Google unreachable; allowing ${expectedAction} unverified:`, error?.message || error);
    return { ok: true };
  }

  if (!data?.success) return { ok: false, reason: `rejected:${(data?.["error-codes"] || []).join(",")}` };
  if (data.action !== expectedAction) return { ok: false, reason: `action:${data.action}` };
  if (typeof data.score === "number" && data.score < MIN_SCORE) return { ok: false, reason: `score:${data.score}` };
  return { ok: true };
}
