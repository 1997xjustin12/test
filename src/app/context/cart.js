"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import AddedToCartDialog from "@/app/components/atom/AddedToCartDialog";
import GuestBillingFormDialog from "@/app/components/atom/GuestBillingFormDialog";
import Cookies from "js-cookie";
import { getOrCreateSessionId } from "@/app/lib/session";
import { store_domain, mapOrderItems } from "@/app/lib/helpers";
import { sendAbandonedCart } from "@/app/lib/api";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

const ABANDONED_CART_SPAN = 5; // -> minuites

export const CartProvider = ({ children }) => {
  const ABANDON_TIMEOUT = ABANDONED_CART_SPAN * 60 * 1000;
  const [cart, setCart] = useState(null);
  const [cartStorage, setCartStorage] = useState(null);
  const [billingStorage, setBillingStorage] = useState(null);
  const [toggleBillingDialog, setToggleBillingDialog] = useState(false);
  const [preaddedItem, setPreaddedItem] = useState(null);
  // const [cartItems, setCartItems] = useState([]);
  // const [cartItemsCount, setCartItemsCount] = useState(0);
  const [loadingCartItems, setLoadingCartItems] = useState(true);
  const [addedToCart, setAddedToCart] = useState(null);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const sendAbandonedCartBeacon = (cart) => {
    if (!cart || !cart?.items || cart?.items?.length === 0) return;
    const url = "/api/abandoned-carts/create";
    const data = JSON.stringify(cart);

    navigator.sendBeacon(url, data);
  };

  // const createAbandonedCart = async (sendBeacon = false) => {
  //   if (!cartStorage) return;
  //   const cartObj = await cartStorage.getCart();
  //   if (!cartObj) return;
  //   const now = Date.now();
  //   const updatedAt = new Date(cartObj.updated_at).getTime();
  //   const timedout = now - updatedAt > ABANDON_TIMEOUT;
  //   if (cartObj?.cart_status !== "abandoned") {
  //     const sendCart = cartObj;
  //     sendCart["abandoned_cart_id"] = sendCart["id"];
  //     sendCart["items"] = mapOrderItems(formatItems(sendCart["items"]));
  //     console.log("[SENDCART]", sendCart);
  //     if (sendBeacon) {
  //       sendAbandonedCartBeacon(sendCart);
  //     } else {
  //       if (timedout) {
  //         sendAbandonedCart(sendCart);
  //       }
  //     }
  //     // if success
  //     cartObj["cart_status"] = "abandoned";
  //     await cartStorage.saveCart(cartObj);
  //   }
  // };

  const createAbandonedCart = async (sendBeacon = false) => {
    if (!cartStorage) return;

    const cartObj = await cartStorage.getCart();
    if (!cartObj) return;
    if (cartObj.cart_status === "abandoned") return;

    const updatedAt = new Date(cartObj.updated_at).getTime();
    const timedout = Date.now() - updatedAt > ABANDON_TIMEOUT;

    const sendCart = {
      ...cartObj,
      abandoned_cart_id: cartObj.id,
      items: mapOrderItems(formatItems(cartObj.items)),
    };

    // console.log("[SENDCART]", sendCart);

    if (sendBeacon) {
      sendAbandonedCartBeacon(sendCart);
    } else if (timedout) {
      sendAbandonedCart(sendCart);
    }

    cartObj.cart_status = "abandoned";
    await cartStorage.saveCart(cartObj);
  };

  useEffect(() => {
    const handleUnload = () => {
      console.log("[UNLOAD]");
      createAbandonedCart(true);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        console.log("[HIDDEN]");
        createAbandonedCart(true);
      }
    };

    if (typeof window === "undefined") return;

    let mounted = true;
    let tmp_billing = {};
    let tmp_cart = {};

    import("@/app/lib/billingStorage").then(async (billingModule) => {
      if (!mounted) return;
      tmp_billing = await billingModule.get();
      setBillingStorage(billingModule);
    });

    import("@/app/lib/cartStorage").then(async (module) => {
      if (!mounted) return;
      const cartObj = await module.getCart();
      // await module.saveCart(null);
      if (cartObj) {
        tmp_cart = { ...cartObj, tmp_billing };
        const newCart = await buildCartObject(tmp_cart);
        const items = newCart?.items || [];
        setCart(newCart);
        setLoadingCartItems(false);
        if (items.length > 0) {
          syncCartToCookie(items);
        }
        createAbandonedCart();
      }
      setCartStorage(module);
    });

    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mounted = false;
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!cartStorage) return;

    const activityEvents = ["click", "keydown", "scroll"];

    activityEvents.forEach((evt) => {
      document.addEventListener(evt, createAbandonedCart);
    });

    return () => {
      activityEvents.forEach((evt) => {
        document.removeEventListener(evt, createAbandonedCart);
      });
    };
  }, [cartStorage]);

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
    const billing_info = billingStorage
      ? (await billingStorage.get()) || null
      : null;
    const items = mapOrderItems(formatItems(cartObject?.items));
    syncCartToCookie(items);
    const { data } = await fetchOrderTotal({ items });
    const rebuild = {
      ...cartObject,
      sub_total: data?.sub_total,
      total_tax: data?.total_tax,
      total_shipping: data?.total_shipping,
      total_price: data?.total_price,
      ...(billing_info || {}),
    };
    // console.log("[REBUILD CART]", rebuild);
    setCart(rebuild);
    return rebuild;
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
      const now = new Date().toISOString();
      let _cartObj = {};
      if (Array.isArray(cartObj) || !cartObj) {
        // insert create cart here
        // step 1: get user billing info by triggering the billing form dialog
        console.log("[ATC CART]", cartObj);
        const billing_info = (await billingStorage.get()) || null;
        console.log("[ATC BI]", billing_info);
        if (billing_info) {
          _cartObj = createCartObj();
          _cartObj["created_at"] = now;
          _cartObj["updated_at"] = now;
        } else {
          setPreaddedItem(items);
          setToggleBillingDialog(true);
        }
      } else {
        _cartObj = cartObj;
        _cartObj["updated_at"] = now;

        if (_cartObj?.cart_status === "abandoned") {
          // if cart status is once abandoned then updated later.. then flip status to revived
          _cartObj.id = createCartId();
          _cartObj.cart_status = "revived";
        }
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
    const now = new Date().toISOString();
    const cartObj = await cartStorage.getCart();
    const items = cartObj?.items;
    const updatedItems = items.filter(
      (i) => i?.variants?.[0]?.sku !== item?.variants?.[0]?.sku
    );
    cartObj["items"] = updatedItems;
    cartObj["updated_at"] = now;
    if (cartObj?.cart_status === "abandoned") {
      // if cart status is once abandoned then updated later.. then flip status to revived
      cartObj.cart_status = "revived";
    }
    const newCart = await buildCartObject(cartObj);
    setCart(updatedItems.length === 0 ? null : newCart);
    cartStorage.saveCart(updatedItems.length === 0 ? null : newCart);
  };

  const increaseProductQuantity = async (item) => {
    const now = new Date().toISOString();
    const cartObj = await cartStorage.getCart();
    const savedItems = cartObj?.items;
    const updatedItems = [...savedItems, item];
    cartObj["items"] = updatedItems;
    cartObj["updated_at"] = now;
    if (cartObj?.cart_status === "abandoned") {
      // if cart status is once abandoned then updated later.. then flip status to revived
      cartObj.cart_status = "revived";
    }
    const newCart = await buildCartObject(cartObj);
    setCart((prev) => newCart);
    cartStorage.saveCart(newCart);
  };

  const decreaseProductQuantity = async (item) => {
    const now = new Date().toISOString();
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
      cartObj["updated_at"] = now;
      if (cartObj?.cart_status === "abandoned") {
        // if cart status is once abandoned then updated later.. then flip status to revived
        cartObj.cart_status = "revived";
      }
      const newCart = await buildCartObject(cartObj);
      setCart((prev) => newCart);
      cartStorage.saveCart(newCart);
    }
  };

  const clearCartItems = async () => {
    cartStorage.saveCart(null);
  };

  const handleCloseAddedToCart = () => {
    setAddedToCart(null);
  };

  const handleBillingDialogOnClose = (e) => {
    console.log("[handleBillingDialogOnClose]");
    console.log("[Product not Added To Cart]");
    setToggleBillingDialog(false);
    setAddToCartLoading(false);
  };

  const handleBillingDialogOnSave = async (billing_info) => {
    setToggleBillingDialog(false);
    // console.log("[handleBillingDialogOnSave]", billing_info);
    // console.log("[handleBillingDialogOnSave Item]", preaddedItem);
    if (preaddedItem) {
      await addToCart(preaddedItem);
    }
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
        const sku = item?.product_id;
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

    return cart?.items || [];
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
        fetchOrderTotal,
        addToCartLoading,
      }}
    >
      {children}
      <AddedToCartDialog data={addedToCart} onClose={handleCloseAddedToCart} />
      <GuestBillingFormDialog
        open={toggleBillingDialog}
        onClose={handleBillingDialogOnClose}
        onSave={handleBillingDialogOnSave}
      />
    </CartContext.Provider>
  );
};
