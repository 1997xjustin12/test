/**
 * What a shopper is told when a request was refused for being too frequent.
 *
 * Both this storefront's own limiter (lib/rate-limit.js) and the backend's
 * answer 429 with Retry-After. The backend's rate-limit checklist
 * (docs/reference/storefront-rate-limit-checklist.pdf) asks every screen to say
 * "Too many requests, please wait a moment", respect Retry-After and never
 * retry in a loop — rather than a generic failure, or worse, a success.
 *
 * Browser-safe: no server imports.
 */

/** "45 seconds", "3 minutes" — from a Retry-After header's seconds, or null. */
export function waitFrom(retryAfter) {
  const seconds = Number.parseInt(retryAfter, 10);
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"}`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

/** Seconds to wait: Retry-After, else what either limiter put in the body. */
function retryAfterOf(response, data) {
  const header = response?.headers?.get?.("retry-after");
  if (header) return header;
  if (data?.retryAfter) return data.retryAfter; // this storefront's limiter
  const said = String(data?.detail ?? data?.data?.detail ?? "");
  return said.match(/available in (\d+) second/i)?.[1] ?? null; // DRF's throttle text
}

/** The message for a 429, or null when the response isn't one. */
export function tooManyRequestsMessage(response, data) {
  if (response?.status !== 429) return null;
  const wait = waitFrom(retryAfterOf(response, data));
  return wait
    ? `Too many requests, please wait a moment and try again in ${wait}.`
    : "Too many requests, please wait a moment and try again.";
}
