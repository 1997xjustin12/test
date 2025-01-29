"use client";
import { useEffect, useState } from "react";
import HomeSearch from "../search/HomeSearch";
import { HeartIcon, CartIcon } from "../icons/lib";
import Image from "next/image";
export default function FixedHeader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = 200; // Change this value as needed
      if (window.scrollY > scrollHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`z-[10] fixed top-0 left-0 w-full bg-[#4C4C53] shadow-md transform transition-transform duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}>
      <div className="container mx-auto h-[50px] flex items-center justify-around">
        <div className="w-[40px] h-[40px] relative">
          <Image
            src="/logo-s1.webp"
            alt="solana-icon"
            className="w-full h-full object-cover"
            width={500}
            height={500}
            // loading="eager"
            // priority={false}
          />
        </div>
        <div className="w-[180px] sm:w-[auto] md:w-[500px]">
          <HomeSearch />
        </div>
        <div>
          <ul className="flex space-x-4">
            <li>
              <a href="#home" className="text-gray-700 relative">
                <div className="absolute bg-pallete-orange w-[20px] h-[20px] overflow-hidden rounded-full text-pallete-dark bottom-[60%] left-[60%] flex justify-center items-center">
                  <div className="text-[10px]">26</div>
                </div>
                <CartIcon width="24" height="24" color="white" />

                <div className="absolute text-[7px] w-full text-white bg-stone-900 uppercase text-center top-[20%] z-[1]">
                  Soon
                </div>
              </a>
            </li>
            <li>
              <a href="#about" className="text-gray-700 relative">
                <div className="absolute bg-pallete-orange w-[20px] h-[20px] overflow-hidden rounded-full text-pallete-dark bottom-[60%] left-[60%] flex justify-center items-center">
                  <div className="text-[10px]">739</div>
                </div>
                <HeartIcon width="24" height="24" color="white" />

                <div className="absolute text-[7px] w-full text-white bg-stone-900 uppercase text-center top-[20%] z-[1]">
                  Soon
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
