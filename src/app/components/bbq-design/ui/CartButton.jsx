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
      aria-label="View cart"
      className="relative w-10 h-10 dark:bg-stone-800 flex items-center justify-center text-charcoal dark:text-white  transition-all duration-200"
    >
      <div>
        <div className="text-lg">🛒</div>
        <small className="text-[12px] hidden sm:block">Cart</small>
      </div>
      {cartItemsCount > 0 && (
      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-fire rounded-full border-2 border-white dark:border-charcoal" />
      )}
    </Link>
  );
}

export default CartButton;
