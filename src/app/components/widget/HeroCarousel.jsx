'use client'
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const Carousel = ({ slides, autoSlideInterval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide functionality
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, autoSlideInterval);

    return () => clearInterval(timer);
  }, [isPaused, slides.length, autoSlideInterval]);

  // Change to a specific slide
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="relative h-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 relative h-60 sm:h-80 lg:h-96 flex"
            style={{backgroundImage:`url("${slide.background}")`}}
          >
            <div className={`absolute top-0 left-0 w-full text-white flex items-center h-56 sm:h-64 md:h-80 lg:h-96`}>
              <div className={`container mx-auto flex ${slide.position}`}>
               <div className="flex flex-col gap-[20px]">
                  <div className={`${slide.headline.twClass && slide.headline.twClass!==""? slide.headline.twClass: "text-white text-2xl sm:text-5xl font-bold"}`}>{slide.headline.text}</div>
                  <div className={`${slide.subheadline.twClass && slide.subheadline.twClass!==""? slide.subheadline.twClass: "text-[14px] sm:text-[18px]"}`}>{slide.subheadline.text}</div>
                  <div className={`${slide.cta.position && slide.cta.position!=="" ? slide.cta.position: '' }`}>
                    <a href={slide.cta.href} className={`${slide.cta.twClass}`}>{slide.cta.label}</a>
                  </div>
                </div>
              </div>
            </div>
            {/* <img
              src={slide}
              alt={`Slide ${index + 1}`}
              className="w-full h-56 sm:h-64 md:h-80 lg:h-96 object-cover"
            /> */}
          </div>
        ))}
      </div>

      {/* Page Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-width duration-500 ease-in-out ${
              index === currentIndex
                ? "bg-theme-500 w-6 h-1 md:w-8 md:h-2 "
                : "bg-pallete-lightgray w-1 h-1 md:w-2 md:h-2 "
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => goToSlide((currentIndex - 1 + slides.length) % slides.length)}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full sm:p-3 hover:bg-opacity-75"
      >
        <Icon icon="mingcute:left-fill" width="24" height="24" />
      </button>
      <button
        onClick={() => goToSlide((currentIndex + 1) % slides.length)}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full sm:p-3 hover:bg-opacity-75"
      >
        <Icon icon="mingcute:right-fill" width="24" height="24" />
      </button>
    </div>
  );
};

export default Carousel;


//36.37.70.147.148.149.150