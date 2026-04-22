"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/app/lib/helpers";
import { STORE_CONTACT } from "@/app/lib/store_constants";

const StickyCTA = ({ price, was, onCart }) => {
  const [added, setAdded] = useState(false);

  const handle = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    onCart?.();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 hidden lg:flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-2xl shadow-black/10">
      <div className="pr-3 border-r border-gray-100 dark:border-gray-800">
        <p className="text-base font-black text-gray-900 dark:text-white leading-none">
          ${formatPrice(price)}
        </p>
        <p className="text-[10px] text-green-500 font-semibold mt-0.5">
          Save ${was - price} · Free Ship
        </p>
      </div>
      <Link
        href={`tel:${STORE_CONTACT}`}
        className="flex items-center gap-1.5 border-2 border-orange-500 text-orange-600 dark:text-orange-400 text-xs font-bold py-2 px-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors whitespace-nowrap"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Call
      </Link>
      <button
        onClick={handle}
        className={`flex items-center gap-1.5 text-xs font-bold py-2 px-4 rounded-xl text-white transition-all duration-200 ${
          added ? "bg-green-500" : "bg-orange-500 hover:bg-orange-600"
        }`}
      >
        {added ? "✓ Added" : "Add to Cart"}
      </button>
    </div>
  );
};

export default StickyCTA;
