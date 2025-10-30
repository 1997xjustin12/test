import * as cookie from "cookie";

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
        'X-Store-Domain': process.env.NEXT_PUBLIC_STORE_DOMAIN,
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(400).json(data);
    }

    // login flag for middleware route control
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("isLoggedIn", "true", {
        httpOnly: false, // middleware can read this
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    );

    // res.setHeader(
    //   "Set-Cookie",
    //   cookie.serialize("refresh_token", data.refresh, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "strict",
    //     path: "/",
    //     maxAge: 60 * 60 * 24 * 7, // 7 days
    //   })
    // );

    res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
