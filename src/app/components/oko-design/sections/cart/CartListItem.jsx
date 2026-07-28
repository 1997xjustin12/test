"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/app/context/cart";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, formatProduct, createSlug } from "@/app/lib/helpers";

// OKO cart line item — white bordered card, cream-dim image well, three-part
// price (was / now / Save), a 34px bordered quantity stepper that inverts to
// char on hover (matches ProductInfo/AddToCartWidget), and a subtle stone→barn
// remove control.
export default function CartListItem({ item, onItemCountUpdate }) {
  const { removeCartItem } = useCart();
  const [product, setProduct] = useState(item);

  useEffect(() => {
    setProduct(formatProduct(item, "cart_item"));
  }, [item]);

  const handleRemoveItem = () => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      removeCartItem(item);
    }
  };

  const handleCount = (increment) => {
    onItemCountUpdate({ product: item, increment });
  };

  const qty = product?.quantity || 1;

  return (
    <div className="bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] p-4">
      <div className="flex gap-4">
        {/* Image well */}
        <Link prefetch={false} href={product?.url || "#"} className="flex-shrink-0">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 overflow-hidden bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px]">
            {product?.image && (
              <Image
                src={product.image}
                alt={createSlug(product?.title || "")}
                fill
                className="object-contain p-1.5"
                sizes="(max-width: 640px) 96px, 112px"
              />
            )}
          </div>
        </Link>

        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <Link
            prefetch={false}
            href={product?.url || "#"}
            className="font-inter text-[14px] font-medium leading-[1.3] text-oko-char dark:text-oko-cream hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors line-clamp-2"
          >
            {product?.title}
          </Link>

          {/* Three-part price: struck "was" → "now" → sage "Save $X" */}
          <div className="flex items-baseline flex-wrap gap-x-2.5 gap-y-1">
            {!!product?.was && (
              <span className="font-inter text-[12px] text-oko-stone line-through">
                ${formatPrice(product.was)}
              </span>
            )}
            <span className="font-inter font-semibold text-[16px] text-oko-char dark:text-oko-cream">
              ${formatPrice(product?.price || 0)}
            </span>
            {product?.save_amt > 0 && (
              <span className="font-inter font-semibold text-[12px] text-oko-sage dark:text-oko-sage-light">
                Save ${formatPrice(product.save_amt)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto pt-1 flex-wrap gap-3">
            {/* Quantity stepper — three 34px bordered squares, char-inversion hover */}
            <div className="inline-flex items-stretch rounded-[2px] border border-oko-char dark:border-oko-cream">
              <button
                onClick={() => handleCount(false)}
                type="button"
                aria-label="Decrease quantity"
                className="w-[34px] h-[34px] flex items-center justify-center text-[18px] leading-none text-oko-char dark:text-oko-cream hover:bg-oko-char hover:text-oko-cream dark:hover:bg-oko-cream dark:hover:text-oko-char transition-colors"
              >
                −
              </button>
              <span className="w-[34px] h-[34px] flex items-center justify-center font-oko-mono text-[14px] text-oko-char dark:text-oko-cream border-x border-oko-char dark:border-oko-cream select-none">
                {qty}
              </span>
              <button
                onClick={() => handleCount(true)}
                type="button"
                aria-label="Increase quantity"
                className="w-[34px] h-[34px] flex items-center justify-center text-[18px] leading-none text-oko-char dark:text-oko-cream hover:bg-oko-char hover:text-oko-cream dark:hover:bg-oko-cream dark:hover:text-oko-char transition-colors"
              >
                +
              </button>
            </div>

            <div className="flex items-center gap-3.5">
              <span className="font-inter font-semibold text-[16px] text-oko-char dark:text-oko-cream">
                ${formatPrice((product?.price || 0) * qty)}
              </span>
              <button
                type="button"
                aria-label="Remove item"
                onClick={handleRemoveItem}
                className="text-oko-stone hover:text-oko-barn dark:text-oko-stone dark:hover:text-oko-barn-light transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
