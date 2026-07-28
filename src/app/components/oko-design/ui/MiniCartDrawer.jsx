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
    <div className="w-16 h-16 bg-grate/40 dark:bg-white/10 flex-shrink-0" />
    <div className="flex-1 flex flex-col gap-2 py-1">
      <div className="h-2.5 w-full bg-grate/40 dark:bg-white/10" />
      <div className="h-2.5 w-2/3 bg-grate/40 dark:bg-white/10" />
      <div className="h-3 w-20 bg-grate/40 dark:bg-white/10 mt-1" />
    </div>
  </div>
);

function MiniCartItem({ item, onNavigate }) {
  const { increaseProductQuantity, decreaseProductQuantity, removeCartItem } = useCart();
  const product = formatProduct(item, "cart_item");
  const quantity = product?.quantity || 0;

  return (
    <div className="flex gap-3 py-4 border-b border-grate dark:border-white/10">
      <Link
        prefetch={false}
        href={product?.url || "#"}
        onClick={onNavigate}
        className="flex-shrink-0"
      >
        <div className="relative w-16 h-16 overflow-hidden bg-white dark:bg-char">
          {product?.image && (
            <Image
              src={product.image}
              alt={createSlug(product?.title || "")}
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
          className="font-sora text-xs font-semibold text-char dark:text-ash hover:text-theme-600 dark:hover:text-theme-500 transition-colors line-clamp-2 leading-snug"
        >
          {product?.title}
        </Link>

        <div className="flex items-baseline gap-1.5">
          <span className="font-oswald text-sm font-bold text-ember-deep dark:text-ember">
            ${formatPrice((product?.price || 0) * quantity)}
          </span>
          {quantity > 1 && (
            <span className="text-[10px] text-char/40 dark:text-ash/30">
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
              className="w-6 h-6 flex items-center justify-center rounded-sm border border-grate dark:border-white/10 bg-ash dark:bg-char/60 text-char dark:text-ash hover:bg-grate/40 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <MinusIcon />
            </button>
            <span className="w-7 text-center font-oswald text-xs font-semibold text-char dark:text-ash select-none">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => increaseProductQuantity(item)}
              className="w-6 h-6 flex items-center justify-center rounded-sm border border-grate dark:border-white/10 bg-ash dark:bg-char/60 text-char dark:text-ash hover:bg-grate/40 dark:hover:bg-white/5 transition-colors"
            >
              <PlusIcon />
            </button>
          </div>

          <button
            type="button"
            title="Remove item"
            aria-label="Remove item"
            onClick={() => removeCartItem(item)}
            className="text-grate hover:text-fire dark:text-white/20 dark:hover:text-fire transition-colors"
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
        className="fixed inset-0 bg-char/60 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 flex justify-end">
          <DialogPanel
            transition
            className="w-screen max-w-md h-full bg-paper dark:bg-smoke border-l-2 border-ember shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[closed]:translate-x-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-grate dark:border-white/10 flex-shrink-0">
              <h2 className="font-oswald text-lg font-bold uppercase tracking-wide text-char dark:text-ash">
                Your Cart
                {cartItemsCount > 0 && (
                  <span className="ml-2 font-sora text-xs font-medium normal-case tracking-normal text-char/40 dark:text-ash/40">
                    {cartItemsCount} item{cartItemsCount !== 1 ? "s" : ""}
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="w-8 h-8 rounded-sm flex items-center justify-center text-char/40 dark:text-ash/40 hover:bg-grate/30 dark:hover:bg-white/5 hover:text-char dark:hover:text-ash transition-colors"
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
                  <span className="text-4xl mb-4">🛒</span>
                  <h3 className="font-oswald text-sm font-bold uppercase tracking-wide text-char dark:text-ash mb-1.5">
                    Your cart is empty
                  </h3>
                  <p className="text-xs text-char/50 dark:text-ash/40 mb-6 max-w-[240px]">
                    Nothing on the grill yet. Browse our lineup and find your setup.
                  </p>
                  <Link
                    prefetch={false}
                    href={`${BASE_URL}/grills`}
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-sm bg-ember hover:bg-ember-deep text-white font-oswald text-sm font-semibold uppercase tracking-wide transition-colors"
                  >
                    Shop Grills
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
              <div className="border-t border-grate dark:border-white/10 px-5 py-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-oswald text-sm font-bold uppercase tracking-wide text-char dark:text-ash">
                    Subtotal
                  </span>
                  <span className="font-oswald text-sm font-bold text-char dark:text-ash">
                    ${formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-[11px] text-char/40 dark:text-ash/30 mb-4">
                  Shipping &amp; tax calculated at checkout.
                </p>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-2.5 rounded-sm bg-ember hover:bg-ember-deep text-white font-oswald text-sm font-semibold uppercase tracking-wide transition-colors mb-2"
                >
                  Proceed to Checkout
                </button>
                <Link
                  prefetch={false}
                  href={`${BASE_URL}/cart`}
                  onClick={onClose}
                  className="block w-full py-2.5 rounded-sm border border-grate dark:border-white/10 text-char dark:text-ash font-oswald text-sm font-semibold uppercase tracking-wide text-center hover:bg-grate/30 dark:hover:bg-white/5 transition-colors"
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
