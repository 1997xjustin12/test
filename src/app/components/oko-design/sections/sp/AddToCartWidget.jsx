"use client";
import React, { useState, useMemo } from "react";
import { useCart } from "@/app/context/cart";

function AddToCartWidget({ product }) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  const toCart = useMemo(() => ({ ...product, quantity: qty || 1 }), [product, qty]);

  return (
    <>
      <div className="flex items-center bg-ash dark:bg-smoke border border-grate dark:border-white/10 overflow-hidden">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="w-10 h-11 flex items-center justify-center text-char/40 dark:text-ash/40 hover:bg-grate/50 dark:hover:bg-white/10 text-xl font-light transition-colors"
        >
          −
        </button>
        <span className="w-9 text-center text-sm font-bold text-char dark:text-ash">
          {qty}
        </span>
        <button
          onClick={() => setQty((q) => q + 1)}
          className="w-10 h-11 flex items-center justify-center text-char/40 dark:text-ash/40 hover:bg-grate/50 dark:hover:bg-white/10 text-xl font-light transition-colors"
        >
          +
        </button>
      </div>
      <button
        onClick={() => addToCart(toCart)}
        className="flex-1 min-w-[140px] flex items-center justify-center gap-2 h-11 px-5 font-oswald font-semibold text-sm uppercase tracking-wide text-white bg-theme-600 hover:bg-theme-700 hover:-translate-y-0.5 active:scale-[.98] transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Add to Cart
      </button>
    </>
  );
}

export default AddToCartWidget;
