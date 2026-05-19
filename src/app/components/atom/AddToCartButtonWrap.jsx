"use client";
import { useCart } from "@/app/context/cart";
import { pixelAddToCart } from "@/app/lib/pixel";

function AddToCartButtonWrap({ product, children }) {
  const { addToCart, addToCartLoading } = useCart();

  const handleClick = () => {
    pixelAddToCart({
      id: product?.id || product?.product_id,
      name: product?.title || product?.name,
      price: product?.price || product?.variants?.[0]?.price || 0,
      quantity: 1,
    });
    addToCart({...product, quantity: 1});
  }

  return <div onClick={handleClick} style={{ display: "contents" }}>{children}</div>;
}

export default AddToCartButtonWrap;
