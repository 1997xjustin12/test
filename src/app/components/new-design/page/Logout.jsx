"use client";
import { useAuth } from "@/app/context/auth";
import { useCart } from "@/app/context/cart";
import { useSignOut } from "@/app/lib/use-sign-out";

export default function NewLogoutPage() {
  const auth = useAuth();
  const cart = useCart();
  const { failed, retry } = useSignOut(auth, cart);

  if (failed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div>
            <h2 className="text-base font-bold text-charcoal dark:text-white mb-1">
              We could not sign you out
            </h2>
            <p className="text-xs text-stone-400 dark:text-stone-500">
              Check your connection and try again.
            </p>
          </div>
          <button
            type="button"
            onClick={retry}
            className="rounded-full bg-fire px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-stone-200 dark:border-stone-700 border-t-fire animate-spin" />
        <div>
          <h2 className="text-base font-bold text-charcoal dark:text-white mb-1">
            Signing out…
          </h2>
          <p className="text-xs text-stone-400 dark:text-stone-500">
            Please wait a moment.
          </p>
        </div>
      </div>
    </div>
  );
}
