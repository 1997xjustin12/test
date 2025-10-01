export const sendAbandonedCart= async(cart) => {
  try {
    if (!cart) {
      console.warn("[ABANDONED CART] No valid cart to send");
      return;
    }

    return await fetch("/api/abandoned-carts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
    });

  } catch (err) {
    // console.error("[ABANDONED CART] API error:", err);
  }
}