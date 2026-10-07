import * as cookie from "cookie";
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  adminCookieOptions,
  isAdminUser,
  signAdminSession,
} from "@/app/lib/admin-auth";

/**
 * GET /api/profile — the signed-in person's profile, and the one place the
 * admin session gets renewed.
 *
 * The admin cookie lasts eight hours and used to be minted only at login,
 * while the storefront session renews itself every ten minutes for as long as
 * the refresh token lives. So an admin stayed signed in to the shop and
 * quietly lost /admin after eight hours — no sign-out, no prompt, just a 404
 * and a Store Admin link that had vanished. Signing out and back in was the
 * only way back, which is not a thing anyone would guess.
 *
 * Renewing it here is safe because this is the point where the session has
 * just been proven: the backend validated the bearer token and told us who it
 * belongs to. That is the same basis login had. The allowlist is still checked
 * per request, so revoking someone's access still takes effect immediately —
 * this only stops the cookie ageing out from under someone who is still using
 * the site.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const url = `${process.env.NEXT_SOLANA_BACKEND_URL}/api/auth/profile`;

     // Read authorization header from the incoming request
    const authHeader = req.headers.authorization;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'X-Store-Domain': process.env.NEXT_PUBLIC_STORE_DOMAIN,
        ...(authHeader ? { Authorization: authHeader } : {}), // forward bearer token if exists
      },
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text(); // fallback
      // The upstream body is a diagnostic, not something to hand back: the
      // backend answers with Django debug pages, which carry its traceback,
      // local variables, request headers and settings.
      console.error("profile: upstream returned a non-JSON response:", text.slice(0, 500));
      return res.status(500).json({ message: 'Invalid JSON response' });
    }

    const data = await response.json();

    // A valid session, for someone who is an admin right now: push the cookie's
    // expiry out so it tracks the session instead of the login.
    if (response.ok && data?.username && (await isAdminUser(data.username))) {
      try {
        res.setHeader(
          "Set-Cookie",
          cookie.serialize(ADMIN_COOKIE, await signAdminSession(data.username), {
            ...adminCookieOptions(),
            maxAge: ADMIN_COOKIE_MAX_AGE,
          }),
        );
      } catch (err) {
        // A misconfigured signing secret must not break the profile request.
        // The admin simply does not get renewed, which is the safe direction.
        console.error("[profile] could not renew the admin session:", err.message);
      }
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ message: 'Proxy request failed', error: error.message });
  }
}