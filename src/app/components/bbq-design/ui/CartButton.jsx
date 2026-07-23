"use client";
import React from "react";
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
      className="relative flex flex-col items-center justify-center w-10 h-10 text-char dark:text-ash hover:text-theme-600 dark:hover:text-theme-500 transition-colors"
    >
      <span className="text-lg leading-none">🛒</span>
      <span className="font-oswald text-[10px] uppercase tracking-wide hidden sm:block leading-none mt-0.5">
        Cart
      </span>
      {cartItemsCount > 0 && (
        <span className="absolute top-1 right-1 w-[18px] h-[18px] flex items-center justify-center bg-ember text-white text-[9px] font-oswald font-bold rounded-sm leading-none">
          {cartItemsCount > 9 ? "9+" : cartItemsCount}
        </span>
      )}
    </Link>
  );
}

export default CartButton;
