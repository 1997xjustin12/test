import Client from "@searchkit/instantsearch-client";

/**
 * The storefront's InstantSearch client, for the listing-page product grid.
 *
 * WHY THIS EXISTS
 *
 * Under sustained load, listing pages could hang server-side and never finish
 * rendering — found by loading every sitemap URL back, when a different handful
 * of /[slug] pages timed out on each run. Three things combined:
 *
 *   1. The grid's server-side search requests to our own /api/es/searchkit did
 *      not identify themselves as internal, so they counted against the public
 *      rate limit (120 a minute). On Vercel every server render shares the
 *      deployment's address, so a crawler reading a few dozen listing pages is
 *      enough to make the storefront throttle itself.
 *
 *   2. @searchkit/instantsearch-client never checks response.ok. It caches the
 *      429 body as if it were a result, keyed by the request — in a client that
 *      is a module-level singleton, so the cache outlives the request and serves
 *      that error to every later render of the page until the process restarts.
 *
 *   3. The search helper reads `results.slice` on that error body, throws, and
 *      InstantSearch retries — indefinitely, re-reading the same cached error.
 *
 * So: server-side requests now carry the internal header (the secret is read
 * only on the server; `window` is undefined there and defined in the browser),
 * and a response without a results array is never passed on. The client's cache
 * is cleared so the next render asks again, and each query gets a well-formed
 * empty result — on gallery and top-level pages the grid then falls back to the
 * server-supplied first page, so the page still shows products.
 */

const isServer = () => typeof window === "undefined";

/** What the search helper expects for one query, with nothing in it. */
const emptyResult = (request) => ({
  index: request?.indexName,
  hits: [],
  nbHits: 0,
  nbPages: 0,
  page: 0,
  hitsPerPage: request?.params?.hitsPerPage ?? 0,
  processingTimeMS: 0,
  exhaustiveNbHits: true,
  query: request?.params?.query ?? "",
  params: "",
  facets: {},
});

export function createSearchClient() {
  const base = Client({
    // Server-side: absolute URL (no window during SSR). Client-side: relative.
    url: isServer()
      ? `${process.env.NEXT_PUBLIC_SITE_BASE_URL}/api/es/searchkit`
      : "/api/es/searchkit",
    // A function, so it is evaluated per request and never on a browser path
    // that could read the secret. See lib/rate-limit.js isInternalRequest.
    headers: () => {
      if (!isServer()) return {};
      const secret = process.env.REVALIDATE_SECRET;
      return secret ? { "x-internal-request": secret } : {};
    },
  });

  return {
    async search(requests) {
      const response = await base.search(requests);
      if (Array.isArray(response?.results)) return response;

      await base.clearCache();
      console.error(
        "[searchkit-client] unusable search response; rendering empty results:",
        response?.error || response?.message || response,
      );
      return { results: requests.map(emptyResult) };
    },
    searchForFacetValues: (requests) => base.searchForFacetValues(requests),
    clearCache: () => base.clearCache(),
  };
}
