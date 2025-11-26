import gateway from "@/app/lib/braintree";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { paymentMethodNonce, amount, nonce, recaptchaToken } = req.body;

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
    if (recaptchaData.action !== "checkout") {
      return res.status(400).json({
        error: "Invalid reCAPTCHA action",
      });
    }

    // Proceed with payment if reCAPTCHA validation passed
    const result = await gateway.transaction.sale({
      amount,
      paymentMethodNonce: nonce,
      options: { submitForSettlement: true },
    });

    if (result.success) {
      res.status(200).json({ success: true, transaction: result.transaction });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error("Transaction error:", error);
    res.status(500).json({ error: "Transaction failed" });
  }
}