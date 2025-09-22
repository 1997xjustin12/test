"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/context/auth";
import { BASE_URL } from "@/app/lib/helpers";
export default function LogoutPage() {
  const { logout, forage } = useAuth();

  const logUserOut = async () => {
    try {
      const response = await logout();
      if (!response.ok) {
        console.log("[LogoutPage][error]");
        return;
      }

      window.location.href = `${BASE_URL}/login`;
    } catch (err) {
      console.log("[LogoutPage][error]");
    }
  };

  useEffect(() => {
    if (forage) {
      console.log("[FORAGE]", forage);
      logUserOut();
    }
  }, [forage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Logging Out...</h2>
      </div>
    </div>
  );
}
