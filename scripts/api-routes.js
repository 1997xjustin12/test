/**
 * Every API route this app serves, and what is allowed to call it.
 *
 * This file exists because nothing else in the repo answers the question. A
 * route is protected if its author remembered, and an unprotected one looks
 * exactly like a deliberately public one — which is how
 * /api/bulk_update_popular_searches sat open to anonymous callers, taking its
 * increment from the request body and defaulting it to 50, until someone read
 * all 67 route files one afternoon in October 2026.
 *
 * Listing them does not make anything safer by itself. What it does is force
 * one decision, in the pull request, by the person who already knows the
 * answer: `npm run check:routes` fails when a route file exists that is not
 * named here, and when a route's declared group is contradicted by its own
 * code.
 *
 * ── The four groups ──────────────────────────────────────────────────────
 *
 *   admin    An admin session (the signed cookie) or the server-to-server
 *            secret. The admin screens and the Django backend.
 *
 *   secret   The revalidation secret only. Server-to-server, no cookie
 *            involved, so no browser can reach it.
 *
 *   user     Forwards the caller's own bearer token upstream. Note what this
 *            means: the route authorises nothing itself, and the security of
 *            everything here is Django's. A backend endpoint that forgets its
 *            own ownership check is not caught by anything on this side.
 *
 *   public   Anyone may call it, including a script. Which is fine — see
 *            docs/guides/api-security.md on why "only our app may call it" is
 *            not achievable for anything a browser must reach. What a public
 *            route owes in return is a rate limit.
 *
 * ── Adding a route ───────────────────────────────────────────────────────
 *
 * Add it to the right list. If it is `public`, wrap the handler in
 * withRateLimit / withRouteRateLimit, or add it to UNTHROTTLED below with a
 * reason. The check will tell you which of these you have missed.
 */

/** Admin session or the server-to-server secret. */
const admin = [
  "/api/admin-session",
  "/api/admin-users",
  "/api/bulk_update_popular_searches",
  "/api/cache/clear",
  "/api/cache/clear-remote",
  "/api/catalog-exclusions",
  "/api/catalog/duplicates",
  "/api/chat/region-settings",
  "/api/checkout-availability",
  "/api/footer",
  "/api/header",
  "/api/home-page",
  "/api/redis",
  "/api/regenerate-feed",
  "/api/revalidate-page-seo",
  "/api/revalidate-store-settings",
];

/** The revalidation secret only. Called by the Django backend. */
const secret = [
  "/api/revalidate",
  "/api/revalidate-all",
  "/api/revalidate-pdp",
  "/api/revalidate-plp",
];

/** Forwards the caller's own token. Django decides. */
const user = [
  "/api/auth/cart/active",
  "/api/auth/cart/close",
  "/api/auth/cart/create",
  "/api/auth/cart/update",
  "/api/auth/change-password",
  "/api/auth/orders",
  "/api/checkout/place-order",
  "/api/orders/checkout",
  "/api/profile",
  "/api/profile/update",
  "/api/reviews/create",
  "/api/reviews/update",
];

/** Open to anyone. Every one of these should carry a rate limit. */
const open = [
  "/api/abandoned-carts/create",
  "/api/add_popular_searches",
  "/api/auth/forgot-password",
  "/api/blogs/[[...slug]]",
  "/api/braintree_token",
  "/api/catalog/product/[handle]",
  "/api/catalog/search",
  "/api/chat",
  "/api/chat/availability",
  "/api/chat/history",
  "/api/chat/products",
  "/api/collections/collection-list",
  "/api/collections/collection-products/[id]",
  "/api/es/product",
  "/api/es/products",
  "/api/es/products-by-ids",
  "/api/es/searchkit",
  "/api/es/shopify/brands",
  "/api/es/shopify/categories",
  "/api/es/shopify/search",
  "/api/es/solana_product",
  "/api/favicon",
  "/api/login",
  "/api/logout",
  "/api/mcp",
  "/api/orders/get-total",
  "/api/popular_searches",
  "/api/refresh",
  "/api/register",
  "/api/reset-password",
  "/api/reviews/list",
  "/api/session",
  "/api/stores/validate-token",
  "/api/subscribers/subscribe",
  "/api/subscribers/unsubscribe",
];

/**
 * Public routes with no rate limit yet, each with the reason it is tolerable
 * for now. This list is a ratchet: the check fails when something lands in it
 * that is not written down here, so it can shrink but not quietly grow.
 *
 * None of these proxy a credential or write anything an attacker would want —
 * that was the test applied when drawing the line. The ones that did
 * (the Elasticsearch proxies, the popular-search writer) were throttled on
 * 8 October 2026 rather than excused.
 */
const UNTHROTTLED = {
  "/api/braintree_token": "Issues a client token. Will be retired with Braintree.",
  "/api/collections/collection-list": "Cached Redis read of the menu. Cheap, and the same data the page already ships.",
  "/api/collections/collection-products/[id]": "Cached Redis read. Same as above.",
  "/api/favicon": "Serves a cached icon.",
  "/api/logout": "Clears cookies. Nothing upstream, nothing to exhaust.",
  "/api/orders/get-total": "Arithmetic on a posted basket. No upstream call, no storage.",
  "/api/reviews/list": "Public reviews, already cached upstream. A candidate for the light bucket.",
  "/api/session": "Reads the caller's own cookie.",
  "/api/stores/validate-token": "Proxies one backend validation call and is the admin door — see docs/guides/admin-security.md A4. Throttling it is wanted; the shape of the fix is not settled.",
};

module.exports = { admin, secret, user, public: open, UNTHROTTLED };
