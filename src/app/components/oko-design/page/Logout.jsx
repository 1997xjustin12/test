"use client";
import { useEffect } from "react";
import { useAuth } from "@/app/context/auth";
import { useCart } from "@/app/context/cart";
import { BASE_URL } from "@/app/lib/helpers";
import { useRouter } from "next/navigation";

export default function BBQLogoutPage() {
  const { user, logout, loading } = useAuth();
  const { cartObject, createAbandonedCart, abandonedCartUser } = useCart();
  const router = useRouter();

  useEffect(() => {
    const logUserOut = async () => {
      try {
        await createAbandonedCart(cartObject, abandonedCartUser, "forced");
        const response = await logout();
        if (!response?.ok) return;
        router.push(`${BASE_URL}/login`);
      } catch (err) {
        console.error("[LogoutPage]", err);
      }
    };

    if (!loading && user && abandonedCartUser && cartObject) {
      logUserOut();
    }
  }, [loading, user, abandonedCartUser, cartObject]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 bg-oko-cream dark:bg-oko-night">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-oko-stone-line dark:border-oko-line-dark border-t-oko-barn dark:border-t-oko-barn-light animate-spin" />
        <div>
          <h2 className="font-oko-display font-semibold text-[21px] leading-[1.3] text-oko-char dark:text-oko-cream mb-1">
            Signing out…
          </h2>
          <p className="font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark">
            Please wait a moment.
          </p>
        </div>
      </div>
    </div>
  );
}
