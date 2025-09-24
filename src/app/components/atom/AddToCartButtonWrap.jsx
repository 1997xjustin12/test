"use client";
import React from "react";
import { useCart } from "@/app/context/cart";
function AddToCartButtonWrap({ product, children }) {
  const { addToCart } = useCart();

  const handleClick = () => {
    console.log("[TRIGGER ADD TO CART] product", product)
    addToCart([product]);
  }

  return React.cloneElement(children, {
    onClick: handleClick,
  });
}

export default AddToCartButtonWrap;
