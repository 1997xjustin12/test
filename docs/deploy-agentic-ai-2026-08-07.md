# Release checklist — agentic AI work

Covers `ae0c8f5..6fb6a7a` on `main`. Run once **per brand** — Solana, BBQ and
OKO are three separate Vercel projects and each needs its own release.

Rollback point: `backups/main-2026-08-07` (`ae0c8f5`), on both remotes.

---

## 0. Before anything — confirm the deploy source

```
forked-repo/main   6fb6a7a   <- all of this work
origin/main        d543e40   <- 6 commits behind
```

Every commit in this batch went to **`forked-repo`**
(`github.com/kizzbonez/solana_frontend`), because that is where `main` was
already tracking. `origin` (`github.com/1997xjustin12/test`) has not been
updated since before this work started.

**Check which repository each Vercel project builds from.** If any project
watches `origin`, it will deploy the pre-work code and nothing here will take
effect. Fix by pushing `main` to `origin` as well.

---

## 1. Environment changes — required, and not carried by git

`.env.*` is gitignored, so these do **not** ship with the code. Set them in the
Vercel dashboard per project.

| Project | Variable | Action |
|---|---|---|
| BBQ | `NEXT_PUBLIC_STORE_FACEBOOK` | **clear** — currently Solana's page |
| BBQ | `NEXT_PUBLIC_STORE_PINTEREST` | **clear** — currently Solana's account |
| OKO | `NEXT_PUBLIC_STORE_FACEBOOK` | **clear** — currently Solana's page |
| OKO | `NEXT_PUBLIC_STORE_PINTEREST` | **clear** — currently Solana's account |
| Solana | — | no change; its values are correct |

Why it matters: these feed schema.org `sameAs`, the property search engines and
AI agents use to decide two sites are the same business entity. Until they are
cleared, BBQ and OKO tell every agent they are Solana. Leave them **empty**
rather than guessing — `buildOrganization()` omits `sameAs` entirely when both
are blank.

Also confirm `react-instantsearch-nextjs` installs cleanly. Installs in this
repo require `--legacy-peer-deps` (pre-existing: `react-html-parser@2.0.2` peers
React 16 against this project's React 19). If Vercel's install step fails, set
`NPM_FLAGS=--legacy-peer-deps` or an `.npmrc` with `legacy-peer-deps=true`.

---

## 2. Firewall check — do this before declaring success

Vercel bot protection, if enabled, can silently block AI crawlers and undo the
robots.txt work entirely. There is no Cloudflare or WAF in front of these sites,
so Vercel's own settings are the only gate.

Check **Project → Settings → Firewall / Bot Management** on all three. If bot
protection is on, confirm the crawlers listed in `src/app/robots.js` are not
being challenged.

---

## 3. Deploy

Trigger per project. Builds were verified locally on 2026-08-07 — all three
complete at 338/338 static pages, exit 0.

---

## 4. Post-deploy verification

Run per brand against the **live** domain. Every figure below was measured
locally; production is what actually matters, and dev/prod rendering can differ.

```bash
BASE=https://<brand-domain>

# 1. Products present without JavaScript. Expect 30+, was 0 before this work.
curl -s "$BASE/category/grills-and-smokers" \
  | grep -oE 'href="[^"]*/product/[^"]*"' | sort -u | wc -l

# 2. Structured data. Expect 3 blocks on a category page, 3 on a PDP.
curl -s "$BASE/category/grills-and-smokers" | grep -c 'application/ld+json'

# 3. Crawler policy. Expect 22 named AI user-agents.
curl -s "$BASE/robots.txt" | grep -c '^User-Agent:'

# 4. llms.txt carries the category list. Expect 8, not 0.
curl -s "$BASE/llms.txt" | grep -c '/category/'

# 5. sameAs is gone on BBQ and OKO, still present on Solana.
curl -s "$BASE/" | grep -o '"sameAs":\[[^]]*\]'
```

Then, the check no script covers: **load a category page with JavaScript
disabled in the browser** and confirm products render. That is the failure this
release fixes, and it is the one that looked fine in every source-level
measurement while the page was actually blank.

---

## 5. If something is wrong

```bash
git checkout backups/main-2026-08-07   # ae0c8f5
```

Then redeploy. Note the Vercel Data Cache survives deployments, so also run the
cache clear afterwards — `/admin/cache`, or
`GET /api/revalidate-all?secret=$REVALIDATE_SECRET`.

---

## What is in this release

- Listing pages server-render their products. Every category, brand, main-nav
  and search page went from 0 to 30 products in the HTML.
- The whole storefront now renders without JavaScript at all. It previously
  returned a blank page: React streamed everything into a hidden element that
  only client-side JavaScript could reveal.
- schema.org coverage: `Organization`, `WebSite`, `Product` (enriched),
  `BreadcrumbList`, `ItemList`, `FAQPage`.
- `/llms.txt`, and 22 AI crawlers named explicitly in `robots.txt`.
- An admin cache control at `/admin/cache`.
- Fixes: a product prefetch that threw on every request and silently discarded a
  wasted Elasticsearch call; a category list missing from the built `llms.txt`.

See `docs/agentic-ai-readiness.md` for the full picture and what remains.
