export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    email,
    username,
    last_name,
    first_name,
    password,
    password2,
    recaptchaToken,
  } = req.body;

  if (
    !email ||
    !username ||
    !first_name ||
    !last_name ||
    !password ||
    !password2
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Verify reCAPTCHA v3 token
  if (!recaptchaToken) {
    return res.status(400).json({ error: "reCAPTCHA token is required" });
  }

  try {
    // Verify reCAPTCHA token with Google
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      }
    );

    const recaptchaData = await recaptchaResponse.json();

    // Check if reCAPTCHA verification was successful
    if (!recaptchaData.success) {
      return res.status(400).json({
        error: "reCAPTCHA verification failed",
        details: recaptchaData["error-codes"],
      });
    }

    // Check reCAPTCHA v3 score (0.0 - 1.0, higher is better)
    // Scores below 0.5 are typically considered suspicious
    if (recaptchaData.score < 0.5) {
      return res.status(400).json({
        error: "reCAPTCHA score too low. Please try again.",
        score: recaptchaData.score,
      });
    }

    // Verify the action matches what we expect
    if (recaptchaData.action !== "register") {
      return res.status(400).json({
        error: "Invalid reCAPTCHA action",
      });
    }

    try {
      const url = `${process.env.NEXT_SOLANA_BACKEND_URL}/api/auth/register`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Api-Key ${process.env.NEXT_SOLANA_BACKEND_KEY}`,
          "X-Store-Domain": process.env.NEXT_PUBLIC_STORE_DOMAIN,
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          last_name,
          first_name,
          password,
          password2,
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
  } catch (err) {
    console.error("reCAPTCHA verification error:", err);
    res.status(500).json({ error: "reCAPTCHA verification failed" });
  }
}
