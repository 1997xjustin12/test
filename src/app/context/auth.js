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

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const myAccountLinks = [
  {
    label: "Dashboard",
    url: `${BASE_URL}/my-account`,
    icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z"/></svg>),
  },
  {
    label: "Orders",
    url: `${BASE_URL}/my-account/orders`,
    icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2M1 2v2h2l3.6 7.59l-1.36 2.45c-.15.28-.24.61-.24.96a2 2 0 0 0 2 2h12v-2H7.42a.25.25 0 0 1-.25-.25q0-.075.03-.12L8.1 13h7.45c.75 0 1.41-.42 1.75-1.03l3.58-6.47c.07-.16.12-.33.12-.5a1 1 0 0 0-1-1H5.21l-.94-2M7 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2"/></svg>),
  },
  {
    label: "Profile",
    url: `${BASE_URL}/my-account/profile`,
    icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 19.2c-2.5 0-4.71-1.28-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.23 7.23 0 0 1-6 3.2M12 5a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-3A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10c0-5.53-4.5-10-10-10"/></svg>),
  },
  {
    label: "Change Password",
    url: `${BASE_URL}/my-account/change-password`,
    icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"/></svg>),
  },
  {
    label: "Logout",
    url: `${BASE_URL}/logout`,
    icon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5M4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4z"/></svg>),
  },
];

export function AuthProvider({ children }) {
  const pathname = usePathname();
  const [forage, setForage] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
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
        forage,
        fullName,
        isLoggedIn,
        user,
        myAccountLinks,
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
