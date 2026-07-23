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
- [x] **[Both]** *(found during item-by-item review)* `/blogs` list + detail pages for **both** Solana and BBQ pulled from the same unbranded WordPress feed with a hardcoded `categories=2` — which is the **`solana`** category, so BBQ shoppers were served fireplace articles. **Client decision: split per brand.** Implemented via new `src/app/lib/blog.js`: `BLOG_CATEGORY_SLUG` is `ISBBQ ? "bbq" : "solana"`, resolved slug→ID against the WP categories endpoint (cached 24h, with verified fallback IDs) so the mapping survives a category being recreated in WP. Applied to the listing, its `generateMetadata`, the detail page **and** its "other posts" — the detail fetch is scoped too, otherwise a Solana article URL would still render on the BBQ storefront. Both paginators now return `null` below 2 pages, since WP sends `X-WP-TotalPages: 0` for an empty category.
  - ⚠️ **BBQ blog is empty until content is categorised.** Verified live 2026-07-23: `solana` (id 2) = **50 posts**, `bbq` (id 4) = **0 posts**. The filter is correct, but nothing is tagged `bbq` yet, so `bbq-design`'s `/blogs` will show its "No blog posts available" empty state. **Action for the client: assign posts to the `bbq` category in WordPress** (or write new ones). No code change needed once they exist. Deliberately no fallback to the Solana feed — that would silently recreate the cross-brand leak this fixes.
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
- [x] **[Shared]** Core Web Vitals / image optimization audit for large product galleries — *done in `12e7316`*. Audited the live site (not just source) and fixed: (1) **Next 16 `images.qualities` regression** — `quality` is restricted to that list and silently coerced to 75, so the `quality={40}` on both brands' category cards had been inert since the upgrade, and because the preload URLs are hand-built with `&q=40` while `<Image>` requested `&q=75` they were different cache entries — every category card, incl. the homepage LCP image, was **downloading twice**; (2) category preloads moved out of `(market)/layout.jsx` onto the homepage — every product/category/cart/checkout page was preloading 4 unused images and giving the `fetchPriority="high"` slot to a category tile instead of its own LCP element; (3) `sizes` declared `100vw` on 2-col mobile grids in 3 ProductCards across both brands (~2× oversized fetches) and an invalid `(max-w-768px)` media condition in `DescriptionSection`; (4) gallery `quality` 75→60 main / →50 thumbs, both brands; (5) `getYMALProducts` + PDP FAQ Redis reads now cached, removing an ES query and a Redis round-trip from every product view
- [x] **[Shared]** *(found during the Core Web Vitals pass)* **Product pages are not edge-cached.** PDP ships `Cache-Control: private, no-cache, no-store` and `X-Vercel-Cache: MISS` on every request; measured TTFB 0.72–2.48s vs 0.32s on the cached `/fireplaces`. `export const revalidate = 86400` is present but has nothing to attach to, because a dynamic segment with no `generateStaticParams` export is treated as pure SSR and appears in neither `routes` nor `dynamicRoutes` in the prerender manifest. **The obvious fix is a trap:** adding `generateStaticParams` does fix caching (verified — `s-maxage=3600`, warm TTFB ~9ms) but drops every product `<img>` from the server-rendered HTML — A/B tested on one build, **35 tags vs 0**, gallery stops server-rendering entirely. Not worth taking on 6,000+ indexed pages. **Solved a different way** — rather than change how the page renders, a `Cache-Control: public, s-maxage=300, stale-while-revalidate=86400` rule on `/:slug/product/:product_path` in `next.config.ts` edge-caches the SSR output that is already correct. Verified on a local production build: header applied (it overrides Next's `no-store`), `<img>` still 35, gallery still server-rendered, CSP header still present, and `/fireplaces` `/cart` `/about` unaffected. Safe to cache because `src/proxy.js` never matches product paths, so no per-user content reaches the response. TTL is deliberately 5 minutes, not 24h: a CDN cache is invisible to `revalidatePath`, so `/api/revalidate-pdp` cannot flush it — 5 min bounds how long a price edit can be stale while still absorbing effectively all repeat traffic.
- [ ] **[Shared]** Programmatic SEO — unique meta titles & descriptions at scale for 6,000+ products
- [ ] **[Shared]** Loyalty / rewards program for repeat customers
- [ ] **[BBQ]** Decide the fate of the legacy "brand microsite" pages (`/brand/bbq-grill-outlet`, `/brand/solana-bbq-grills`) — an older system outside the `ISBBQ` theming architecture entirely, with its own hardcoded "Solana BBQ Grills" metadata

---

## Out of scope (removed from tracking)

- ~~Wishlist / save for later~~ — no backend support exists for this feature and the client has not requested it. Removed from active tracking on 2026-07-22 per client instruction. Revisit only if the client asks for it later.
- ~~Solana brand carousel: replace text names with logo images~~ — intentional design choice, text is preferred here for the homepage carousel. Full brand logo images already exist on the dedicated `/brands` page. Removed from active tracking on 2026-07-22 per client instruction.

---

## Progress

**21 of 29 in-scope tasks complete (72%) · 8 remaining**

- **Session 1 (2026-07-22):** 15 fixed — 9 in commit `fca6e76`, plus payment icons, the Solana footer logo bug, the BBQ brand carousel, the BBQ Cta/Blog sections, and a site-wide BBQ phone-number leak (all found/fixed during item-by-item review)
- **Session 2 (2026-07-23):** 5 fixed — Solana `SingleProductPage.jsx` dead-constant cleanup (`644ef05`), the site-wide Solana footer newsletter signup (`644ef05`), the shared mini-cart drawer (`644ef05`), the Core Web Vitals / image pass (`12e7316`), and PDP edge caching (`pending`) — the last of which the CWV work surfaced as a new item, moving the denominator 28 → 29.

> **Not yet measured.** The CWV fixes are verified at the HTML level (emitted `q=` values, preload counts, `<img>` counts, `Cache-Control` headers on a local production build) but **no Lighthouse before/after has been run** — the PageSpeed API rate-limits without a key. Run PageSpeed on the homepage and a PDP after `12e7316` deploys and record it in `pagespeed-homepage.md`.

### What's left, by what unblocks it

**Nothing in the remaining 8 is buildable by us today** — every one needs a client answer, backend work, or a scoping decision. (PDP edge caching, discovered during the CWV pass, was found and fixed in the same session.)

| # | Task | P | Blocked by |
|---|------|---|-----------|
| 1 | Braintree production credentials + one live settled transaction | P1 | client (credentials) |
| 2 | Expand social presence beyond Facebook + Pinterest | P2 | client (needs the actual accounts to link) |
| 3 | Courier/shipment tracking in Order History | P2 | backend — API must return carrier + tracking number first |
| 4 | Newsletter → Klaviyo/Mailchimp, or confirm custom backend covers lifecycle | P2 | client decision + backend |
| 5 | Confirm order confirmation/receipt email flow end-to-end | P3 | external service, not verifiable from this codebase |
| 6 | Programmatic SEO for 6,000+ products | P3 | scoping — needs a template + content strategy decision |
| 7 | Loyalty / rewards program | P3 | client (product decision) |
| 8 | Fate of legacy `/brand/bbq-grill-outlet` + `/brand/solana-bbq-grills` microsites | P3 | client decision |

**Five of these are client questions** (items 1, 2, 4, 7, 8) — drafted and ready to send as one batch in [`audit-client-questions.md`](./audit-client-questions.md). Answering them converts most of the remaining backlog into buildable work.

*Source audits: `solana_ecommerce_audit_2026-07-22.pdf`, `bbq_ecommerce_audit_2026-07-22.pdf` — both will be re-rendered with these corrections (Braintree blocked status, wishlist removed) once the full item-by-item review is done.*
