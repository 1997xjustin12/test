//  API functions that can be used for guest users
//  API functions for auth user can be found in context/auth.js

export const getProductsByIds = async (ids) => {
  try {
    if (!ids) {
      return;
    }
    const uniqueIds = [...new Set(ids)];
    const query = uniqueIds.map((id) => `product_ids=${id}`).join("&");
    return await fetch(`/api/es/products-by-ids?${query}`);
  } catch (err) {
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
  }
};

export const sendAbandonedCart = async (cart) => {
  try {
    if (!cart) {
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
  }
};

export const subscribe = async (email) => {
  try {
    if (!email) {
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
  }
};

export const unsubscribe = async (email) => {
  try {
    if (!email) {
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
  }
};

// redis
export const redisGet = async (key) => {
  try {
    if (!key) {
      return;
    }

    return await fetch(`/api/redis/?key=${key}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
  }
};


export const redisSet = async ({key, value}) => {
  try {
    if (!key || !value) {
      return;
    }

    return await fetch("/api/redis/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key, value }),
    });
  } catch (err) {
  }
};