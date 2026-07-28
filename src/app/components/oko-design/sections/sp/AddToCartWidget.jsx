"use client";
import React, { useState, useMemo } from "react";
import { useCart } from "@/app/context/cart";

// Quantity stepper (spec §9) — three 34px bordered squares, 2px radius, the
// −/+ controls invert to char on hover like the card add button. Numeric value
// is set in the mono "counter" voice. Followed by a full-width barn CTA.
function AddToCartWidget({ product }) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  const toCart = useMemo(() => ({ ...product, quantity: qty || 1 }), [product, qty]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="font-inter text-[11px] font-medium uppercase tracking-[0.08em] text-oko-stone">
          Qty
        </span>
        <div className="inline-flex items-stretch rounded-[2px] border border-oko-char dark:border-oko-cream">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-[34px] h-[34px] flex items-center justify-center text-[18px] leading-none text-oko-char dark:text-oko-cream hover:bg-oko-char hover:text-oko-cream dark:hover:bg-oko-cream dark:hover:text-oko-char transition-colors"
          >
            −
          </button>
          <span className="w-[34px] h-[34px] flex items-center justify-center font-oko-mono text-[14px] text-oko-char dark:text-oko-cream border-x border-oko-char dark:border-oko-cream">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => q + 1)}
            className="w-[34px] h-[34px] flex items-center justify-center text-[18px] leading-none text-oko-char dark:text-oko-cream hover:bg-oko-char hover:text-oko-cream dark:hover:bg-oko-cream dark:hover:text-oko-char transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => addToCart(toCart)}
        className="w-full flex items-center justify-center gap-2 h-12 px-5 rounded-[2px] font-inter font-semibold text-[13.5px] text-white bg-oko-barn hover:bg-oko-barn-dark transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Add to cart
      </button>
    </div>
  );
}

export default AddToCartWidget;
