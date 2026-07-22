# E-Commerce Audit Task List

Derived from `solana_ecommerce_audit_2026-07-22.pdf` and `bbq_ecommerce_audit_2026-07-22.pdf`. This is the running checklist for everything both audits found lacking — check items off as they're fixed and keep this file at 100% before either storefront is called launch-ready. Update it whenever a new audit finds something new, or a task here gets resolved.

Tags: **[Shared]** = same code/backend for both brands · **[Solana]** = new-design only · **[BBQ]** = bbq-design only

---

## P1 — Critical (fix before launch)

- [x] **[Shared]** Fix `'NaN NaN/1 Inches'` bug — `decimalToFraction()` had no guard against non-numeric spec values (`helpers.js`) — *fixed in `fca6e76`*
- [x] **[Shared]** Stop hardcoding Braintree sandbox credentials in source — `braintree.js` now reads `BRAINTREE_MERCHANT_ID` / `BRAINTREE_PUBLIC_KEY` / `BRAINTREE_PRIVATE_KEY` / `BRAINTREE_ENV` from env vars — *fixed in `fca6e76`*
- [ ] **[Shared]** Set the **real production** Braintree credentials in the hosting env (Vercel) and set `BRAINTREE_ENV=production`, then run one live transaction end-to-end to confirm it actually settles. *(Code fix alone isn't enough — this needs real credentials + manual verification.)*
- [x] **[Shared]** Remove canned default text ("Good value for the price...") pre-filled in the "Write a Review" form; also fixed the underlying `{...initForm} || fallback` bug (fallback branch was unreachable — spreading `null`/`undefined` always yields a truthy `{}`) — *fixed in `fca6e76`, both `new-design` and `bbq-design` `OrdersPage.jsx`*
- [ ] **[Shared]** Implement wishlist / save for later — currently just local UI state (heart icon toggle), not persisted or connected to any backend
- [x] **[BBQ]** Fix Footer logo rendering the Solana wordmark PNG instead of the `logo` prop — *fixed in `fca6e76`*
- [x] **[BBQ]** Recurate Footer "Products" nav column (was Fireplaces/Patio Heaters) — *fixed in `fca6e76`*
- [x] **[BBQ]** Branch site-wide `metadata.jsx` title/description/favicon fallback by `ISBBQ` — *fixed in `fca6e76`*

## P2 — Growth & Optimization

- [ ] **[Shared]** Replace text-only payment badges (Visa/MC/Amex/...) with real card-brand icon graphics
- [ ] **[Solana]** Replace the text-name brand carousel with real logo images
- [ ] **[BBQ]** Decide the fate of the Brand carousel homepage section — currently imported but commented out in `bbq-design/page/HomePage.jsx`: theme it for BBQ and re-enable, or remove the dead import
- [ ] **[BBQ]** Decide the fate of the Blog preview and Cta homepage sections — same situation, commented out in `bbq-design/page/HomePage.jsx`
- [ ] **[Shared]** Expand social presence beyond Facebook + Pinterest
- [ ] **[Shared]** Add courier/shipment tracking (carrier + tracking number) to Order History — currently only shows internal status (pending/paid/shipped/etc.)
- [ ] **[Shared]** Connect newsletter signup to a recognized ESP (Klaviyo/Mailchimp), or confirm the custom backend (`NEXT_SOLANA_BACKEND_URL`) covers full lifecycle marketing
- [ ] **[Solana]** Clean up unused placeholder constants left in `new-design/page/SingleProductPage.jsx` (`STATIC_SPECS`, `STATIC_SHIPPING`, `RELATED`, `RECENT`) — defined but never rendered
- [x] **[BBQ]** Remove stray `console.log("reviewDetails", ...)` in `bbq-design/sections/Reviews.jsx` — *fixed in `fca6e76`*
- [x] **[BBQ]** Delete dead `WhySolana.jsx` component (still named/worded for Solana, was one accidental un-comment away from shipping) — *fixed in `fca6e76`*
- [x] **[BBQ]** Clean dead Solana-referencing constants in `Hero.jsx` (`CARDS`) and `Products.jsx` (`PRODUCT_TABS`, `VIEW_ALL_URL`) — *fixed in `fca6e76`*
- [ ] **[Solana]** Move/duplicate the homepage newsletter signup into the Footer itself (currently only a separate homepage section, not in the footer)
- [ ] **[Shared]** Add a mini-cart drawer — currently Add to Cart routes to the full `/cart` page only, no slide-out preview

## P3 — Future Enhancements

- [ ] **[Shared]** Confirm the order confirmation/receipt email flow end-to-end — dispatched by an external backend service, not verifiable from this codebase
- [ ] **[Shared]** Core Web Vitals / image optimization audit for large product galleries
- [ ] **[Shared]** Programmatic SEO — unique meta titles & descriptions at scale for 6,000+ products
- [ ] **[Shared]** Loyalty / rewards program for repeat customers
- [ ] **[BBQ]** Decide the fate of the legacy "brand microsite" pages (`/brand/bbq-grill-outlet`, `/brand/solana-bbq-grills`) — an older system outside the `ISBBQ` theming architecture entirely, with its own hardcoded "Solana BBQ Grills" metadata

---

## Progress

- **Fixed this session (2026-07-22, commit `fca6e76`):** 9 of 26 tasks
- **Remaining:** 17 — 2 in P1 (1 needs real credentials + manual verification, 1 is a feature build), 10 in P2, 5 in P3

*Source audits: `solana_ecommerce_audit_2026-07-22.pdf`, `bbq_ecommerce_audit_2026-07-22.pdf`. Re-run/update both when this list reaches 100%.*
