/**
 * Turning a backend rejection into something a shopper can act on.
 *
 * Registration used to report every failure it did not specifically recognise
 * as "Registration failed." — and the handler recognised exactly two fields,
 * email and username. So a real, fixable answer from the backend, "This
 * password is too common.", reached the browser and was thrown away. The
 * shopper was told the feature was broken when they were four characters from
 * succeeding. Reported from a live attempt on 14 October 2026.
 *
 * Django REST Framework answers a failed validation with the field as the key
 * and a list of sentences as the value:
 *
 *   { "password": ["This password is too common."] }
 *   { "email": ["user with this email already exists."] }
 *   { "password": ["This password is too short…", "This password is too common."] }
 *
 * It also has several shapes for errors that belong to no field —
 * `non_field_errors`, `detail` — and our own proxy adds `error`. All of them
 * end up here.
 *
 * The rule is to show what the backend said rather than inventing wording for
 * it: the backend is the only thing that knows why it refused, and the next
 * validator someone adds should reach the shopper without this file changing.
 * Only two messages are rewritten, where the raw text is worse than useless.
 */

/** Field names in the order a reader meets them in the form. */
const FIELD_LABELS = {
  first_name: "First name",
  last_name: "Last name",
  username: "Username",
  email: "Email",
  password: "Password",
  password2: "Confirm password",
};

/** Keys carrying a message that is already a whole sentence about the request. */
const GENERAL_KEYS = ["error", "detail", "message", "title", "non_field_errors"];

/**
 * Diagnostics that travel beside a message and are not for the shopper.
 *
 * Google's reCAPTCHA codes are the reason this exists: a refused token comes
 * back as { error: "reCAPTCHA verification failed", details: ["invalid-input-response"] },
 * and the sweep below would otherwise append that code to the sentence. It
 * belongs in a log, not under a sign-up form.
 */
const DIAGNOSTIC_KEYS = ["details", "score", "retryAfter", "retry_after", "status", "code", "errors"];

const asSentences = (value) => {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
};

/**
 * A sentence that already names its own subject does not want a label in front
 * of it. "This password is too common." reads worse as "Password: This password
 * is too common."
 */
const namesItself = (label, sentence) =>
  sentence.toLowerCase().includes(label.toLowerCase());

/**
 * The two rewrites. DRF's uniqueness wording — "user with this email already
 * exists." — is accurate and unhelpful: it does not say what to do about it.
 */
const friendlier = (field, sentence) => {
  const lower = sentence.toLowerCase();
  if (!lower.includes("unique") && !lower.includes("already exists")) return sentence;
  if (field === "email") return "That email is already registered. Try signing in instead.";
  if (field === "username") return "That username is taken. Please choose another.";
  return sentence;
};

/**
 * What to tell the shopper, given the parsed body of a failed response.
 *
 * Returns a single string. Several problems at once are joined rather than
 * reduced to the first, because fixing one and resubmitting only to be told
 * about the next is the slowest way to learn what the form wants.
 */
/** "45 seconds", "3 minutes" — from a Retry-After header's seconds, or null. */
function waitFrom(retryAfter) {
  const seconds = Number.parseInt(retryAfter, 10);
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"}`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

/**
 * What the sign-in form says when /api/login refuses.
 *
 * A 429 is a lockout — the backend's (5 wrong passwords in 15 minutes, or 20
 * in an hour, refused even with the right password) or this storefront's own
 * limiter — and must never read as "wrong password". The backend explains
 * itself in `detail`, our limiter in `message`; either way the wait from
 * Retry-After is added when the message doesn't already give one.
 *
 * @param data      the parsed response body
 * @param response  the fetch Response, for its status and Retry-After
 */
export function loginErrorMessage(data, response) {
  if (response?.status === 429) {
    const said = data?.detail || data?.message || null;
    const wait = waitFrom(response.headers?.get?.("retry-after"));
    if (!said) {
      return wait
        ? `Too many sign-in attempts. Try again in ${wait}.`
        : "Too many sign-in attempts. Please wait a moment and try again.";
    }
    return wait && !/\d/.test(said) ? `${said} Try again in ${wait}.` : said;
  }
  return data?.error || data?.detail || "Login failed. Please try again.";
}

export function registrationErrorMessage(data, status) {
  if (typeof data === "string" && data.trim()) return data.trim();

  if (data && typeof data === "object") {
    const parts = [];

    for (const key of GENERAL_KEYS) {
      for (const sentence of asSentences(data[key])) parts.push(sentence);
    }

    for (const [field, label] of Object.entries(FIELD_LABELS)) {
      for (const sentence of asSentences(data[field])) {
        const friendly = friendlier(field, sentence);
        parts.push(namesItself(label, friendly) ? friendly : `${label}: ${friendly}`);
      }
    }

    // Anything the backend added that this file has never heard of. Shown
    // rather than swallowed — a new validator should reach the shopper without
    // waiting for a frontend release.
    for (const [key, value] of Object.entries(data)) {
      if (key in FIELD_LABELS || GENERAL_KEYS.includes(key)) continue;
      if (DIAGNOSTIC_KEYS.includes(key)) continue;
      for (const sentence of asSentences(value)) parts.push(sentence);
    }

    if (parts.length) return [...new Set(parts)].join(" ");
  }

  // Nothing usable in the body. Say what is known rather than guessing.
  if (status === 429) return "Too many attempts. Please wait a moment and try again.";
  if (status >= 500) return "Something went wrong at our end. Please try again shortly.";
  return "Registration failed. Please check your details and try again.";
}
