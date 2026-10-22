"use client";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/app/lib/helpers";
import { useSolanaCategories } from "@/app/context/category";
import StarRating from "@/app/components/new-design/ui/StarRating";
import CompareItemAddToCart from "@/app/components/new-design/sections/sp/CompareItemAddToCart";

// One product's column head on /compare, Solana's design: soft card image
// well, serif name, theme-colour primary button (new-design-patterns.md).
export default function CompareProductHeader({ product, onRemove }) {
  const { isPriceVisible } = useSolanaCategories();
  const priceVisible = isPriceVisible(product?.product_category, product?.brand);

  return (
    <div className="relative flex flex-col h-full p-3 sm:p-4">
      <button
        type="button"
        onClick={() => onRemove(product.handle)}
        aria-label={`Remove ${product.name} from the comparison`}
        className="absolute top-2 right-2 z-[1] w-7 h-7 rounded-full bg-white/90 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-white hover:bg-neutral-800 dark:hover:bg-neutral-600 flex items-center justify-center transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <Link href={product.url || "#"} prefetch={false} className="block">
        <div className="relative aspect-[4/3] rounded-xl bg-neutral-50 dark:bg-neutral-800 overflow-hidden">
          {product.image && (
            <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 160px, 260px" className="object-contain p-3" />
          )}
        </div>
      </Link>

      <p className="mt-3 text-[11px] uppercase tracking-widest font-medium text-neutral-400 dark:text-neutral-500 line-clamp-1">
        {product.brand}
      </p>
      <Link href={product.url || "#"} prefetch={false}>
        <h2
          className="mt-1 text-sm font-semibold leading-snug text-neutral-900 dark:text-white line-clamp-3 hover:text-theme-600 dark:hover:text-theme-500 transition-colors"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {product.name}
        </h2>
      </Link>

      <div className="mt-auto pt-3">
        {priceVisible ? (
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-lg font-bold text-neutral-900 dark:text-white">${formatPrice(product.price)}</span>
            {!!product.was && <span className="text-xs text-neutral-400 line-through">${formatPrice(product.was)}</span>}
          </div>
        ) : (
          <p className="text-sm font-medium text-stone-700 dark:text-stone-300">Contact us for pricing.</p>
        )}
        <CompareItemAddToCart
          product={product}
          label="Add to Cart"
          className="mt-2 w-full rounded-xl bg-theme-600 hover:bg-theme-500 text-white text-xs font-semibold py-2 transition-colors"
        />
      </div>
    </div>
  );
}

// The shrunk version for the sticky bar: image, name and price only.
export function CompareProductHeaderCompact({ product }) {
  const { isPriceVisible } = useSolanaCategories();
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="relative w-10 h-10 flex-shrink-0 rounded-lg bg-neutral-50 dark:bg-neutral-800 overflow-hidden">
        {product.image && <Image src={product.image} alt="" fill sizes="40px" className="object-contain p-0.5" />}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-neutral-900 dark:text-white line-clamp-1">{product.name}</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {isPriceVisible(product?.product_category, product?.brand) ? `$${formatPrice(product.price)}` : "Call for price"}
        </p>
      </div>
    </div>
  );
}

// The rating cell, with the same star component as the product cards.
export function CompareRating({ product }) {
  if (!product?.reviews) return <span className="text-neutral-400 dark:text-neutral-500">No reviews</span>;
  return (
    <span className="inline-flex items-center gap-1.5">
      <StarRating rating={product.rating} />
      <span>({product.reviews})</span>
    </span>
  );
}
