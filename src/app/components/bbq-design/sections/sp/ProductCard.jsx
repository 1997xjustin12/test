"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FicDropDown from "@/app/components/bbq-design/ui/FicDropDown";
import { ICRoundPhone, Eos3DotsLoading } from "@/app/components/icons/lib";
import StarRating from "@/app/components/bbq-design/sections/sp/StarRating";

const BADGE_STYLES = {
  bestseller: "bg-gold text-white",
  sale:       "bg-ember text-white",
  new:        "bg-char text-white",
  openbox:    "bg-smoke text-white",
};
const BADGE_LABELS = {
  bestseller: "Bestseller",
  sale:       "Sale",
  new:        "New",
  openbox:    "Open Box",
};
import { formatPrice } from "@/app/lib/helpers";
import { STORE_CONTACT } from "@/app/lib/store_constants";
import { useCart } from "@/app/context/cart";
import { useQuickView } from "@/app/context/quickview";

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
    <article className="group flex flex-col bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm overflow-hidden hover:border-theme-600 dark:hover:border-theme-600/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-char/10 dark:hover:shadow-black/30 transition-all duration-200">

      {/* Image */}
      <Link
        prefetch={false}
        href={p?.url || "#"}
        title={p?.title}
        className="relative h-40 sm:h-48 bg-white dark:bg-char overflow-hidden"
      >
        {p?.image && (
          <Image
            src={p.image}
            alt={p?.name || "Product Image"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            priority={false}
          />
        )}
        {p?.badge && BADGE_STYLES[p.badge] && (
          <div className="absolute top-2 left-2">
            <span className={`font-oswald text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wide ${BADGE_STYLES[p.badge]}`}>
              {BADGE_LABELS[p.badge]}
            </span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-col gap-1.5 p-3 flex-1">
        <p className="font-oswald text-[10px] font-semibold uppercase tracking-widest text-theme-600 line-clamp-1">
          {p?.brand}
        </p>
        <Link
          prefetch={false}
          href={p?.url || "#"}
          title={p?.title}
          className="font-sora text-xs sm:text-sm font-semibold text-char dark:text-ash leading-snug line-clamp-2 min-h-[36px] hover:text-theme-600 dark:hover:text-theme-500 transition-colors"
        >
          {p?.name}
        </Link>
        <StarRating rating={p?.ratings} showCount count={p?.reviews} />

        {/* Price */}
        <div className="flex items-baseline gap-1.5 pt-3 mt-auto border-t border-grate dark:border-white/10">
          <span className="font-oswald font-bold text-base text-ember-deep dark:text-ember">
            ${formatPrice(p?.price)}
          </span>
          {!!p?.was && (
            <span className="text-xs text-char/40 dark:text-ash/30 line-through">
              ${formatPrice(p.was)}
            </span>
          )}
          {!!p?.save_amt && (
            <span className="font-oswald text-[10px] font-bold text-bbq-green">
              −${formatPrice(p.save_amt)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-3 pb-3 flex gap-2">
        {/* Quick view */}
        <button
          onClick={() => viewItem(p)}
          aria-label="Quick view"
          className="w-9 h-9 min-w-[36px] flex items-center justify-center rounded-sm bg-ash dark:bg-white/10 text-char/50 dark:text-ash/40 hover:bg-theme-600 hover:text-white dark:hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="relative flex-1 h-9 flex items-center justify-center font-oswald font-semibold text-xs uppercase tracking-wide text-white bg-theme-600 hover:bg-theme-700 rounded-sm transition-colors disabled:opacity-60"
        >
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${loading ? "" : "invisible"}`}>
            <Eos3DotsLoading />
          </div>
          <span className={loading ? "invisible" : ""}>Add to Cart</span>
        </button>

        {/* Call */}
        <Link
          href={`tel:${STORE_CONTACT}`}
          className="h-9 px-2.5 flex items-center justify-center border border-theme-600 text-theme-600 font-oswald font-semibold text-xs uppercase tracking-wide hover:bg-theme-600/10 rounded-sm transition-colors whitespace-nowrap"
        >
          Call
        </Link>
      </div>

      {/* Found it cheaper */}
      <div className="px-3 pb-3 -mt-1">
        <FicDropDown contact_number={STORE_CONTACT}>
          <div className="text-xs text-white flex items-center cursor-default gap-[7px] flex-wrap hover:text-theme-600 transition-colors">
            Found It Cheaper?
            <div className="hover:underline flex items-center gap-[3px] cursor-pointer">
              <ICRoundPhone width={14} height={14} />
              <span>{STORE_CONTACT}</span>
            </div>
          </div>
        </FicDropDown>
      </div>
    </article>
  );
};

export default ProductCard;
