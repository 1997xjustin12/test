//  API functions that can be used for guest users
//  API functions for auth user can be found in context/auth.js

export const getProductsByIds = async (ids) => {
  try {
    if (!ids) {
      console.warn("[ids] Requied field missing.");
      return;
    }
    const uniqueIds = [...new Set(ids)];
    const query = uniqueIds.map((id) => `product_ids=${id}`).join("&");
    return await fetch(`/api/es/products-by-ids?${query}`);
  } catch (err) {
    console.warn("[unsubscribe] API error:", err);
  }
};

export const getReviewsByProductId = async (product_id) => {
  try {
    return await fetch(`/api/reviews/list?product_id=${product_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.warn("[productReviewList] API error:", err);
  }
};

export const sendAbandonedCart = async (cart) => {
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
};

export const subscribe = async (email) => {
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
      body: JSON.stringify({ email }),
    });
  } catch (err) {
    console.warn("[subscribe] API error:", err);
  }
};

export const unsubscribe = async (email) => {
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
      body: JSON.stringify({ email }),
    });
  } catch (err) {
    console.warn("[unsubscribe] API error:", err);
  }
};
