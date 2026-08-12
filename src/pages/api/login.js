import * as cookie from "cookie";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  adminCookieOptions,
  isAdminUsername,
  signAdminSession,
} from "@/app/lib/admin-auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    const url = `${process.env.NEXT_SOLANA_BACKEND_URL}/api/auth/login`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Store-Domain": process.env.NEXT_PUBLIC_STORE_DOMAIN,
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

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
    //
    // The username is trustworthy here precisely because the backend just
    // accepted these credentials — this is the one point in the flow where the
    // server knows who logged in without having to ask anything else.
    if (isAdminUsername(username)) {
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
