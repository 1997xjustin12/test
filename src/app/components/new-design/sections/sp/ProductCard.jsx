"use client";

import { useState } from "react";
import Link from "next/link";
import StarRating from "@/app/components/new-design/sections/sp/StarRating";
import Badge from "@/app/components/new-design/sections/sp/Badge";
import GrillMockSVG from "@/app/components/new-design/sections/sp/GrillMockSVG";
import { formatPrice } from "@/app/lib/helpers";
import { STORE_CONTACT } from "@/app/lib/store_constants";

const ProductCard = ({ p }) => {
  const [hovered, setHovered] = useState(false);
  const badgeVariant = p.badge === "Sale" ? "green" : "orange";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group flex flex-col bg-white dark:bg-gray-900 border rounded-2xl overflow-hidden transition-all duration-200 ${
        hovered
          ? "border-orange-200 dark:border-orange-800 shadow-lg -translate-y-1"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="relative h-32 bg-gray-50 dark:bg-gray-800 overflow-hidden">
        <GrillMockSVG slot={0} />
        {p.badge && (
          <div className="absolute top-2 left-2">
            <Badge variant={badgeVariant}>{p.badge}</Badge>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-3 flex-1">
        <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">{p.brand}</p>
        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-snug line-clamp-2 flex-1">
          {p.name}
        </p>
        <StarRating rating={4} showCount count={0} />
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-sm font-extrabold text-gray-900 dark:text-white">
            ${formatPrice(p.price)}
          </span>
          {p.was && (
            <>
              <span className="text-xs text-gray-400 line-through">${formatPrice(p.was)}</span>
              <span className="text-[10px] text-green-600 dark:text-green-400 font-bold">
                −${(p.was - p.price).toLocaleString()}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="px-3 pb-3 flex gap-2">
        <button className="flex-1 text-xs bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg transition-colors">
          Add to Cart
        </button>
        <Link
          href={`tel:${STORE_CONTACT}`}
          className="text-xs border-2 border-orange-500 text-orange-600 dark:text-orange-400 font-bold py-2 px-2.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors"
        >
          Call
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
