// Shopify Structure Component - Refactored for better UX and performance

"use client";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

const IconBtn = ({ onClick, className = "", title, children }) => (
  <button
    onClick={onClick}
    title={title}
    className={`flex items-center justify-center rounded-full transition-all duration-200 ${className}`}
  >
    {children}
  </button>
);

const MediaGallery = ({ gallery }) => {
  const [active, setActive] = useState(null);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [fullscreen, setFullsceen] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const imgRef = useRef(null);

  const images = useMemo(() => {
    if (!gallery) return [];
    console.log("loaded images");
    const mainImage = gallery.find(({ position }) => position == 1)?.src;
    setActive(mainImage);
    return gallery.map(({ src }) => src);
  }, [gallery]);

  const prev = useCallback(
    () =>
      setActive((current) => {
        const currentIndex = images.indexOf(current);
        const prevIndex = currentIndex - 1;

        // If we are already at the first image (0), stay there
        if (prevIndex < 0) return images[0];

        return images[prevIndex];
      }),
    [images],
  );

  const next = useCallback(
    () =>
      setActive((current) => {
        const currentIndex = images.indexOf(current);
        const nextIndex = currentIndex + 1;

        // If the next index is beyond the last item, stay at the last item
        if (nextIndex >= images.length) return images[images.length - 1];

        return images[nextIndex];
      }),
    [images],
  );

  useEffect(() => {
    setZoom(false);
    setZoomPos({ x: 50, y: 50 });
  }, [active]);

  useEffect(() => {
    const handler = (e) => {
      if (!fullscreen) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setFullsceen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreen, prev, next]);

  useEffect(() => {
    // 1. Handle Scroll Lock
    if (fullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // 2. Dispatch Global Event (Check for window for SSR safety)
    if (typeof window !== "undefined") {
      const event = new CustomEvent("galleryStatus", {
        detail: { isFullscreen: fullscreen },
      });
      window.dispatchEvent(event);
    }

    // 3. Cleanup on Unmount
    return () => {
      document.body.style.overflow = "unset";
      // Optional: Dispatch 'false' on unmount to reset Navbar if Gallery closes abruptly
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("galleryStatus", { detail: { isFullscreen: false } }),
        );
      }
    };
  }, [fullscreen]);

  const handleMouseMove = (e) => {
    if (!zoom) return;
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const GalleryMainImage = ({ slot, inFullscreen = false }) => (
    <div
      ref={inFullscreen ? null : imgRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !inFullscreen && setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      className={`relative overflow-hidden select-none ${inFullscreen ? "w-full h-full" : "w-full h-full"}`}
      style={zoom && !inFullscreen ? { cursor: "zoom-in" } : {}}
    >
      <div
        className="w-full h-full transition-transform duration-300"
        style={
          !inFullscreen
            ? {
                transform: zoom ? "scale(2.2)" : "scale(1)",
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              }
            : {}
        }
      >
        {slot && (
          <Image
            src={slot}
            alt="Product-Main-Image"
            fill
            className="object-contain"
            priority
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
        <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden aspect-square lg:aspect-auto lg:h-[460px]">
          <GalleryMainImage slot={active} inFullscreen={fullscreen} />

          {/* Top controls */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="bg-black/50 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
              {images.indexOf(active) + 1} / {images.length}
            </span>
            <div className="flex gap-2 pointer-events-auto">
              <IconBtn
                onClick={() => setFullsceen(true)}
                title="Fullscreen"
                className="w-8 h-8 bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-600 shadow-sm hover:bg-theme-50 hover:border-theme-300 dark:hover:border-theme-500"
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
              <IconBtn
                onClick={() => setWishlist((w) => !w)}
                title="Wishlist"
                className={`w-8 h-8 border shadow-sm ${wishlist ? "bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700" : "bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-600 hover:bg-red-50 hover:border-red-200"}`}
              >
                <svg
                  className={`w-3.5 h-3.5 ${wishlist ? "text-red-500" : "text-gray-400"}`}
                  fill={wishlist ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
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
                className="absolute z-10 left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-600 shadow-md hover:bg-theme-50 hover:border-theme-300 dark:hover:border-theme-500"
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
                className="absolute z-10 shadow-lg right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-600 shadow-md hover:bg-theme-50 hover:border-theme-300 dark:hover:border-theme-500"
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
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === active ? "bg-theme-500 w-4" : "bg-white/60"}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="hidden sm:grid grid-cols-6 gap-2 ">
          {images.map((img, i) => (
            <button
              key={`image-thumb-${i}`}
              onClick={() => setActive(img)}
              className={`relative aspect-1 rounded-xl overflow-hidden border-2 transition-all duration-200 bg-white dark:bg-gray-900 ${img === active ? "border-theme-500 ring-2 ring-theme-200 dark:ring-theme-800" : "border-gray-200 dark:border-gray-700 hover:border-theme-300 dark:hover:border-theme-600"}`}
            >
              {img && (
                <Image
                  src={img}
                  alt={`Product-Thumb-${i + 1}`}
                  fill
                  className="object-contain"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[99999] bg-black/95 flex flex-col"
          onClick={() => setFullsceen(false)}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-white/60 text-sm">
              {images.indexOf(active) + 1} / {images.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-white/40 text-xs hidden sm:block">
                ← → arrow keys to navigate · ESC to close
              </span>
              <IconBtn
                onClick={() => setFullsceen(false)}
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
              className="absolute z-10 shadow-lg left-4 w-11 h-11 bg-black/40 hover:bg-black/30"
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
            <div className="w-full max-w-2xl aspect-1">
              {active && (
                <Image
                  src={active}
                  alt={`Product-Thumb`}
                  fill
                  className="object-contain"
                />
              )}
              {images.indexOf(active)}
            </div>
            <IconBtn
              onClick={next}
              className="absolute z-10 shadow-lg right-4 w-11 h-11 bg-black/40 hover:bg-black/30 border"
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
                key={i}
                onClick={() => setActive(img)}
                className={`relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${img === active ? "border-theme-500 opacity-100" : "border-white/20 opacity-50 hover:opacity-80"}`}
              >
                {img && (
                  <Image
                    src={img}
                    alt={`Product-Thumb-Strips-${i + 1}`}
                    fill
                    className="object-contain"
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
export default MediaGallery;
