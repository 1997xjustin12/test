"use client";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/app/lib/helpers";
import { useSolanaCategories } from "@/app/context/category";
import CompareItemAddToCart from "@/app/components/oko-design/sections/sp/CompareItemAddToCart";

// One product's column head on /compare, OKO's design (oko-design-patterns.md,
// after the 8.10 product card): cream image well, barn brand eyebrow, Inter
// name and price, the solid barn add-to-cart. 2px corners, no shadow, no
// emoji.
export default function CompareProductHeader({ product, onRemove }) {
  const { isPriceVisible } = useSolanaCategories();
  const priceVisible = isPriceVisible(product?.product_category, product?.brand);

  return (
    <div className="relative flex flex-col h-full p-3 sm:p-4">
      <button
        type="button"
        onClick={() => onRemove(product.handle)}
        aria-label={`Remove ${product.name} from the comparison`}
        className="absolute top-2 right-2 z-[1] w-7 h-7 rounded-[2px] bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark text-oko-char-soft dark:text-oko-ondark hover:bg-oko-char hover:text-oko-cream hover:border-oko-char dark:hover:bg-oko-cream dark:hover:text-oko-char flex items-center justify-center transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <Link href={product.url || "#"} prefetch={false} className="block">
        <div className="relative aspect-[4/3] bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] overflow-hidden">
          {product.image && (
            <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 160px, 260px" className="object-contain p-3" />
          )}
        </div>
      </Link>

      <p className="mt-3 font-inter text-[11px] font-semibold uppercase tracking-[0.04em] text-oko-barn dark:text-oko-barn-light line-clamp-1">
        {product.brand}
      </p>
      <Link href={product.url || "#"} prefetch={false}>
        <h2 className="mt-1 font-inter font-medium text-[14px] leading-[1.3] text-oko-char dark:text-oko-cream line-clamp-3 hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors">
          {product.name}
        </h2>
      </Link>

      <div className="mt-auto pt-3">
        {priceVisible ? (
          <div className="flex items-baseline gap-1.5 flex-wrap">
            {!!product.was && <span className="text-[12px] text-oko-stone line-through">${formatPrice(product.was)}</span>}
            <span className="font-inter font-semibold text-[16px] text-oko-char dark:text-oko-cream">${formatPrice(product.price)}</span>
          </div>
        ) : (
          <p className="font-inter font-semibold text-[13px] text-oko-char-soft dark:text-oko-ondark">Contact us for pricing.</p>
        )}
        {/* OKO's shared compare button: solid barn, the primary action (§5) —
            the same one as the product page's comparison table. */}
        <div className="mt-2">
          <CompareItemAddToCart product={product} label="Add to cart" />
        </div>
      </div>
    </div>
  );
}

export function CompareProductHeaderCompact({ product }) {
  const { isPriceVisible } = useSolanaCategories();
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="relative w-10 h-10 flex-shrink-0 bg-oko-cream-dim rounded-[2px] overflow-hidden">
        {product.image && <Image src={product.image} alt="" fill sizes="40px" className="object-contain p-0.5" />}
      </div>
      <div className="min-w-0">
        <p className="font-inter text-[12px] font-semibold text-oko-cream line-clamp-1">{product.name}</p>
        <p className="font-inter text-[12px] text-oko-ondark-muted">
          {isPriceVisible(product?.product_category, product?.brand) ? `$${formatPrice(product.price)}` : "Call for price"}
        </p>
      </div>
    </div>
  );
}

// Brass stars only (§2), with a text equivalent (§12).
export function CompareRating({ product }) {
  if (!product?.reviews) return <span className="text-oko-stone">No reviews</span>;
  const rounded = Math.round(product.rating || 0);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-oko-brass tracking-[1px]" aria-hidden="true">
        {"★".repeat(rounded)}
        {"☆".repeat(Math.max(0, 5 - rounded))}
      </span>
      <span>({product.reviews})</span>
      <span className="sr-only">Rated {product.rating} out of 5, {product.reviews} reviews</span>
    </span>
  );
}
