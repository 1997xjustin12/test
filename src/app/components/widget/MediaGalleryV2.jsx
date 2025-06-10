// Shopify Structure Component

"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

const MediaGallery = ({ mediaItems }) => {
  const [activeIndex, setActiveIndex] = useState(0); // Track active media item
  const [activeItem, setActiveItem] = useState(null); // Track active media item
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [mobileGalleryOverflow, setMobileGalleryOverflow] = useState(false);
  
  useEffect(() => {
    const updateWidths = () => {
      const screenWidth = window.innerWidth;
      setIsSmallScreen(screenWidth < 641); // Track if screen is below 640px

      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
      if (contentRef.current) {
        setContentWidth(contentRef.current.offsetWidth);
      }

      setMobileGalleryOverflow(containerRef.current.offsetWidth < contentRef.current.offsetWidth);
    };

    updateWidths(); // Initial check

    window.addEventListener("resize", updateWidths);
    return () => window.removeEventListener("resize", updateWidths);
  }, []);

  useEffect(() => {
    if (mediaItems && mediaItems.length > 0) {
      setActiveItem(mediaItems[activeIndex]);
    }
  }, [mediaItems, activeIndex]);

  return (
    <div className="w-full px-[5px] mb-0 sm:mb-8 sm:sticky sm:top-[60px] aspect-w-5 aspect-h-4 sm:aspect-h-2 lg:aspect-h-4">
      <div className="flex flex-col sm:flex-row gap-[10px]">
        <div
          ref={containerRef}
          className={`w-full order-2 sm:order-1 sm:w-[110px] h-[90px] min-h-[90px] sm:h-full flex flex-row
            sm:justify-start sm:flex-col  overflow-x-auto overflow-y-hidden sm:overflow-x-hidden
            sm:overflow-y-auto [&::-webkit-scrollbar]:h-[10px]
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500
  ${isSmallScreen && mobileGalleryOverflow ? "justify-start":"justify-center"}
  `}
        >
          <div
          ref={contentRef}
          className="flex flex-row sm:flex-col gap-[10px]">
            {mediaItems &&
              mediaItems.length > 0 &&
              mediaItems.map((item, index) => (
                <div
                  key={`image-gallery-item-${index}`}
                  className={`relative flex items-center w-[72px] min-w-[72px] min-h-[72px] h-[72px] bg-white rounded-sm shadow ${
                    index === activeIndex
                      ? "border-theme-600 border-[3px]"
                      : "border"
                  }`}
                >
                  <Image
                    src={item.src}
                    alt={`Thumbnail ${index}`}
                    className={`cursor-pointer hover:opacity-100 transition duration-300`}
                    objectFit="contain"
                    fill
                    onClick={() => setActiveIndex(index)}
                  />
                </div>
              ))}
          </div>
        </div>
        <div className="order-1 sm:order-2w-full h-full sm:w-[calc(100%-110px)] bg-white relative overflow-hidden border shadow">
          {activeItem && (
            <Image
              src={activeItem?.src}
              alt="Product"
              className="w-full"
              objectFit="contain"
              fill
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaGallery;
