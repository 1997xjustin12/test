"use client";
import React from "react";
import { CartIcon } from "@/app/components/new-design/ui/Icons";
import Link from "next/link";
import { useCart } from "@/app/context/cart";

function CartButton() {
  const { cartItemsCount, openMiniCart } = useCart();

  // Stays a real link to /cart so it remains crawlable and middle/modifier-click
  // still opens the full cart page; a plain left-click opens the drawer instead.
  const handleClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    openMiniCart();
  };

  return (
    <Link
      href="/cart"
      prefetch={false}
      onClick={handleClick}
      aria-label="View cart"
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
