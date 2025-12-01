export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { new_password, token, uidb64 } = req.body;

  if (!new_password || !token || !uidb64) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const url = `${process.env.NEXT_SOLANA_BACKEND_URL}/api/auth/reset-password`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Store-Domain": process.env.NEXT_PUBLIC_STORE_DOMAIN,
        Accept: "application/json",
      },
      body: JSON.stringify({
        new_password,
        token,
        uidb64,
      }),
    });

    const data = await response.json();

    if (!response?.ok) {
      return res.status(response.status).json({
        error: data,
      });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
