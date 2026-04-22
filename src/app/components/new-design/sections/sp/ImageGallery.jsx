"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Image from "next/image";

const IconBtn = ({ onClick, className = "", title, children }) => (
  <button
    onClick={onClick}
    title={title}
    aria-label={title}
    className={`flex items-center justify-center rounded-full transition-all duration-200 ${className}`}
  >
    {children}
  </button>
);

// Defined outside ImageGallery so React never treats it as a new component type
// between renders — prevents remount flicker (CLS/LCP regression).
const GalleryMainImage = ({
  image,
  productTitle,
  imgRef,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  zoom,
  zoomPos,
  priority,
}) => (
  <div
    ref={imgRef}
    onMouseMove={onMouseMove}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className="relative overflow-hidden select-none w-full h-full"
    style={zoom ? { cursor: "zoom-in" } : {}}
  >
    <div
      className="w-full h-full transition-transform duration-150"
      style={
        zoom
          ? { transform: "scale(2.2)", transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
          : {}
      }
    >
      {image && (
        <Image
          src={image}
          alt={productTitle || "Product image"}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 460px"
          className="w-full h-full object-contain"
        />
      )}
    </div>
    {zoom && (
      <div className="absolute bottom-3 left-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm pointer-events-none">
        🔍 Hover to zoom
      </div>
    )}
  </div>
);

const ImageGallery = ({ images, productTitle }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [fullscreen, setFullscreen] = useState(false);
  const imgRef = useRef(null);

  const prev = useCallback(
    () => setActiveIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  );

  const next = useCallback(
    () => setActiveIndex((i) => (i + 1) % images.length),
    [images.length],
  );

  const selectThumb = useCallback(
    (image) => {
      const index = images.findIndex((img) => img.src === image.src);
      if (index !== -1) setActiveIndex(index);
    },
    [images],
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!zoom) return;
      const rect = imgRef.current?.getBoundingClientRect();
      if (!rect) return;
      setZoomPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [zoom],
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

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("galleryStatus", { detail: { isFullscreen: fullscreen } }),
    );
    document.body.style.overflow = fullscreen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [fullscreen]);

  const mainImage = useMemo(() => images?.[activeIndex]?.src, [images, activeIndex]);

  return (
    <>
      {/* Main gallery */}
      <div className="flex flex-col gap-3">
        {/* Primary image — fixed container height prevents CLS */}
        <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden aspect-square lg:aspect-auto lg:h-[460px]">
          <GalleryMainImage
            image={mainImage}
            productTitle={productTitle}
            imgRef={imgRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            zoom={zoom}
            zoomPos={zoomPos}
            // priority=true on the first image makes Next.js preload it —
            // this is the LCP element on product pages.
            priority={activeIndex === 0}
          />

          {/* Counter badge */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="bg-black/50 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </span>
            <div className="flex gap-2 pointer-events-auto">
              <IconBtn
                onClick={() => setFullscreen(true)}
                title="View fullscreen"
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
                title="Previous image"
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
                title="Next image"
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

          {/* Dot indicators — mobile only */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:hidden">
            {images.map((img, i) => (
              <button
                key={`mobile-dot-${i}`}
                onClick={() => selectThumb(img)}
                aria-label={`View image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  img?.src === mainImage ? "bg-orange-500 w-4" : "bg-white/60 w-1.5"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnails — lazy loaded, below the fold on mobile */}
        <div className="hidden sm:grid grid-cols-6 gap-2">
          {images.map((img, i) => (
            <button
              key={`thumb-${i}`}
              onClick={() => selectThumb(img)}
              aria-label={`View image ${i + 1}`}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 bg-white dark:bg-gray-900 ${
                img?.src === mainImage
                  ? "border-orange-500 ring-2 ring-orange-200 dark:ring-orange-800"
                  : "border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600"
              }`}
            >
              {img?.src && (
                <Image
                  src={img.src}
                  alt={img?.alt || `${productTitle} - image ${i + 1}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 15vw, 80px"
                  className="w-full h-full object-contain"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen lightbox — rendered only after user interaction, not LCP-critical */}
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
                ← → arrow keys · ESC to close
              </span>
              <IconBtn
                onClick={() => setFullscreen(false)}
                title="Close fullscreen"
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

          {/* Main fullscreen image */}
          <div
            className="flex-1 flex items-center justify-center px-16 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <IconBtn
              onClick={prev}
              title="Previous image"
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
            <div className="w-full max-w-2xl aspect-square relative">
              {mainImage && (
                <Image
                  src={mainImage}
                  alt={`${productTitle} - fullscreen view ${activeIndex + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <IconBtn
              onClick={next}
              title="Next image"
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

          {/* Fullscreen thumbnail strip — lazy loaded */}
          <div
            className="flex-shrink-0 flex gap-2 justify-center px-5 py-4 overflow-x-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, i) => (
              <button
                key={`fs-thumb-${i}`}
                onClick={() => selectThumb(img)}
                aria-label={`View image ${i + 1}`}
                className={`relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  img?.src === mainImage
                    ? "border-orange-500 opacity-100"
                    : "border-white/20 opacity-50 hover:opacity-80"
                }`}
              >
                {img?.src && (
                  <Image
                    src={img.src}
                    alt={img?.alt || `${productTitle} - image ${i + 1}`}
                    fill
                    loading="lazy"
                    sizes="56px"
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

export default ImageGallery;
