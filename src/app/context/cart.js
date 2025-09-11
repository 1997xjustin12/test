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

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartStorage, setCartStorage] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [loadingCartItems, setLoadingCartItems] = useState(true);
  const [addedToCart, setAddedToCart] = useState(null);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    if (typeof window === "undefined") return;

    let mounted = true;

    import("@/app/lib/cartStorage").then(async (module) => {
      if (!mounted) return;

      const cartItems = await module.getCart();
      setCartItems(cartItems);
      setCartItemsCount(cartItems.length);
      setLoadingCartItems(false);

      // ✅ Only sync if cart has items
      if (cartItems.length > 0) {
        syncCartToCookie(cartItems);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  async function syncCartToCookie() {
    try {
      const cart = (await cartStorage.getCart()) || [];
      console.log("[syncCartToCookie] cart", cart);

      // Save to cookie (client + server readable)
      Cookies.set(
        "cart",
        JSON.stringify(cart.map(({ product_id }) => product_id)),
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

  // Function to add to cart and update cart count
  // item param must be an array
  const addToCart = async (items) => {
    setAddToCartLoading(true);
    // getCart everytime we add or remove items
    try {
      const savedItems = await cartStorage.getCart();
      await sleep(2000);
      const updatedItems = [...savedItems, ...items];
      cartStorage.saveCart(updatedItems);
      setCartItems((prev) => {
        return [...updatedItems];
      });
      setCartItemsCount(updatedItems.length);
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
    // getCart everytime we add or remove items
    const items = await cartStorage.getCart();
    setCartItems((prev) => {
      const updatedItems = items.filter(
        (i) => i?.variants?.[0]?.sku !== item?.variants?.[0]?.sku
      );
      cartStorage.saveCart(updatedItems);
      setCartItemsCount(updatedItems.length);
      return [...updatedItems];
    });
  };

  const increaseProductQuantity = async (item) => {
    const savedItems = await cartStorage.getCart();
    // await sleep(2000);
    setCartItems((prev) => {
      const updatedItems = [...savedItems, item];
      cartStorage.saveCart(updatedItems);
      setCartItemsCount(updatedItems.length);
      return [...updatedItems];
    });
  };

  const decreaseProductQuantity = async (item) => {
    const savedItems = await cartStorage.getCart();
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
      updateCart(tmpCartItems);
    }
  };

  const updateCart = (items) => {
    cartStorage.saveCart([...items]);
    setCartItemsCount(items.length);
    setCartItems([...items]);
  };

  const clearCartItems = async () => {
    setCartItems((prev) => {
      const updatedItems = [];
      cartStorage.saveCart(updatedItems);
      setCartItemsCount(updatedItems.length);
      return [...updatedItems];
    });
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

  const formattedCart = useMemo(() => {
    if (cartItems.length === 0) {
      return [];
    }

    return Object.values(
      cartItems.reduce((acc, item) => {
        const sku = item?.variants?.[0]?.sku;
        if (!acc[sku]) {
          acc[sku] = { ...item, count: 0 };
        }
        acc[sku].count += 1;
        return acc;
      }, {})
    ).sort((a, b) => a.title.localeCompare(b.title));
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
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
