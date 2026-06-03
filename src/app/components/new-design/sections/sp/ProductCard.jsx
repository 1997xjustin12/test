"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AddToCartButtonWrap from "@/app/components/atom/AddToCartButtonWrap";
import FicDropDown from "@/app/components/new-design/ui/FicDropDown";
import { ICRoundPhone } from "@/app/components/icons/lib";
import StarRating from "@/app/components/new-design/sections/sp/StarRating";
import Badge from "@/app/components/new-design/sections/sp/Badge";
import { Eos3DotsLoading } from "@/app/components/icons/lib";
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
    <article className="group flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-neutral-200/60 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300">

      {/* Image */}
      <Link
        prefetch={false}
        href={p?.url || "#"}
        title={p?.title}
        className="relative h-40 sm:h-52 bg-neutral-100 dark:bg-neutral-800 overflow-hidden"
      >
        {p?.image && (
          <Image
            src={p.image}
            alt={p?.name || "Product Image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            priority={false}
          />
        )}
        {p?.badge && (
          <div className="absolute top-2 left-2">
            <Badge variant={p.badge === "sale" ? "green" : "orange"}>{p.badge}</Badge>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-col gap-1.5 p-3 flex-1">
        <p className="text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-medium line-clamp-1">
          {p?.brand}
        </p>
        <Link
          prefetch={false}
          href={p?.url || "#"}
          title={p?.title}
          className="line-clamp-2 min-h-[38.5px] text-sm font-semibold text-neutral-900 dark:text-white leading-snug"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {p?.name}
        </Link>
        <StarRating rating={p?.ratings} showCount count={p?.reviews} />

        {/* Price */}
        <div className="flex items-baseline gap-1.5 pt-3 mt-auto border-t border-neutral-100 dark:border-neutral-800">
          <span className="text-base font-extrabold text-neutral-900 dark:text-white">
            ${formatPrice(p?.price)}
          </span>
          {!!p?.was && (
            <span className="text-xs text-neutral-400 line-through">
              ${formatPrice(p.was)}
            </span>
          )}
          {!!p?.save_amt && (
            <span className="text-[10px] text-green-600 dark:text-green-400 font-bold">
              −${formatPrice(p.save_amt)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-3 pb-3 flex gap-2">
        <button
          onClick={() => viewItem(p)}
          aria-label="Quick view"
          className="w-9 h-9 min-w-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-300 hover:bg-neutral-800 dark:hover:bg-neutral-600 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="relative flex-1 min-h-[36px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors bg-theme-600 hover:bg-theme-700 text-white disabled:opacity-60"
        >
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${loading ? "" : "invisible"}`}>
            <Eos3DotsLoading />
          </div>
          <div className={loading ? "invisible" : ""}>Add to Cart</div>
        </button>
        <Link
          href={`tel:${STORE_CONTACT}`}
          className="text-xs border-2 border-theme-600 text-theme-700 dark:text-theme-400 font-bold py-2 px-2.5 rounded-xl hover:bg-theme-50 dark:hover:bg-theme-950 transition-colors whitespace-nowrap"
        >
          Call
        </Link>
      </div>

      {/* Found it cheaper */}
      <div className="px-3 pb-3">
        <FicDropDown contact_number={STORE_CONTACT}>
          <div className="text-xs text-blue-500 flex items-center cursor-default gap-[7px] flex-wrap">
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
