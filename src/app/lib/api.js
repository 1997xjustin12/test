export const sendAbandonedCart= async(cart) => {
  try {
    if (!cart || !cart.id) {
      console.warn("[ABANDONED CART] No valid cart to send");
      return;
    }

    const response = await fetch("/api/abandoned-carts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
    });

    if (!response.ok) {
    //   throw new Error(`Failed with status ${response.status}`);
        console.log("[ABANDONED CART] API error:", err);
    }

    const data = await response.json();
    console.log("[ABANDONED CART] API success:", data);
    return data;
  } catch (err) {
    console.error("[ABANDONED CART] API error:", err);
  }
}