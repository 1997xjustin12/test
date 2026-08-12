# Admin access in production

How someone gets into `/admin` on a deployed brand, and how to grant or revoke
it. Applies identically to Solana, BBQ and OKO — one codebase, three Vercel
projects, the same two environment variables on each.

## How it works

There is no separate admin login. An operator signs in on the storefront at
`/login` with the same username and password they already have, and `/admin`
then works for eight hours.

What happens underneath:

1. `/api/login` proxies the credentials to the Django backend as before.
2. On success, if the username is listed in `ADMIN_USERNAMES`, the response also
   sets `admin_session` — an httpOnly cookie naming the user, signed with
   HMAC-SHA256.
3. `proxy.js` checks that cookie on every `/admin` request, and the admin API
   routes check it on every call.

Two separate facts, deliberately kept apart:

| | Where it lives | What it proves |
|---|---|---|
| Identity | the signed cookie | which user this is — tamper-proof, browser cannot write it |
| Authority | `ADMIN_USERNAMES` | whether that user is an admin — re-read on every request |

Because authority is not baked into the cookie, **removing a username takes
effect immediately**. There is no waiting for a session to expire.

Anyone who is not a current admin — logged out, logged in as a shopper, or
holding a valid cookie for a username since removed — gets a **404**. Not a 403:
a 403 confirms there is something at `/admin` worth attacking.

## Setting it up

Two variables, on **each of the three Vercel projects**:

| Variable | Required | Notes |
|---|---|---|
| `ADMIN_USERNAMES` | yes | Comma-separated usernames. Case- and space-insensitive. |
| `ADMIN_SESSION_SECRET` | no | Signing key. Falls back to `REVALIDATE_SECRET` when unset. Set it explicitly so admin sessions and cache revalidation can be rotated independently. |

> **Unset means nobody gets in.** An empty or missing `ADMIN_USERNAMES` admits
> no one, which is the safe direction for a fresh deployment. It does not fall
> open.

Both are already appended to the bottom of `.env.local`, `.env.solana`,
`.env.bbq` and `.env.oko` for local work. **Those files are gitignored, so they
do not reach Vercel** — the same two variables have to be set in each Vercel
project's dashboard before `/admin` will open on a deployed brand.

`ADMIN_USERNAMES` is currently the same list on all three brands, since the same
operators manage all of them. Per-brand admins work too — just set different
lists.

`ADMIN_SESSION_SECRET` is deliberately **different on each brand**. Whoever holds
it can forge an admin session, and cookies are domain-scoped anyway, so there is
no benefit to sharing one and a real cost if it leaks. Verified: a cookie signed
with Solana's secret is refused by the OKO deployment even for a username that
is an admin on both.

### Granting access

Add the username to `ADMIN_USERNAMES` and redeploy (Vercel applies environment
changes on the next deployment). The person then signs out and back in, because
the cookie is minted at login.

### Revoking access

Remove the username and redeploy. This takes effect on the next request — their
existing cookie stops being honoured immediately, without waiting for expiry.

To cut someone off *now* without a deploy, rotate `ADMIN_SESSION_SECRET`
(or `REVALIDATE_SECRET` if you are relying on the fallback). That invalidates
every admin session on that brand, including your own.

## Verifying a deployment

```bash
BASE=https://<brand-domain>

# 1. Not logged in -> 404, and nothing that reveals /admin exists.
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/admin"           # 404

# 2. The admin APIs refuse anonymous callers.
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/api/cache/clear"  # 401
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/api/redis?key=solana_menu_list"   # 404

# 3. The storefront's own use of Redis still works.
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/api/redis?key=abandoned:test"     # 200

# 4. The Django server-to-server path still works.
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/api/cache/clear?secret=$REVALIDATE_SECRET"  # 200
```

Then the part no script covers: sign in at `$BASE/login` as a listed admin and
confirm `/admin` loads, the sidebar renders, and a save on
`/admin/settings` succeeds.

## Notes worth keeping

**Existing sessions do not carry over.** The cookie is issued at login, so
anyone already signed in when this ships must sign out and back in before
`/admin` will open.

**Logging out of the storefront ends admin access**, because `/api/logout`
clears both cookies.

**The Django token entry point still works.** `proxy.js` continues to accept a
valid `?token=` minted by the Django admin (`app/stores/views.py::generate_token`),
so the existing iframe flow is unaffected. It is now an alternative credential
rather than the only one, and the `ENABLE_ADMIN_TOKEN_GATE` flag is gone — the
gate is always on. Previously, with that flag unset, production served the admin
HTML to anyone and relied on a client-side component to hide it.

**Local development is unaffected.** `npm run oko-dev` and friends bypass the
gate on `localhost`. The bypass requires a non-production build as well as a
local host, so it cannot be reached on a deployed brand by spoofing a `Host`
header. Running `next start` over a production build locally *does* ask for a
real login — which is what you want when reproducing a production problem.

**Why the storefront's JWT is not used directly.** The access/refresh pair from
the backend lives in IndexedDB and is only ever sent as an `Authorization`
header by client JavaScript, so the server never sees it and cannot gate on it.
The only cookie the login flow used to set was `isLoggedIn`, which is not
httpOnly and can therefore be typed into a console by anyone. That is why a
separate signed cookie exists rather than reusing what was already there.

## What this replaced

The admin surface previously had no working server-side protection:

- `proxy.js` had a gate, but it only enforced when `ENABLE_ADMIN_TOKEN_GATE` was
  `"true"`, and it was not set.
- The remaining check was `TokenValidator`, a client component that read
  `?token=` in the browser — after the page and its data had already been sent,
  and bypassable with devtools. It has been deleted.
- `/api/redis` accepted unauthenticated `GET`, `POST`, `PUT` and `DELETE`
  against **any** key: the menus, store settings and Page SEO for all three
  brands were publicly readable, writable and deletable. Writes and arbitrary
  reads are now admin-only; the storefront's own `abandoned:<cart_id>` keys
  remain open to it, and nothing else does.
- `/api/cache/clear` treated a same-origin or absent `Origin` header as
  authorization. `curl` sends no `Origin` at all, so it passed for everyone.
- `/api/regenerate-feed`, `/api/revalidate-page-seo` and
  `/api/revalidate-store-settings` had no check whatsoever. The feed route walks
  an external storefront's whole catalogue for up to five minutes per call.
