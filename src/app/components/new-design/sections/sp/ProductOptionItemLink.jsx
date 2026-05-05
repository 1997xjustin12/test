"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { formatPrice } from "@/app/lib/helpers";

const UpsellPriceDisplay = ({ mod, value, active }) => {
  if (mod === "less") {
    return (
      <div
        className={`font-semibold text-xs ${
          active ? "text-green-200" : "text-green-600"
        }`}
      >
        {`Save $${formatPrice(value)}`}
      </div>
    );
  }
  if (mod === "add") {
    return (
      <div
        className={`font-semibold text-xs ${
          active ? "text-red-200" : "text-red-600"
        }`}
      >
        {`Add $${formatPrice(value)}`}
      </div>
    );
  }
  if (mod === "same") {
    return ``;
  }
};

function ProductOptionItemLink({ product }) {
  const [galleryOnFullscreen, setGalleryOnFullscreen] = useState(false);

  useEffect(() => {
    const handleGallery = (e) => {
      setGalleryOnFullscreen(e.detail.isFullscreen);
    };

    window.addEventListener("galleryStatus", handleGallery);
    return () => window.removeEventListener("galleryStatus", handleGallery);
  }, []);

  return (
    <Link
      prefetch={false}
      href={product?.url || "#"}
      title={product?.title}
      className={`product-option-item-link group relative flex items-center gap-1 p-0 transition-all duration-300 border rounded-lg overflow-hidden ${
        product?.active
          ? "bg-theme-600 text-white shadow-xs shadow-theme-500/30 border-theme-600 border-2"
          : "bg-white border-2 border-neutral-300 hover:border-theme-600 hover:shadow-md"
      } ${galleryOnFullscreen ? "-z-[1]":""}`}
    >
      {/* Active Check Icon */}
      {product?.active && (
        <div className="absolute top-1 right-1 z-[2] w-5 h-5 bg-white rounded-full flex items-center justify-center">
          <Icon icon="mdi:check" className="text-theme-600 text-sm" />
        </div>
      )}

      {/* Image Container */}
      <div
        className={`flex-shrink-0 w-[60px] bg-white h-full min-h-[60px] overflow-hidden relative p-1`}
      >
        {product?.image && (
          <Image
            src={product?.image}
            alt={product?.title}
            fill
            className="object-contain"
          />
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-col gap-1 min-w-0 flex-1 px-2">
        <div
          className={`font-semibold text-xs line-clamp-2 ${
            product?.active
              ? "text-white"
              : "text-neutral-800 group-hover:text-theme-600"
          }`}
        >
          {/* {formatOptionLabel(item)} */}
          {product?.label}
        </div>
        <UpsellPriceDisplay
          mod={product?.upsell?.mod}
          value={product?.upsell?.value}
          active={product?.active}
        />
      </div>
    </Link>
  );
}

export default ProductOptionItemLink;
