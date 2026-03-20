import React from "react";
import { CartIcon } from "@/app/components/new-design/ui/Icons";
import Link from "next/link";
import { useCart } from "@/app/context/cart";

function CartButton() {
  const { cartItemsCount } = useCart();
  return (
    <Link
      href="/cart"
      prefetch={false}
      className="relative w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-charcoal dark:text-white hover:bg-fire hover:text-white transition-all duration-200"
    >
      <CartIcon />
      {cartItemsCount > 0 && (
      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-fire rounded-full border-2 border-white dark:border-charcoal" />
      )}
    </Link>
  );
}

export default CartButton;
