"use client";
import { useEffect, useState } from "react";
import HomeSearch from "../search/HomeSearch";
import { HeartIcon } from "../icons/lib";
import CartButton from "@/app/components/atom/CartButton";
import Image from "next/image";
import { useSearch } from "@/app/context/search";
export default function FixedHeader() {
  const { mainIsActive } = useSearch();
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

  if (!mainIsActive) {
    return (
      <div
        className={`z-[10] fixed top-0 left-0 w-full bg-[#4C4C53] shadow-md transform transition-transform duration-300 ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 z-[-10]"
        }`}
      >
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
            <HomeSearch controlled_height={true} main={false} />
          </div>
          <div>
            <ul className="flex space-x-4">
              <li>
                <CartButton className="text-white hover:text-orange-500" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
