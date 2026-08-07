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
- [ ] **1.5 Enrich the Product JSON-LD.** `buildJsonLd()` in the PDP is missing
      the fields shopping surfaces actually filter on: `gtin`/`mpn`,
      `itemCondition`, `priceValidUntil`, `shippingDetails`,
      `hasMerchantReturnPolicy`.
- [ ] **1.6 `BreadcrumbList` on PDP and all listing routes.** Gives an agent the
      taxonomy without inferring it from URL segments.
- [ ] **1.7 `FAQPage` on the PDP.** The content already exists — the PDP builds a
      `FAQS` array from Redis and renders it as plain markup with no schema.

## Tier 2 — make listings machine-readable

The headline fix. Two independent halves; do the JSON-LD half first, it is far
cheaper and delivers most of the agent benefit.

- [ ] **2.1 `ItemList` JSON-LD on every listing route** (`/categories`,
      `/category/[category_slug]`, `/[slug]`), emitted server-side with product
      name, URL, image and price. Requires moving a first-page product fetch into
      the server component. `[slug]` already has `getInitialHits()` to reuse;
      `category/[category_slug]` needs one adding.
- [ ] **2.2 Server-render the first page of results as real HTML.** The
      interactive `<InstantSearch>` grid stays; the server emits a semantic
      product list that hydration replaces. Must render the *same* products the
      user sees — a hidden list that differs from the visible one is cloaking.
- [ ] **2.3 Server-render category identity** — `<h1>`, description and product
      count on `/category/[category_slug]` currently come from client context.
      Resolve the category server-side and pass it as a prop.
- [ ] **2.4 Real `generateMetadata` for categories.** Today the title and
      description are generated by `toTitleCase(slug)`, not from category data.

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
