import * as cookie from 'cookie';
import { ADMIN_COOKIE, adminCookieOptions } from "@/app/lib/admin-auth";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  res.setHeader("Set-Cookie", [
    cookie.serialize("isLoggedIn", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0), // delete cookie
    }),
    // Logging out has to drop admin access too, or signing out of the
    // storefront would leave a working admin session behind it.
    cookie.serialize(ADMIN_COOKIE, "", {
      ...adminCookieOptions(),
      expires: new Date(0),
    }),
  ]);
  return res.status(200).json({ message: 'Logged out successfully' });
}
