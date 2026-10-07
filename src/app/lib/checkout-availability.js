import { unstable_cache } from "next/cache";
import { redis } from "@/app/lib/redis";
import { contentKey } from "@/app/lib/store";
import { readOrDegrade } from "@/app/lib/upstream";

/**
 * Whether this brand is taking orders.
 *
 * Braintree is configured against a sandbox and is going to be replaced, so a
 * completed checkout captures nothing. Rather than delete the checkout — which
 * would mean unpicking a flow that works and rebuilding it for the next
 * gateway — it is closed behind a switch. Every component, route and API stays
 * exactly where it is; the door is shut in front of them.
 *
 * One record per brand (solana_checkout, bbq_checkout, oko_checkout), so the
 * three can be closed and reopened independently.
 *
 * Two layers, deliberately:
 *
 *   CHECKOUT_CLOSED   an environment variable, the floor. It decides what a
 *                     deployment does when there is no record or Redis cannot
 *                     be reached, so an outage cannot quietly reopen a
 *                     checkout that was meant to be shut.
 *   the record        the day-to-day switch, flipped at /admin/checkout
 *                     without a deploy.
 *
 * The record wins when it exists. The variable is what a cold instance falls
 * back to.
 */

export const CHECKOUT_KEY = contentKey("checkout");
export const CHECKOUT_TAG = "checkout-availability";

/** What is shown when nobody has written a message of their own. */
export const DEFAULT_MESSAGE =
  "Online checkout is temporarily unavailable while we move to a new payment provider. " +
  "Your basket is saved, and our team can take your order over the phone in the meantime.";

const envClosed = () => /^(1|true|yes|on)$/i.test(String(process.env.CHECKOUT_CLOSED ?? "").trim());

/** The answer when there is no record, or none can be read. */
const fallback = () => ({ closed: envClosed(), message: "", updatedAt: null });

export function normalizeCheckout(raw) {
  if (!raw || typeof raw !== "object") return fallback();
  return {
    closed: raw.closed === true,
    message: String(raw.message ?? "").trim().slice(0, 400),
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : null,
  };
}

/** Throws rather than caching a failure; see lib/upstream.js. */
const readCheckout = unstable_cache(
  async () => {
    const stored = await redis.get(CHECKOUT_KEY);
    if (!stored) return fallback();
    return normalizeCheckout(typeof stored === "string" ? JSON.parse(stored) : stored);
  },
  ["checkout-availability", CHECKOUT_KEY],
  { revalidate: 86400, tags: [CHECKOUT_TAG] },
);

/**
 * This brand's checkout state. Never throws — a failed read degrades to what
 * CHECKOUT_CLOSED says, which is why that variable is worth setting on a
 * deployment that is meant to stay shut.
 */
export const getCheckoutState = () => readOrDegrade("checkout-availability", readCheckout, fallback());

/** The message to show, falling back to the standard wording. */
export const checkoutMessage = (state) => state?.message?.trim() || DEFAULT_MESSAGE;

export async function saveCheckoutState({ closed, message }) {
  const record = normalizeCheckout({ closed, message });
  record.updatedAt = new Date().toISOString();
  await redis.set(CHECKOUT_KEY, JSON.stringify(record));
  return record;
}
