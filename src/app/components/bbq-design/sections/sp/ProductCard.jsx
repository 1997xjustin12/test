"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AddToCartButtonWrap from "@/app/components/atom/AddToCartButtonWrap";
import StarRating from "@/app/components/new-design/sections/sp/StarRating";
import Badge from "@/app/components/new-design/sections/sp/Badge";
import { formatPrice } from "@/app/lib/helpers";
import { STORE_CONTACT } from "@/app/lib/store_constants";
import { useCart } from "@/app/context/cart";
import { Eos3DotsLoading } from "@/app/components/icons/lib";


const ProductCard = ({ p }) => {
  const { addToCart } = useCart();
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const badgeVariant = p.badge === "Sale" ? "green" : "orange";
  const atc_error = "[AddToCartError] Card trigger";
  const handleClick = async() => {
    try{
      setLoading(true);
      addToCart(p)
      .catch((err) => console.log(atc_error))
      .finally(()=> setLoading(false));
    }catch(error){
      console.log(atc_error)
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group flex flex-col bg-white dark:bg-gray-900 border rounded-2xl overflow-hidden transition-all duration-200 ${
        hovered
          ? "border-gray-300 shadow-lg -translate-y-1"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <Link
        prefetch={false}
        href={p?.url || "#"}
        title={p?.title}
        className="relative aspect-[16/9] bg-gray-50 dark:bg-gray-800 overflow-hidden"
      >
        {p?.image && (
          <Image
            src={p?.image}
            alt={p?.name || "Frequently Bqught Together Product Image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            priority={false} // Set to true if this is "above the fold"
          />
        )}
        {p.badge && (
          <div className="absolute top-2 left-2">
            <Badge variant={badgeVariant}>{p.badge}</Badge>
          </div>
        )}
      </Link>
      <div className="flex flex-col gap-1.5 p-3 flex-1">
        <p className="text-[9px] font-bold text-theme-600 uppercase tracking-widest">
          {p.brand}
        </p>
        <Link
          prefetch={false}
          href={p?.url || "#"}
          title={p?.title}
          className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-snug line-clamp-2 flex-1"
        >
          {p.name}
        </Link>
        <StarRating rating={p?.ratings} showCount count={p?.reviews} />
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-sm font-extrabold text-gray-900 dark:text-white">
            ${formatPrice(p.price)}
          </span>
          {!!p?.save_amt && (
            <>
              <span className="text-xs text-gray-400 line-through">
                ${formatPrice(p.was)}
              </span>
              <span className="text-[10px] text-green-600 dark:text-green-400 font-bold">
                −${formatPrice(p?.save_amt)}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="px-3 pb-3 flex gap-2">
          <button
            onClick={handleClick}
            className="w-full relative min-h-[32px] flex-1 text-xs bg-theme-600 hover:bg-theme-700 text-white font-bold py-2 rounded-lg transition-colors"
          >
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${loading? "":"invisible"}`}><Eos3DotsLoading /></div>
            <div className={loading? "invisible":""}>Add to Cart</div>
          </button>
        <Link
          href={`tel:${STORE_CONTACT}`}
          className="text-xs border-2 border-theme-600 text-theme-700 dark:text-theme-400 font-bold py-2 px-2.5 rounded-lg hover:bg-theme-50 dark:hover:bg-theme-950 transition-colors"
        >
          Call
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
