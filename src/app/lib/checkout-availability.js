import { unstable_cache } from "next/cache";
import { redis } from "@/app/lib/redis";
import { contentKey } from "@/app/lib/store";
import { readOrDegrade } from "@/app/lib/upstream";

/**
 * Whether checkout is open — for this brand, on this domain.
 *
 * Built so a storefront that is still in development (a staging domain, a
 * preview) can keep its checkout shut while the live site takes orders, or the
 * other way round. When it is shut, /checkout redirects to /checkout-unavailable
 * and the place-order API refuses, so nothing can be bought by any route.
 *
 * Decided in this order, first answer wins:
 *
 *   1. CHECKOUT_CLOSED   environment variable, a hard lock for one deployment.
 *                        Set it on a Vercel project or environment that must
 *                        never take orders (staging); nothing in the admin can
 *                        reopen it, and it needs no Redis — so it holds through
 *                        an outage too.
 *   2. this domain       the admin's per-domain switch ("Enable checkout on
 *                        staging.outdoorkitchenoutlet.com"), toggled at
 *                        /admin/checkout without a deploy.
 *   3. the brand         the admin's brand-wide default, for every domain with
 *                        no switch of its own.
 *   4. open              nothing set anywhere.
 *
 * One record per brand (solana_checkout, bbq_checkout, oko_checkout). Staging
 * and production of a brand share it, which is why domains have their own
 * entries in it rather than sharing the brand's one switch.
 */

export const CHECKOUT_KEY = contentKey("checkout");
export const CHECKOUT_TAG = "checkout-availability";

/** Where a closed checkout sends the shopper. */
export const CHECKOUT_UNAVAILABLE_PATH = "/checkout-unavailable";

/** What is shown when nobody has written a message of their own. */
export const DEFAULT_MESSAGE =
  "We're putting the finishing touches on our new store, so online ordering is switched off for now. " +
  "Your cart is saved, and our team can place your order over the phone.";

const envLocked = () => /^(1|true|yes|on)$/i.test(String(process.env.CHECKOUT_CLOSED ?? "").trim());

/**
 * A request's domain, as the switch keys it: lowercased, no port, no "www.",
 * so www.solanafireplaces.com and solanafireplaces.com are one site.
 */
export function normalizeHost(host) {
  return String(host ?? "")
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "")
    .replace(/^www\./, "")
    .slice(0, 253);
}

const EMPTY_RECORD = Object.freeze({ closed: false, message: "", hosts: {}, updatedAt: null });

export function normalizeCheckout(raw) {
  if (!raw || typeof raw !== "object") return { ...EMPTY_RECORD, hosts: {} };
  const hosts = {};
  if (raw.hosts && typeof raw.hosts === "object") {
    for (const [host, entry] of Object.entries(raw.hosts)) {
      const key = normalizeHost(host);
      if (key && entry && typeof entry === "object" && typeof entry.closed === "boolean") {
        hosts[key] = { closed: entry.closed };
      }
    }
  }
  return {
    closed: raw.closed === true,
    message: String(raw.message ?? "").trim().slice(0, 400),
    hosts,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : null,
  };
}

/** The stored record, or null when there is none. Throws on a failed read. */
const readRecord = unstable_cache(
  async () => {
    const stored = await redis.get(CHECKOUT_KEY);
    if (!stored) return null;
    return normalizeCheckout(typeof stored === "string" ? JSON.parse(stored) : stored);
  },
  ["checkout-availability-record", CHECKOUT_KEY],
  { revalidate: 86400, tags: [CHECKOUT_TAG] },
);

/**
 * Checkout's state for a request to `host`. Never throws: an unreadable record
 * counts as "nothing set", so only CHECKOUT_CLOSED (or nothing) decides then.
 *
 * Returns { closed, message, source, host, record }, where `source` says which
 * rule decided — "env", "host", "brand" or "default" — for the admin screen.
 */
export async function getCheckoutState(host) {
  const key = normalizeHost(host);
  const record = await readOrDegrade("checkout-availability", readRecord, null);
  const message = record?.message ?? "";

  if (envLocked()) return { closed: true, message, source: "env", host: key, record };
  const own = key ? record?.hosts?.[key] : undefined;
  if (own) return { closed: own.closed, message, source: "host", host: key, record };
  if (record) return { closed: record.closed, message, source: "brand", host: key, record };
  return { closed: false, message, source: "default", host: key, record };
}

/** The message to show, falling back to the standard wording. */
export const checkoutMessage = (state) => state?.message?.trim() || DEFAULT_MESSAGE;

/** Whether CHECKOUT_CLOSED locks this deployment shut. */
export const isCheckoutLocked = envLocked;

/**
 * Saves the brand record. `hosts` replaces the stored map: a domain set to
 * null or missing falls back to the brand default.
 */
export async function saveCheckoutState({ closed, message, hosts }) {
  const record = normalizeCheckout({ closed, message, hosts });
  record.updatedAt = new Date().toISOString();
  await redis.set(CHECKOUT_KEY, JSON.stringify(record));
  return record;
}
