"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import AddedToCartDialog from "@/app/components/atom/AddedToCartDialog";
import Cookies from "js-cookie";
import { getOrCreateSessionId } from "@/app/lib/session";
import { store_domain, mapOrderItems } from "@/app/lib/helpers";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartStorage, setCartStorage] = useState(null);
  // const [cartItems, setCartItems] = useState([]);
  // const [cartItemsCount, setCartItemsCount] = useState(0);
  const [loadingCartItems, setLoadingCartItems] = useState(true);
  const [addedToCart, setAddedToCart] = useState(null);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let mounted = true;

    import("@/app/lib/cartStorage").then(async (module) => {
      if (!mounted) return;
      const cartObj = await module.getCart();
      const newCart = await buildCartObject(cartObj);
      const items = newCart?.items || [];
      setCart(newCart);
      setLoadingCartItems(false);
      if (items.length > 0) {
        syncCartToCookie(items);
      }
      setCartStorage(module);
    });

    return () => {
      mounted = false;
    };
  }, []);


  async function syncCartToCookie(items) {
    try {
      // Save to cookie (client + server readable)
      Cookies.set(
        "cart",
        JSON.stringify(items.map(({ product_id }) => product_id)),
        {
          path: "/",
          sameSite: "lax", // works cross-page, avoids blocking
        }
      );
      // Verify
      const cart_check = JSON.parse(Cookies.get("cart") || "[]");
      console.log("[Cookie check]", cart_check);
    } catch (error) {
      console.log("[SYNCCARTOCOOKIE]", error);
    }
  }

  const buildCartObject = async (cartObject) => {
    if (!cartObject) return null;
    if (!cartObject?.items) return null;
    const items = mapOrderItems(formatItems(cartObject?.items));
    syncCartToCookie(items);
    const { data } = await fetchOrderTotal({ items });
    return {
      ...cartObject,
      sub_total: data?.sub_total,
      total_tax: data?.total_tax,
      total_shipping: data?.total_shipping,
      total_price: data?.total_price,
    };
  };

  function getUserAgent() {
    if (typeof navigator !== "undefined") {
      return navigator.userAgent;
    }
    return null; // SSR-safe
  }

  function createCartId() {
    if (typeof window === "undefined") return null;
    return crypto.randomUUID();
  }

  const createCartObj = () => {
    return {
      id: createCartId(),
      session_id: getOrCreateSessionId(),
      user_agent: getUserAgent(),
      store_domain: store_domain,
      items: [],
    };
  };
  // Function to add to cart and update cart count
  // item param must be an array
  const addToCart = async (items) => {
    setAddToCartLoading(true);
    // getCart everytime we add or remove items
    try {
      const cartObj = await cartStorage.getCart();
      let _cartObj = {};
      if (Array.isArray(cartObj) || !cartObj) {
        _cartObj = createCartObj();
      } else {
        _cartObj = cartObj;
      }
      const updatedItems = [..._cartObj?.items, ...items];
      _cartObj.items = updatedItems;
      const newCart = await buildCartObject(_cartObj);
      setCart((prev) => newCart);
      cartStorage.saveCart(newCart);
      setAddToCartLoading(false);
      setAddedToCart(items);
      return {
        code: 200,
        status: "success",
        message: "Successfully added items to cart.",
      };
    } catch (error) {
      return {
        code: 500,
        status: "error",
        message: "Error added items to cart.",
      };
    }
  };

  const removeCartItem = async (item) => {
    const cartObj = await cartStorage.getCart();
    const items = cartObj?.items;
    const updatedItems = items.filter(
      (i) => i?.variants?.[0]?.sku !== item?.variants?.[0]?.sku
    );
    cartObj["items"] = updatedItems;
    const newCart = await buildCartObject(cartObj);
    setCart(updatedItems.length === 0 ? null : newCart);
    cartStorage.saveCart(updatedItems.length === 0 ? null : newCart);
  };

  const increaseProductQuantity = async (item) => {
    const cartObj = await cartStorage.getCart();
    const savedItems = cartObj?.items;
    const updatedItems = [...savedItems, item];
    cartObj["items"] = updatedItems;
    const newCart = await buildCartObject(cartObj);
    setCart((prev) => newCart);
    cartStorage.saveCart(newCart);
  };

  const decreaseProductQuantity = async (item) => {
    const cartObj = await cartStorage.getCart();
    const savedItems = cartObj?.items;
    const tmpCartItems = savedItems;
    const idToFindAndPop = item?.variants?.[0].sku;
    if (
      tmpCartItems.filter((i) => i?.variants?.[0].sku === idToFindAndPop)
        .length > 1
    ) {
      const indexToRemove = tmpCartItems.findIndex(
        (i2) => i2?.variants?.[0].sku === idToFindAndPop
      );

      if (indexToRemove !== -1) {
        // Use pop() to remove the item at that index
        tmpCartItems.splice(indexToRemove, 1); // Removes 1 element at the found index
      }
      // update cart only if > 1
      cartObj["items"] = tmpCartItems;
      updateCart(cartObj);
    }
  };

  const updateCart = (cartObj) => {
    const items = cartObj?.items;
    cartStorage.saveCart(cartObj);
    setCartItemsCount(items.length);
    setCartItems([...items]);
  };

  const clearCartItems = async () => {
    setCartItems([]);
    cartStorage.saveCart([]);
  };

  const handleCloseAddedToCart = () => {
    setAddedToCart(null);
  };

  const fetchOrderTotal = async (orderData) => {
    try {
      const response = await fetch("/api/orders/get-total", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Frontend Fetch Error:", error);
      return { success: false, message: error.message };
    }
  };

  const formatItems = (items) => {
    if (items.length === 0) {
      return [];
    }

    return Object.values(
      items.reduce((acc, item) => {
        const sku = item?.variants?.[0]?.sku;
        if (!acc[sku]) {
          acc[sku] = { ...item, count: 0 };
        }
        acc[sku].count += 1;
        return acc;
      }, {})
    ).sort((a, b) => a.title.localeCompare(b.title));
  };

  const cartItems = useMemo(() => {
    if (!cart) return [];

    return cart?.items;
  }, [cart]);

  const cartItemsCount = useMemo(() => {
    if (!cart) return 0;

    return cart?.items?.length || 0;
  }, [cart]);

  const formattedCart = useMemo(() => {
    return formatItems(cartItems);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartObject: cart,
        cartItems,
        cartItemsCount,
        formattedCart,
        loadingCartItems,
        addToCart,
        clearCartItems,
        increaseProductQuantity,
        decreaseProductQuantity,
        removeCartItem,
        updateCart,
        fetchOrderTotal,
        addToCartLoading,
      }}
    >
      {children}
      <AddedToCartDialog data={addedToCart} onClose={handleCloseAddedToCart} />
    </CartContext.Provider>
  );
};
