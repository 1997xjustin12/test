export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const url = `${process.env.NEXT_SOLANA_BACKEND_URL}/api/orders/get-total`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Store-Domain": process.env.NEXT_PUBLIC_STORE_DOMAIN,
      },
      body: JSON.stringify(req.body),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      // The upstream body is a diagnostic, not something to hand back: the
      // backend answers with Django debug pages, which carry its traceback,
      // local variables, request headers and settings.
      console.error("orders/get-total: upstream returned a non-JSON response:", text.slice(0, 500));
      return res
        .status(500)
        .json({ success: false, message: "Invalid JSON response" });
    }

    const data = await response.json();

    return res.status(response.status).json({
      success: response?.ok,
      data,
    });
  } catch (error) {
    console.error("Proxy Error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Proxy request failed",
        error: error.message,
      });
  }
}
