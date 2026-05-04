"use client";
import { useCart } from "@/app/context/cart";
function AddToCartButtonWrap({ product, children }) {
  const { addToCart, addToCartLoading } = useCart();

  const handleClick = () => {
    addToCart({...product, quantity: 1});
  }

  return <div onClick={handleClick} style={{ display: "contents" }}>{children}</div>;
}

export default AddToCartButtonWrap;
