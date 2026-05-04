"use client";
import React, { useState, useMemo } from "react";
import { useCart } from "@/app/context/cart";

function AddToCartWidget({ product }) {
  const [qty, setQty] = useState(1);
  const { addToCart, addToCartLoading } = useCart();

  const toCart = useMemo(() => {
    const tc = product;
    tc["quantity"] = qty || 1;
    return tc;
  }, [product, qty]);

  return (
    <>
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="w-10 h-11 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xl font-light transition-colors"
        >
          −
        </button>
        <span className="w-9 text-center text-sm font-bold text-gray-900 dark:text-white">
          {qty}
        </span>
        <button
          onClick={() => setQty((q) => q + 1)}
          className="w-10 h-11 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xl font-light transition-colors"
        >
          +
        </button>
      </div>
      <button
        onClick={()=> addToCart(toCart) }
        className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-sm font-bold text-white transition-all duration-200 bg-orange-500 hover:bg-orange-600 active:scale-[.98]}`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>{" "}
        Add to Cart
      </button>
    </>
  );
}

export default AddToCartWidget;
