"use client";
import React from "react";
import { useCart } from "@/app/context/cart";
function AddToCartButtonWrap({ product, children }) {
  const { addToCart, addToCartLoading } = useCart();

  const handleClick = () => {
    addToCart({...product, quantity: 1});
  }

  return React.cloneElement(children, {
    onClick: handleClick,
  });
}

export default AddToCartButtonWrap;
