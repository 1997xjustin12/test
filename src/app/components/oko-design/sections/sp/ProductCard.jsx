"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FicDropDown from "@/app/components/oko-design/ui/FicDropDown";
import { ICRoundPhone, Eos3DotsLoading } from "@/app/components/icons/lib";
import StarRating from "@/app/components/oko-design/sections/sp/StarRating";
import { formatPrice } from "@/app/lib/helpers";
import { useCart } from "@/app/context/cart";
import { useQuickView } from "@/app/context/quickview";

// Phone is a first-class OKO brand element — always this exact literal (spec §10).
const OKO_PHONE = "888-667-4986";
const OKO_PHONE_HREF = "tel:8886674986";

const BADGE_STYLES = {
  bestseller: "bg-oko-char text-white",
  sale: "bg-oko-barn text-white",
  new: "bg-oko-sage text-white",
  openbox: "bg-oko-stone text-white",
};
const BADGE_LABELS = {
  bestseller: "Bestseller",
  sale: "Sale",
  new: "New",
  openbox: "Open box",
};

// Product card (spec §8.10) — white/bordered, cream-dim image well, barn brand
// eyebrow → name → review line → three-part price. No shadow, no lift on hover.
const ProductCard = ({ p }) => {
  const { addToCart } = useCart();
  const { viewItem } = useQuickView();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await addToCart({ ...p, quantity: 1 });
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="group flex flex-col bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px]">
      {/* Media */}
      <Link
        prefetch={false}
        href={p?.url || "#"}
        title={p?.title}
        tabIndex={-1}
        aria-hidden="true"
        className="relative aspect-square bg-oko-cream-dim dark:bg-oko-night-3 border-b border-oko-stone-line dark:border-oko-line-dark overflow-hidden block"
      >
        {p?.image && (
          <Image
            src={p.image}
            alt={p?.name || "Product Image"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
            priority={false}
          />
        )}
        {p?.badge && BADGE_STYLES[p.badge] && (
          <span className={`absolute top-2.5 left-2.5 font-inter text-[10px] font-semibold px-2 py-1 uppercase tracking-[0.04em] rounded-[2px] ${BADGE_STYLES[p.badge]}`}>
            {BADGE_LABELS[p.badge]}
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-col gap-1.5 p-4 flex-1">
        <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.04em] text-oko-barn dark:text-oko-barn-light line-clamp-1">
          {p?.brand}
        </p>
        <Link
          prefetch={false}
          href={p?.url || "#"}
          title={p?.title}
          className="font-inter text-[14px] font-medium text-oko-char dark:text-oko-cream leading-[1.3] line-clamp-2 min-h-[36px] hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
        >
          {p?.name}
        </Link>
        <StarRating rating={p?.ratings || 0} showCount count={p?.reviews} />

        {/* Price */}
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-3 mt-auto border-t border-oko-stone-line dark:border-oko-line-dark">
          {!!p?.was && (
            <span className="font-inter text-[12px] text-oko-stone line-through order-2 md:order-1">
              ${formatPrice(p.was)}
            </span>
          )}
          <span className="font-inter font-semibold text-[16px] text-oko-char dark:text-oko-cream order-1 md:order-2">
            ${formatPrice(p?.price)}
          </span>
          {!!p?.save_amt && (
            <span className="w-full font-inter text-[11px] font-semibold text-oko-sage dark:text-oko-sage-light order-3">
              Save ${formatPrice(p.save_amt)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        {/* Quick view */}
        <button
          type="button"
          onClick={() => viewItem(p)}
          aria-label="Quick view"
          className="w-9 h-9 min-w-[36px] flex items-center justify-center rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark text-oko-char dark:text-oko-cream hover:bg-oko-char hover:text-oko-cream dark:hover:bg-oko-cream dark:hover:text-oko-char hover:border-oko-char dark:hover:border-oko-cream transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>

        {/* Add to cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={loading}
          aria-label={`Add ${p?.name || "product"} to cart`}
          className="relative flex-1 h-9 flex items-center justify-center font-inter font-semibold text-[13px] text-white bg-oko-barn hover:bg-oko-barn-dark rounded-[2px] transition-colors disabled:opacity-60"
        >
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${loading ? "" : "invisible"}`}>
            <Eos3DotsLoading />
          </div>
          <span className={`hidden md:block ${loading ? "invisible" : ""}`}>Add to cart</span>
          <span className={`block md:hidden ${loading ? "invisible" : ""}`} aria-hidden="true">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </span>
        </button>

        {/* Call */}
        <Link
          href={OKO_PHONE_HREF}
          aria-label={`Call ${OKO_PHONE}`}
          className="h-9 px-2.5 flex items-center justify-center border border-oko-barn dark:border-oko-barn-light text-oko-barn dark:text-oko-barn-light font-inter font-semibold text-[13px] hover:bg-oko-barn/10 rounded-[2px] transition-colors whitespace-nowrap"
        >
          <span className="hidden md:block">Call</span>
          <span className="block md:hidden" aria-hidden="true">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </span>
        </Link>
      </div>

      {/* Found it cheaper */}
      <div className="px-4 pb-4 -mt-1">
        <FicDropDown contact_number={OKO_PHONE}>
          <div className="font-inter text-[12px] text-oko-sage dark:text-oko-sage-light flex items-center cursor-default gap-[7px] flex-wrap justify-center lg:justify-start">
            Found it cheaper?
            <div className="hover:underline flex items-center gap-[3px] cursor-pointer">
              <ICRoundPhone width={14} height={14} />
              <span>{OKO_PHONE}</span>
            </div>
          </div>
        </FicDropDown>
      </div>
    </article>
  );
};

export default ProductCard;
