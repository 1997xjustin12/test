# Agentic AI readiness

Started 2026-08-07. Backup of `main` before this work: `backups/main-2026-08-07`
(`ae0c8f5`), pushed to both `forked-repo` and `origin`.

"Agentic AI ready" is not one feature. It is four questions, in order — each one
only matters if the previous one is already true:

1. **Reach** — is the agent allowed to fetch the page?
2. **Read** — can it understand the page without executing JavaScript?
3. **Query** — can it ask the catalog a question instead of scraping?
4. **Transact** — can it complete a purchase?

Most of the value is in 1 and 2. Layer 4 is a moving target and should not be
built on speculation.

---

## Baseline audit (measured 2026-08-07, oko brand, local dev)

Reproduce any row with:

```bash
curl -s "http://localhost:3000<path>" > /tmp/p.html
grep -oE 'href="[^"]*/product/[^"]*"' /tmp/p.html | sort -u | wc -l   # product links
grep -oE '\$[0-9,]+\.[0-9]{2}' /tmp/p.html | sort -u | wc -l          # prices
grep -oc 'application/ld+json' /tmp/p.html                            # structured data
```

| Route | File | Product links | Prices | JSON-LD |
|---|---|---:|---:|---:|
| `/` | `(market)/(home)/page.jsx` | 4 | 0 | 0 |
| `/categories` | `(market)/categories/page.jsx` | 0 | 0 | 0 |
| `/category/[category_slug]` | `(market)/category/[category_slug]/page.jsx` | 0 | 0 | 0 |
| `/[slug]` (e.g. `/fireplaces`) | `(market)/[slug]/page.jsx` | 0 | 0 | 0 |
| `/[slug]/product/[product_path]` | `(market)/[slug]/product/[product_path]/page.jsx` | 11 | 2 | 1 |

**Every listing surface renders zero products without JavaScript. Only the PDP is
machine-readable.**

### After Tier 1 + Tier 2.1 (measured 2026-08-07)

Visible HTML is unchanged — the win is in structured data, which is what agents
and crawlers actually parse.

| Route | JSON-LD blocks | Types |
|---|---:|---|
| `/` | 2 | `OnlineStore`, `WebSite` |
| `/category/grills-and-smokers` | 3 | + `BreadcrumbList`, `ItemList` (30 products) |
| `/broilmaster` (non-base-nav PLP) | 3 | + `BreadcrumbList`, `ItemList` (30 products) |
| `/fireplaces`, `/open-box` (base-nav) | 2 | still uncovered — see Tier 2.1c |
| PDP | 3 | + `Product`, `BreadcrumbList`, `FAQPage` (4) |

Product URLs in the `ItemList` were spot-checked and resolve `200`.

### Why — the route map matters

Three distinct listing routes, often confused:

| Route | Purpose | Data source |
|---|---|---|
| `/categories` | Category **root** / index | `await fetchBrands()` server-side, then client components |
| `/category/[category_slug]` | A single category | **Nothing server-side.** Thin wrapper renders `<{OKO,BBQ,New}Category>` |
| `/[slug]` | Brand & collection PLP | `getInitialHits()` server-side (`unstable_cache`, tag `plp-initial-hits`) |

The failure is not the same in all three:

- `category/[category_slug]/page.jsx` awaits `params`, picks a brand component,
  and renders it. All three `page/Category.jsx` components are `"use client"`;
  the category itself is resolved from the `useSolanaCategories()` **client**
  context, and products come from `ProductsSectionV2`, which is an
  `<InstantSearch>` tree. Nothing is fetched on the server, so nothing can be
  rendered on the server.
- `[slug]/page.jsx` **does** prefetch `initialHits` server-side, but hands it to
  the same `<InstantSearch>` tree, which only paints after hydration. The server
  pays for the data and throws away the benefit.

This is an SEO problem before it is an agentic problem. Fixing it helps organic
search at least as much as it helps agents.

---

## Tier 1 — foundational (do first)

Cheap, self-contained, and verifiable. No visual change to the storefront.

- [x] **1.1 Shared structured-data builders** — `lib/structured-data.js`, one
      module so schema shapes cannot drift per brand or per page.
- [x] **1.2 `Organization` + `WebSite` JSON-LD** in the market layout. Identity
      for the store itself; `WebSite.potentialAction` advertises the search
      endpoint so an agent can query without guessing the URL shape.
- [x] **1.3 Explicit AI-crawler policy** in `robots.js`. Currently every AI
      crawler is allowed *by omission*. Naming them makes it a decision.
      **Business call required — see "Open decisions" below.**
- [x] **1.4 `llms.txt`** at the site root. Emerging convention; a plain-language
      map of what the site sells and where the machine-readable endpoints are.
- [x] **1.5 Enrich the Product JSON-LD.** `buildJsonLd()` replaced by
      `buildProduct()` in `lib/structured-data.js`, adding `gtin` (Shopify
      `variant.barcode`), `mpn`, `itemCondition`, `priceValidUntil`. See note (5)
      on the two fields deliberately left empty.
- [x] **1.6 `BreadcrumbList`** on PDP, `/category/[category_slug]` and the
      non-base-nav `[slug]` PLPs.
- [x] **1.7 `FAQPage` on the PDP** — 4 entries, built from the existing Redis
      FAQ copy. HTML is stripped to text.

## Tier 2 — make listings machine-readable

The headline fix. Two independent halves; do the JSON-LD half first, it is far
cheaper and delivers most of the agent benefit.

- [x] **2.1a `ItemList` on `/category/[category_slug]`** — 30 products with name,
      URL, image, brand, SKU and price. New `lib/listing-data.js` holds the
      shared fetch + mapper.
- [x] **2.1b `ItemList` on non-base-nav `[slug]` PLPs** (brand and collection
      pages, e.g. `/broilmaster`). Reuses the now-working `getInitialHits()`.
- [ ] **2.1c `ItemList` on base-nav PLPs.** `[slug]/page.jsx` returns early at
      `if (pageData.is_base_nav)` into `{OKO,BBQ,New}BasePlp` before any product
      fetch, so `/fireplaces`, `/open-box` etc. are still uncovered. `BasePlp`
      needs the same treatment — see note (4).
- [ ] **2.1d `ItemList` on `/categories`.** Should list the categories
      themselves, not products.
- [ ] **2.2 Server-render the product grid. The single remaining structural
      item**, and the only thing still missing from category HTML.

      Every listing grid runs through `<InstantSearch>` in `ProductsSectionV2`,
      which fetches after mount, so no product reaches the server HTML. Three
      ways out, in order of preference:

      > **SPIKE RESULT 2026-08-07 — option (a) works.** Branch
      > `spike/instantsearch-ssr`. Server HTML went from **0 → 30 product links**
      > on `/category/grills-and-smokers`, `/broilmaster` **and `/fireplaces`**,
      > so it closes 2.1c at the same time. Titles, hrefs and prices are all in
      > the markup. Hydration is intact: 14 facets, filter clicks work, URL
      > refinements apply, no new JS errors. Warm SSR latency 143–218ms
      > (category) and 362–473ms (brand). Two costs: it needs
      > `react-instantsearch` upgraded **7.15.5 → 7.42.0**, and installs need
      > `--legacy-peer-deps` (pre-existing — `react-html-parser@2.0.2` peers
      > React 16 against this project's React 19). Details in the section below.

      **(a) `react-instantsearch-nextjs` — the real fix.** Algolia's official
      App Router SSR package. `<InstantSearchNext>` replaces `<InstantSearch>`
      and server-renders the whole widget tree including `<Hits>`. One rendering
      path, no drift, and it fixes category pages, brand PLPs, base-nav PLPs
      (2.1c) and `/search` in a single change. Costs: a new dependency, and it
      touches `ProductsSectionV2`, which all three themes and every listing page
      share. **Needs a spike first** — the package is built for Algolia and this
      app uses `@searchkit/instantsearch-client`. Encouraging sign: the
      `searchClient` in `ProductsSectionV2` already switches to an absolute URL
      when `window` is undefined, with a comment naming `getServerState`, so
      someone has been down this path. `getServerState` is present in the
      installed `react-instantsearch-core@7.15.5`; `react-instantsearch-nextjs`
      is not installed.

      **(b) A parallel server-rendered list. Do not do this.** Rendering the 30
      products from `getListingHits()` as a static list that hydration replaces
      needs no new dependency and is contained — but it creates a second
      rendering path that will drift from the InstantSearch one, which is
      precisely the cloaking risk in note (6). It also flashes on hydration.
      Listed only so nobody re-derives it and thinks it is clever.

      **(c) Accept it.** The `ItemList` JSON-LD already gives agents and crawlers
      the same 30 products with names, prices and URLs. Google executes JS and
      sees the real grid regardless. This is a defensible stopping point if
      budget is tight — the machine-readable layer is covered, only the raw HTML
      is not.
- [x] **2.3 Server-render category identity** — **already true, no work needed.**
      Verified 2026-08-07: `/category/grills-and-smokers` server HTML contains
      `<h1>Grills &amp; Smokers</h1>`, the `1087` product count and the
      breadcrumb `<nav aria-label="Breadcrumb">`. The earlier assumption that
      these were client-only was wrong. `page/Category.jsx` is `"use client"`,
      but client components still server-render in the App Router, and
      `CategoriesProvider` is handed its `categories` as a server prop from the
      market layout — so `useSolanaCategories()` already has data during SSR.
      **The only thing missing from category HTML is the product grid.**
- [x] **2.4 Real `generateMetadata` for categories** — now uses the resolved
      category's name, `sub` descriptor and product count, falling back to
      `toTitleCase(slug)` if Elasticsearch is unavailable.

## Tier 3 — let agents query instead of scrape

- [ ] **3.1 Read-only catalog API** — `GET /api/catalog/search`,
      `GET /api/catalog/product/{handle}`. Stable JSON contract, versioned,
      rate-limited. Thin wrapper over the existing Elasticsearch layer.
- [ ] **3.2 OpenAPI description** for the above, served at a fixed path.
- [ ] **3.3 robots.txt carve-out** — `/api/*` is currently `Disallow`ed wholesale,
      which would hide the catalog API. Allow the catalog paths specifically.
- [ ] **3.4 Keep the merchant feed healthy.** `products_sitemap.xml` is already
      the single strongest agentic asset here — it is the same pipe shopping
      surfaces consume. Verify GTIN, availability and shipping are populated.
- [ ] **3.5 MCP server** exposing catalog search + product lookup. Small once 3.1
      exists. This is the genuinely differentiating item.

## Tier 4 — transaction (watch, do not build yet)

- [ ] **4.1 Evaluate** Agentic Commerce Protocol (OpenAI/Stripe) and AP2 (Google).
- [ ] **4.2 Decide** whether the payment stack can support it. The app is on
      Braintree; ACP is Stripe-first. This is a payment-provider question before
      it is an engineering question.

---

---

## Notes worth keeping

Things found while implementing that are not obvious from the code.

**(1) `getInitialHits()` had never worked.** `/api/es/searchkit` returns
`{ results: [ { hits, nbHits, ... } ] }`, but the prefetch read `data?.[0]?.hits`
— indexing the object rather than the array — which is always `undefined`. It
threw `"No hits returned"` on every request, and the call site's
`.catch(() => null)` swallowed it silently. Because `unstable_cache` does not
cache a thrown error, **every `[slug]` render also paid for a wasted
Elasticsearch round-trip** that was then discarded. Fixed; both shapes are now
accepted. This is why the original audit found zero server-rendered products on
`[slug]` pages even though the code appeared to prefetch them.

**(2) The category filter string really does end in `:undefined`.**
`ProductsSectionV2` builds `page_category1:${name}:${filter_type}`, and
categories from `mapCategoryResults()` carry no `filter_type`, so the literal
string `"undefined"` is part of the contract the searchkit endpoint already
expects. Verified against the live endpoint:
`page_category1:Grills & Smokers:undefined` returns `nbHits: 1087`, matching the
count rendered on the page. Do not "clean this up" without re-checking both
sides — `categoryFilterString()` in `lib/listing-data.js` and the `useMemo` in
`ProductsSectionV2` have to agree or the JSON-LD stops matching the grid.

**(3) Three listing routes, three different failure modes.** Worth re-reading
the route map above before touching any of them. `/category/[category_slug]`
does no server fetching at all; `[slug]` fetches but discards; `/categories`
fetches brands only.

**(4) `[slug]` has an early return that bypasses everything.**
`if (pageData.is_base_nav)` returns `BasePlp` before the product fetch, so the
main nav pages (`/fireplaces`, `/patio-heaters`, `/open-box`, …) get no
`ItemList`. These are the highest-traffic PLPs on the site, so 2.1c matters more
than its position in this list suggests.

**(5) Two Product fields are deliberately left empty.** `shippingDetails` and
`hasMerchantReturnPolicy` are accepted by `buildProduct()` but nothing passes
them yet. They need the *real* published policy — shipping thresholds and the
return window — and asserting a policy that contradicts the storefront or the
merchant feed is worse than omitting it, because that mismatch is exactly what
gets a merchant penalised. Wire them once someone confirms the actual numbers.

**(6) Never emit an `ItemList` that disagrees with the rendered grid.** The
schema must describe the products the user actually sees. That is why
`getListingHits()` mirrors the client's filter logic instead of running its own
query. If the two ever diverge, that is cloaking, and it is a manual-action
risk, not a ranking nudge.

**(7) `getListingHits()` returns empty instead of throwing**, unlike the old
`getInitialHits`. A listing page must still render if Elasticsearch is down — it
just loses its JSON-LD. It shares the `plp-initial-hits` cache tag, so the admin
Cache screen and `/api/revalidate-plp` already bust it.

**(8) Unrelated data bug spotted.** OKO emits
`sameAs: [... pinterest.com/solanafireplaces/]` because
`NEXT_PUBLIC_STORE_PINTEREST` in `.env.oko` still points at Solana's account.
Now that it is in structured data it actively tells agents the two brands are
one entity. Fix in the env, not the code.

**(9) JSON-LD is escaped, not just stringified.** `serializeJsonLd()` escapes
`<` because a product description containing `</script>` would otherwise close
the tag early and inject markup into the page.

## Open decisions (need the client, not us)

1. **Allow or block AI training crawlers?** Allowing `GPTBot`, `ClaudeBot`,
   `PerplexityBot`, `Google-Extended` etc. means product copy and imagery may be
   used for model training. Blocking them may reduce visibility in AI shopping
   surfaces. These are separable — some vendors split their *search* crawler from
   their *training* crawler (e.g. `OAI-SearchBot` vs `GPTBot`), so "visible in
   answers, not used for training" is a coherent position. Tier 1.3 currently
   implements **allow search, allow training**, matching today's effective
   behaviour. Change it once the client decides.
2. **Is a public catalog API acceptable?** It exposes the full catalog with
   pricing in a trivially consumable form — to competitors as much as to agents.

## Caveats

- Baseline measured against **local dev**. Confirm on production before
  reporting to the client; dev and prod streaming can differ.
- Tier 3/4 protocol names were current as of mid-2026 and this space moves fast.
  Re-check before committing budget. The Tier 1/2 work is stable — schema.org and
  robots.txt are not going anywhere.

## Verification

After any change:

```bash
# no-JS product visibility
curl -s "$BASE/category/grills-and-smokers" | grep -oc 'application/ld+json'

# schema validity — paste output into validator.schema.org
curl -s "$BASE/<path>" | grep -oP '(?<=<script type="application/ld\+json">).*?(?=</script>)'

# crawler policy
curl -s "$BASE/robots.txt"
curl -s "$BASE/llms.txt"
```
