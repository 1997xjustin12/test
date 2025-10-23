"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { capitalizeFirstLetter, BASE_URL } from "@/app/lib/helpers";
import { usePathname } from "next/navigation";
import { redisGet } from "@/app/lib/api";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const myAccountLinks = [
  {
    label: "Dashboard",
    url: `${BASE_URL}/my-account`,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z" />
      </svg>
    ),
  },
  {
    label: "Orders",
    url: `${BASE_URL}/my-account/orders`,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M17 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2M1 2v2h2l3.6 7.59l-1.36 2.45c-.15.28-.24.61-.24.96a2 2 0 0 0 2 2h12v-2H7.42a.25.25 0 0 1-.25-.25q0-.075.03-.12L8.1 13h7.45c.75 0 1.41-.42 1.75-1.03l3.58-6.47c.07-.16.12-.33.12-.5a1 1 0 0 0-1-1H5.21l-.94-2M7 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2"
        />
      </svg>
    ),
  },
  {
    label: "Profile",
    url: `${BASE_URL}/my-account/profile`,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 19.2c-2.5 0-4.71-1.28-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.23 7.23 0 0 1-6 3.2M12 5a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-3A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10c0-5.53-4.5-10-10-10"
        />
      </svg>
    ),
  },
  {
    label: "Change Password",
    url: `${BASE_URL}/my-account/change-password`,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"
        />
      </svg>
    ),
  },
  {
    label: "Logout",
    url: `${BASE_URL}/logout`,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="m17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5M4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4z"
        />
      </svg>
    ),
  },
];

const accountBenefits = [
  "Earn 1 point per $1 spent",
  "Track your orders",
  "Save Favorite items",
  "Quick and easy checkout",
];

export function AuthProvider({ children }) {
  const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes
  const pathname = usePathname();
  const [forage, setForage] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const injectUserFields = (data) => {
    if (!data) return null;
    return {
      ...data,
      full_name: `${capitalizeFirstLetter(
        data.first_name || ""
      )} ${capitalizeFirstLetter(data.last_name || "")}`.trim(),
      name_initials: `${data?.first_name?.[0] || ""}${
        data?.last_name?.[0] || ""
      }`.toUpperCase(),
    };
  };

  const getUser = async () => {
    try {
      const response = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await response.json();
      const user_obj = injectUserFields(data);
      setUser(user_obj);
      setLoading(false);
    } catch (err) {
      setUser(null);
      setLoading(false);
    }
  };

  const userOrdersGet = async () => {
    const headers = {};

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch("/api/auth/orders", {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      // Throw readable error instead of silent fail
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }

    return response.json();
  };

  const userOrderCreate = async (order) => {
    try {
      console.log("[userOrderCreate]");

      if (loading) return;

      const headers = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      console.log("headers", headers);

      return await fetch("/api/orders/checkout", {
        method: "POST",
        headers,
        body: JSON.stringify(order),
      });
    } catch (err) {
      console.error("[userOrderCreate] error:", err);
      return null;
    }
  };

  const userCartGet = async () => {
    console.log("[userCartGet]");
    if (loading) return;
    if (!user) {
      console.log("[userCartGet][CANT GET CART] USER UNDEFINED");
    }

    try {
      const bearer = `Bearer ${accessToken}`;

      const response = await fetch("/api/auth/cart/active", {
        headers: {
          Authorization: bearer,
        },
      });

      if (response.status === 404) {
        return null;
      }

      const cart = await response.json();

      const key = `abandoned:${cart?.cart_id}`;
      const redis_response = await redisGet(key);
      if (!redis_response.ok) {
        console.warn("[userCartGet]");
        return null;
      }
      const is_abandoned = await redis_response.json();
      const items = cart?.items?.map((item) => ({
        ...item,
        ...item?.custom_fields,
      }));
      return { ...cart, is_abandoned, items };
    } catch (err) {
      return err;
    }
  };

  const userCartCreate = async (cart = {}) => {
    console.log("[userCartCreate]");
    if (loading) return;
    if (!user) {
      console.log("[userCartCreate][CANT CREATE CART] USER UNDEFINED");
      return null;
    }

    try {
      const bearer = `Bearer ${accessToken}`;

      const response = await fetch("/api/auth/cart/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: bearer,
        },
        body: JSON.stringify(cart),
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (err) {
      console.error("[userCartCreate] error:", err);
      return null;
    }
  };

  const userCartUpdate = async (cart = {}) => {
    console.log("[userCartUpdate]");
    if (loading) return;
    if (!user) {
      console.log("[userCartUpdate][CANT CREATE CART] USER UNDEFINED");
      return null;
    }

    const sendCart = {
      ...cart,
      items: cart?.items?.map((item) => ({
        ...item,
        product_id: item?.custom_fields?.product_id,
      })),
    };

    try {
      const bearer = `Bearer ${accessToken}`;

      const response = await fetch("/api/auth/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: bearer,
        },
        body: JSON.stringify(sendCart),
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (err) {
      console.error("[userCartUpdate] error:", err);
      return null;
    }
  };

  const userCartClose = async (cart = {}) => {
    console.log("[userCartClose]");
    if (loading) return;
    if (!user || !isLoggedIn) {
      console.log("[userCartClose][CANT CLOSE CART] USER UNDEFINED");
      return null;
    }

    try {
      const bearer = `Bearer ${accessToken}`;

      return await fetch("/api/auth/cart/close", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: bearer,
        },
      });
    } catch (err) {
      console.error("[userCartClose] error:", err);
      return null;
    }
  };

  const login = async (data) => {
    if (!data || !data.access || !data.refresh) return false; // fail early if missing
    setIsLoggedIn(true);
    setAccessToken(data.access);

    if (forage) {
      forage.setItem("refresh", data.refresh);
    } else {
      console.log("REFRESH TO FORAGE ERROR");
    }

    return true;
  };

  const logout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // ensures cookies are sent
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Logout failed:", errorData.error || response.statusText);
        return false;
      }

      // Clear frontend tokens/state
      setAccessToken(null);
      setUser(null);

      if (forage) {
        console.log("[CONTEXT][logout][forageRemoveItem]");
        await forage.removeItem("refresh");
        await forage.removeItem("last_refresh");
        await forage.removeItem("access");
      } else {
        console.log("[CONTEXT][logout] forange is null", forage);
      }

      console.log("Logged out successfully");
      syncCartToCookie([]);
      setIsLoggedIn(false);
      return response;
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const refreshAccessToken = useCallback(
    async (force = false) => {
      if (!forage) return;
      if (pathname === "/logout") return;

      try {
        const now = Date.now();

        const lastRefresh = await forage.getItem("last_refresh");

        const existingAccess = await forage.getItem("access");

        if (
          !force &&
          lastRefresh &&
          now - lastRefresh < REFRESH_INTERVAL &&
          existingAccess
        ) {
          console.log("Using existing access token, skipping refresh");
          setIsLoggedIn(true);
          setAccessToken(existingAccess);
          return;
        }

        const refresh = await forage.getItem("refresh");
        if (!refresh) {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        });

        if (!res.ok) {
          throw new Error("Refresh failed");
        }

        const data = await res.json();
        if (data.access) {
          setIsLoggedIn(true);
          setAccessToken(data.access);

          // 🔹 Save tokens + last refresh
          await forage.setItem("access", data.access);
          await forage.setItem("last_refresh", now);
        }
      } catch (err) {
        console.error("Refresh error:", err);
        logout();
      }
    },
    [forage, pathname]
  );

  const updateProfile = async (updatedData) => {
    const res = await fetch("/api/profile/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
      console.log("[ERROR] updateProfile");
      return res;
    }

    const data = await res.json();
    // inject fields
    const user_obj = injectUserFields(data);
    setUser(user_obj);

    return res;
  };

  const changePassword = async (password) => {
    const res = await fetch("/api/auth/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(password),
    });
    return res;
  };

  const userReviewCreate = async (data) => {
    try {
      return await fetch("/api/reviews/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn("[userReviewCreate] API error:", err);
    }
  };

  const userReviewUpdate = async (data) => {
    try {
      return await fetch("/api/reviews/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.warn("[userReviewUpdate] API error:", err);
    }
  };

  // ---- on mount, load localForage and then refresh once ----
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@/app/lib/localForage")
        .then((module) => {
          setForage(module.default || module); // ✅ use .default
        })
        .catch((error) => {
          console.error("Error loading localForage module:", error);
        });
    }
  }, []);

  useEffect(() => {
    if (!forage) return;

    // Run once on mount → force refresh if no access token
    (async () => {
      const existingAccess = await forage.getItem("access");
      if (!existingAccess) {
        await refreshAccessToken(true); // force refresh if missing
      } else {
        setIsLoggedIn(true);
        setAccessToken(existingAccess);
      }
    })();

    // Then refresh every 10 minutes
    const interval = setInterval(() => {
      refreshAccessToken();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [forage, refreshAccessToken]);

  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      await getUser();
    })();
  }, [accessToken]);

  useEffect(() => {
    refreshAccessToken(); // first check immediately

    const interval = setInterval(() => {
      refreshAccessToken();
    }, 5 * 60 * 1000); // every 5 minutes

    return () => clearInterval(interval);
  }, [refreshAccessToken]);

  const fullName = useMemo(() => {
    if (!user) return "";
    const first = capitalizeFirstLetter(user.first_name || "");
    const last = capitalizeFirstLetter(user.last_name || "");
    return `${first} ${last}`.trim();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        accountBenefits,
        forage,
        fullName,
        userOrderCreate,
        userOrdersGet,
        userCartClose,
        userCartCreate,
        userCartGet,
        userCartUpdate,
        isLoggedIn,
        user,
        myAccountLinks,
        changePassword,
        userReviewCreate,
        userReviewUpdate,
        login,
        logout,
        updateProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
