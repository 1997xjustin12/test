# E-Commerce Audit Task List

Derived from `solana_ecommerce_audit_2026-07-22.pdf` and `bbq_ecommerce_audit_2026-07-22.pdf`. This is the running checklist for everything both audits found lacking — check items off as they're fixed and keep this file at 100% before either storefront is called launch-ready. Update it whenever a new audit finds something new, or a task here gets resolved.

Tags: **[Shared]** = same code/backend for both brands · **[Solana]** = new-design only · **[BBQ]** = bbq-design only

---

## P1 — Critical (fix before launch)

- [x] **[Shared]** Fix `'NaN NaN/1 Inches'` bug — `decimalToFraction()` had no guard against non-numeric spec values (`helpers.js`) — *fixed in `fca6e76`*
- [x] **[Shared]** Stop hardcoding Braintree sandbox credentials in source — `braintree.js` now reads `BRAINTREE_MERCHANT_ID` / `BRAINTREE_PUBLIC_KEY` / `BRAINTREE_PRIVATE_KEY` / `BRAINTREE_ENV` from env vars — *fixed in `fca6e76`*
- [ ] **[Shared]** Set the **real production** Braintree credentials in the hosting env (Vercel) and set `BRAINTREE_ENV=production`, then run one live transaction end-to-end to confirm it actually settles. *(Code fix alone isn't enough — this needs real credentials + manual verification.)* — **blocked: waiting on client to provide production credentials**
- [x] **[Shared]** Remove canned default text ("Good value for the price...") pre-filled in the "Write a Review" form; also fixed the underlying `{...initForm} || fallback` bug (fallback branch was unreachable — spreading `null`/`undefined` always yields a truthy `{}`) — *fixed in `fca6e76`, both `new-design` and `bbq-design` `OrdersPage.jsx`*
- [x] **[BBQ]** Fix Footer logo rendering the Solana wordmark PNG instead of the `logo` prop — *fixed in `fca6e76`*
- [x] **[BBQ]** Recurate Footer "Products" nav column (was Fireplaces/Patio Heaters) — *fixed in `fca6e76`*
- [x] **[BBQ]** Branch site-wide `metadata.jsx` title/description/favicon fallback by `ISBBQ` — *fixed in `fca6e76`*
- [x] **[Solana]** *(found during item-by-item review, not in original audit)* Fix `new-design/layout/Footer.jsx` hardcoding the Solana logo PNG with the actual `logo` prop commented out (`// src={logo}`) — same bug pattern as the BBQ footer fix above; was invisible today only because the hardcoded file happened to match Solana's own logo

## P2 — Growth & Optimization

- [x] **[Shared]** Replace text-only payment badges (Visa/MC/Amex/...) with real card-brand icon graphics — full-color Visa/Mastercard/Amex/PayPal logos on white chips, monochrome Apple Pay/Google Pay marks per their brand guidelines, via new shared `atom/PaymentIcons.jsx` used by both footers
- [x] **[BBQ]** Brand carousel re-enabled on the BBQ homepage — fixed a copy-paste leftover (`font-serif`, Solana's display font) to `font-oswald` to match BBQ's typography, then un-commented it in `bbq-design/page/HomePage.jsx`
- [x] **[BBQ]** Cta homepage section rewritten and re-enabled — was explicitly fireplace-branded copy ("find the perfect fireplace...") linking to `/fireplaces`; rewrote for BBQ voice and pointed the CTA at `/grills`
- [x] **[BBQ]** Blog preview homepage section rewritten and re-enabled — was pulling the shared `BLOG_POSTS` array (3 Solana fireplace articles); added a real, hand-picked `BBQ_BLOG_POSTS` array sourced from the same WordPress feed both brands' `/blogs` pages already use (verified live URLs/images), plus fixed the `font-serif`→`font-oswald` mismatch and a dead `href="#"` "All Articles" link
- [x] **[Shared→BBQ]** *(found during item-by-item review, not in original audit)* Site-wide hardcoded Solana phone number leak — `bbq-design/layout/Topbar.jsx` and `Navbar.jsx` (desktop + mobile menu, visible on every page) used the hardcoded `PHONE`/`PHONE_HREF` constant instead of the env-driven `STORE_CONTACT` that ~30 other bbq-design files already use correctly; also removed an unused `PHONE_HREF` import in `Promo.jsx`
- [ ] **[Both]** *(found during item-by-item review)* `/blogs` list + detail pages for **both** Solana and BBQ pull from the same unbranded WordPress feed (`bbq-blog.onsitestorage.com`, `categories=2`) — brands only differ in which component renders the results, not the underlying articles. Need a decision: is one shared blog across both brands intentional, or should content be split per brand?
- [ ] **[Shared]** Expand social presence beyond Facebook + Pinterest
- [ ] **[Shared]** Add courier/shipment tracking (carrier + tracking number) to Order History — currently only shows internal status (pending/paid/shipped/etc.)
- [ ] **[Shared]** Connect newsletter signup to a recognized ESP (Klaviyo/Mailchimp), or confirm the custom backend (`NEXT_SOLANA_BACKEND_URL`) covers full lifecycle marketing
- [x] **[Solana]** Clean up unused placeholder constants left in `new-design/page/SingleProductPage.jsx` (`STATIC_SPECS`, `STATIC_SHIPPING`, `RELATED`, `RECENT`) — deleted; all four were module-local and never referenced anywhere in the file
- [x] **[BBQ]** Remove stray `console.log("reviewDetails", ...)` in `bbq-design/sections/Reviews.jsx` — *fixed in `fca6e76`*
- [x] **[BBQ]** Delete dead `WhySolana.jsx` component (still named/worded for Solana, was one accidental un-comment away from shipping) — *fixed in `fca6e76`*
- [x] **[BBQ]** Clean dead Solana-referencing constants in `Hero.jsx` (`CARDS`) and `Products.jsx` (`PRODUCT_TABS`, `VIEW_ALL_URL`) — *fixed in `fca6e76`*
- [x] **[Solana]** Move/duplicate the homepage newsletter signup into the Footer itself — new client component `new-design/layout/FooterNewsletter.jsx` renders a compact signup row above the footer's bottom bar on **every** page, reusing the same `subscribe()` API and `useAuth()` subscription state as the homepage section (which stays as-is); already-subscribed users see a confirmation line instead of the form
- [x] **[Shared]** Add a mini-cart drawer — new `MiniCartDrawer` in both `new-design/ui/` and `bbq-design/ui/`, rendered globally by `CartProvider` (brand-switched on `ISBBQ`, same pattern as `AddedToCartDialog`) and opened from the navbar cart button. Slides in from the right with line items, qty steppers, remove, subtotal, and Checkout / View Cart. New `miniCartOpen` / `openMiniCart` / `closeMiniCart` on the cart context. The cart button stays a real `<Link href="/cart">` — modifier- and middle-clicks still open the full page, only a plain left-click opens the drawer

## P3 — Future Enhancements

- [ ] **[Shared]** Confirm the order confirmation/receipt email flow end-to-end — dispatched by an external backend service, not verifiable from this codebase
- [ ] **[Shared]** Core Web Vitals / image optimization audit for large product galleries
- [ ] **[Shared]** Programmatic SEO — unique meta titles & descriptions at scale for 6,000+ products
- [ ] **[Shared]** Loyalty / rewards program for repeat customers
- [ ] **[BBQ]** Decide the fate of the legacy "brand microsite" pages (`/brand/bbq-grill-outlet`, `/brand/solana-bbq-grills`) — an older system outside the `ISBBQ` theming architecture entirely, with its own hardcoded "Solana BBQ Grills" metadata

---

## Out of scope (removed from tracking)

- ~~Wishlist / save for later~~ — no backend support exists for this feature and the client has not requested it. Removed from active tracking on 2026-07-22 per client instruction. Revisit only if the client asks for it later.
- ~~Solana brand carousel: replace text names with logo images~~ — intentional design choice, text is preferred here for the homepage carousel. Full brand logo images already exist on the dedicated `/brands` page. Removed from active tracking on 2026-07-22 per client instruction.

---

## Progress

**18 of 28 in-scope tasks complete (64%) · 10 remaining**

- **Session 1 (2026-07-22):** 15 fixed — 9 in commit `fca6e76`, plus payment icons, the Solana footer logo bug, the BBQ brand carousel, the BBQ Cta/Blog sections, and a site-wide BBQ phone-number leak (all found/fixed during item-by-item review)
- **Session 2 (2026-07-23):** 3 fixed — Solana `SingleProductPage.jsx` dead-constant cleanup, the site-wide Solana footer newsletter signup, and the shared mini-cart drawer

### What's left, by what unblocks it

**Nothing in the remaining 10 is buildable by us today** — every one needs a client answer, backend work, or a scoping decision first.

| # | Task | P | Blocked by |
|---|------|---|-----------|
| 1 | Braintree production credentials + one live settled transaction | P1 | client (credentials) |
| 2 | `/blogs` shared content pool — one blog for both brands, or split? | P2 | client decision |
| 3 | Expand social presence beyond Facebook + Pinterest | P2 | client (needs the actual accounts to link) |
| 4 | Courier/shipment tracking in Order History | P2 | backend — API must return carrier + tracking number first |
| 5 | Newsletter → Klaviyo/Mailchimp, or confirm custom backend covers lifecycle | P2 | client decision + backend |
| 6 | Confirm order confirmation/receipt email flow end-to-end | P3 | external service, not verifiable from this codebase |
| 7 | Core Web Vitals / image optimization audit for large galleries | P3 | scoping — post-launch; see `docs/pagespeed-homepage.md` |
| 8 | Programmatic SEO for 6,000+ products | P3 | scoping — needs a template + content strategy decision |
| 9 | Loyalty / rewards program | P3 | client (product decision) |
| 10 | Fate of legacy `/brand/bbq-grill-outlet` + `/brand/solana-bbq-grills` microsites | P3 | client decision |

**Six of these are client questions** (items 1, 2, 3, 5, 9, 10) — drafted and ready to send as one batch in [`audit-client-questions.md`](./audit-client-questions.md). Answering them converts most of the remaining backlog into buildable work.

*Source audits: `solana_ecommerce_audit_2026-07-22.pdf`, `bbq_ecommerce_audit_2026-07-22.pdf` — both will be re-rendered with these corrections (Braintree blocked status, wishlist removed) once the full item-by-item review is done.*
