"use client";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/app/lib/helpers";
import { useSolanaCategories } from "@/app/context/category";
import StarRating from "@/app/components/bbq-design/ui/StarRating";
import CompareItemAddToCart from "@/app/components/bbq-design/sections/sp/CompareItemAddToCart";

// One product's column head on /compare, BBQ's design: white image well,
// Oswald brand label and price, near-square theme CTA (bbq-design-patterns.md).
export default function CompareProductHeader({ product, onRemove }) {
  const { isPriceVisible } = useSolanaCategories();
  const priceVisible = isPriceVisible(product?.product_category, product?.brand);

  return (
    <div className="relative flex flex-col h-full p-3 sm:p-4">
      <button
        type="button"
        onClick={() => onRemove(product.handle)}
        aria-label={`Remove ${product.name} from the comparison`}
        className="absolute top-2 right-2 z-[1] w-7 h-7 rounded-sm bg-char dark:bg-ash text-ash dark:text-char hover:bg-theme-600 hover:text-white flex items-center justify-center transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <Link href={product.url || "#"} prefetch={false} className="block">
        <div className="relative aspect-[4/3] bg-white dark:bg-char border border-grate dark:border-white/10 rounded-sm overflow-hidden">
          {product.image && (
            <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 160px, 260px" className="object-contain p-3" />
          )}
        </div>
      </Link>

      <p className="mt-3 font-oswald text-[10px] uppercase tracking-widest text-theme-600 line-clamp-1">{product.brand}</p>
      <Link href={product.url || "#"} prefetch={false}>
        <h2 className="mt-1 font-sora text-sm font-semibold leading-snug text-char dark:text-ash line-clamp-3 hover:text-theme-600 dark:hover:text-theme-500 transition-colors">
          {product.name}
        </h2>
      </Link>

      <div className="mt-auto pt-3">
        {priceVisible ? (
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-oswald text-lg font-bold text-ember-deep dark:text-ember">${formatPrice(product.price)}</span>
            {!!product.was && <span className="font-oswald text-xs text-char/40 dark:text-ash/30 line-through">${formatPrice(product.was)}</span>}
          </div>
        ) : (
          <p className="font-oswald font-medium text-sm text-char/60 dark:text-ash/50">Contact us for pricing.</p>
        )}
        <CompareItemAddToCart
          product={product}
          label="Add to Cart"
          className="mt-2 w-full rounded-sm bg-theme-600 hover:bg-theme-700 text-white font-oswald text-xs font-semibold uppercase tracking-wide py-2 transition-colors"
        />
      </div>
    </div>
  );
}

export function CompareProductHeaderCompact({ product }) {
  const { isPriceVisible } = useSolanaCategories();
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="relative w-10 h-10 flex-shrink-0 bg-white dark:bg-char border border-grate dark:border-white/10 rounded-sm overflow-hidden">
        {product.image && <Image src={product.image} alt="" fill sizes="40px" className="object-contain p-0.5" />}
      </div>
      <div className="min-w-0">
        <p className="font-sora text-xs font-semibold text-char dark:text-ash line-clamp-1">{product.name}</p>
        <p className="font-oswald text-xs text-ember-deep dark:text-ember">
          {isPriceVisible(product?.product_category, product?.brand) ? `$${formatPrice(product.price)}` : "Call for price"}
        </p>
      </div>
    </div>
  );
}

export function CompareRating({ product }) {
  if (!product?.reviews) return <span className="text-char/40 dark:text-ash/30">No reviews</span>;
  return (
    <span className="inline-flex items-center gap-1.5">
      <StarRating rating={product.rating} />
      <span>({product.reviews})</span>
    </span>
  );
}
