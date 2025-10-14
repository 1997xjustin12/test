export const sendAbandonedCart = async(cart) => {
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
    console.warn("[ABANDONED CART] API error:", err);
  }
}


export const subscribe = async(email) => {
  try {
    if (!email) {
      console.warn("[email] Requied field missing.");
      return;
    }

    return await fetch("/api/subscribers/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email}),
    });

  } catch (err) {
    console.warn("[subscribe] API error:", err);
  }
}

export const unsubscribe = async(email) => {
  try {
    if (!email) {
      console.warn("[email] Requied field missing.");
      return;
    }

    return await fetch("/api/subscribers/unsubscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email}),
    });

  } catch (err) {
    console.warn("[unsubscribe] API error:", err);
  }
}