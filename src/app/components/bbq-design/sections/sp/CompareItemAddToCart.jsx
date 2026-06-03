"use client";
import React, { useState } from "react";
import { useCart } from "@/app/context/cart";
import { Eos3DotsLoading } from "@/app/components/icons/lib";

function CompareItemAddToCart({ label, product }) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    addToCart({ ...product, quantity: 1 })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="relative w-full h-9 flex items-center justify-center font-oswald font-semibold text-xs uppercase tracking-wide text-white bg-theme-600 hover:bg-theme-700 hover:-translate-y-0.5 active:scale-[.98] transition-all rounded-sm disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {loading ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Eos3DotsLoading />
        </div>
      ) : (
        <span>{label}</span>
      )}
    </button>
  );
}

export default CompareItemAddToCart;
