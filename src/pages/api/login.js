import { withAuthRateLimit } from "@/app/lib/rate-limit";
import { backendHeaders, forwardRetryAfter } from "@/app/lib/backend-headers";
import * as cookie from "cookie";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  adminCookieOptions,
  isAdminUser,
  signAdminSession,
} from "@/app/lib/admin-auth";

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    const url = `${process.env.NEXT_SOLANA_BACKEND_URL}/api/auth/login`;

    // Not signed in yet, so the storefront key and the visitor's address: the
    // backend's wrong-password lockout counts per visitor + username.
    const response = await fetch(url, {
      method: "POST",
      headers: backendHeaders(req, { bearer: null }),
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json().catch(() => ({}));

    // A lockout (5 wrong passwords in 15 minutes, or 20 in an hour) is a 429
    // that refuses even the right password until the window passes. It goes to
    // the browser as itself — the backend's message in `detail` plus
    // Retry-After — not as a 400, which the form would show as a wrong password.
    if (response.status === 429) {
      forwardRetryAfter(response, res);
      return res.status(429).json(data);
    }

    // Return, rather than falling through: without this a rejected login sent a
    // 400 and then tried to send a 200 with a session cookie on top of it.
    if (!response?.ok) {
      return res.status(400).json(data);
    }

    const cookies = [
      // login flag for middleware route control
      cookie.serialize("isLoggedIn", "true", {
        httpOnly: false, // middleware can read this
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }),
    ];

    // Admins additionally get a signed, httpOnly cookie naming them, which is
    // what /admin and the admin APIs actually check. Minted only for
    // allowlisted usernames, so an ordinary shopper's browser never holds one.
    // The allowlist is ADMIN_USERNAMES plus the grants from /admin/admin-users,
    // so someone granted access there can sign in without a redeploy.
    //
    // The username is trustworthy here precisely because the backend just
    // accepted these credentials — this is the one point in the flow where the
    // server knows who logged in without having to ask anything else.
    if (await isAdminUser(username)) {
      try {
        cookies.push(
          cookie.serialize(ADMIN_COOKIE, await signAdminSession(username), {
            ...adminCookieOptions(),
            maxAge: ADMIN_COOKIE_MAX_AGE,
          }),
        );
      } catch (err) {
        // A misconfigured signing secret must not break ordinary logins; the
        // admin simply does not get in, which is the safe direction to fail.
        console.error("[login] Could not issue admin session:", err.message);
      }
    }

    res.setHeader("Set-Cookie", cookies);

    return res.status(200).json(data);
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Throttled: see lib/rate-limit.js. Credential endpoints had no limit of any
 * kind, so the only bound on guessing was how fast the backend could answer.
 */
export default withAuthRateLimit(handler, (req) => req.body?.username);
