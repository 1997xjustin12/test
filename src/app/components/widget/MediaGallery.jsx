"use client";
import React, { useState, useRef, useEffect } from "react";

const loader_thumbnails = [1, 2, 3, 4];
const MediaGallery = ({ mediaItems, loading }) => {
  const [activeIndex, setActiveIndex] = useState(0); // Track active media item
  const [activeItem, setActiveItem] = useState(null); // Track active media item
  const zoomRef = useRef(null); // Ref for zoom functionality

  const handleMouseMove = (e) => {
    if (zoomRef.current) {
      const { left, top, width, height } =
        zoomRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      zoomRef.current.style.backgroundPosition = `${x}% ${y}%`;
    }
  };

  useEffect(() => {
    // console.log(mediaItems);
    if (mediaItems && mediaItems.length > 0) {
      setActiveItem(mediaItems[activeIndex]);
      // console.log("activeItem", mediaItems[activeIndex])
    }
  }, [mediaItems, activeIndex]);

  return (
    <div className="w-full px-4 mb-8">
      {loading && (
        <>
          <div className="flex aspect-w-16 h-[350px] md:aspect-w-4 md:aspect-h-3 overflow-hidden rounded-lg shadow-md mb-4 justify-center items-center bg-stone-200"></div>
          <div className="flex gap-4 py-4 justify-center overflow-x-auto">
            {loader_thumbnails.map((item, index) => (
              <div
                key={`img-gallery-loader-${index}`}
                className={`size-16 sm:size-20 object-cover rounded-md cursor-pointer bg-stone-200 transition duration-300`}
              />
            ))}
          </div>
        </>
      )}
      {!loading && (
        <>
          <div className="flex aspect-w-16 h-[350px] md:aspect-w-4 md:aspect-h-3 overflow-hidden rounded-lg shadow-md mb-4 justify-center items-center">
            <img
              src={activeItem?.url_standard}
              alt="Product"
              className="object-contain"
              id="mainImage"
            />
          </div>
          <div
            className="flex gap-4 py-4 justify-center overflow-x-auto [&::-webkit-scrollbar]:h-[10px]
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            {mediaItems &&
              mediaItems.length > 0 &&
              mediaItems.map((item, index) => (
                <img
                  key={`img-gallery-${index}`}
                  src={item.url_thumbnail}
                  alt={`Thumbnail ${index}`}
                  className={`size-16 sm:size-20 object-cover rounded-md cursor-pointer hover:opacity-100 transition duration-300 ${
                    index === activeIndex ? "opacity-100" : "opacity-60"
                  }`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MediaGallery;
