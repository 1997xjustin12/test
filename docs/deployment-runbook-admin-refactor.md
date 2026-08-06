# Deployment Runbook — Admin Refactor, Store Settings, Page SEO & Feed Regeneration

Covers the change set that adds `STORE_ID`, moves per-brand config into Redis,
adds the Page SEO and XML Feeds admin screens, and rebuilds the menu editor.

**Applies to three deployments off this one repo:** Solana, BBQ Grill Outlet, OKO
(Outdoor Kitchen Outlet).

---

## ⚠️ Read this first

**Every deployment sets its own `STORE_ID`:** `solana`, `bbq`, `oko`.

This was not always safe. Originally no `bbq_*` or `oko_*` keys existed — both
brands ran on `STORE_REDIS_PREFIX=solana` and shared Solana's namespace, so
setting `STORE_ID=bbq` would have pointed that deployment at an empty namespace
and lost its theme, favicon and FAQs.

**That has been resolved.** 22 keys were copied from `solana_*` into `bbq_*` and
`oko_*` (nothing overwritten; the two irregular shapes `admin_<id>_market_logo`
and `<id>_faqs_about_<id>` were mapped correctly). All three namespaces now hold
identical values, so behaviour is unchanged — but each brand can now be edited
independently.

`page_seo` and `store_settings` were empty at the source and were not copied;
they get populated per brand through the admin. `feed_status` was deliberately
excluded — it is run history, and copying it would show a brand a "last
generated" result for a run that never happened there.

The theme is derived **only from an explicitly set `STORE_ID`**, never from the
`STORE_REDIS_PREFIX` fallback. Brands may legitimately share a namespace, and if
the prefix could pick the theme, a shared namespace would serve Solana's entire
storefront on bbqgrilloutlet.com.

### Local testing per brand

```bash
npm run solana-dev      # or bbq-dev / oko-dev
npm run solana-build    # or bbq-build / oko-build
```

`scripts/run-brand.js` copies `.env.<brand>` over `.env.local`, clears
`.next/cache` when the brand changes, and prints the active store id, Redis
namespace and feed mode before Next boots. Only one `next dev` can run per
checkout (Next holds a lock at `.next/dev/lock`), and the script swaps the
shared `.env.local`, so brands cannot run side by side from one folder.

---

## 0. Before pushing

```bash
rm -f nul                    # stray Windows redirect artifact, untracked
git status --porcelain       # confirm no .env* files appear (they are gitignored)
```

---

## 1. Environment variables — Solana only

Vercel → Solana project → Settings → Environment Variables.

| Action | Variable | Notes |
| --- | --- | --- |
| **Add** | `STORE_ID=solana` | New bootstrap. Selects the Redis namespace and derives the theme. |
| **Remove** | `MERCHANT_FEED_SHOPIFY_DOMAIN` | Fully migrated — no code reads it. Now Store Settings → Catalog. |
| Keep | everything else | Including `STORE_REDIS_PREFIX`; still imported by two components. |

## 1b. Environment variables — BBQ and OKO

Now that their namespaces are populated, both get their own id:

| Project | Add |
| --- | --- |
| BBQ | `STORE_ID=bbq` |
| OKO | `STORE_ID=oko` |

`NEXT_PUBLIC_STORE_THEME` becomes redundant on both (`STORE_ID` takes
precedence) but is harmless to leave. OKO keeps its
`MERCHANT_FEED_SHOPIFY_DOMAIN` until the value is entered in Store Settings.

Verified locally: each brand builds and serves its own title, palette and feed
mode with `STORE_ID` set.

---

## 2. Deploy Solana first

Deploy Solana alone and complete section 3 against it before deploying the other
two. If the theme resolves wrong there, it will be wrong everywhere.

---

## 3. Smoke test — theme first

Highest-risk change. Each brand must return **its own** title:

```bash
curl -s https://www.solanafireplaces.com/ | grep -o '<title>[^<]*</title>'
# expect: Solana Fireplaces | Stylish Indoor & Outdoor Heating

curl -s https://bbqgrilloutlet.com/       | grep -o '<title>[^<]*</title>'
# expect: ... | Gas Grills & Built-Ins at Outlet Prices

curl -s https://<oko-domain>/             | grep -o '<title>[^<]*</title>'
# expect: ... | Built-In BBQ Grills & Islands
```

> If any brand returns Solana's title, **roll back immediately**. That is the
> wrong-brand failure mode. Do not debug it live.

Then confirm the new metadata on routes that previously had none:

```bash
curl -s https://<domain>/cart  | grep -o 'name="robots" content="[^"]*"'    # noindex, nofollow
curl -s https://<domain>/login | grep -o 'rel="canonical" href="[^"]*"'
```

Admin screens should load:

- `/admin/menu-builder/edit/<menu_id>/seo` (tabs are routes now)
- `/admin/page-seo`
- `/admin/settings`
- `/admin/xml-feeds`

---

## 4. Bust the caches

Vercel's Data Cache persists across deployments, so a fresh deploy can still
serve pre-deploy settings. Run once per brand:

```bash
curl "https://<domain>/api/revalidate-all?secret=$REVALIDATE_SECRET"
```

Now covers `store-settings` and `page-seo` alongside the existing tags.

Targeted alternatives:

```bash
curl -X POST https://<domain>/api/revalidate-store-settings
curl -X POST https://<domain>/api/revalidate-page-seo
```

> Store settings are cached for 24h. An env change that appears to do nothing is
> almost always this cache.

---

## 5. Seed Store Settings

Open `/admin/settings` per brand. Each field shows its env fallback beneath it —
fill in only what should differ. Blank means "use env", so nothing is required on
day one.

**OKO is the one that matters:** set **Catalog → Merchant feed source** to
`https://www.outdoorkitchenoutlet.com`. Its env var still supplies this as a
fallback, so nothing breaks if skipped, but moving it into settings is the point
of the change. Leave that field **blank** on Solana and BBQ.

---

## 6. Verify the merchant feed

`/admin/xml-feeds` per brand. Check the mode banner:

| Brand | Expected mode |
| --- | --- |
| Solana, BBQ | This site (Elasticsearch) |
| OKO | External Shopify storefront — outdoorkitchenoutlet.com (amber) |

Hit **Regenerate** on the merchant feed. Measured locally in Shopify mode:

```
4,593 items   9.4 MB   24.9s
```

The ES-sourced brands are faster. A `0 items` result is reported as a failure —
that is the Shopify rate-limit case, and the reason the button waits for a result
instead of firing and forgetting.

Watch for a serverless timeout on OKO. `maxDuration = 300` is set on the route,
but the hosting plan has to allow it.

---

## 7. Page SEO

`/admin/page-seo` per brand. All 19 routes show grey dots (using defaults) — the
key is empty, which is expected. Save an override on one route and confirm it
appears on the **public** URL, not in the admin; the storefront read is a separate
cached path.

---

## 8. Watch for a day

- **Google Search Console → Coverage** — for the new `noindex` on `/cart`,
  `/login`, `/search`. These should not have been indexed anyway, but confirm
  nothing you wanted indexed got caught.
- **Merchant Center → Diagnostics** — after the next scheduled fetch, OKO
  especially.

---

## Rollback

Revert the deployment in Vercel.

Nothing here is destructive: no Redis key was renamed, deleted or rewritten (all
15 pre-existing keys were verified to resolve byte-identically), and the new keys
(`*_store_settings`, `*_page_seo`, `*_feed_status`) are additive.

Re-adding `MERCHANT_FEED_SHOPIFY_DOMAIN` to Solana's env restores the old feed
mode.

---

## Live behaviour changes to expect

1. **19 routes now emit `robots` and `canonical`** where they previously had no
   metadata at all. Titles are unchanged — the hardcoded values moved into the
   route registry as defaults.
2. **Solana's merchant feed switches to SELF mode**, since
   `MERCHANT_FEED_SHOPIFY_DOMAIN` is removed. Per the feed route's own
   documentation this is correct for solanafireplaces.com, which serves its own
   product pages.
3. **Admin dark mode** follows the OS by default and can be forced from the
   sidebar. Storefront `dark:` behaviour is unchanged.

---

## Known follow-ups (not in this change set)

- `/blogs` and `/register` are excluded from Page SEO — the former builds
  metadata from the latest WordPress post, the latter is a client component and
  cannot export `generateMetadata`.
- `FaviconUpdater`, `ThemeUpdater` and `FaqsUpdater` compute store-prefixed Redis
  keys **client-side**, where `STORE_ID` is undefined. Same bug already fixed in
  the Page SEO editor by resolving the key server-side and passing it as a prop.
- `keys.dev_shopify_menu` is a hardcoded, non-store-scoped literal
  (`menu-5q8vn2rcy`), so all brands read the same menu. The store-scoped pointer
  `<store>_shopify_active_menu` exists and holds a different value
  (`menu-7pajm2g8w`) but is ignored.
- `/api/regenerate-feed` has no auth. Other revalidate endpoints require
  `?secret=`.
- ~180 call sites still import store constants from env. Store Settings override
  only where code reads `getStoreSettings()` / `useStoreSettings()`.
