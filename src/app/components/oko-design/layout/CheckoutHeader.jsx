import Link from "next/link";
import { CartIcon } from "@/app/components/icons/lib";
import { BASE_URL } from "@/app/lib/helpers";

// The pared-down header /checkout shows instead of the storefront navbar:
// the bordered barn lockup from layout/Navbar.jsx, a secure badge and the way
// back to the cart. Nothing else to click away to mid-purchase.
export default function CheckoutHeader() {
  return (
    <header className="bg-white dark:bg-oko-night border-b border-oko-stone-line dark:border-oko-line-dark">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8 h-16 lg:h-20 flex items-center justify-between">
        <Link
          href={BASE_URL || "/"}
          prefetch={false}
          aria-label="Outdoor Kitchen Outlet home"
          className="flex flex-col items-center leading-none border-[1.5px] border-oko-barn rounded-[2px] px-3.5 py-2 sm:px-5 sm:py-2.5 shrink-0"
        >
          <span className="font-oko-display font-semibold text-[15px] sm:text-[19px] tracking-[0.04em] text-oko-char dark:text-oko-cream whitespace-nowrap">
            OUTDOOR <span className="text-oko-barn dark:text-oko-barn-light">⌂</span> KITCHEN
          </span>
          <span className="font-inter text-[8px] sm:text-[10px] tracking-[0.32em] text-oko-stone dark:text-oko-ondark-faint mt-0.5">
            OUTLET
          </span>
        </Link>

        <span className="hidden sm:flex items-center gap-1.5 font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-stone select-none">
          <svg className="w-3.5 h-3.5 text-oko-sage dark:text-oko-sage-light" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Secure checkout
        </span>

        <Link
          href={`${BASE_URL}/cart`}
          prefetch={false}
          className="flex items-center gap-1.5 font-inter text-[13px] font-semibold text-oko-char-soft dark:text-oko-ondark hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
        >
          <CartIcon width="18" height="18" />
          <span className="hidden sm:inline">Cart</span>
        </Link>
      </div>
    </header>
  );
}
