# AI assistant — conversation history

_17 August 2026_

Registered users are getting server-side history; **that endpoint does not exist
yet**. This documents the browser-side half, which is permanent for guests and
an interim measure for signed-in users, and marks exactly where the server
takes over.

## What is stored, and where

`localStorage`, for **seven days from the last message** — sliding, not from the
first message, so a conversation someone is actively using does not vanish
mid-thread.

Keys are scoped to brand and identity
([`src/app/lib/chat-history.js`](../src/app/lib/chat-history.js)):

```
sf:chat-history:solanafireplaces.com:guest
sf:chat-history:bbqgrilloutlet.com:u:1423
```

The **brand** segment only matters in development, where all three storefronts
share `localhost` and therefore one localStorage origin; in production each
brand has its own domain and is already isolated. It costs nothing and stops a
developer switching `STORE_ID` from inheriting the previous brand's thread.

The **identity** segment is what makes signing in and out safe — see below.

Stored per message: `id`, `role`, `text`, and the product `handles` the reply
recommended. Two of those are less obvious than they look:

- **`text` is the complete reply, not what is on screen.** While a reply types
  itself out, the displayed text is a growing slice. The full text is carried
  alongside it and persisted instead, so closing the tab mid-animation does not
  save a truncated answer.
- **`handles`, not resolved products.** Product URLs are stripped out of the
  prose before display, so the recommendations cannot be recovered from the text
  alone. Storing handles means a conversation reopened next week re-prices from
  the catalogue rather than showing what something cost when the answer was
  given.

## Signing in and out

| Transition | What happens |
| --- | --- |
| Guest chats | Saved under the `guest` key. |
| Guest → signed in | The thread on screen **comes with them** — it moves under their identity and the guest copy is deleted. |
| Signed in → signed out | The account's copy is **deleted** and the panel starts over. |
| Signed in as someone else | Same as a sign-out, then that account's thread is loaded. |

Two details in that table are load-bearing.

**The guest thread is carried, not discarded.** Someone mid-conversation who
signs in to check out should not watch their questions disappear at that moment.
The guest copy is removed at the same time, so the next guest on that browser
cannot pick up where a signed-in person left off.

**A signed-out browser holds no account's conversation.** Logging out clears it
directly, but only when the widget is mounted at the time — a full page
navigation to `/logout`, a tab closed mid-session, or a logout in another tab
all miss that path. So the widget *also* purges every account thread whenever it
loads signed-out. A session that is merely resumed is unaffected, because the
refresh token restores the identity first.

This was found by testing rather than reasoning: the live logout path passed,
and the hard-navigation path left the conversation sitting in the browser for
the remaining seven days.

## Where the server endpoint plugs in

One place, marked `SERVER HISTORY SEAM` in
[`AiChatWidget.jsx`](../src/app/components/widget/AiChatWidget.jsx) — the
guest → signed-in branch. When the endpoint exists:

1. **On sign-in**, fetch the account's stored conversation and let it take
   precedence over the local copy.
2. **POST the carried guest thread** to it, so the adoption is recorded
   server-side rather than only in the browser.
3. Local storage for signed-in users then becomes a cache the server
   supersedes — it is deliberately *not* a second source of truth today, which
   is why the server copy can simply overwrite it with no merge to reason about.

Guest history stays exactly as it is; there is no account to hang it on.

## Limits and edge cases

- **60 messages** per conversation. On a quota failure the oldest half is
  dropped and the write retried until it fits — quota is shared with the cart,
  so one halving is not always enough.
- **Corrupt, expired, or older-version records are deleted on read**, not just
  ignored, so a bad record cannot be re-read on every page view.
- **Storage may be unavailable** (Safari private mode, sandboxed iframes) —
  accessing it can throw rather than return null. Every path is guarded; the
  widget works without persistence.
- **Expired threads for other identities are swept on load**, so someone who
  signs in once and never returns does not leave a conversation behind
  indefinitely.
- **Multiple tabs** are last-write-wins. Not worth coordinating for a chat
  transcript.

## Clearing it

The panel header has a **new-conversation** button whenever there is something
to clear. A transcript that persists for a week needs a way to be forgotten —
on a shared computer that is the only control the person actually has.

## Related

- [`docs/chat-region-restriction.md`](chat-region-restriction.md) — who may use
  the assistant at all.
