# Backend API Usage & Trigger Checklist — for reuse in new app

Companion to `docs/backend-api-spec.md`. For each endpoint: which page/component should call it, and what user action triggers the call. Use this as a build checklist for the new app — check off each item once the page/function exists and is wired to the endpoint.

---

## Auth

- [ ] **Login page/form** — submit → `POST /api/login`
- [ ] **Logout control** (nav/account menu) — click → `POST /api/logout`
- [ ] **Register page/form** — submit → `POST /api/register`
- [ ] **Background token refresh** (no page — runs in auth context on a ~10 min interval + app init) → `POST /api/refresh`
- [ ] **Forgot Password form** — submit → `POST /api/auth/forgot-password`
- [ ] **Reset Password page** (landed on via emailed link, token+uidb64 in URL) — submit → `POST /api/reset-password`
- [ ] **Account > Change Password form** — submit → `PUT /api/auth/change-password`
- [ ] **Auth check on app load** (no dedicated page — runs in auth context init) → `GET /api/profile`
- [ ] **Account > Profile edit form** — submit → `PUT /api/profile/update`

## Cart

- [ ] **Cart page/drawer, load** (logged-in user) → `GET /api/auth/cart/active`
- [ ] **Add-to-cart action, first item** (logged-in user) → `POST /api/auth/cart/create`
- [ ] **Cart page/drawer, qty change or remove item** → `PUT /api/auth/cart/update`
- [ ] **Post-checkout success** (order placed) → `POST /api/auth/cart/close`
- [ ] **Tab close / cart inactivity** (via `navigator.sendBeacon`) → `POST /api/abandoned-carts/create`

## Orders / Checkout / Payments

- [ ] **Cart/Checkout page, qty/shipping/coupon change** → `POST /api/orders/get-total`
- [ ] **Checkout page, on mount** (init Braintree Drop-in UI) → `GET /api/braintree_token`
- [ ] **Checkout page, "Place Order" button** → `POST /api/braintree_checkout`
- [ ] **Checkout page, after payment nonce received** → `POST /api/orders/checkout`
- [ ] **Account > Order History page, load** → `GET /api/auth/orders`
- [ ] **Checkout address form, ZIP field blur** (external, not your backend: `api.zippopotam.us`) → autofill city/state

## Reviews

- [ ] **PDP reviews section, load** → `GET /api/reviews/list`
- [ ] **PDP review submission form** — submit → `POST /api/reviews/create`
- [ ] **PDP edit-review form** — submit → `PUT /api/reviews/update`

## Newsletter

- [ ] **Newsletter signup widget** (footer/homepage/standalone Subscribe page) — submit → `POST /api/subscribers/subscribe`
- [ ] **Account Dashboard subscribe toggle** — toggle on → `POST /api/subscribers/subscribe`
- [ ] **Unsubscribe page** (landed on via email link) — confirm → `POST /api/subscribers/unsubscribe`
- [ ] **Account Dashboard subscribe toggle** — toggle off → `POST /api/subscribers/unsubscribe`

---

## Query to paste into the new app's Claude session

> Using `docs/backend-api-spec.md` and `docs/backend-api-usage-triggers.md` from the source project as reference, build a checklist of pages/components/functions this app still needs, matched to the endpoint(s) each one should call and the user action that triggers the call (form submit, button click, page load, interval, etc.).
>
> For each unchecked item: tell me whether the page/component already exists in this app (and where), or needs to be created from scratch. Don't implement anything yet — just produce the gap checklist so we can prioritize what to build first.
