"use client";
import { useState, useMemo } from "react";
import { useSolanaCategories } from "@/app/context/category";
import { useCart } from "@/app/context/cart";

import Link from "next/link";
import Image from "next/image";

import FicDropDown from "@/app/components/oko-design/ui/FicDropDown";
import { STORE_CONTACT } from "@/app/lib/store_constants";
import { useQuickView } from "@/app/context/quickview";
import { formatPrice, formatProduct, productIsFreeshipping } from "@/app/lib/helpers";
import { Eos3DotsLoading } from "@/app/components/icons/lib";
import CompareToggle from "@/app/components/compare/CompareToggle";

// The listing-grid card, in OKO's own design: the homepage card's look
// (oko-design/sections/Products.jsx, 8.10 — white, bordered, 2px radius, barn
// brand eyebrow, brass stars, sage savings) with what a listing card also
// needs: quick view, a labelled add-to-cart, hidden-price categories and the
// "Found it cheaper?" call line. It used to be an unchanged copy of the BBQ
// card, BBQ's colours and corners inside OKO's grid. No emoji (§6).

const BADGE_STYLES = {
  bestseller: "bg-oko-brass text-white",
  sale: "bg-oko-barn text-white",
  new: "bg-oko-char text-oko-cream dark:bg-oko-cream dark:text-oko-char",
  openbox: "bg-oko-char-soft text-white",
};
const BADGE_LABELS = {
  bestseller: "Bestseller",
  sale: "Sale",
  new: "New",
  openbox: "Open Box",
};

const badgeCls = "font-inter font-semibold text-[10px] uppercase tracking-[0.04em] px-2 py-1 rounded-[2px]";

function ProductThumb({ product }) {
  const mainImage = useMemo(() => {
    return product?.images?.find(({ position }) => position == 1)?.src;
  }, [product]);

  if (!mainImage) return null;

  return (
    <Image
      src={mainImage}
      alt={product?.name || "Product Image"}
      fill
      // Grids using this card are 2-col on mobile / 4-col from lg — declaring
      // 100vw made the browser pick a candidate ~2x wider than needed on phones.
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
      priority={false}
    />
  );
}

function Stars({ rating }) {
  const rounded = Math.round(rating || 0);
  return (
    <span className="text-oko-brass tracking-[1px]" aria-hidden="true">
      {"★".repeat(rounded)}
      {"☆".repeat(Math.max(0, 5 - rounded))}
    </span>
  );
}

function ProductCard({ hit, page_details, onCompare }) {
  const { viewItem } = useQuickView();
  const { addToCart } = useCart();
  const { isPriceVisible } = useSolanaCategories();
  const [product] = useState(formatProduct(hit, "card"));
  const [atcLoading, setAtcLoading] = useState(false);
  const priceVisible = isPriceVisible(hit?.product_category, hit?.brand);
  const freeShipping = productIsFreeshipping(hit?.tags);
  const hasReviews = product?.reviews > 0;

  async function handleAdd() {
    setAtcLoading(true);
    try {
      await addToCart({ ...formatProduct(product), quantity: 1 });
    } catch (err) {
      console.log("[ERROR]", err);
    } finally {
      setAtcLoading(false);
    }
  }

  return (
    <article className="group flex flex-col h-full bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] hover:border-oko-char/40 dark:hover:border-oko-ondark-faint transition-colors">
      {/* Media */}
      <div className="relative aspect-1 bg-oko-cream-dim dark:bg-oko-night-3 border-b border-oko-stone-line dark:border-oko-line-dark overflow-hidden">
        <Link aria-label={product?.name} title={product?.name} href={product?.url || "#"} prefetch={false}>
          <ProductThumb product={hit} />
        </Link>

        {/* Badges: the product's badge top-left, free shipping beside it. */}
        {(product?.badge || freeShipping) && (
          <div className="absolute top-2.5 left-2.5 right-2.5 z-[1] flex flex-wrap gap-1.5 pointer-events-none">
            {product?.badge && BADGE_LABELS[product.badge] && (
              <span className={`${badgeCls} ${BADGE_STYLES[product.badge]}`}>{BADGE_LABELS[product.badge]}</span>
            )}
            {freeShipping && <span className={`${badgeCls} bg-oko-sage text-white`}>Free shipping</span>}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <p
          title={product?.brand}
          className="font-inter text-[11px] font-semibold uppercase tracking-[0.04em] text-oko-barn dark:text-oko-barn-light line-clamp-1"
        >
          {product?.brand}
        </p>

        <Link aria-label={product?.name} title={product?.name} href={product?.url || "#"} prefetch={false} className="mt-1.5">
          <h2 className="font-inter font-medium text-[14px] leading-[1.3] min-h-[36px] text-oko-char dark:text-oko-cream group-hover:text-oko-barn dark:group-hover:text-oko-barn-light transition-colors line-clamp-2">
            {product?.name}
          </h2>
        </Link>

        {/* Review line */}
        <div className="mt-1.5 text-[11.5px] text-oko-stone">
          {hasReviews ? (
            <>
              <Stars rating={product?.ratings} />
              <span className="ml-1.5">{product.reviews} reviews</span>
              <span className="sr-only">
                Rated {product?.ratings} out of 5, {product.reviews} reviews
              </span>
            </>
          ) : (
            "No reviews"
          )}
        </div>

        {/* Price */}
        <div className="mt-auto pt-3.5 min-h-[52px]">
          {!priceVisible ? (
            <p className="font-inter font-semibold text-[13px] text-oko-char-soft dark:text-oko-ondark">
              Contact us for pricing.
            </p>
          ) : (
            <>
              {!!product?.was && (
                <span className="text-[12px] text-oko-stone line-through mr-1.5">${formatPrice(product.was)}</span>
              )}
              <span className="font-inter font-semibold text-[16px] text-oko-char dark:text-oko-cream">
                ${formatPrice(product?.price)}
              </span>
              {!!(product?.was && product?.was > product?.price) && (
                <span className="block font-inter font-semibold text-[11px] text-oko-sage dark:text-oko-sage-light mt-0.5">
                  Save ${formatPrice(product.was - product.price)}
                </span>
              )}
            </>
          )}
        </div>

        {/* Actions: quick view, then add to cart — outline buttons that invert
            to char on hover, as on the homepage card. */}
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            title="Quick View"
            onClick={() => viewItem(hit)}
            aria-label={`Quick view ${product?.name || ""}`.trim()}
            className="flex-shrink-0 w-[36px] h-[36px] flex items-center justify-center border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] text-oko-char-soft dark:text-oko-ondark hover:border-oko-char hover:bg-oko-char hover:text-oko-cream dark:hover:border-oko-cream dark:hover:bg-oko-cream dark:hover:text-oko-char transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={atcLoading}
            aria-label={`Add ${product?.name || "product"} to cart`}
            className="relative flex-1 h-[36px] flex items-center justify-center gap-1.5 px-3 border border-oko-char dark:border-oko-cream rounded-[2px] font-inter font-semibold text-[12.5px] text-oko-char dark:text-oko-cream hover:bg-oko-char hover:text-oko-cream dark:hover:bg-oko-cream dark:hover:text-oko-char disabled:opacity-60 transition-colors"
          >
            {atcLoading ? (
              <Eos3DotsLoading />
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6h15l-1.5 9h-12z" />
                  <path d="M6 6 5 3H2" />
                  <circle cx="9" cy="20" r="1.25" />
                  <circle cx="18" cy="20" r="1.25" />
                </svg>
                <span className="hidden sm:inline">Add to cart</span>
              </>
            )}
          </button>
        </div>

        <CompareToggle product={hit} className="mt-2.5" />

        <FicDropDown contact_number={page_details?.contact_number}>
          <div className="mt-2.5 font-inter text-[12px] text-oko-stone flex items-center cursor-default gap-1.5 flex-wrap justify-center lg:justify-start">
            {!priceVisible ? <>Call for price</> : <>Found it cheaper?</>}
            <span className="flex items-center gap-1 font-semibold text-oko-barn dark:text-oko-barn-light hover:underline cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {page_details?.contact_number || STORE_CONTACT}
            </span>
          </div>
        </FicDropDown>
      </div>
    </article>
  );
}

export default ProductCard;
