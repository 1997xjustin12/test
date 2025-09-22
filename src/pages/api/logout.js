import * as cookie from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("isLoggedIn", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0), // delete cookie
    })
  );
  return res.status(200).json({ message: 'Logged out successfully' });
}
