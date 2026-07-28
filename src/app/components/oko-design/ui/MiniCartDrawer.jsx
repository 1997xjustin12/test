"use client";
import { useMemo } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/cart";
import { BASE_URL, formatPrice, formatProduct, createSlug } from "@/app/lib/helpers";
import { pixelInitiateCheckout } from "@/app/lib/pixel";

// §9 Cart drawer — white (dark:night-2), 420px, slides from right, stone-line
// left border, NO shadow. Bordered line-item rows with cream-dim image wells,
// a bordered quantity stepper (char-inversion hover) and a subtle stone→barn
// remove. Footer is cream-dim with a slab subtotal + full-width barn checkout.

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// Static placeholder — no shimmer (spec §7).
const ItemPlaceholder = () => (
  <div className="flex gap-3 py-4 border-b border-oko-stone-line dark:border-oko-line-dark">
    <div className="w-16 h-16 bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px] flex-shrink-0" />
    <div className="flex-1 flex flex-col gap-2 py-1">
      <div className="h-2.5 w-full bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px]" />
      <div className="h-2.5 w-2/3 bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px]" />
      <div className="h-3 w-20 bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px] mt-1" />
    </div>
  </div>
);

function MiniCartItem({ item, onNavigate }) {
  const { increaseProductQuantity, decreaseProductQuantity, removeCartItem } = useCart();
  const product = formatProduct(item, "cart_item");
  const quantity = product?.quantity || 0;

  return (
    <div className="flex gap-3 py-4 border-b border-oko-stone-line dark:border-oko-line-dark">
      <Link
        prefetch={false}
        href={product?.url || "#"}
        onClick={onNavigate}
        className="flex-shrink-0"
      >
        <div className="relative w-16 h-16 overflow-hidden bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px]">
          {product?.image && (
            <Image
              src={product.image}
              alt={createSlug(product?.title || "")}
              fill
              sizes="64px"
              className="object-contain p-1"
            />
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <Link
          prefetch={false}
          href={product?.url || "#"}
          onClick={onNavigate}
          className="font-inter text-[13px] font-medium leading-[1.3] text-oko-char dark:text-oko-cream hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors line-clamp-2"
        >
          {product?.title}
        </Link>

        <div className="flex items-baseline gap-2">
          <span className="font-inter text-[14px] font-semibold text-oko-char dark:text-oko-cream">
            ${formatPrice((product?.price || 0) * quantity)}
          </span>
          {quantity > 1 && (
            <span className="font-inter text-[11px] text-oko-stone">
              ${formatPrice(product?.price || 0)} each
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-0.5">
          {/* Quantity stepper — bordered squares, char-inversion hover */}
          <div className="inline-flex items-stretch rounded-[2px] border border-oko-char dark:border-oko-cream">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => decreaseProductQuantity(item)}
              className="w-[30px] h-[30px] flex items-center justify-center text-[16px] leading-none text-oko-char dark:text-oko-cream hover:bg-oko-char hover:text-oko-cream dark:hover:bg-oko-cream dark:hover:text-oko-char disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              −
            </button>
            <span className="w-[30px] h-[30px] flex items-center justify-center font-oko-mono text-[13px] text-oko-char dark:text-oko-cream border-x border-oko-char dark:border-oko-cream select-none">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => increaseProductQuantity(item)}
              className="w-[30px] h-[30px] flex items-center justify-center text-[16px] leading-none text-oko-char dark:text-oko-cream hover:bg-oko-char hover:text-oko-cream dark:hover:bg-oko-cream dark:hover:text-oko-char transition-colors"
            >
              +
            </button>
          </div>

          <button
            type="button"
            aria-label="Remove item"
            onClick={() => removeCartItem(item)}
            className="text-oko-stone hover:text-oko-barn dark:text-oko-stone dark:hover:text-oko-barn-light transition-colors"
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
        className="fixed inset-0 bg-oko-char/60 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 flex justify-end">
          <DialogPanel
            transition
            className="w-screen max-w-[420px] h-full bg-white dark:bg-oko-night-2 border-l border-oko-stone-line dark:border-oko-line-dark flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[closed]:translate-x-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-oko-stone-line dark:border-oko-line-dark flex-shrink-0">
              <h2 className="flex items-baseline gap-2 font-oko-display font-semibold text-[21px] leading-[1.2] text-oko-char dark:text-oko-cream">
                Your cart
                {cartItemsCount > 0 && (
                  <span className="font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-stone">
                    {cartItemsCount} item{cartItemsCount !== 1 ? "s" : ""}
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="w-8 h-8 rounded-[2px] flex items-center justify-center text-oko-stone hover:text-oko-char dark:hover:text-oko-cream transition-colors"
              >
                <XIcon />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5">
              {loadingCartItems ? (
                <>
                  <ItemPlaceholder />
                  <ItemPlaceholder />
                  <ItemPlaceholder />
                </>
              ) : cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <h3 className="font-oko-display font-semibold text-[21px] leading-[1.2] text-oko-char dark:text-oko-cream mb-2">
                    Your cart is empty
                  </h3>
                  <p className="font-inter text-[13.5px] text-oko-stone mb-6 max-w-[240px]">
                    Browse the lineup and add a grill to get started.
                  </p>
                  <Link
                    prefetch={false}
                    href={`${BASE_URL}/grills`}
                    onClick={onClose}
                    className="px-6 py-3 rounded-[2px] bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[13.5px] transition-colors"
                  >
                    Shop grills
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
              <div className="bg-oko-cream-dim dark:bg-oko-night-3 border-t border-oko-stone-line dark:border-oko-line-dark px-5 py-4 flex-shrink-0">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-inter text-[14px] font-semibold text-oko-char dark:text-oko-cream">
                    Subtotal
                  </span>
                  <span className="font-oko-display font-semibold text-[21px] leading-none text-oko-char dark:text-oko-cream">
                    ${formatPrice(subtotal)}
                  </span>
                </div>
                <p className="font-inter text-[12px] text-oko-stone mb-4">
                  Shipping &amp; tax calculated at checkout.
                </p>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3 rounded-[2px] bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[13.5px] transition-colors mb-2"
                >
                  Checkout
                </button>
                <Link
                  prefetch={false}
                  href={`${BASE_URL}/cart`}
                  onClick={onClose}
                  className="block w-full py-3 rounded-[2px] border border-oko-char dark:border-oko-cream text-oko-char dark:text-oko-cream font-inter font-semibold text-[13.5px] text-center hover:bg-oko-char hover:text-oko-cream dark:hover:bg-oko-cream dark:hover:text-oko-char transition-colors"
                >
                  View cart
                </Link>
              </div>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
