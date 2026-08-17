# AI assistant — regional restriction

_17 August 2026_

The AI assistant is available to visitors in the **United States and Canada**
only, on production deployments only. Everywhere else — local development,
Vercel preview URLs — it is open to everyone, so it can be worked on and
demonstrated from anywhere.

Each message costs a model call on the backend, and the catalogue only ships to
those two countries, so this keeps that spend pointed at people who can actually
buy.

## Nothing to configure

The restriction is on by default in production. `CHAT_ALLOWED_COUNTRIES` and
`CHAT_REGION_LOCK` exist as overrides and do **not** need to be set in Vercel for
this to work — an unset `CHAT_REGION_LOCK` already means "enforce on production,
nowhere else".

This is deliberate. A restriction that only works when someone remembers to set
an environment variable in three separate Vercel projects is a restriction that
will eventually be off in one of them without anyone noticing.

| Variable | Default | Purpose |
| --- | --- | --- |
| `CHAT_ALLOWED_COUNTRIES` | `US,CA` | Served countries, comma-separated ISO alpha-2. Add a market without a code change. |
| `CHAT_REGION_LOCK` | unset | `on` forces the restriction (to reproduce a refusal locally); `off` lifts it in production from the dashboard. |

### Why `VERCEL_ENV`, not `NODE_ENV`

Vercel builds **preview** deployments with `NODE_ENV=production`. Keying the
restriction on `NODE_ENV` would therefore enforce it on preview URLs too, and
lock us out of the environment we test in. `VERCEL_ENV` distinguishes
`production` / `preview` / `development`, so only the real thing is gated.

## How it works

Two independent pieces, one rule, in
[`src/app/lib/chat-region.js`](../src/app/lib/chat-region.js).

**Enforcement** — `POST /api/chat` reads Vercel's `x-vercel-ip-country` header
and returns `403` before it reads the request body, so a refused message never
reaches the backend and never costs a model call. This is the part that
actually matters; everything below is presentation.

**Presentation** — the widget asks `GET /api/chat/availability` once per session
and hides its trigger button entirely if the answer is no, so a blocked visitor
never sees a button that was never going to work. The answer is cached in
`sessionStorage`, so it costs one small request on the first page view of a
session and nothing afterwards. Session-scoped rather than local, so someone who
travels or drops a VPN gets a fresh answer on their next visit.

The check could not be done during page render: the storefront layout that
mounts the widget is statically generated across ~340 pages, and reading a
request header there would opt every one of them into dynamic rendering. One
small request per session is far cheaper than losing the site's static
generation.

Because the client half is only cosmetic, it **fails open** — if the availability
request fails, the button shows. A visitor who skips the call, edits the cached
value, or blocks the request gains nothing, because the POST enforces the rule
by itself.

## Testing it

Local development has no geolocation to read, so outside production an
`X-Debug-Country` header stands in. It is ignored in production — otherwise the
restriction would be a suggestion, undone by anyone who sets a header.

```bash
# Reproduce production behaviour locally
CHAT_REGION_LOCK=on npx next dev -p 3010

curl -H "X-Debug-Country: US" localhost:3010/api/chat/availability
#   {"available":true,"country":"US"}
curl -H "X-Debug-Country: GB" localhost:3010/api/chat/availability
#   {"available":false,"country":"GB"}

curl -X POST -H "Content-Type: application/json" -H "X-Debug-Country: GB" \
     -d '{"message":"hi"}' localhost:3010/api/chat
#   403  {"error":true,"message":"The AI assistant is only available in the US and Canada."}
```

Browsers can send the header too — in Chrome DevTools, Network conditions, or
via an extension — which is how the hidden-trigger path was verified.

## Two things to know

**Unknown country is refused.** If the geolocation header is missing or reads
`XX`, the visitor is turned away when the lock is on. "US and Canada only" means
denying what can't be placed, and admitting unknowns would make the restriction
avoidable by anything that strips the header. The trade-off: if Vercel ever
stopped sending that header, the assistant would be off for **everyone** rather
than quietly open to everyone. That is the failure you find out about
immediately, which is the one worth having — and `CHAT_REGION_LOCK=off` lifts it
in seconds without a deploy.

**This is IP geolocation, not a security boundary.** A VPN defeats it in both
directions: someone in Texas on a UK exit node is refused, and someone in London
on a US exit node is served. It is a usage control, and nothing downstream
should treat it as proof of where anyone is.

## Related

- [`docs/brand-isolation.md`](brand-isolation.md) — what the three brands share.
  The restriction is identical across all three; there is no per-brand region
  list.
