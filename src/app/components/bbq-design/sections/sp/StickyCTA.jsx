"use client";
import Link from "next/link";
import { formatPrice } from "@/app/lib/helpers";
import { STORE_CONTACT } from "@/app/lib/store_constants";
import AddToCartButtonWrap from "@/app/components/atom/AddToCartButtonWrap";

const StickyCTA = ({ product }) => {
  const openChat = () => window.$zoho?.salesiq?.floatwindow?.visible("show");

  return (
    <div className="fixed bottom-4 right-4 z-50 hidden lg:flex items-center gap-3 bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm px-4 py-3 shadow-xl shadow-char/10 dark:shadow-black/40">
      <div className="pr-3 border-r border-grate dark:border-white/10">
        <p className="font-oswald font-bold text-base text-char dark:text-ash leading-none">
          ${formatPrice(product?.price)}
        </p>
        {!!product?.save_amt && (
          <p className="text-[10px] text-bbq-green font-semibold mt-0.5">
            Save ${formatPrice(product?.save_amt)}{!!product?.is_freeshipping && " · Free Ship"}
          </p>
        )}
      </div>
      <Link
        href={`tel:${STORE_CONTACT}`}
        className="flex items-center gap-1.5 border border-theme-600 text-theme-600 text-xs font-oswald font-semibold py-2 px-3 rounded-sm hover:bg-theme-600/10 transition-colors whitespace-nowrap uppercase tracking-wide"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Call
      </Link>
      <button
        onClick={openChat}
        className="flex items-center gap-1.5 border border-bbq-green text-bbq-green text-xs font-oswald font-semibold py-2 px-3 rounded-sm hover:bg-bbq-green/10 transition-colors whitespace-nowrap uppercase tracking-wide"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Chat
      </button>
      <AddToCartButtonWrap product={product}>
        <button className="flex items-center gap-1.5 text-xs font-oswald font-semibold py-2 px-4 rounded-sm text-white bg-theme-600 hover:bg-theme-700 transition-colors uppercase tracking-wide">
          Add to Cart
        </button>
      </AddToCartButtonWrap>
    </div>
  );
};

export default StickyCTA;
