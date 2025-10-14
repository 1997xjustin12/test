"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import AddedToCartDialog from "@/app/components/atom/AddedToCartDialog";
import GuestBillingFormDialog from "@/app/components/atom/GuestBillingFormDialog";
import Cookies from "js-cookie";
import { getOrCreateSessionId } from "@/app/lib/session";
import { store_domain, mapOrderItems } from "@/app/lib/helpers";
import { sendAbandonedCart } from "@/app/lib/api";
import { useAuth } from "@/app/context/auth";
import { redisGet, redisSet } from "@/app/lib/redis";
import { usePathname, useRouter } from "next/navigation";
import { BASE_URL, createSlug } from "@/app/lib/helpers";
import GuestEmailDialog from "@/app/components/atom/GuestEmailCaptureDialog"



const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

const ABANDONED_CART_SPAN = 5; // -> minuites

export const CartProvider = ({ children }) => {
  const cart_channel = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const ABANDON_TIMEOUT = ABANDONED_CART_SPAN * 60 * 1000;
  const {
    loading,
    isLoggedIn,
    user,
    userCartGet,
    userCartCreate,
    userCartUpdate,
    userCartClose,
  } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartStorage, setCartStorage] = useState(null);
  const [loadingCartItems, setLoadingCartItems] = useState(true);
  const [addedToCart, setAddedToCart] = useState(null);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const notifyCartUpdate = (cartData = null) => {
    if (!cart_channel.current) return;

    cart_channel.current.postMessage({
      type: "CART_UPDATED",
      payload: cartData, // optional: send the updated cart
    });

    console.log("[CartContext] Broadcasted CART_UPDATED");
  };

  const sendAbandonedCartBeacon = (cart) => {
    if (!cart || !cart?.items || cart?.items?.length === 0) return;
    const url = "/api/abandoned-carts/create";
    const data = JSON.stringify(cart);

    navigator.sendBeacon(url, data);
  };

  const createAbandonedCart = async (cart_obj, user_obj, trigger = "timed") => {
    if (!cart_obj && !cart_obj?.id) return;
    if (!user_obj) return;

    const cart_items = cart_obj?.items ?? [];

    if (cart_items.length === 0) return;

    if (cart_obj?.abandoned_cart_id) return;

    const updatedAt = new Date(cart_obj.updated_at).getTime();

    const timedout = Date.now() - updatedAt > ABANDON_TIMEOUT;

    const sendCart = {
      ...cart_obj,
      abandoned_cart_id: cart_obj.id,
      items: mapOrderItems(cart_items),
      billing_address: user_obj?.profile?.billing_address,
      billing_city: user_obj?.profile?.billing_city,
      billing_country: user_obj?.profile?.billing_country,
      billing_email: user_obj?.email,
      billing_first_name: user_obj?.first_name,
      billing_last_name: user_obj?.last_name,
      billing_province: user_obj?.profile?.billing_state,
      billing_zip_code: user_obj?.profile?.billing_zip,
      shipping_address: user_obj?.profile?.shipping_address,
      shipping_city: user_obj?.profile?.shipping_city,
      shipping_country: user_obj?.profile?.shipping_country,
      shipping_email: user_obj?.email,
      shipping_first_name: user_obj?.first_name,
      shipping_last_name: user_obj?.last_name,
      shipping_province: user_obj?.profile?.shipping_state,
      shipping_zip_code: user_obj?.profile?.shipping_zip,
    };

    console.log("TRIGGERED ABANDONED CART BUT THIS FEATURE IS TEMPORARY DISABLED");
    // console.log("[createAbandonedCart]", sendCart);

    // if (trigger === "beacon") {
    //   console.log("TRIGGERED ABANDONED CART BEACON", cart_obj);
    //   await saveCart({...cart_obj, status:"abandoned"});
    //   sendAbandonedCartBeacon(sendCart);
    //   return;
    // }

    // let response = null;

    // if (trigger === "timed") {
    //   console.log("TRIGGERED ABANDONED CART TIMED [timedout]", timedout);
    //   if (timedout) {
    //     response = await sendAbandonedCart(sendCart);
    //   }
    // }

    // if (trigger === "forced") {
    //   console.log("TRIGGERED ABANDONED CART FORCED", response);
    //   response = await sendAbandonedCart(sendCart);
    // }

    // if(!response) return;

    // const {success, data} = await response.json(); 

    // if (success) {
    //   await saveCart({ ...cart, status: "abandoned" });
    // }

    // if(data?.error === ""){
      
    // }
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
    const items = cartObject?.items;
    syncCartToCookie(items);
    const { data } = await fetchOrderTotal({ items });
    const rebuild = {
      ...cartObject,
      sub_total: data?.sub_total,
      total_tax: data?.total_tax,
      total_shipping: data?.total_shipping,
      total_price: data?.total_price,
    };
    // setCart(rebuild);
    console.log("REBUILD", rebuild);

    return rebuild;
  };

  const userProfileToCart = (user = {}) => {
    return {
      billing_address: user?.profile?.billing_address,
      billing_city: user?.profile?.billing_city,
      billing_country: user?.profile?.billing_country,
      billing_email: user?.email,
      billing_first_name: user?.first_name,
      billing_last_name: user?.last_name,
      billing_phone: user?.profile?.phone,
      billing_province: user?.profile?.billing_state,
      billing_zip_code: user?.profile?.billing_zip,
      shipping_address: user?.profile?.shipping_address,
      shipping_city: user?.profile?.shipping_city,
      shipping_country: user?.profile?.shipping_country,
      shipping_email: user?.email,
      shipping_first_name: user?.first_name,
      shipping_last_name: user?.last_name,
      shipping_phone: user?.profile?.phone,
      shipping_province: user?.profile?.shipping_state,
      shipping_zip_code: user?.profile?.shipping_zip,
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

  function createOrderNumber() {
    const date = new Date();
    const y = date.getFullYear().toString().slice(-2);
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const h = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const s = String(date.getSeconds()).padStart(2, "0");
    const rand = Math.floor(Math.random() * 9000) + 1000; // 4-digit random
    return `SF-${y}${m}${d}${h}${min}${s}-${rand}`;
  }

  const createCartObj = async () => {
    const now = new Date().toISOString();
    return {
      id: createCartId(),
      tracking_number: createOrderNumber(),
      session_id: await getOrCreateSessionId(),
      user_agent: getUserAgent(),
      store_domain: store_domain,
      items: [],
      created_at: now,
      updated_at: now,
      status: "active",
    };
  };

  const mergeUserCartItems = async () => {
    if (!user) {
      return;
    }

    const guestCart = await getGuestCart();

    const toMerge = (guestCart?.items ?? []).filter((i) => !i?.merged);

    const getCart = await userCartGet();
    const userCart = getCart?.message
      ? null
      : {
          ...getCart,
          items: (getCart?.items || []).map((item) => ({
            ...item,
            ...(item?.custom_fields || {}),
          })),
        };

    if (toMerge.length === 0) {
      return {
        ...userCart,
        tracking_number: userCart?.tracking_number ?? createOrderNumber(),
      };
    }

    let newCart;

    if (userCart) {
      newCart = {
        ...userCart,
        items: [...(userCart.items ?? []), ...toMerge],
        updated_at: new Date().toISOString(),
        tracking_number: userCart?.tracking_number ?? createOrderNumber(),
      };
    } else {
      newCart = await createCartObj();
      const user_profile = userProfileToCart(user);
      newCart = {
        ...newCart,
        items: [...toMerge],
        ...user_profile,
        tracking_number: createOrderNumber(),
      };
      newCart = await userCartCreate(newCart);
    }

    let saved = null;
    const user_cart_items = userCart?.items || [];
    if (user_cart_items.length > 0) {
      saved = await userCartUpdate(newCart);
    } else {
      const user_profile = userProfileToCart(user);
      saved = await userCartCreate({ ...newCart, ...user_profile });
    }

    if (saved) {
      await cartStorage.saveCart({
        ...guestCart,
        items: (guestCart.items ?? []).map((item) => ({
          ...item,
          merged: true,
        })),
      });
    }

    return newCart;
  };

  const getGuestCart = async () => {
    return await cartStorage.getCart();
  };

  const getUserCart = async () => {
    return await mergeUserCartItems();
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
  const loadCart = useCallback(async () => {
    if (cartStorage && !loading) {
      setLoadingCartItems(true);
      const loadedCart = await getCart();
      console.log("[RELOAD CART]", loadedCart);
      const items = loadedCart?.items || [];
      setCart(loadedCart);
      syncCartToCookie(items);
      createAbandonedCart(loadedCart, user, "timed"); // timed
      setLoadingCartItems(false);
    }
  }, [cartStorage, loading, user, getCart, syncCartToCookie, createAbandonedCart]);

  const saveCart = async (newCart) => {
    if (isLoggedIn && user && user?.email) {
      await userCartUpdate(newCart);
    } else {
      await cartStorage.saveCart(newCart);
    }
  };

  const getOrCreateCart = async () => {
    return (await getCart()) ?? (await createCartObj());
  };

  const appendToMergeItems = (cart_items, new_item) => {
    if (!new_item || !new_item?.product_id || !new_item?.quantity) {
      console.log(
        "Invalid item passed to appendToMergeItems. Returning original cart."
      );
      return cart_items;
    }

    const existingItemIndex = cart_items.findIndex(
      (item) => item.product_id === new_item.product_id
    );
    if (existingItemIndex > -1) {
      const newCart = [...cart_items];
      newCart[existingItemIndex].quantity += new_item.quantity;
      newCart[existingItemIndex].custom_fields.quantity += new_item.quantity;
      return newCart;
    } else {
      const product_object = {
        product_id: new_item?.product_id,
        quantity: new_item?.quantity,
        handle: new_item?.handle,
        brand: new_item?.brand,
        title: new_item?.title,
        product_title: new_item?.title,
        product_link: `${store_domain}/${createSlug(new_item?.brand)}/product/${
          new_item?.handle
        }`,
        images: new_item?.images,
        ratings: new_item?.ratings,
        variants: new_item?.variants,
      };
      return [
        ...cart_items,
        {
          ...product_object,
          variant_data: new_item?.variants?.[0],
          custom_fields: product_object,
        },
      ];
    }
  };

  const addToCart = async (item) => {
    setAddToCartLoading(true);
    try {
      const cartObj = await getOrCreateCart();
      const cart_items = cartObj?.items || [];
      const injected_item = appendToMergeItems(cart_items, item);
      console.log("[addToCart][cartObj]", cartObj);
      const newCart = await buildCartObject({
        ...cartObj,
        items: injected_item,
      });

      if (newCart?.status === "abandoned") {
        newCart.status = "active";
        newCart.id = createCartId();
        newCart.tracking_number = createOrderNumber();
      }

      console.log("[NEWCART]2", newCart);

      setCart(newCart);
      if (cart_items.length === 0 && isLoggedIn) {
        const user_profile = userProfileToCart(user);
        await userCartCreate({ ...newCart, ...user_profile });
      } else {
        // update cart
        await saveCart(newCart);
      }

      notifyCartUpdate();
      setAddToCartLoading(false);
      setAddedToCart(item);
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
      (i) => i?.product_id !== item?.product_id
    );

    console.log("[removeCartItem] updatedItems", updatedItems);
    const newCart = await buildCartObject({
      ...cartObj,
      items: updatedItems,
      updated_at: new Date().toISOString(),
    });

    if (newCart?.status === "abandoned") {
      newCart.status = "active";
      newCart.id = createCartId();
      newCart.tracking_number = createOrderNumber();
    }

    setCart(newCart);
    if (newCart?.items.length === 0 && isLoggedIn) {
      await userCartClose();
    } else {
      await saveCart(newCart);
    }
    notifyCartUpdate();
  };

  const increaseProductQuantity = async (item) => {
    const cartObj = await getCart();
    const cart_items = cartObj?.items || [];
    if (!cartObj) return;
    const product_id = item?.product_id;
    if (!product_id) return;

    const updatedItems = updateQuantity(cart_items, item?.product_id, "+");
    console.log("increaseProductQuantity", updatedItems);
    const newCart = await buildCartObject({
      ...cartObj,
      items: updatedItems,
      updated_at: new Date().toISOString(),
    });

    if (newCart?.status === "abandoned") {
      newCart.status = "active";
      newCart.id = createCartId();
      newCart.tracking_number = createOrderNumber();
    }

    setCart(newCart);
    await saveCart(newCart);
    notifyCartUpdate();
  };

  function updateQuantity(cart_items, product_id, action) {
    return cart_items
      .map((item) => {
        if (item.product_id === product_id) {
          const updated_quantity =
            action === "+" ? item.quantity + 1 : item.quantity - 1;

          return {
            ...item,
            quantity: updated_quantity,
            custom_fields: {
              ...item.custom_fields,
              quantity: updated_quantity,
            },
          };
        }
        return item;
      })
      .filter((item) => item.quantity > 0); // remove if quantity <= 0
  }

  const decreaseProductQuantity = async (item) => {
    const cartObj = await getCart();
    if (!cartObj) return;
    console.log("[decrease]");
    const items = cartObj.items ?? [];
    const product_id = item?.product_id;

    if (!product_id) {
      return;
    }

    // Find the index of the first matching item
    const indexToRemove = items.findIndex((i) => i?.product_id === product_id);

    if (
      indexToRemove !== -1 &&
      items.find((i) => i?.product_id === product_id)?.quantity > 1
    ) {
      const updatedItems = updateQuantity(items, product_id, "-");
      console.log("[decrease][updatedItems]", updatedItems);
      const newCart = await buildCartObject({
        ...cartObj,
        items: updatedItems,
        updated_at: new Date().toISOString(),
      });

      if (newCart?.status === "abandoned") {
        newCart.status = "active";
        newCart.id = createCartId();
        newCart.tracking_number = createOrderNumber();
      }

      setCart(newCart);
      await saveCart(newCart);
      notifyCartUpdate();
    }
  };

  const clearCartItems = async () => {
    if (isLoggedIn && user) {
      await userCartClose();
    } else {
      await saveCart(null);
    }
    syncCartToCookie([]);
    notifyCartUpdate();
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    let mounted = true;

    import("@/app/lib/cartStorage").then(async (module) => {
      if (!mounted) return;
      setCartStorage(module);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!cartStorage) return;
    loadCart();
  }, [cartStorage, loading, isLoggedIn, user]);

  useEffect(() => {
    if(!cart || !user) return;

    const handleUnload = async () => {
      // console.log("AbandonedCart Event Unload");
      await createAbandonedCart(cart, user, "beacon");
    };

    const handleVisibilityChange = async () => {
      // console.log("AbandonedCart Event Visibility Hidden");
      if (document.visibilityState === "hidden") {
        await createAbandonedCart(cart, user, "beacon");
      }
    };

    const handleEvent = async () => {
      // console.log("AbandonedCart Event click, keydown and scroll");
      await createAbandonedCart(cart, user, "timed");
    }

    const activityEvents = ["click", "keydown", "scroll"];

    activityEvents.forEach((evt) => {
      document.addEventListener(evt, handleEvent);
    });

    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      activityEvents.forEach((evt) => {
        document.removeEventListener(evt, handleEvent);
      });
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [cart, user, createAbandonedCart]);

  const cartItems = useMemo(() => {
    if (!cart) return [];

    return cart?.items || [];
  }, [cart]);

  const cartItemsCount = useMemo(() => {
    if (!cartItems) return 0;

    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [cartItems]);

  useEffect(() => {
    console.log("[CART]", cart);
  }, [cart]);

  useEffect(() => {
    cart_channel.current = new BroadcastChannel("cart_channel");

    cart_channel.current.onmessage = (event) => {
      // console.log("[CartContext] Message received:", event.data);
      loadCart();
    };

    return () => {
      cart_channel.current?.close();
    };
  }, [loadCart]);

  return (
    <CartContext.Provider
      value={{
        cartObject: cart,
        cartItems,
        cartItemsCount,
        loadingCartItems,
        addToCart,
        clearCartItems,
        createAbandonedCart,
        decreaseProductQuantity,
        fetchOrderTotal,
        increaseProductQuantity,
        mergeUserCartItems,
        removeCartItem,
        loadCart,
        addToCartLoading,
      }}
    >
      {children}
      <AddedToCartDialog data={addedToCart} onClose={handleCloseAddedToCart} />
      <GuestEmailDialog isLoggedIn={isLoggedIn} cart={cart}/>
    </CartContext.Provider>
  );
};
