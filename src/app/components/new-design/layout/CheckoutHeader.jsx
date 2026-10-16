import Link from "next/link";
import Image from "next/image";
import { CartIcon } from "@/app/components/icons/lib";
import { BASE_URL } from "@/app/lib/helpers";

// The pared-down header /checkout shows instead of the storefront navbar:
// logo, a secure badge and the way back to the cart. Nothing else to click
// away to mid-purchase.
export default function CheckoutHeader({ logo }) {
  return (
    <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href={BASE_URL || "/"} prefetch={false} className="flex-shrink-0">
          <div className="w-[130px] aspect-[191/94] relative">
            <Image src={logo || `/Logo.webp`} alt="Logo" fill className="object-contain" />
          </div>
        </Link>

        <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-stone-400 dark:text-stone-500 select-none">
          <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Secure Checkout
        </span>

        <Link
          href={`${BASE_URL}/cart`}
          prefetch={false}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
        >
          <CartIcon width="18" height="18" />
          <span className="hidden sm:inline">Cart</span>
        </Link>
      </div>
    </header>
  );
}
