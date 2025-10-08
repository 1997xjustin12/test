"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/context/auth";
import { useCart } from "@/app/context/cart";
import { BASE_URL } from "@/app/lib/helpers";
import { useRouter } from "next/navigation";
export default function LogoutPage() {
  const { user, logout, forage } = useAuth();
  const { cart, createAbandonedCart } = useCart();
  const router = useRouter();
  const logUserOut = async () => {
    try {
      const response = await logout();
      const response2 = await createAbandonedCart(cart, user, "forced");
      if (!response.ok) {
        console.log("[LogoutPage][error]");
        return;
      }

      router.push(`${BASE_URL}/login`);
    } catch (err) {
      console.log("[LogoutPage][error]");
    }
  };

  useEffect(() => {
    logUserOut();
  }, []);

  return (
    <div className="flex items-center justify-center px-4">
      <div className="container mx-auto flex justify-center">
        <h2 className="text-2xl font-bold mb-6 text-center">Logging Out...</h2>
      </div>
    </div>
  );
}
