"use client";
import { useAuth } from "@/app/context/auth";
import { useCart } from "@/app/context/cart";
import { useSignOut } from "@/app/lib/use-sign-out";

export default function BBQLogoutPage() {
  const auth = useAuth();
  const cart = useCart();
  const { failed, retry } = useSignOut(auth, cart);

  if (failed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 bg-oko-cream dark:bg-oko-night">
        <div className="flex flex-col items-center gap-4 text-center">
          <div>
            <h2 className="font-oko-display font-semibold text-[21px] leading-[1.3] text-oko-char dark:text-oko-cream mb-1">
              We could not sign you out
            </h2>
            <p className="font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark">
              Check your connection and try again.
            </p>
          </div>
          <button
            type="button"
            onClick={retry}
            className="rounded-full bg-oko-barn px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-oko-barn-dark"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

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
