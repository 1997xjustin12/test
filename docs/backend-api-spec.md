# Backend API Spec — for reuse in new app

Extracted from this project's live integration (Elasticsearch + Django "Solana" backend + Redis + Braintree). Legacy BigCommerce Store API routes were excluded — they're superseded and not used by the current UI.

Paste the "Implementation request" block at the bottom into the new app's Claude session, after filling in your enhancements/limitations per section.

---

## Backend systems

| System | Base URL env var | Auth header |
|---|---|---|
| Django "Solana" backend | `NEXT_SOLANA_BACKEND_URL` | `X-Store-Domain: <NEXT_PUBLIC_STORE_DOMAIN>` always; `Authorization: Api-Key <NEXT_SOLANA_BACKEND_KEY \| NEXT_SOLANA_COLLECTIONS_KEY>` on register/collections; `Authorization: Bearer <access token>` forwarded on user-scoped routes |
| Elasticsearch | `NEXT_ES_URL`, index `bigcommerce_products_7` | `Authorization: apiKey <NEXT_ES_API_KEY>` |
| Upstash Redis | `NEXT_UPSTASH_REDIS_REST_URL` / `_TOKEN` | via `@upstash/redis` client |
| Braintree | SDK creds (not URL-based) | server SDK only |
| Google reCAPTCHA v3 | `https://www.google.com/recaptcha/api/siteverify` | `RECAPTCHA_SECRET_KEY` |
| WordPress blog (separate CMS) | hardcoded `https://bbq-blog.onsitestorage.com` | none |

JWT auth model: access/refresh pair issued by Django backend, refreshed client-side every 10 min via `/api/refresh`; incoming `Authorization: Bearer <token>` is forwarded as-is to the backend on user-scoped routes.

---

## Auth

| Endpoint | Method | Upstream | Request | Purpose |
|---|---|---|---|---|
| `/api/login` | POST | `{SOLANA}/api/auth/login` | email, password | Login; sets `isLoggedIn` cookie |
| `/api/logout` | POST | — (local) | — | Clears cookie |
| `/api/register` | POST | reCAPTCHA verify → `{SOLANA}/api/auth/register` | user fields + recaptchaToken | Register |
| `/api/refresh` | POST | `{SOLANA}/api/auth/token/refresh` | refresh token | Rotate access token |
| `/api/auth/forgot-password` | POST | `{SOLANA}/api/auth/forgot-password` | email | Send reset email |
| `/api/reset-password` | POST | `{SOLANA}/api/auth/reset-password` | token, uidb64, new password | Reset password |
| `/api/auth/change-password` | PUT | `{SOLANA}/api/auth/change-password` | old/new password (Bearer) | Change password |
| `/api/profile` | GET | `{SOLANA}/api/auth/profile` | Bearer | Get profile |
| `/api/profile/update` | PUT | `{SOLANA}/api/auth/profile` | profile fields (Bearer) | Update profile |

## Cart

| Endpoint | Method | Upstream | Purpose |
|---|---|---|---|
| `/api/auth/cart/active` | GET | `{SOLANA}/api/cart/active` | Get logged-in user's active cart |
| `/api/auth/cart/create` | POST | `{SOLANA}/api/cart/create` | Create cart |
| `/api/auth/cart/update` | PUT | `{SOLANA}/api/cart/update` | Update cart items |
| `/api/auth/cart/close` | POST | `{SOLANA}/api/cart/close` | Close/clear cart |
| `/api/abandoned-carts/create` | POST | `{SOLANA}/api/abandoned-carts/create/` | Record abandoned cart (also fired via `sendBeacon` on tab close) |

## Orders / Checkout / Payments

| Endpoint | Method | Upstream | Purpose |
|---|---|---|---|
| `/api/orders/checkout` | POST | `{SOLANA}/api/orders/checkout` | Create order after payment |
| `/api/orders/get-total` | POST | `{SOLANA}/api/orders/get-total` | Compute cart total (tax/shipping) |
| `/api/auth/orders` | GET | `{SOLANA}/api/auth/orders` | List user's orders |
| `/api/braintree_token` | GET | Braintree SDK `clientToken.generate` | Drop-in client token |
| `/api/braintree_checkout` | POST | reCAPTCHA verify → Braintree `transaction.sale` | Charge card. Body: `nonce, amount, recaptchaToken` |

External (not a backend endpoint to build, just a call the frontend makes): `https://api.zippopotam.us/us/{zip}` for ZIP → city/state autofill.

## Products / Search (Elasticsearch-backed — this is the core contract to replicate)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/es/products` | GET, POST | PLP listing w/ filters (categories, brand, price, free-shipping, sort, q) + facet aggs |
| `/api/es/solana_product` | POST | Full PDP fetch by `handle`: product + related/FBW/open-box/new/specs/manuals/shipping |
| `/api/es/products-by-ids` | GET | Batch fetch by product IDs |
| `/api/es/shopify/search` | POST | Generic search proxy (site search, homepage carousels, "you may also like") — has in-memory 5-min cache |
| `/api/es/shopify/brands` | POST | Distinct brand list (agg on `brand.keyword`) |
| `/api/es/shopify/categories` | POST | Distinct category list (agg on `product_category.category_name.keyword`) |
| `/api/es/searchkit` | POST | Searchkit-driven PLP/InstantSearch backend; brand/collection exclusion, custom sort, price buckets; Redis-cached (60s/24h) |
| `/api/collections/collection-list` | GET | `{SOLANA}/api/collections/collection-list` — list collections for menu builder |
| `/api/collections/collection-products/[id]` | GET | `{SOLANA}` collection → product IDs, then ES-enriched |

Response shape from ES routes: raw `hits.hits[]._source` plus `aggregations` for facets — the new app's ES client/index should mirror this document shape (`bigcommerce_products_7`) for a drop-in swap.

## Reviews

| Endpoint | Method | Upstream | Purpose |
|---|---|---|---|
| `/api/reviews/list` | GET | `{SOLANA}/api/reviews/list?product_id=&page=` | List reviews |
| `/api/reviews/create` | POST | `{SOLANA}/api/reviews/create` | Submit review (product, rating, title, comment) |
| `/api/reviews/update` | PUT | `{SOLANA}/api/reviews/{id}/update` | Edit review |

## Newsletter

| Endpoint | Method | Upstream |
|---|---|---|
| `/api/subscribers/subscribe` | POST | `{SOLANA}/api/subscribers/subscribe/` |
| `/api/subscribers/unsubscribe` | POST | `{SOLANA}/api/subscribers/unsubscribe/` |

## Search analytics + generic KV (Redis)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/popular_searches` | GET | Top searched terms (`zrange`), query `?limit=` |
| `/api/add_popular_searches` | POST | Increment one search term's score |
| `/api/bulk_update_popular_searches` | POST | Bulk-seed scores |
| `/api/redis` | GET/POST/PUT/DELETE | Generic KV proxy — reused for abandoned-cart flags, favicon/logo overrides, ES cache reads |
| `/api/favicon` | GET | Serve favicon override from Redis |

## Cache revalidation (App Router)

| Endpoint | Purpose |
|---|---|
| `/api/revalidate?secret=` | Revalidate `/` |
| `/api/revalidate-pdp?secret=&path=` or `&all=true&reviews_id=` | Bust one/all PDP pages + tags |
| `/api/revalidate-plp?secret=` | Bust PLP/home-products tags |
| `/api/revalidate-all?secret=` | Bust all tags, pre-warm homepage |

All gated on `secret === process.env.REVALIDATE_SECRET`.

## Store admin

| Endpoint | Method | Upstream | Purpose |
|---|---|---|---|
| `/api/stores/validate-token` (app router) | POST | `{SOLANA}/api/stores/validate-token/` | Validate store admin token |

---

## Known issues found (don't carry these over)

- `src/app/hooks/useESFetchCategorizedProducts.js` calls `/api/es/categorized/products`, which doesn't exist anywhere in the codebase — dead/broken hook, not a real endpoint.
- `NEXT_BC_CLIENT_SECRET`, `NEXT_PUBLIC_BC_CLIENT_ID`, `NEXT_BIGCOMMERCE_GQL_API_URL` are declared but unused.

---

## Implementation request (copy into the new app's session)

> Implement backend integration for this app against the same backend stack: an Elasticsearch product index (`bigcommerce_products_7`-equivalent) for products/search/PLP/PDP, and a Django REST backend for auth (JWT access/refresh), cart, orders, reviews, subscribers, and collections. Full endpoint contract is in `docs/backend-api-spec.md` from the source project — replicate the routes, methods, and request/response shapes listed there under Auth, Cart, Orders/Checkout/Payments, Products/Search, Reviews, Newsletter, and Redis-backed KV/search-analytics.
>
> Enhancements/limitations for this app:
> - [ ] _fill in — e.g. rate-limit `/api/braintree_checkout`, restrict `/api/redis` to admin-only keys, add pagination caps to `/api/es/products`, etc._
