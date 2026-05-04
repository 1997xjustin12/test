"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/app/lib/helpers";
import { STORE_CONTACT } from "@/app/lib/store_constants";
import AddToCartButtonWrap from "@/app/components/atom/AddToCartButtonWrap";

const StickyCTA = ({ product }) => {

  return (
    <div className="fixed bottom-4 right-4 z-50 hidden lg:flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-2xl shadow-black/10">
      <div className="pr-3 border-r border-gray-100 dark:border-gray-800">
        <p className="text-base font-black text-gray-900 dark:text-white leading-none">
          ${formatPrice(product?.price)}
        </p>
        {!!product?.save_amt && (
          <p className="text-[10px] text-green-500 font-semibold mt-0.5">
            Save ${formatPrice(product?.save_amt)}{!!product?.is_freeshipping && " · Free Ship"}
          </p>
        )}
      </div>
      <Link
        href={`tel:${STORE_CONTACT}`}
        className="flex items-center gap-1.5 border-2 border-theme-500 text-theme-600 hover:border-theme-700 hover:text-theme-700 dark:text-theme-400 text-xs font-bold py-2 px-3 rounded-xl hover:bg-theme-50 dark:hover:bg-theme-950 transition-colors whitespace-nowrap"
      >
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Call
      </Link>
      <AddToCartButtonWrap product={product}>
        <button
          className={`flex items-center gap-1.5 text-xs font-bold py-2 px-4 rounded-xl text-white transition-all duration-200 bg-theme-600 hover:bg-theme-700`}
        >
          Add to Cart
        </button>
      </AddToCartButtonWrap>
    </div>
  );
};

export default StickyCTA;
