"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

import { BASE_URL } from "@/app/lib/helpers";
import { STORE_CONTACT, STORE_EMAIL } from "@/app/lib/store_constants";

import { useSolanaCategories } from "@/app/context/category";

const BRAND_COLOR = "#f97316";

const PRODUCT = {
  brand: "Blaze Outdoor Products",
  sku: "BLZ-4LTE2",
  name: "Blaze Premium LTE – 32-Inch 4-Burner Built-In Grill with Rear Infrared Burner & Grill Lights",
  rating: 4.4,
  reviewCount: 31,
  price: 1999,
  was: 2099,
  savePct: 5,
  ships: "Ships Within 1–2 Business Days",
  badges: [
    "Phone Discounts",
    "Package Deals",
    "Scratch & Dent",
    "Close Out Deals",
    "Free Accessory Bundle",
    "Open Box",
    "Finance Now",
    "Low Monthly Payments",
  ],
  images: [0, 1, 2, 3, 4, 5],
  specs: [
    { label: "Class", value: "Premium" },
    { label: "BTU Output", value: "56,000" },
    { label: "Cutout Depth", value: "27 3/4 Inches" },
    { label: "Configuration", value: "Built-In" },
    {
      label: "Cutout Dimensions",
      value: "33 5/16 W × 21 1/4 D × 8 1/2 H Inches",
    },
    { label: "Cooking Grill Dimensions", value: "29 5/12 W × 18 D Inches" },
    { label: "Cutout Height", value: "8 1/2 Inches" },
  ],
  shipping: [
    { label: "Weight", value: "135 lbs" },
    { label: "Dimensions", value: "36″ × 25″ × 25″" },
  ],
  faqs: [
    {
      q: "About Solana Fireplaces",
      a: "Welcome to Solana Fireplaces! Since 1997, we have been offering a wide selection of top grill brands from our Southern California location. Our knowledgeable sales team is here to help you find the right product at unbeatable prices.",
    },
    {
      q: "Shipping Policy",
      a: "We offer free shipping on all orders over $79.99. Orders typically ship within 1–2 business days and arrive within 5–7 business days depending on your location.",
    },
    {
      q: "Return Policy",
      a: "We stand by our Satisfaction Guarantee. If you encounter any issues, our team is committed to supporting you both before and after your purchase with hassle-free returns.",
    },
    {
      q: "Warranty",
      a: "If you have an issue with a product we are happy to assist with the warranty claim and coordinate directly with the manufacturer on your behalf.",
    },
  ],
};

const RELATED = [
  {
    name: "Napoleon 700 Series Dual Range Top Burner",
    brand: "Napoleon",
    price: 889,
    was: 945,
    badge: "Popular",
  },
  {
    name: "Summit 76-Wide 2-Burner Radiant Cooking Block",
    brand: "Summit Appliance",
    price: 455,
    was: 500,
    badge: "Popular",
  },
  {
    name: "WPPO Karma 25-inch Wood-Fired Pizza Oven",
    brand: "WPPO",
    price: 1525,
    was: null,
    badge: null,
  },
  {
    name: "RCS 27-Inch Freestanding Beverage Center",
    brand: "RCS",
    price: 4400,
    was: null,
    badge: null,
  },
];

const RECENT = [
  {
    name: "American Fyre Designs 26 Inch Java Free-Standing Granite Shelf",
    brand: "American Fyre Design",
    price: 12490,
    was: 13960,
    badge: "Sale",
  },
  {
    name: "Blaze Freelan LBE 25-Inch 2-Burner Built-In Grill",
    brand: "Blaze Outdoor Products",
    price: 1409,
    was: null,
    badge: null,
  },
  {
    name: "Bromic Heating Tungsten Smart-Heat 56,000 BTU",
    brand: "Bromic Heaters",
    price: 2250,
    was: 3000,
    badge: "Sale",
  },
  {
    name: "Sunglo Stainless Steel Patio Heater A270SS",
    brand: "Sunglo",
    price: 1325,
    was: null,
    badge: null,
  },
];

const GrillMockSVG = ({ slot = 0, className = "" }) => (
  <svg
    viewBox="0 0 480 360"
    className={`w-full h-full ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="480"
      height="360"
      className="fill-gray-100 dark:fill-gray-800"
    />
    <rect
      x="60"
      y="40"
      width="360"
      height="240"
      rx="10"
      className="fill-gray-200 dark:fill-gray-700"
    />
    <rect
      x="85"
      y="65"
      width="310"
      height="185"
      rx="6"
      className="fill-gray-300 dark:fill-gray-600"
    />
    {[0, 1, 2, 3].map((i) => (
      <rect
        key={i}
        x={105 + i * 70}
        y={100}
        width="52"
        height="110"
        rx="26"
        className="fill-gray-400 dark:fill-gray-500"
      />
    ))}
    <rect
      x="60"
      y="280"
      width="360"
      height="20"
      rx="5"
      className="fill-gray-200 dark:fill-gray-700"
    />
    <rect
      x="170"
      y="305"
      width="140"
      height="34"
      rx="6"
      className="fill-gray-200 dark:fill-gray-700"
    />
    <text
      x="240"
      y="328"
      textAnchor="middle"
      fontSize="11"
      className="fill-gray-400 dark:fill-gray-500"
    >
      Image {slot + 1}
    </text>
  </svg>
);

const StarRating = ({ rating, size = "sm", showCount, count }) => {
  const s = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            className={`${s} ${i <= Math.round(rating) ? "text-amber-400" : "text-gray-200 dark:text-gray-600"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </span>
      {showCount && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ({count})
        </span>
      )}
    </span>
  );
};

const Badge = ({ children, variant = "orange" }) => {
  const variants = {
    orange:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    green:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    gray: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  };
  return (
    <span
      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

const SectionHeading = ({ children, action }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-2.5">
      <span className="block w-1 h-5 bg-orange-500 rounded-full flex-shrink-0" />
      <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">
        {children}
      </h2>
    </div>
    {action}
  </div>
);

const IconBtn = ({ onClick, className = "", title, children }) => (
  <button
    onClick={onClick}
    title={title}
    className={`flex items-center justify-center rounded-full transition-all duration-200 ${className}`}
  >
    {children}
  </button>
);

const ProductGallery = ({ images, productTitle }) => {
  const [active, setActive] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [fullscreen, setFullscreen] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const imgRef = useRef(null);

  const prev = useCallback(
    () => setActiveIndex((i) => (i - 1 + images.length) % images.length),
    [images.length], // Optimization: Only depend on the length
  );

  const next = useCallback(
    () => setActiveIndex((i) => (i + 1) % images.length),
    [images.length],
  );

  const selectThumb = useCallback(
    (image) => {
      const index = images.findIndex((img) => img.src === image.src);
      if (index !== -1) {
        setActiveIndex(index);
      }
    },
    [images],
  );

  useEffect(() => {
    const handler = (e) => {
      if (!fullscreen) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreen, prev, next]);

  const handleMouseMove = (e) => {
    if (!zoom) return;
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const mainImage = useMemo(() => {
    return images?.[activeIndex]?.src;
  }, [images, activeIndex]);

  useEffect(() => {
    // 1. Dispatch your custom event
    window.dispatchEvent(
      new CustomEvent("galleryStatus", {
        detail: { isFullscreen: fullscreen },
      }),
    );

    // 2. Lock/Unlock the body scroll
    if (fullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // 3. Cleanup function (Crucial!)
    // This ensures scroll is restored if the component unmounts unexpectedly
    return () => {
      document.body.style.overflow = "";
    };
  }, [fullscreen]);

  const GalleryMainImage = ({ image, productTitle, inFullscreen = false }) => (
    <div
      ref={inFullscreen ? null : imgRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !inFullscreen && setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      className={`relative overflow-hidden select-none ${inFullscreen ? "w-full h-full" : "w-full h-full"}`}
      style={zoom && !inFullscreen ? { cursor: "zoom-in" } : {}}
    >
      <div
        className="w-full h-full transition-transform duration-150"
        style={
          zoom && !inFullscreen
            ? {
                transform: "scale(2.2)",
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              }
            : {}
        }
      >
        {image && (
          <Image
            src={image}
            alt={`${productTitle} -- Gallery Main Image`}
            fill
            className="w-full h-full object-contain"
          />
        )}
      </div>
      {zoom && !inFullscreen && (
        <div className="absolute bottom-3 left-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm pointer-events-none">
          🔍 Hover to zoom
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Main gallery */}
      <div className="flex flex-col gap-3">
        {/* Primary image */}
        <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden aspect-1 lg:aspect-auto lg:h-[460px]">
          <GalleryMainImage image={mainImage} productTitle={productTitle} />

          {/* Top controls */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="bg-black/50 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </span>
            <div className="flex gap-2 pointer-events-auto">
              <IconBtn
                onClick={() => setFullscreen(true)}
                title="Fullscreen"
                className="w-8 h-8 bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-600 shadow-sm hover:bg-orange-50 hover:border-orange-300 dark:hover:border-orange-500"
              >
                <svg
                  className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </IconBtn>
            </div>
          </div>

          {/* Prev / Next */}
          {images.length > 1 && (
            <>
              <IconBtn
                onClick={prev}
                title="Previous"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-600 shadow-md hover:bg-orange-50 hover:border-orange-300 dark:hover:border-orange-500"
              >
                <svg
                  className="w-4 h-4 text-gray-700 dark:text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </IconBtn>
              <IconBtn
                onClick={next}
                title="Next"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-600 shadow-md hover:bg-orange-50 hover:border-orange-300 dark:hover:border-orange-500"
              >
                <svg
                  className="w-4 h-4 text-gray-700 dark:text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </IconBtn>
            </>
          )}

          {/* Dot indicators (mobile) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:hidden">
            {images.map((img, i) => (
              <button
                key={`mobile-gallery-thumbs-${img?.src}-${i}`}
                onClick={() => selectThumb(img)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${img?.src === mainImage ? "bg-orange-500 w-4" : "bg-white/60"}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="hidden sm:grid grid-cols-6 gap-2">
          {images.map((img, i) => (
            <button
              key={`gallery-thumbs-${img?.src}-${i}`}
              onClick={() => selectThumb(img)}
              className={`relative aspect-1 rounded-xl overflow-hidden border-2 transition-all duration-200 bg-white dark:bg-gray-900 ${img?.src === mainImage ? "border-orange-500 ring-2 ring-orange-200 dark:ring-orange-800" : "border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600"}`}
            >
              {img?.src && (
                <Image
                  src={img.src}
                  alt={img?.alt || `${productTitle} -- Thumb-${i}`}
                  fill
                  className="w-full h-full object-contain"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
          onClick={() => setFullscreen(false)}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-white/60 text-sm">
              {activeIndex + 1} / {images.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-white/40 text-xs hidden sm:block">
                ← → arrow keys to navigate · ESC to close
              </span>
              <IconBtn
                onClick={() => setFullscreen(false)}
                className="w-9 h-9 bg-white/10 hover:bg-white/20 border border-white/10"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </IconBtn>
            </div>
          </div>
          {/* Image */}
          <div
            className="flex-1 flex items-center justify-center px-16 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <IconBtn
              onClick={prev}
              className="absolute left-4 w-11 h-11 bg-white/10 hover:bg-white/20 border border-white/10"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </IconBtn>
            <div className="w-full max-w-2xl aspect-1 relative">
              {/* <GrillMockSVG slot={active} /> */}
              <Image
                src={mainImage}
                alt={`${productTitle} -- Gallery Main Image`}
                fill
                className="w-full h-full object-contain"
              />
            </div>
            <IconBtn
              onClick={next}
              className="absolute right-4 w-11 h-11 bg-white/10 hover:bg-white/20 border border-white/10"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </IconBtn>
          </div>
          {/* Thumbnail strip */}
          <div
            className="flex-shrink-0 flex gap-2 justify-center px-5 py-4 overflow-x-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, i) => (
              <button
                key={`gal-expand-thumbs-${img?.src}-${i}`}
                onClick={() => selectThumb(img)}
                className={`relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${img?.src === mainImage ? "border-orange-500 opacity-100" : "border-white/20 opacity-50 hover:opacity-80"}`}
              >
                {img?.src && (
                  <Image
                    src={img.src}
                    alt={img?.alt || `${productTitle} -- Thumb-${i}`}
                    fill
                    className="w-full h-full object-contain"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const ProductInfo = ({ product }) => {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Brand + SKU */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <Link
          href="#"
          className="text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 px-2.5 py-1 rounded-full uppercase tracking-widest hover:bg-orange-100 transition-colors"
        >
          {product.brand}
        </Link>
        <span className="text-[10px] text-gray-400 dark:text-gray-500">
          SKU: {product.sku}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-3 flex-wrap pb-4 border-b border-gray-100 dark:border-gray-800">
        <StarRating
          rating={product.rating}
          showCount
          count={product.reviewCount}
        />
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {product.rating} out of 5
        </span>
        <span className="text-gray-200 dark:text-gray-700">·</span>
        <Link
          href="#reviews"
          className="text-xs font-semibold text-orange-500 hover:underline"
        >
          Write a Review
        </Link>
      </div>

      {/* Price */}
      <div className="flex items-end gap-3 flex-wrap">
        <span className="text-4xl font-black text-gray-900 dark:text-white">
          ${product.price.toLocaleString()}
        </span>
        <div className="flex flex-col pb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 line-through">
              ${product.was.toLocaleString()}
            </span>
            <Badge variant="green">SAVE {product.savePct}%</Badge>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            You save ${product.was - product.price} · Free Shipping
          </span>
        </div>
      </div>

      {/* Ships */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <svg
          className="w-4 h-4 text-green-500 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">{product.ships}</span>
      </div>

      {/* Discounts */}
      <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-md bg-orange-500 flex items-center justify-center text-xs flex-shrink-0">
            🔥
          </span>
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
            Discounts & Savings Available
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {product.badges.map((b) => (
            <div
              key={b}
              className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
            >
              <span className="w-4 h-4 rounded-full bg-orange-100 dark:bg-orange-900/40 border border-orange-200 dark:border-orange-800 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-2 h-2 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* Qty + CTA */}
      <div className="flex items-stretch gap-3 flex-wrap">
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-11 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xl font-light transition-colors"
          >
            −
          </button>
          <span className="w-9 text-center text-sm font-bold text-gray-900 dark:text-white">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-10 h-11 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xl font-light transition-colors"
          >
            +
          </button>
        </div>
        <button
          onClick={handleCart}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-sm font-bold text-white transition-all duration-200 ${added ? "bg-green-500" : "bg-orange-500 hover:bg-orange-600 active:scale-[.98]"}`}
        >
          {added ? (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>{" "}
              Added to Cart
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>{" "}
              Add to Cart
            </>
          )}
        </button>
        <Link
          href={`tel:${STORE_CONTACT}`}
          className="flex items-center gap-2 h-11 px-4 rounded-xl border-2 border-orange-500 text-orange-600 dark:text-orange-400 text-sm font-bold hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors whitespace-nowrap"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call Expert
        </Link>
      </div>
    </div>
  );
};

const CollectionStrip = () => {
  const [tab, setTab] = useState(0);
  const tabs = ["All", "Built-In", "Freestanding", "Inserts"];
  return (
    <section className="mb-14">
      <SectionHeading
        action={
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            {tabs.map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${tab === i ? "bg-white dark:bg-gray-700 text-orange-500 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
              >
                {t}
              </button>
            ))}
          </div>
        }
      >
        Shop This Collection
      </SectionHeading>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="group border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            <div className="h-28 bg-gray-50 dark:bg-gray-800 overflow-hidden">
              <GrillMockSVG slot={i} />
            </div>
            <div className="p-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  Blaze LTE {i + 1}-Burner
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  ${(1199 + i * 400).toLocaleString()}
                </p>
              </div>
              <svg
                className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-orange-500 transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const DescriptionSection = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        {/* Description */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <span className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-orange-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Product Description
            </h3>
          </div>
          <div className="p-5">
            <div
              className={`overflow-hidden transition-all duration-500 ${expanded ? "max-h-96" : "max-h-20"}`}
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                Blaze Grills offers an affordable premium commercial-style
                grill, meticulously crafted to fulfill your outdoor BBQ
                aspirations. These Blaze grills boast precision-cut 304
                stainless steel components that deliver exceptional durability
                and longevity for your outdoor cooking endeavors.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                This model goes above and beyond with its distinctive 6W LED
                accent lights and integrated halogen food lighting, elevating
                your grilling experience. The rear infrared burner delivers even
                heat across the entire cooking surface, ensuring the perfect
                sear every single time.
              </p>
            </div>
            <button
              onClick={() => setExpanded((e) => !e)}
              className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              {expanded ? "Show less ↑" : "Read more ↓"}
            </button>
          </div>
        </div>
        {/* Brand card */}
        <div className="bg-gray-900 dark:bg-gray-950 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center mb-3">
              <svg
                className="w-4 h-4 text-orange-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-white mb-2">
              About Blaze Outdoor Products
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Designed with features that make it easy to grill great food,
              every Blaze product is built for those who demand performance,
              durability, and bold outdoor style.
            </p>
          </div>
          <Link
            href="#"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
          >
            Visit Brand Page{" "}
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

const SpecsShipping = ({ specs, shipping }) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? specs : specs.slice(0, 4);
  return (
    <section className="mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        {/* Specs */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Specifications
              </h3>
            </div>
            <Badge variant="gray">{specs.length} attributes</Badge>
          </div>
          <table className="w-full">
            <tbody>
              {visible.map((s, i) => (
                <tr
                  key={s.label}
                  className={
                    i % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-800/40"
                      : "bg-white dark:bg-gray-900"
                  }
                >
                  <td className="px-5 py-3 text-xs text-gray-500 dark:text-gray-400 font-medium w-2/5 border-b border-gray-100 dark:border-gray-800">
                    {s.label}
                  </td>
                  <td className="px-5 py-3 text-xs font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800">
                    {s.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="text-xs font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1.5 transition-colors"
            >
              {showAll ? "Show fewer ↑" : `Show all ${specs.length} specs ↓`}
            </button>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <span className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-orange-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M7 17a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z" />
              </svg>
            </span>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Shipping Info
            </h3>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-xl p-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-orange-700 dark:text-orange-300">
                  Free Shipping Included
                </p>
                <p className="text-[10px] text-orange-500/70 dark:text-orange-400/70">
                  No additional shipping cost
                </p>
              </div>
            </div>
            {shipping.map((s, i) => (
              <div
                key={s.label}
                className={`flex justify-between items-center py-3 ${i < shipping.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""}`}
              >
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {s.label}
                </span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {s.value}
                </span>
              </div>
            ))}
            {[
              ["Est. Delivery", "5–7 Business Days"],
              ["Carrier", "Freight / LTL"],
            ].map(([l, v], i) => (
              <div
                key={l}
                className={`flex justify-between items-center py-3 border-t border-gray-100 dark:border-gray-800`}
              >
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {l}
                </span>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ReviewsSection = ({ rating, reviewCount }) => {
  const bars = [
    { star: 5, pct: 48 },
    { star: 4, pct: 32 },
    { star: 3, pct: 12 },
    { star: 2, pct: 5 },
    { star: 1, pct: 3 },
  ];
  return (
    <section id="reviews" className="mb-6">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-orange-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Customer Reviews
            </h3>
          </div>
          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors">
            Write a Review
          </button>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center pb-6 border-b border-gray-100 dark:border-gray-800 mb-6">
            <div className="text-center sm:pr-6 sm:border-r sm:border-gray-100 dark:sm:border-gray-800">
              <p className="text-6xl font-black text-gray-900 dark:text-white leading-none">
                {rating}
              </p>
              <StarRating rating={rating} size="lg" />
              <p className="text-xs text-gray-400 mt-1">
                {reviewCount} reviews
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {bars.map(({ star, pct }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-3 text-right">
                    {star}
                  </span>
                  <svg
                    className="w-3 h-3 text-amber-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 w-6">{pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center py-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Be the first to review this product
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Share your experience to help other customers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQSection = ({ faqs }) => {
  const [open, setOpen] = useState(null);
  return (
    <section className="mb-6">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <span className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-orange-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">
              Everything you need to know
            </p>
          </div>
        </div>
        <div>
          {faqs.map((f, i) => (
            <div
              key={f.q}
              className={`border-b border-gray-100 dark:border-gray-800 last:border-0`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <span
                  className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold transition-all duration-200 ${open === i ? "bg-orange-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}
                >
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {f.q}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-45" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
              {open === i && (
                <div className="px-5 pb-5 pl-16">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {f.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SupportCTA = () => (
  <section className="mb-14">
    <div className="grid grid-cols-1 sm:grid-cols-2 rounded-2xl overflow-hidden border border-gray-800">
      <div className="bg-gray-900 p-7 flex flex-col justify-between gap-5">
        <div>
          <p className="text-base font-extrabold text-white mb-2">
            Still have questions?
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            Can't find the answer you're looking for? Our expert support team is
            here to help you make the right choice.
          </p>
        </div>
        <Link
          href={`mailto:${STORE_EMAIL}`}
          className="self-start inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Contact Support
        </Link>
      </div>
      <div className="bg-orange-500 p-7 flex flex-col justify-between gap-5">
        <div>
          <p className="text-base font-extrabold text-white mb-2">
            Prefer to call?
          </p>
          <p className="text-sm text-orange-100 leading-relaxed">
            Our grill experts are available Mon–Sat 9am–6pm PST ready to help
            you pick the perfect product.
          </p>
        </div>
        <Link
          href={`tel:${STORE_CONTACT}`}
          className="self-start inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-orange-50 text-orange-600 rounded-xl text-xs font-bold transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          (888) 575-9720
        </Link>
      </div>
    </div>
  </section>
);

const ProductCard = ({ p }) => {
  const [hovered, setHovered] = useState(false);
  const badgeVariant = p.badge === "Sale" ? "green" : "orange";
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group flex flex-col bg-white dark:bg-gray-900 border rounded-2xl overflow-hidden transition-all duration-200 ${hovered ? "border-orange-200 dark:border-orange-800 shadow-lg -translate-y-1" : "border-gray-200 dark:border-gray-700"}`}
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
        <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">
          {p.brand}
        </p>
        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-snug line-clamp-2 flex-1">
          {p.name}
        </p>
        <StarRating rating={4} showCount count={0} />
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-sm font-extrabold text-gray-900 dark:text-white">
            ${p.price.toLocaleString()}
          </span>
          {p.was && (
            <>
              <span className="text-xs text-gray-400 line-through">
                ${p.was.toLocaleString()}
              </span>
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

const ProductGrid = ({ title, items, action }) => (
  <section className="mb-14">
    <SectionHeading action={action}>{title}</SectionHeading>
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {items.map((p) => (
        <ProductCard key={p.name} p={p} />
      ))}
    </div>
  </section>
);

const StickyCTA = ({ price, was, onCart }) => {
  const [added, setAdded] = useState(false);
  const handle = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    onCart?.();
  };
  return (
    <div className="fixed bottom-4 right-4 z-50 hidden lg:flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-2xl shadow-black/10">
      <div className="pr-3 border-r border-gray-100 dark:border-gray-800">
        <p className="text-base font-black text-gray-900 dark:text-white leading-none">
          ${price.toLocaleString()}
        </p>
        <p className="text-[10px] text-green-500 font-semibold mt-0.5">
          Save ${was - price} · Free Ship
        </p>
      </div>
      <Link
        href={`tel:${STORE_CONTACT}`}
        className="flex items-center gap-1.5 border-2 border-orange-500 text-orange-600 dark:text-orange-400 text-xs font-bold py-2 px-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors whitespace-nowrap"
      >
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Call
      </Link>
      <button
        onClick={handle}
        className={`flex items-center gap-1.5 text-xs font-bold py-2 px-4 rounded-xl text-white transition-all duration-200 ${added ? "bg-green-500" : "bg-orange-500 hover:bg-orange-600"}`}
      >
        {added ? "✓ Added" : "Add to Cart"}
      </button>
    </div>
  );
};

const MobileStickyCTA = ({ price, was }) => (
  <div className="fixed bottom-0 left-0 right-0 lg:hidden z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 shadow-2xl">
    <div className="flex-1 min-w-0">
      <p className="text-base font-black text-gray-900 dark:text-white leading-none">
        ${price.toLocaleString()}
      </p>
      <p className="text-[10px] text-green-500 font-semibold mt-0.5">
        Save ${was - price} · Free Shipping
      </p>
    </div>
    <Link
      href={`tel:${STORE_CONTACT}`}
      className="flex items-center gap-1.5 border-2 border-orange-500 text-orange-600 dark:text-orange-400 text-xs font-bold py-2.5 px-3 rounded-xl hover:bg-orange-50 transition-colors whitespace-nowrap flex-shrink-0"
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
      Call
    </Link>
    <button className="flex-shrink-0 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors">
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      Add to Cart
    </button>
  </div>
);

const Topbar = () => {
  const [galleryOnFullscreen, setGalleryOnFullscreen] = useState(false);

  const links = [
    {
      name: "Learning Center",
      url: `${BASE_URL}/blogs`,
    },
    {
      name: "Professional Program",
      url: `${BASE_URL}/professional-program`,
    },
    {
      name: "Support",
      url: `${BASE_URL}/contact`,
    },
  ];

  useEffect(() => {
    const handleGallery = (e) => {
      setGalleryOnFullscreen(e.detail.isFullscreen);
    };

    window.addEventListener("galleryStatus", handleGallery);
    return () => window.removeEventListener("galleryStatus", handleGallery);
  }, []);

  return (
    <div
      className={`bg-charcoal hidden md:block sticky top-[105px] ${galleryOnFullscreen ? "" : "z-10"}`}
    >
      <div className="max-w-[1240]  py-2 px-4 sm:px-6 mx-auto flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs text-gray-400">
          🔥 Free Shipping on Selected Orders —{" "}
          <Link
            href={`tel:${STORE_CONTACT}`}
            className="text-orange-400 font-semibold hover:text-orange-300"
          >
            Call now ↗
          </Link>
        </span>
        <div className="hidden sm:flex gap-5">
          {links.map((l) => (
            <Link
              key={`links-redirect-${l?.url}`}
              href={l?.url || "#"}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              {l?.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const Breadcrumb = ({ crumbs }) => (
  <nav className="flex items-center gap-1.5 flex-wrap mb-5">
    {crumbs.map((c, i) => (
      <span
        key={`breadcrumb-${c.name}-${i}`}
        className="flex items-center gap-1.5"
      >
        {i < crumbs.length - 1 ? (
          <>
            <Link
              href={c?.url}
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-orange-500 transition-colors"
            >
              {c?.name}
            </Link>
            <span className="text-xs text-gray-200 dark:text-gray-700">/</span>
          </>
        ) : (
          <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
            {c?.name}
          </span>
        )}
      </span>
    ))}
  </nav>
);

function SingleProductPage({
  product,
  slug,
  loading,
  reviews,
  recentlyViewed,
}) {
  const { getNameBySlug } = useSolanaCategories();
  const breadcrumbs = useMemo(() => {
    if (!product || !slug) return [];
    return [
      { name: "Home", url: `${BASE_URL}` },
      { name: getNameBySlug(slug), url: `${BASE_URL}/${slug}` },
      { name: product?.title || "", url: `#` },
    ];
  }, [product, slug]);
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen font-sans">
      <Topbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-20">
        <Breadcrumb crumbs={breadcrumbs} />

        {/* ── HERO: GALLERY + INFO ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-6 lg:gap-10 mb-12 lg:items-start">
          <div className="lg:sticky lg:top-4">
            <ProductGallery
              images={product?.images || []}
              productTitle={product?.title}
            />
          </div>
          {/* <ProductInfo product={PRODUCT} /> */}
        </div>

        {/* ── BELOW-FOLD SECTIONS ── */}
        {/* <CollectionStrip />
        <DescriptionSection />
        <SpecsShipping specs={PRODUCT.specs} shipping={PRODUCT.shipping} />
        <ReviewsSection
          rating={PRODUCT.rating}
          reviewCount={PRODUCT.reviewCount}
        />
        <FAQSection faqs={PRODUCT.faqs} />
        <SupportCTA />
        <ProductGrid
          title="You May Also Like"
          items={RELATED}
          action={
            <Link
              href="#"
              className="text-xs font-semibold text-orange-500 hover:underline flex items-center gap-1"
            >
              View all{" "}
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          }
        />
        <ProductGrid
          title="Recently Viewed"
          items={RECENT}
          action={
            <Link
              href="#"
              className="text-xs font-semibold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              Clear{" "}
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
          }
        /> */}
      </div>

      <StickyCTA price={PRODUCT.price} was={PRODUCT.was} />
      <MobileStickyCTA price={PRODUCT.price} was={PRODUCT.was} />
    </div>
  );
}

export default SingleProductPage;
