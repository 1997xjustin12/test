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
      aria-label={`View cart, ${cartItemsCount} ${cartItemsCount === 1 ? "item" : "items"}`}
      className="relative flex flex-col items-center justify-center gap-1 w-11 text-oko-char dark:text-oko-cream hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M3 6h2l2.4 12.2a2 2 0 0 0 2 1.8h8.2a2 2 0 0 0 2-1.6L21 8H6" />
        <circle cx="9" cy="21" r="1" />
        <circle cx="18" cy="21" r="1" />
      </svg>
      <span className="font-inter text-[10.5px] tracking-[0.06em] leading-none">Cart</span>
      {cartItemsCount > 0 && (
        <span className="absolute -top-1.5 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-oko-barn text-white font-oko-mono text-[9px] leading-none rounded-full">
          {cartItemsCount > 9 ? "9+" : cartItemsCount}
        </span>
      )}
    </Link>
  );
}

export default CartButton;
