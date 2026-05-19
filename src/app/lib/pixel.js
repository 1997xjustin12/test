export const pixelViewContent = ({ id, name, price }) => {
  window.fbq?.("track", "ViewContent", {
    content_ids: [String(id)],
    content_name: name,
    content_type: "product",
    value: price,
    currency: "USD",
  });
};

export const pixelAddToCart = ({ id, name, price, quantity = 1 }) => {
  window.fbq?.("track", "AddToCart", {
    content_ids: [String(id)],
    content_name: name,
    content_type: "product",
    value: parseFloat(price) * quantity,
    currency: "USD",
  });
};

export const pixelInitiateCheckout = ({ value, numItems }) => {
  window.fbq?.("track", "InitiateCheckout", {
    value,
    currency: "USD",
    num_items: numItems,
  });
};

export const pixelPurchase = ({ value, orderId, items = [] }) => {
  window.fbq?.("track", "Purchase", {
    value,
    currency: "USD",
    content_ids: items.map((i) => String(i.product_id || i.id || "")),
    content_type: "product",
    order_id: String(orderId || ""),
  });
};
