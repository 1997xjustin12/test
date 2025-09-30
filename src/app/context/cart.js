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
import { useAuth } from "@/app/context/auth";
import { redisGet, redisSet } from "@/app/lib/redis";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

const ABANDONED_CART_SPAN = 5; // -> minuites

export const CartProvider = ({ children }) => {
  const ABANDON_TIMEOUT = ABANDONED_CART_SPAN * 60 * 1000;
  const { loading, isLoggedIn, user } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartStorage, setCartStorage] = useState(null);
  const [loadingCartItems, setLoadingCartItems] = useState(true);
  const [addedToCart, setAddedToCart] = useState(null);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const sendAbandonedCartBeacon = (cart) => {
    if (!cart || !cart?.items || cart?.items?.length === 0) return;
    const url = "/api/abandoned-carts/create";
    const data = JSON.stringify(cart);

    navigator.sendBeacon(url, data);
  };

  const createAbandonedCart = async (sendBeacon = false) => {
    if (loading) return;
    if (!isLoggedIn) return;
    if (!user) return;

    const cartObj = await getCart();

    if (!cartObj) return;
  
    if (cartObj.cart_status === "abandoned") return;

    const updatedAt = new Date(cartObj.updated_at).getTime();

    const timedout = Date.now() - updatedAt > ABANDON_TIMEOUT;

    const sendCart = {
      ...cartObj,
      abandoned_cart_id: cartObj.id,
      items: mapOrderItems(formatItems(cartObj.items)),
    };

    if (sendBeacon) {
      sendAbandonedCartBeacon(sendCart);
    } else if (timedout) {
      sendAbandonedCart(sendCart);
    }

    cartObj.cart_status = "abandoned";
    await saveCart(cartObj);
  };

  async function syncCartToCookie(items) {
    try {
      Cookies.set(
        "cart",
        JSON.stringify(items.map(({ product_id }) => product_id)),
        {
          path: "/",
          sameSite: "lax",
        }
      );
      // Verify
      // const cart_check = JSON.parse(Cookies.get("cart") || "[]");
      // console.log("[Cookie check]", cart_check);
    } catch (error) {
      console.log("[SYNC CART TO COOKIE]", error);
    }
  }

  const buildCartObject = async (cartObject) => {
    if (!cartObject) return null;
    if (!cartObject?.items) return null;
    const items = mapOrderItems(formatItems(cartObject?.items));
    syncCartToCookie(items);
    const { data } = await fetchOrderTotal({ items });
    const rebuild = {
      ...cartObject,
      sub_total: data?.sub_total,
      total_tax: data?.total_tax,
      total_shipping: data?.total_shipping,
      total_price: data?.total_price,
    };
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

  const createCartObj = async () => {
    const now = new Date().toISOString();
    return {
      id: createCartId(),
      session_id: await getOrCreateSessionId(),
      user_agent: getUserAgent(),
      store_domain: store_domain,
      items: [],
      created_at: now,
      updated_at: now,
      cart_status: "active",
    };
  };

  const mergeGuestToLoggedInUser = async () => {
    console.log("[mergeGuestToLoggedInUser]");
    if (!user) {
      console.log("[mergeGuestToLoggedInUser] Not Merged: No User");
      return;
    }

    const guestCart = await getGuestCart();

    const toMerge = (guestCart?.items ?? []).filter((i) => !i?.merged);

    if (toMerge.length === 0) {
      console.log("[mergeGuestToLoggedInUser] Not Merged: No new items that needs merging");
      return;
    };

    console.log("[mergeGuestToLoggedInUser] Processing Merge");
    const userKey = `user:${user.email}`;
    const userObj = await redisGet(userKey);
    const userCart = userObj?.cart || null;

    let newCart;

    if(userCart){
      newCart = {
        ...userCart,
        items: [...(userCart.items ?? []), ...toMerge],
        updated_at: new Date().toISOString(),
      };
    }else{
      newCart = createCartObj();
      newCart = {
        ...newCart,
        items: [...toMerge],
      }
    }

    const saveUserCart = userObj ? {...userObj, cart: newCart} : {cart:newCart};
    const save = await redisSet(userKey, saveUserCart);

    if (save?.success) {
      await cartStorage.saveCart({
        ...guestCart,
        items: (guestCart.items ?? []).map((item) => ({ ...item, merged: true }))
      });
      loadCart();
    }
  };

  const getGuestCart = async () => {
    return await cartStorage.getCart();
  };

  const getUserCart = async () => {
    const redis_user = await redisGet(`user:${user?.email}`);
    const redis_cart = redis_user?.cart || null;
    return redis_cart;
  };

  const getCart = async () => {
    if (cartStorage && !loading) {
      if (isLoggedIn && user) {
        return await getUserCart();
      } else {
        return await getGuestCart();
      }
    }
  };

  // load cart to state
  const loadCart = async () => {
    if (cartStorage && !loading) {
      console.log("[RELOAD CART]")
      setLoadingCartItems(true);
      const loadedCart = await getCart();
      const items = loadedCart?.items || [];
      setCart(loadedCart);
      syncCartToCookie(items);
      // createAbandonedCart();
      setLoadingCartItems(false);
    }
  };

  const saveCart = async (newCart) => {
    console.log("[SAVECART]", newCart);
    if (isLoggedIn && user && user?.email) {
      // save to redis
      const redis_key = `user:${user.email}`;
      const redis_user = await redisGet(redis_key);
      redis_user["cart"] = newCart;
      await redisSet(`user:${user.email}`, redis_user);
    } else {
      // save to localforage
      await cartStorage.saveCart(newCart);
    }
  };

  const getOrCreateCart = async () => {
    return (await getCart()) ?? (await createCartObj());
  };

  const addToCart = async (items) => {
    setAddToCartLoading(true);
    try {
      const cartObj = await getOrCreateCart();

      const newCart = await buildCartObject({
        ...cartObj,
        items: [...(cartObj?.items ?? []), ...(items ?? [])],
      });

      setCart(newCart);
      await saveCart(newCart);

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
    const cartObj = await getCart();
    if (!cartObj) return;

    const updatedItems = (cartObj.items ?? []).filter(
      (i) => i?.variants?.[0]?.sku !== item?.variants?.[0]?.sku
    );

    const newCart = await buildCartObject({
      ...cartObj,
      items: updatedItems,
      updated_at: new Date().toISOString(),
    });

    setCart(newCart);
    await saveCart(newCart);
  };

  const increaseProductQuantity = async (item) => {
    const cartObj = await getCart();
    if (!cartObj) return;

    const updatedItems = [...(cartObj.items ?? []), item];

    const newCart = await buildCartObject({
      ...cartObj,
      items: updatedItems,
      updated_at: new Date().toISOString(),
    });

    setCart(newCart);
    await saveCart(newCart);
  };

  const decreaseProductQuantity = async (item) => {
    const cartObj = await getCart();
    if (!cartObj) return;

    const items = cartObj.items ?? [];
    const sku = item?.variants?.[0]?.sku;

    // Find the index of the first matching item
    const indexToRemove = items.findIndex((i) => i?.variants?.[0]?.sku === sku);

    // Only remove if there’s more than 1 of that SKU
    if (
      indexToRemove !== -1 &&
      items.filter((i) => i?.variants?.[0]?.sku === sku).length > 1
    ) {
      const updatedItems = items.filter((_, idx) => idx !== indexToRemove);

      const newCart = await buildCartObject({
        ...cartObj,
        items: updatedItems,
        updated_at: new Date().toISOString(),
      });

      setCart(newCart);
      await saveCart(newCart);
    }
  };

  const clearCartItems = async () => {
    syncCartToCookie([]);
    saveCart(null);
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
    if (!items || items.length === 0) {
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

  useEffect(() => {
    // const handleUnload = () => {
    //   console.log("[UNLOAD] trigger abandoned cart");
    //   createAbandonedCart(true);
    // };

    // const handleVisibilityChange = () => {
    //   if (document.visibilityState === "hidden") {
    //     console.log("[HIDDEN] trigger abandoned cart");
    //     createAbandonedCart(true);
    //   }
    // };

    if (typeof window === "undefined") return;

    let mounted = true;

    import("@/app/lib/cartStorage").then(async (module) => {
      if (!mounted) return;
      setCartStorage(module);
    });

    // window.addEventListener("beforeunload", handleUnload);
    // document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mounted = false;
      // window.removeEventListener("beforeunload", handleUnload);
      // document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // useEffect(() => {
  //   if (!cartStorage) return;

  //   const activityEvents = ["click", "keydown", "scroll"];

  //   activityEvents.forEach((evt) => {
  //     document.addEventListener(evt, createAbandonedCart);
  //   });

  //   return () => {
  //     activityEvents.forEach((evt) => {
  //       document.removeEventListener(evt, createAbandonedCart);
  //     });
  //   };
  // }, [cartStorage]);

  useEffect(() => {
    if(cartStorage && !loading && isLoggedIn && user){
      mergeGuestToLoggedInUser();
    }
    loadCart();
  }, [cartStorage, loading, isLoggedIn, user]);


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
        decreaseProductQuantity,
        fetchOrderTotal,
        increaseProductQuantity,
        mergeGuestToLoggedInUser,
        removeCartItem,
        loadCart,
        addToCartLoading,
      }}
    >
      {children}
      <AddedToCartDialog data={addedToCart} onClose={handleCloseAddedToCart} />
    </CartContext.Provider>
  );
};
