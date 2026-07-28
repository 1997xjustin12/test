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

const UpsellPriceDisplay = ({ mod, value }) => {
  if (mod === "less") return (
    <span className="font-inter text-[10.5px] font-semibold text-oko-sage dark:text-oko-sage-light">
      Save ${formatPrice(value)}
    </span>
  );
  if (mod === "add") return (
    <span className="font-inter text-[10.5px] font-semibold text-oko-stone">
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
      className={`product-option-item-link group relative flex items-center overflow-hidden rounded-[2px] border transition-colors duration-200 ${
        active
          ? "border-oko-barn bg-oko-cream-dim dark:bg-oko-night-3"
          : "border-oko-stone-line dark:border-oko-line-dark bg-white dark:bg-oko-night-2 hover:border-oko-char dark:hover:border-oko-cream"
      } ${galleryOnFullscreen ? "-z-[1]" : ""}`}
    >
      {/* Active left accent bar */}
      <span className={`self-stretch w-[3px] flex-shrink-0 ${active ? "bg-oko-barn" : "bg-transparent"}`} />

      {/* Image */}
      <div className="flex-shrink-0 w-[44px] min-h-[50px] sm:w-[52px] sm:min-h-[56px] h-full relative overflow-hidden p-1.5 bg-white dark:bg-oko-night-3">
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
      <div className="self-stretch w-px flex-shrink-0 bg-oko-stone-line dark:bg-oko-line-dark" />

      {/* Label + upsell */}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1 px-2 sm:px-2.5 py-1.5 sm:py-2">
        <span className={`font-inter text-[11px] font-medium uppercase tracking-[0.03em] line-clamp-2 leading-snug transition-colors ${
          active
            ? "text-oko-char dark:text-oko-cream"
            : "text-oko-char-soft dark:text-oko-ondark group-hover:text-oko-char dark:group-hover:text-oko-cream"
        }`}>
          {product?.label}
        </span>
        <UpsellPriceDisplay
          mod={product?.upsell?.mod}
          value={product?.upsell?.value}
        />
      </div>
    </Link>
  );
}

export default ProductOptionItemLink;
