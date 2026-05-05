"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
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
  if (mod === "less") {
    return (
      <span className={`font-medium text-[10px] tracking-wide ${inverted ? "text-emerald-400" : "text-emerald-600"}`}>
        Save ${formatPrice(value)}
      </span>
    );
  }
  if (mod === "add") {
    return (
      <span className={`font-medium text-[10px] tracking-wide ${inverted ? "text-red-400" : "text-red-500"}`}>
        +${formatPrice(value)}
      </span>
    );
  }
  return null;
};

// ─── Version 1: Left Accent Strip ────────────────────────────────────────────
// Active state uses a thick left border bar — no background fill change.
// Quiet, typographic, editorial feel. Works well for text-heavy option labels.
function ProductOptionItemLinkV1({ product }) {
  const galleryOnFullscreen = useGalleryFullscreen();

  return (
    <Link
      prefetch={false}
      href={product?.url || "#"}
      title={product?.title}
      className={`product-option-item-link group relative flex items-center transition-all duration-200 rounded-md overflow-hidden border border-neutral-200 border-l-[3px] ${
        product?.active
          ? "border-l-neutral-900 bg-neutral-50"
          : "border-l-neutral-200 bg-white hover:border-l-neutral-500 hover:bg-neutral-50/70"
      } ${galleryOnFullscreen ? "-z-[1]" : ""}`}
    >
      {/* Image */}
      <div className="flex-shrink-0 w-[56px] h-full min-h-[56px] relative overflow-hidden p-1.5">
        {product?.image && (
          <Image src={product.image} alt={product.title} fill className="object-contain" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1 px-2.5 py-2 border-l border-neutral-100">
        <div
          className={`text-[10px] font-semibold uppercase tracking-[0.07em] line-clamp-2 ${
            product?.active ? "text-neutral-900" : "text-neutral-500 group-hover:text-neutral-800"
          }`}
        >
          {product?.label}
        </div>
        <UpsellPriceDisplay mod={product?.upsell?.mod} value={product?.upsell?.value} />
      </div>
    </Link>
  );
}

// ─── Version 2: Stacked Tile ─────────────────────────────────────────────────
// Vertical layout — image on top, label below. Works like a product swatch tile.
// Requires a grid parent with fixed column widths (e.g. grid-cols-3 or grid-cols-4).
function ProductOptionItemLinkV2({ product }) {
  const galleryOnFullscreen = useGalleryFullscreen();

  return (
    <Link
      prefetch={false}
      href={product?.url || "#"}
      title={product?.title}
      className={`product-option-item-link group relative flex flex-col transition-all duration-200 rounded-xl overflow-hidden ${
        product?.active
          ? "bg-neutral-900 shadow-lg shadow-neutral-900/15"
          : "bg-white border border-neutral-200 hover:shadow-md hover:border-neutral-300"
      } ${galleryOnFullscreen ? "-z-[1]" : ""}`}
    >
      {/* Active badge overlays image */}
      {product?.active && (
        <div className="absolute top-1.5 right-1.5 z-[2] w-[18px] h-[18px] bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <Icon icon="mdi:check" className="text-white text-[9px]" />
        </div>
      )}

      {/* Image fills top */}
      <div
        className={`w-full h-[64px] relative overflow-hidden flex-shrink-0 ${
          product?.active ? "bg-neutral-800" : "bg-neutral-50"
        }`}
      >
        {product?.image && (
          <Image src={product.image} alt={product.title} fill className="object-contain p-1.5" />
        )}
      </div>

      {/* Label below image */}
      <div className="flex flex-col items-center gap-0.5 px-2 py-1.5">
        <div
          className={`text-[10px] font-medium leading-snug line-clamp-2 text-center ${
            product?.active ? "text-neutral-200" : "text-neutral-600 group-hover:text-neutral-900"
          }`}
        >
          {product?.label}
        </div>
        <UpsellPriceDisplay
          mod={product?.upsell?.mod}
          value={product?.upsell?.value}
          inverted={product?.active}
        />
      </div>
    </Link>
  );
}

// ─── Version 3: Pill Chip ─────────────────────────────────────────────────────
// Compact rounded-full pill with a circular image swatch on the left.
// No card feel — works great as an inline tag/selector row.
function ProductOptionItemLinkV3({ product }) {
  const galleryOnFullscreen = useGalleryFullscreen();

  return (
    <Link
      prefetch={false}
      href={product?.url || "#"}
      title={product?.title}
      className={`product-option-item-link group relative inline-flex items-center gap-2 pl-1 pr-3 py-1 transition-all duration-150 rounded-full ${
        product?.active
          ? "bg-neutral-900 border border-neutral-900"
          : "bg-white border border-neutral-300 hover:border-neutral-600"
      } ${galleryOnFullscreen ? "-z-[1]" : ""}`}
    >
      {/* Circular swatch */}
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full overflow-hidden relative border ${
          product?.active ? "border-neutral-700" : "border-neutral-200"
        }`}
      >
        {product?.image && (
          <Image src={product.image} alt={product.title} fill className="object-cover" />
        )}
      </div>

      {/* Label + upsell stacked */}
      <div className="flex flex-col gap-px min-w-0">
        <span
          className={`text-[11px] font-medium leading-none truncate ${
            product?.active ? "text-white" : "text-neutral-700 group-hover:text-neutral-900"
          }`}
        >
          {product?.label}
        </span>
        <UpsellPriceDisplay
          mod={product?.upsell?.mod}
          value={product?.upsell?.value}
          inverted={product?.active}
        />
      </div>

      {/* Inline check at end */}
      {product?.active && (
        <Icon icon="mdi:check" className="text-white text-xs flex-shrink-0" />
      )}
    </Link>
  );
}

// ─── Version 4: Bare Minimal ─────────────────────────────────────────────────
// Selection is communicated purely through border weight + a tiny dot indicator —
// no fill, no shadow, no icon. Responsive across mobile, tablet, and desktop.
function ProductOptionItemLinkV4({ product }) {
  const galleryOnFullscreen = useGalleryFullscreen();

  return (
    <Link
      prefetch={false}
      href={product?.url || "#"}
      title={product?.title}
      className={`border-[2px] product-option-item-link group relative flex items-center transition-all duration-150 rounded-lg overflow-hidden ${
        product?.active
          ? "border-theme-600 bg-theme-50/60"
          : "border-neutral-200 bg-white hover:border-neutral-400"
      } ${galleryOnFullscreen ? "-z-[1]" : ""}`}
    >
      {/* Tiny dot — only active indicator */}
      {product?.active && (
        <div className="absolute top-2 right-2 z-[2] w-1.5 h-1.5 rounded-full bg-theme-600" />
      )}

      {/* Image — smaller on mobile, grows on sm+ */}
      <div className="flex-shrink-0 w-[44px] h-full min-h-[50px] sm:w-[54px] sm:min-h-[56px] md:w-[60px] md:min-h-[60px] relative overflow-hidden p-1.5 sm:p-2">
        {product?.image && (
          <Image src={product.image} alt={product.title} fill className="object-contain" />
        )}
      </div>

      {/* Content — tighter on mobile, breathes on sm+ */}
      <div className="flex flex-col gap-px min-w-0 flex-1 px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 border-l border-neutral-100">
        <div
          className={`leading-snug line-clamp-2 text-[10px] sm:text-[11px] tracking-wide ${
            product?.active
              ? "font-medium text-neutral-900"
              : "font-normal text-neutral-500 group-hover:text-neutral-800"
          }`}
        >
          {product?.label}
        </div>
        <UpsellPriceDisplay mod={product?.upsell?.mod} value={product?.upsell?.value} />
      </div>
    </Link>
  );
}

// ─── Switch versions by changing the export below ────────────────────────────
export default ProductOptionItemLinkV4;
