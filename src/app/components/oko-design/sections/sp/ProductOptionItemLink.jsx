"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/app/lib/helpers";

function useGalleryFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const handler = (e) => setIsFullscreen(e.detail.isFullscreen);
    window.addEventListener("galleryStatus", handler);
    return () => window.removeEventListener("galleryStatus", handler);
  }, []);
  return isFullscreen;
}

const UpsellPriceDisplay = ({ mod, value, inverted = false }) => {
  if (mod === "less") return (
    <span className="font-oswald text-[10px] tracking-wide text-bbq-green">
      Save ${formatPrice(value)}
    </span>
  );
  if (mod === "add") return (
    <span className={`font-oswald text-[10px] tracking-wide ${inverted ? "text-ember" : "text-ember-deep"}`}>
      +${formatPrice(value)}
    </span>
  );
  return null;
};

function ProductOptionItemLink({ product }) {
  const galleryOnFullscreen = useGalleryFullscreen();
  const active = product?.active;

  return (
    <Link
      prefetch={false}
      href={product?.url || "#"}
      title={product?.title}
      className={`product-option-item-link group relative flex items-center overflow-hidden rounded-sm border-l-4 transition-all duration-200 ${
        active
          ? "border-l-theme-600 border border-theme-600/30 bg-char dark:bg-smoke"
          : "border-l-grate dark:border-l-white/15 border border-grate dark:border-white/10 bg-paper dark:bg-smoke hover:border-l-theme-600/60 hover:border-theme-600/20 hover:bg-ash dark:hover:bg-white/5"
      } ${galleryOnFullscreen ? "-z-[1]" : ""}`}
    >
      {/* Active square dot */}
      {active && (
        <span className="absolute top-1.5 right-1.5 z-[2] w-1.5 h-1.5 bg-theme-600 flex-shrink-0" />
      )}

      {/* Image */}
      <div className={`flex-shrink-0 w-[44px] min-h-[50px] sm:w-[52px] sm:min-h-[56px] h-full relative overflow-hidden p-1.5 ${
        active ? "bg-white/10 dark:bg-char" : "bg-white dark:bg-char"
      }`}>
        {product?.image && (
          <Image
            src={product.image}
            alt={product.title || ""}
            fill
            className="object-contain"
            sizes="56px"
          />
        )}
      </div>

      {/* Vertical divider */}
      <div className={`self-stretch w-px flex-shrink-0 ${
        active ? "bg-theme-600/25" : "bg-grate dark:bg-white/10"
      }`} />

      {/* Label + upsell */}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1 px-2 sm:px-2.5 py-1.5 sm:py-2">
        <span className={`font-oswald text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide line-clamp-2 leading-snug transition-colors ${
          active
            ? "text-ash"
            : "text-char/60 dark:text-ash/50 group-hover:text-char dark:group-hover:text-ash"
        }`}>
          {product?.label}
        </span>
        <UpsellPriceDisplay
          mod={product?.upsell?.mod}
          value={product?.upsell?.value}
          inverted={active}
        />
      </div>
    </Link>
  );
}

export default ProductOptionItemLink;
