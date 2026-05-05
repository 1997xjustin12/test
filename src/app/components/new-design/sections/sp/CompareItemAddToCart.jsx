"use client";
import React, { useState } from "react";
import { useCart } from "@/app/context/cart";
import { Eos3DotsLoading } from "@/app/components/icons/lib";

function CompareItemAddToCart({ label, className, product }) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  
  const handleClick = () => {
    setLoading(true);
    addToCart({...product, quantity:1})
    .catch((error) => console.log("[Compare table add to cart error]"))
    .finally(()=> setLoading(false))  
  };

  return (
  <button onClick={handleClick} disabled={loading} className={`relative min-h-[32px] ${className}`}>
      {loading && (
        <div className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Eos3DotsLoading />
        </div>
      )}
      {!loading && <span>{label}</span>}
    </button>
  );
}

export default CompareItemAddToCart;
