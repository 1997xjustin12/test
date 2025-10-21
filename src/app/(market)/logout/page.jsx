"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/context/auth";
import { useCart } from "@/app/context/cart";
import { BASE_URL } from "@/app/lib/helpers";
import { useRouter } from "next/navigation";
export default function LogoutPage() {
  const { user, logout, loading } = useAuth();
  const { cartObject, createAbandonedCart, abandonedCartUser } = useCart();
  const router = useRouter();
  useEffect(() => {
    const logUserOut = async () => {
      try {
        console.log("cartObject", cartObject);
        console.log("abandonedCartUser", abandonedCartUser);
        const response2 = await createAbandonedCart(cartObject, abandonedCartUser, "forced");
        const response = await logout();
        if (!response.ok) {
          console.log("[LogoutPage][error]");
          return;
        }

        router.push(`${BASE_URL}/login`);
      } catch (err) {
        console.log("[LogoutPage][error]", err);
      }
    };

    if (!loading && user && abandonedCartUser && cartObject) {
      logUserOut();
    }
  }, [loading, user, abandonedCartUser, cartObject]);

  return (
    <div className="container mx-auto flex justify-center items-center p-[10px] min-h-[200px]">
      <div className="flex border border-neutral-300 shadow rounded flex-col items-center justify-center p-4 bg-white max-w-[500px]">
        <h2>Signing out...</h2>
        <p className="mt-2">Please wait...</p>
      </div>
    </div>
  );
}
