"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { useCart } from "@/app/context/cart";
import { useAuth } from "@/app/context/auth";

/**
 * The cart and account buttons for the configured header.
 *
 * New components rather than changes to new-design/ui/CartButton and
 * MyAccountButton: those are the shipped header's, they are styled for it, and
 * the point of the configured header is that switching it on cannot disturb the
 * one it replaces. The behaviour is deliberately the same — the cart opens the
 * drawer on a plain click and stays a real /cart link for crawlers and
 * modifier-clicks; the account button shows the same links from the same
 * context — because that behaviour is right, and only the styling is in
 * question.
 *
 * Colours come from the header's CSS variables, so both follow whatever the
 * admin chose without being told about it.
 */

const RING =
  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-opacity hover:opacity-70";

export function HeaderCartButton() {
  const { cartItemsCount, openMiniCart } = useCart();

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
      aria-label={cartItemsCount > 0 ? `View cart, ${cartItemsCount} items` : "View cart"}
      className={`relative ${RING}`}
      style={{ color: "var(--sh-icon)", borderColor: "var(--sh-icon)" }}
    >
      <ShoppingCart className="h-5 w-5" aria-hidden="true" />
      {cartItemsCount > 0 && (
        <span
          className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold leading-none"
          style={{ background: "var(--sh-icon)", color: "var(--sh-bg)" }}
        >
          {cartItemsCount > 99 ? "99+" : cartItemsCount}
        </span>
      )}
    </Link>
  );
}

export function HeaderAccountButton() {
  const { isLoggedIn, myAccountLinks, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Link
        href="/login"
        prefetch={false}
        aria-label="My account"
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        className={RING}
        style={{ color: "var(--sh-icon)", borderColor: "var(--sh-icon)" }}
      >
        <User className="h-5 w-5" aria-hidden="true" />
      </Link>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-2xl dark:border-stone-700 dark:bg-stone-900">
            {isLoggedIn ? (
              <ul className="py-1">
                {myAccountLinks.map((item) => (
                  <li key={item.url}>
                    <Link
                      prefetch={false}
                      href={item.url}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 dark:text-stone-200 dark:hover:bg-stone-800"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {/* Same rule as the My Account sidenav: offered only when the
                    server says this session may use it. */}
                {isAdmin && (
                  <li>
                    <Link
                      href="/admin"
                      prefetch={false}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:text-stone-200 dark:hover:bg-stone-800"
                    >
                      Store Admin
                    </Link>
                  </li>
                )}
              </ul>
            ) : (
              <div className="flex flex-col gap-2 p-4">
                <Link
                  href="/login"
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-2 text-center text-sm font-semibold text-white"
                  style={{ background: "var(--sh-icon)" }}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-stone-200 px-4 py-2 text-center text-sm font-medium text-stone-700 dark:border-stone-700 dark:text-stone-200"
                >
                  Create an account
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
