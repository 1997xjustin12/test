# Brand isolation — what is separate, what is shared

Audited 12 August 2026 against the live Upstash instance, read-only. Answers one
question: **if an operator changes something in one brand's admin, what else
changes?**

## Short answer

Store settings, Page SEO, logos, favicons, theme colours, FAQs and feed status
are **properly isolated** — each brand has its own Redis key and editing one
cannot touch another.

**The navigation menu is not.** All three brands read and write the same menu
object. Editing it in any admin changes the header, hero, featured content and
collections on **all three storefronts**. This is the one real mix-up, and it is
live today.

---

## How isolation works

`STORE_ID` (`solana` | `bbq` | `oko`) is set per Vercel project and prefixes
every Redis key through `storeKey()` in [`lib/store.js`](../src/app/lib/store.js):

```
storeKey("store_settings")  ->  solana_store_settings
                                bbq_store_settings
                                oko_store_settings
```

All three brands share **one** Upstash Redis instance, so this prefix is the
only thing keeping them apart. It works — for every key that actually uses it.

## What is isolated

Verified present as three separate keys, one per brand:

| Setting | Redis key | Admin screen |
|---|---|---|
| Store settings | `<brand>_store_settings` | `/admin/settings` |
| Page SEO | `<brand>_page_seo` | `/admin/page-seo` |
| Favicon | `<brand>_favicon` | `/admin/favicon-and-logo` |
| Logo | `admin_<brand>_market_logo` | `/admin/favicon-and-logo` |
| Theme colour | `<brand>_theme` | `/admin/theme-color` |
| Menu list & active menu | `<brand>_menu_list`, `<brand>_active_menu` | `/admin/menu-builder` |
| Shipping / return / warranty FAQs | `<brand>_faqs_*` | `/admin/faqs-updater` |
| About-brand FAQ | `<brand>_faqs_about_<brand>` | `/admin/faqs-updater` |
| Feed status | `<brand>_feed_status` | `/admin/xml-feeds` |
| Cache status | `<brand>_cache_status` | `/admin/cache` |

> **These keys currently hold identical content on all three brands.** That is
> the result of the 22-key namespace copy done on 6 Aug, not a sign they are
> linked. They are independent keys: change `bbq_favicon` and `solana_favicon`
> is untouched. Identical *today*, free to diverge.

## What is shared

### 1. The navigation menu — the real problem

Menu objects live under **global** keys with no brand prefix:

| Key | Registry name | Size |
|---|---|---|
| `menu-vwmuqu8jz` | `default_menu` | 208 KB |
| `menu-7pajm2g8w` | `default_shopify_menu` | 37 KB |
| `menu-5q8vn2rcy` | `dev_shopify_menu` | 293 KB |
| `menu-2r175z2fj` | `dev_shopify_menu_v2` | 190 KB |

Those four are the **only** `menu-*` keys in Redis, and none is brand-prefixed.

The chain that makes this a live problem:

- [`(market)/layout.jsx`](../src/app/(market)/layout.jsx) reads
  `keys.dev_shopify_menu.value` — the literal `menu-5q8vn2rcy` — for the
  storefront navigation on **every** brand.
- [`MenuEditorContext.jsx`](../src/app/components/admin/menu-editor/MenuEditorContext.jsx)
  `save()` writes to that **same literal key**.
- `(admin)/layout.jsx` and `[slug]/page.jsx` read it too.

So the menu editor is effectively one shared editor with three front doors.
Everything it controls is shared: nav items, hero content, featured nav,
featured content, product collections, category collections and the per-menu
FAQs and SEO panels.

Note also that each brand's `<brand>_menu_list` references **seven** menu ids
but only four exist. Three are dangling — the list has drifted from what is
stored.

**What to do about it.** The fix is to route the menu through `storeKey()` like
everything else and give each brand its own copy, seeded from the current shared
object. That is a contained change (the key registry plus the four read sites)
but it is a data migration as well as a code change, so it is written up here
rather than done quietly. Until then, treat the menu editor as **global** and
coordinate before saving.

### 2. Search result cache

`searchkit:*` keys are hashed from the request body alone, with no `STORE_ID` in
the key. Harmless for correctness — all three brands query the same
Elasticsearch index, so the cached answer is the same answer — but it means the
admin cache screen's full clear is cross-brand. The Cache screen already warns
about this.

### 3. Abandoned-cart records

`abandoned:<cart_id>` is not brand-prefixed. Cart ids are UUIDs, so collisions
are not a practical concern.

### 4. Infrastructure, shared by design

| | Value | Note |
|---|---|---|
| Redis instance | one Upstash database | Brands separated by key prefix only |
| Elasticsearch index | `solana_updated_product_index` | One catalogue behind all three storefronts |
| Django backend | one URL | Brands distinguished by the `X-Store-Domain` header |
| `REVALIDATE_SECRET` | **identical on all three** | See the warning below |

### 5. Admin access

| | Shared? | |
|---|---|---|
| `ADMIN_USERNAMES` | yes, by choice | Same operators run all three brands. Set different lists if that changes. |
| `ADMIN_SESSION_SECRET` | **no — distinct per brand** | Deliberate. Verified: a cookie signed with Solana's secret is refused by OKO even for a username that is an admin on both. |

> **Why the distinct secret matters here.** `ADMIN_SESSION_SECRET` falls back to
> `REVALIDATE_SECRET` when unset, and `REVALIDATE_SECRET` is the *same value on
> all three brands*. Had the fallback been left in place, one brand's admin
> cookie would have been replayable on the other two. Setting an explicit
> per-brand secret closes that. Do not remove those values from the Vercel
> projects.

---

## The bootstrap landmine

`STORE_ID` is what keeps the brands apart. If it is ever missing on a
deployment, `lib/store.js` falls back to `STORE_REDIS_PREFIX` — which is
**`solana` on all three brands**:

```
STORE_ID=bbq            STORE_REDIS_PREFIX=solana
STORE_ID=oko            STORE_REDIS_PREFIX=solana
```

With `STORE_ID` unset, BBQ and OKO would silently resolve `solana_*` keys and
read Solana's settings, favicon, logo and FAQs. The theme would not flip —
`resolveTheme()` deliberately ignores the prefix fallback for exactly this
reason, so the storefront would still *look* right while reading another brand's
configuration.

**Check `STORE_ID` is set on all three Vercel projects.** It is the single
variable holding the isolation together.

---

## Re-running this audit

The script used is read-only. To check the current state:

```bash
# Are the scoped keys distinct per brand?
curl -s "$BASE/api/redis?key=solana_store_settings" -H "Cookie: admin_session=..."
curl -s "$BASE/api/redis?key=bbq_store_settings"    -H "Cookie: admin_session=..."

# Which menu does this brand's storefront actually render?
#   grep the literal key out of the layout — it should eventually be storeKey()
grep -n "dev_shopify_menu" src/app/\(market\)/layout.jsx
```

The quickest behavioural check: change the theme colour on BBQ, confirm Solana
is unaffected (it will be). Then change a nav label in the menu editor and
confirm it appears on all three (it will) — that is the shared menu.

## Observed state, 12 Aug 2026

- `<brand>_store_settings` — **absent on all three brands.** All three currently
  run entirely on their env fallbacks. Nothing has been saved from
  `/admin/settings` yet, on any brand.
- `<brand>_page_seo` — absent on all three. `/admin/page-seo` has never been
  saved.
- `<brand>_feed_status` — present on Solana only.
- `<brand>_cache_status` — present on OKO only.
- Every other scoped key above — present on all three, identical content.
