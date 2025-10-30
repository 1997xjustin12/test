export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const { 
    product,
    rating,
    title,
    comment,
    id
   } = req.body;

  if (!id || !product || !rating || !title || !comment) {
    return res.status(400).json({ error: "[id, product, rating, title, comment] Missing required fields" });
  }

  try {
    const authHeader = req.headers.authorization;
    const url = `${process.env.NEXT_SOLANA_BACKEND_URL}/api/reviews/${id}/update`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Store-Domain": process.env.NEXT_PUBLIC_STORE_DOMAIN,
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(req.body),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      return res
        .status(500)
        .json({ success: false, message: "Invalid JSON response", raw: text });
    }

    const data = await response.json();

    return res.status(response.status).json({
      success: response.ok,
      data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Proxy request failed",
        error: error.message,
      });
  }
}
