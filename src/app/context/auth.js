"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { capitalizeFirstLetter } from "@/app/lib/helpers";
import { usePathname } from "next/navigation";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const pathname = usePathname();
  const [forage, setForage] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const response = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) setUser(null);

      const data = await response.json();

      setUser(data);
    } catch (err) {
      console.log("[GET USER] error", err);
      setUser(null);
    }
  };

  const login = (data) => {
    if (!data || !data.access || !data.refresh) return; // fail early if missing
    setIsLoggedIn(true);
    setAccessToken(data.access);
    if (forage) {
      forage.setItem("refresh", data.refresh);
    } else {
      console.log("REFRESH TO FORAGE ERROR");
    }
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
        return;
      }

      // Clear frontend tokens/state
      setAccessToken(null);

      if (forage) {
        console.log("[CONTEXT][logout][forageRemoveItem]");
        await forage.removeItem("refresh");
      }else{
        console.log("[CONTEXT][logout] forange is null", forage);
      }

      console.log("Logged out successfully");
      return response;
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ---- refresh token handler ----
  const refreshAccessToken = useCallback(async () => {
    if (!forage) return;
    if (pathname === "/logout") return;
    try {
      const refresh = await forage.getItem("refresh");
      if (!refresh) return;

      const res = await fetch("/api/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ must include
        },
        body: JSON.stringify({ refresh }),
      });

      if (!res.ok) {
        throw new Error("Refresh failed");
      }

      const data = await res.json();
      if (data.access) {
        setIsLoggedIn(true);
        setAccessToken(data.access);
      }
    } catch (err) {
      console.error("Refresh error:", err);
      logout();
    }
  }, [forage]);

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
    setUser(data);

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
    (async () => {
      await refreshAccessToken();
    })();
  }, [forage, refreshAccessToken]);

  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      await getUser();
    })();
  }, [accessToken]);

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
        isLoggedIn,
        fullName,
        user,
        forage,
        changePassword,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
