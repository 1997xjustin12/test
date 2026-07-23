"use client";
import { useMemo } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/cart";
import { BASE_URL, formatPrice, formatProduct, createSlug } from "@/app/lib/helpers";
import { pixelInitiateCheckout } from "@/app/lib/pixel";

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MinusIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 18 2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M1 1h16" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 18 18">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 1v16M1 9h16" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ItemSkeleton = () => (
  <div className="flex gap-3 py-4 animate-pulse">
    <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
    <div className="flex-1 flex flex-col gap-2 py-1">
      <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div className="h-2.5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded-full mt-1" />
    </div>
  </div>
);

function MiniCartItem({ item, onNavigate }) {
  const { increaseProductQuantity, decreaseProductQuantity, removeCartItem } = useCart();
  const product = formatProduct(item, "cart_item");
  const quantity = product?.quantity || 0;

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 dark:border-white/10">
      <Link
        prefetch={false}
        href={product?.url || "#"}
        onClick={onNavigate}
        className="flex-shrink-0"
      >
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
          {product?.image && (
            <Image
              src={product.image}
              alt={createSlug(product?.title || product?.product_title || "")}
              fill
              sizes="64px"
              className="object-contain"
            />
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <Link
          prefetch={false}
          href={product?.url || "#"}
          onClick={onNavigate}
          className="text-xs font-semibold text-charcoal dark:text-white hover:text-theme-500 transition-colors line-clamp-2 leading-snug"
        >
          {product?.title || product?.product_title}
        </Link>

        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-charcoal dark:text-white">
            ${formatPrice((product?.price || 0) * quantity)}
          </span>
          {quantity > 1 && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              ${formatPrice(product?.price || 0)} each
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-0.5">
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => decreaseProductQuantity(item)}
              className="w-6 h-6 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <MinusIcon />
            </button>
            <span className="w-7 text-center text-xs font-semibold text-charcoal dark:text-white select-none">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => increaseProductQuantity(item)}
              className="w-6 h-6 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-charcoal dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <PlusIcon />
            </button>
          </div>

          <button
            type="button"
            title="Remove item"
            aria-label="Remove item"
            onClick={() => removeCartItem(item)}
            className="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MiniCartDrawer({ open, onClose }) {
  const { cartObject, cartItems, cartItemsCount, loadingCartItems } = useCart();

  const subtotal = useMemo(
    () =>
      (cartObject?.items || []).reduce((total, item) => {
        const { price } = formatProduct(item, "cart_item") || {};
        return total + (price || 0) * (item?.quantity || 0);
      }, 0),
    [cartObject],
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    pixelInitiateCheckout({ value: subtotal, numItems: cartItems.length });
    onClose();
    window.location.href = `${BASE_URL}/checkout`;
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-40">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 flex justify-end">
          <DialogPanel
            transition
            className="w-screen max-w-md h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[closed]:translate-x-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10 flex-shrink-0">
              <h2 className="font-serif text-lg text-charcoal dark:text-white">
                Your Cart
                {cartItemsCount > 0 && (
                  <span className="ml-2 text-xs font-sans font-medium text-gray-400 dark:text-gray-500">
                    {cartItemsCount} item{cartItemsCount !== 1 ? "s" : ""}
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-charcoal dark:hover:text-white transition-colors"
              >
                <XIcon />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5">
              {loadingCartItems ? (
                <>
                  <ItemSkeleton />
                  <ItemSkeleton />
                  <ItemSkeleton />
                </>
              ) : cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <span className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-4 text-orange-400">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                  </span>
                  <h3 className="text-sm font-bold text-charcoal dark:text-white mb-1.5">
                    Your cart is empty
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-6 max-w-[240px]">
                    You haven&rsquo;t added anything yet. Browse our collection and find something
                    you&rsquo;ll love.
                  </p>
                  <Link
                    prefetch={false}
                    href={`${BASE_URL}/fireplaces`}
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-theme-600 hover:bg-theme-700 text-white text-sm font-semibold transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                (cartObject?.items || []).map((item, idx) => (
                  <MiniCartItem
                    key={`mini-cart-item-${idx}-${item?.product_id}`}
                    item={item}
                    onNavigate={onClose}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 dark:border-white/10 px-5 py-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-charcoal dark:text-white">Subtotal</span>
                  <span className="text-sm font-bold text-charcoal dark:text-white">
                    ${formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-4">
                  Shipping &amp; tax calculated at checkout.
                </p>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-2.5 rounded-xl bg-theme-600 hover:bg-theme-700 text-white text-sm font-semibold transition-colors mb-2"
                >
                  Proceed to Checkout
                </button>
                <Link
                  prefetch={false}
                  href={`${BASE_URL}/cart`}
                  onClick={onClose}
                  className="block w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-charcoal dark:text-white text-sm font-semibold text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  View Cart
                </Link>
              </div>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
