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
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="relative w-full h-9 flex items-center justify-center font-inter font-semibold text-[13px] text-white bg-oko-barn hover:bg-oko-barn-dark transition-colors rounded-[2px] disabled:opacity-60"
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
