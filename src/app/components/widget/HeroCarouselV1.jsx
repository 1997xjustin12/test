'use client'
import { useState } from "react";

const HeroCarouselV1 = () => {
  const slides = [
    { id: 1, content: "Slide 1", bgColor: "bg-blue-500" },
    { id: 2, content: "Slide 2", bgColor: "bg-red-500" },
    { id: 3, content: "Slide 3", bgColor: "bg-green-500" },
  ];
  
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full bg-gray-300">
      {/* Slides container */}
      <div className="overflow-hidden relative h-[400px]">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`flex-shrink-0 w-full h-full ${slide.bgColor} text-white flex items-center justify-center text-2xl`}
            >
              {slide.content}
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === index ? "bg-gray-900" : "bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroCarouselV1;
