/**
 * Reads that must not take the storefront down.
 *
 * Every storefront page needs the nav menu, the theme and the store settings,
 * and they all come from one Redis. Until now a single failed read replaced the
 * page: (market)/layout.jsx called notFound() when the read came back empty, so
 * every route in the site became a 404, and a *thrown* read propagated out of
 * the layout so every route became an HTTP 500. Measured with one bad Upstash
 * token: a product page returned 500 with zero visible text — an empty page,
 * which is exactly what the uptime monitor reports.
 *
 * Two rules:
 *
 *   1. A failed read degrades part of the page. It never replaces the page, and
 *      it never turns a real URL into a 404 — a 404 can be cached and indexed,
 *      and an outage is not a missing page.
 *   2. A failed read is never cached. The callers here wrap `unstable_cache`
 *      functions, which cache what the function *returns*; catching inside one
 *      would store the fallback and freeze a momentary blip in place for the
 *      whole revalidate window — a day, on the layout.
 *
 * The last good value is kept in module memory, so a warm instance keeps
 * serving the real menu right through an outage. A cold instance has nothing to
 * fall back on, which is what `fallback` is for.
 */

/** Last value each read returned successfully, by name. */
const lastGood = new Map();

/** When each name last logged, so an outage cannot flood the logs. */
const lastLoggedAt = new Map();

const LOG_INTERVAL_MS = 60_000;

const report = (name, detail) => {
  const now = Date.now();
  if (now - (lastLoggedAt.get(name) ?? 0) < LOG_INTERVAL_MS) return;
  lastLoggedAt.set(name, now);
  const source = lastGood.has(name) ? "last known good" : "the fallback";
  console.error(`[upstream] ${name} failed, serving ${source}:`, detail?.message || detail);
};

/**
 * Runs `read`, remembering what it returns. On failure — or on a read that
 * succeeds with nothing in it — returns the last value that worked, or
 * `fallback` if this instance has never seen one. Never throws.
 *
 * Use where the page can do without the data: a header with no menu is worth
 * serving, a 500 is not.
 */
export async function readOrDegrade(name, read, fallback) {
  try {
    const value = await read();
    if (value === null || value === undefined) {
      // A read that succeeds and returns nothing is a configuration problem,
      // not an outage — say so, but do not overwrite a good value with it.
      report(name, new Error("read succeeded but returned nothing"));
      return lastGood.has(name) ? lastGood.get(name) : fallback;
    }
    lastGood.set(name, value);
    return value;
  } catch (error) {
    report(name, error);
    return lastGood.has(name) ? lastGood.get(name) : fallback;
  }
}

/**
 * Same, for data the page cannot be built without: falls back to the last good
 * value, and re-throws when there is none.
 *
 * The throw matters. Next renders a 500 for it, and a 500 is not cached and
 * tells a crawler to come back — where notFound() would publish "this page does
 * not exist" for a URL that does, and let that answer be cached.
 */
export async function readOrLastKnownGood(name, read) {
  try {
    const value = await read();
    if (value !== null && value !== undefined) lastGood.set(name, value);
    return value;
  } catch (error) {
    if (lastGood.has(name)) {
      report(name, error);
      return lastGood.get(name);
    }
    throw error;
  }
}

/** Test seam: drops what this process remembers. */
export function forgetLastKnownGood(name) {
  if (name === undefined) {
    lastGood.clear();
    lastLoggedAt.clear();
    return;
  }
  lastGood.delete(name);
  lastLoggedAt.delete(name);
}
