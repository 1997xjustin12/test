"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/app/context/cart";
import Link from "next/link";
import Image from "next/image";
import { BASE_URL, formatPrice, formatProduct, createSlug } from "@/app/lib/helpers";

export default function CartListItem({ item, onItemCountUpdate }) {
  const { removeCartItem } = useCart();
  const [product, setProduct] = useState(item); 
  const [thumbnail, setThumbnail] = useState(null);

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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex gap-4">
        <Link prefetch={false} href={product.url || "#"} className="flex-shrink-0">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            {product?.image && (
              <Image
                src={product.image}
                alt={createSlug(product?.title || product?.product_title || "")}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 96px, 112px"
              />
            )}
          </div>
        </Link>

        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <Link
            prefetch={false}
            href={product?.url || "#"}
            className="text-sm font-semibold text-charcoal dark:text-white hover:text-theme-500 dark:hover:text-theme-400 transition-colors line-clamp-2 leading-snug"
          >
            {product?.title || product?.product_title}
          </Link>

          <div className="flex items-center flex-wrap gap-2">
            <span className="text-sm font-bold text-charcoal dark:text-white">
              ${formatPrice(product?.price || 0)}
            </span>
            { !!product?.was && (
              <>
                <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                  ${formatPrice(product?.was || 0)}
                </span>
                <span className="text-[10px] font-bold text-white bg-theme-500 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                  {product?.save_pct}% off
                </span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto pt-1 flex-wrap gap-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleCount(false)}
                type="button"
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-charcoal dark:text-white transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 18 2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M1 1h16" />
                </svg>
              </button>
              <span className="w-8 text-center text-sm font-semibold text-charcoal dark:text-white select-none">
                {product?.quantity}
              </span>
              <button
                onClick={() => handleCount(true)}
                type="button"
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-charcoal dark:text-white transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 18 18">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 1v16M1 9h16" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {product?.save_amt > 0 && (
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                  Save ${formatPrice(product?.save_amt * (product?.quantity || 1))}
                </span>
              )}
              <span className="text-sm font-bold text-charcoal dark:text-white">
                ${formatPrice((product?.price || 0) * (product?.quantity || 1))}
              </span>
              <button
                type="button"
                title="Remove item"
                onClick={handleRemoveItem}
                className="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
