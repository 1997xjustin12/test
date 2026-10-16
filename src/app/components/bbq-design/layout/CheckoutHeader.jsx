import Link from "next/link";
import { CartIcon } from "@/app/components/icons/lib";
import { BASE_URL } from "@/app/lib/helpers";

// The pared-down header /checkout shows instead of the storefront navbar:
// the same wordmark as layout/Navbar.jsx, a secure badge and the way back to
// the cart. Nothing else to click away to mid-purchase.
export default function CheckoutHeader() {
  return (
    <header className="bg-paper dark:bg-char border-b border-grate dark:border-white/10">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href={BASE_URL || "/"}
          prefetch={false}
          className="font-bold text-2xl tracking-wide shrink-0 font-oswald text-char dark:text-ash"
        >
          BBQGrill<span className="text-theme-600 font-oswald">Outlet</span>
          <small className="block font-sora font-normal text-[9px] tracking-[.35em] text-char/40 dark:text-ash/30 uppercase">
            Outdoor Kitchen Experts
          </small>
        </Link>

        <span className="hidden sm:flex items-center gap-1.5 font-oswald text-[11px] font-semibold uppercase tracking-widest text-char/40 dark:text-ash/40 select-none">
          <svg className="w-3.5 h-3.5 text-bbq-green" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Secure Checkout
        </span>

        <Link
          href={`${BASE_URL}/cart`}
          prefetch={false}
          className="flex items-center gap-1.5 font-oswald text-xs font-semibold uppercase tracking-wide text-char/50 dark:text-ash/50 hover:text-theme-600 transition-colors"
        >
          <CartIcon width="18" height="18" />
          <span className="hidden sm:inline">Cart</span>
        </Link>
      </div>
    </header>
  );
}
