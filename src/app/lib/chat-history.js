/**
 * Assistant conversation history, kept in the browser.
 *
 * Registered users get server-side history (endpoint pending). This is the
 * other half: somewhere for a conversation to live when there is no account to
 * hang it on, so a guest who reloads the page — or comes back tomorrow — still
 * has the answers they were given.
 *
 * Scoped per identity AND per brand:
 *
 *   sf:chat-history:solanafireplaces.com:guest
 *   sf:chat-history:bbqgrilloutlet.com:u:1423
 *
 * The brand segment matters in development, where all three storefronts are
 * served from localhost and therefore share one localStorage origin. In
 * production each brand has its own domain and is already isolated, but keying
 * on the domain costs nothing and means a developer switching STORE_ID does not
 * inherit the previous brand's conversation.
 *
 * The identity segment is what makes the login transition safe: signing in or
 * out changes which key is read, so one person's conversation cannot appear
 * under another's session on a shared computer.
 *
 * Everything here is defensive. localStorage throws rather than returns null in
 * Safari's private mode and in sandboxed iframes, the stored value can be
 * corrupt or from an older build, and quota is shared with the cart. History is
 * a convenience — nothing in here may throw into the widget.
 */

/**
 * How long a conversation survives, measured from the last message rather than
 * the first. A thread someone is actively using should not disappear mid-way
 * through because it started eight days ago.
 */
export const HISTORY_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** Bumped when the stored shape changes; anything older is dropped, not migrated. */
const VERSION = 1;

/**
 * Kept per conversation. Well past a real session, far short of the ~5MB origin
 * quota that the cart also draws on.
 */
const MAX_MESSAGES = 60;

const PREFIX = "sf:chat-history";

/** Inlined at build time; each brand deploys with its own value. */
const BRAND = String(process.env.NEXT_PUBLIC_STORE_DOMAIN || "store").toLowerCase();

/**
 * `null` identity means guest. Anything else is the signed-in user's id.
 * Never the email address — that would write an identifier into a storage key
 * that is readable by every script on the page, for no benefit.
 */
export function historyKey(identity) {
  return `${PREFIX}:${BRAND}:${identity ? `u:${identity}` : "guest"}`;
}

/** localStorage, or null where it is unavailable. Access itself can throw. */
function store() {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

const ROLES = new Set(["user", "assistant"]);

/**
 * Validates a message read back from storage.
 *
 * Stored JSON is not trusted input in the security sense — it is the visitor's
 * own browser — but it can be stale, hand-edited, or written by an older build,
 * and a malformed record must not reach the renderer.
 */
function isMessage(m) {
  return Boolean(m) && ROLES.has(m.role) && typeof m.text === "string";
}

/**
 * The persistable form of a message.
 *
 * `full` matters: while a reply is typing out, `text` holds only the characters
 * revealed so far. Persisting that would save a truncated answer for anyone who
 * closed the tab mid-animation, so the complete text is carried alongside and
 * preferred here. `typing` is deliberately dropped — a restored conversation is
 * finished, not mid-animation.
 *
 * `handles` are kept because the product URLs are stripped out of the prose
 * before it is displayed, so the recommended products cannot be recovered from
 * the text alone. Storing the handles rather than the resolved products means a
 * restored shelf is re-priced from the catalogue instead of showing whatever a
 * card cost a week ago.
 */
function toStored(m) {
  const text = typeof m.full === "string" ? m.full : m.text;
  const stored = { id: m.id, role: m.role, text };
  if (Array.isArray(m.handles) && m.handles.length) {
    stored.handles = m.handles.filter((h) => typeof h === "string");
  }
  return stored;
}

/**
 * Reads the conversation for an identity, or null if there is nothing usable.
 * Expired, corrupt and outdated records are deleted on the way past rather than
 * left to be re-read on every page view.
 */
export function loadHistory(identity) {
  const ls = store();
  if (!ls) return null;

  const key = historyKey(identity);
  let raw;
  try {
    raw = ls.getItem(key);
  } catch {
    return null;
  }
  if (!raw) return null;

  const drop = () => {
    try {
      ls.removeItem(key);
    } catch {
      /* nothing more to try */
    }
    return null;
  };

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return drop();
  }

  if (!data || data.v !== VERSION) return drop();
  if (!Number.isFinite(data.savedAt)) return drop();
  if (Date.now() - data.savedAt > HISTORY_TTL_MS) return drop();

  const messages = Array.isArray(data.messages) ? data.messages.filter(isMessage) : [];
  if (!messages.length) return drop();

  return {
    messages,
    sessionId: typeof data.sessionId === "string" && data.sessionId ? data.sessionId : null,
  };
}

/**
 * Writes the conversation for an identity. Returns true if it landed.
 *
 * On a quota failure the oldest half is dropped and the write retried, until it
 * fits or there is nothing left — losing the start of a long conversation beats
 * losing all of it, and beats throwing. Total failure is given up on silently;
 * the conversation on screen is unaffected either way.
 */
export function saveHistory(identity, { messages, sessionId } = {}) {
  const ls = store();
  if (!ls) return false;

  let kept = (Array.isArray(messages) ? messages : [])
    .filter(isMessage)
    .slice(-MAX_MESSAGES)
    .map(toStored);

  if (!kept.length) return false;

  const key = historyKey(identity);
  const attempt = (list) => {
    try {
      ls.setItem(
        key,
        JSON.stringify({
          v: VERSION,
          savedAt: Date.now(),
          sessionId: sessionId || null,
          messages: list,
        }),
      );
      return true;
    } catch {
      return false;
    }
  };

  // Halve and retry until it fits or there is nothing left to drop. A single
  // retry is not enough: quota is shared with the cart, so a failure means the
  // origin is already close to full and one halving may still not fit.
  while (kept.length) {
    if (attempt(kept)) return true;
    kept = kept.slice(Math.ceil(kept.length / 2));
  }
  return false;
}

/** Forgets one identity's conversation. */
export function clearHistory(identity) {
  const ls = store();
  if (!ls) return;
  try {
    ls.removeItem(historyKey(identity));
  } catch {
    /* nothing to clear into */
  }
}

/**
 * Removes every signed-in conversation for this brand. Guest history is left
 * alone.
 *
 * Logging out clears the account's copy directly, but only when the widget
 * happens to be mounted at the time — a full page navigation to /logout, a tab
 * closed mid-session, or a logout performed in another tab all miss it, and the
 * conversation would then sit in the browser until it expired a week later.
 * Running this whenever the page loads signed-out closes all of those, because
 * a browser with nobody signed in has no business holding anyone's thread.
 *
 * A session that is merely resumed is unaffected: the refresh token restores
 * the identity before this runs, so it is only reached when genuinely a guest.
 */
export function clearAccountHistories() {
  const ls = store();
  if (!ls) return;
  try {
    const owned = `${PREFIX}:${BRAND}:u:`;
    const keys = [];
    for (let i = 0; i < ls.length; i += 1) {
      const key = ls.key(i);
      if (key?.startsWith(owned)) keys.push(key);
    }
    keys.forEach((key) => ls.removeItem(key));
  } catch {
    /* best-effort */
  }
}

/**
 * Deletes every expired conversation this app owns, not just the current one.
 *
 * Without this, a key only expires when someone signs back in as that identity
 * and it happens to be read. Someone who logs in once and never returns would
 * otherwise leave their conversation in the browser indefinitely — which is the
 * case the seven-day limit is most meant to cover.
 */
export function pruneExpiredHistory() {
  const ls = store();
  if (!ls) return;
  try {
    const stale = [];
    for (let i = 0; i < ls.length; i += 1) {
      const key = ls.key(i);
      if (!key?.startsWith(`${PREFIX}:`)) continue;
      let record = null;
      try {
        record = JSON.parse(ls.getItem(key) ?? "");
      } catch {
        // Unparseable and therefore unusable — clear it out too.
      }
      const savedAt = record?.savedAt;
      if (!Number.isFinite(savedAt) || Date.now() - savedAt > HISTORY_TTL_MS) {
        stale.push(key);
      }
    }
    stale.forEach((key) => ls.removeItem(key));
  } catch {
    /* iterating storage is best-effort */
  }
}
