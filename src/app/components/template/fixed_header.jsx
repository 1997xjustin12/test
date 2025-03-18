"use client";
import { useEffect, useState } from "react";
import HomeSearch from "@/app/components/search/HomeSearch";
import HomeSearchMobile from "@/app/components/search/HomeSearchMobile";
import { FluentChevronUp } from "@/app/components/icons/lib";
import CartButton from "@/app/components/atom/CartButton";
import Image from "next/image";
import Link from "next/link";
import { useSearch } from "@/app/context/search";
export default function FixedHeader() {
  const { mainIsActive } = useSearch();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [favicon, setFavicon] = useState(null);
  useEffect(() => {
    const fetchFavicon = async () => {
      try {
        const response = await fetch("/api/favicon",{cache:"no-store"});
        const data = await response.json();
        if (data) {
          setFavicon(data);
        }
      } catch (error) {
        console.error("Error fetching favicon:", error);
      }
    };

    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    const handleScroll = () => {
      const scrollHeight = 200; // Change this value as needed
      if (window.scrollY > scrollHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    setIsMobile(window.innerWidth < 1024);
    fetchFavicon();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!mainIsActive) {
    return (
      <>
        <div
          className={`fixed z-[10] top-0 left-0 w-full bg-[#4C4C53] shadow-md transform transition-transform duration-300 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0 z-[-10]"
          }`}
        >
          {!isMobile ? (
            <div
              className={`flex container mx-auto h-[50px] items-center justify-around`}
            >
              <div className="w-[40px] h-[40px] relative">
                {favicon && (
                  <Image
                    src={favicon}
                    alt="solana-icon"
                    className="w-full h-full object-cover"
                    width={500}
                    height={500}
                    // loading="eager"
                    // priority={false}
                  />
                )}
              </div>
              <div className="w-[180px] sm:w-[auto] md:w-[500px]">
                <HomeSearch controlled_height={true} main={false} />
              </div>
              <div>
                <ul className="flex space-x-4">
                  <li>
                    <CartButton className="text-white hover:text-theme-500" />
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="w-full ">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[20px]">
                  <div className="w-[40px] h-[40px] relative">
                    {favicon && (
                      <Image
                        src={favicon}
                        alt="solana-icon"
                        className="w-full h-full object-cover"
                        width={500}
                        height={500}
                        // loading="eager"
                        // priority={false}
                      />
                    )}
                  </div>
                  <div>
                    <div className="text-[0.6rem] sm:text-xs text-white font-bold">
                      CALL FOR BEST PRICING!
                    </div>
                    <Link
                      href="tel:(888)%20575-9720"
                      prefetch={false}
                      className="font-bold text-theme-400 hover:text-theme-300"
                    >
                      (888) 575-9720
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-[20px]">
                  <CartButton className="text-white hover:text-theme-500" />
                  <button
                    onClick={scrollToTop}
                    className="w-[60px] h-[60px] border-l flex items-center justify-center text-stone-300 hover:text-stone-100"
                  >
                    <span className="sr-only">Move to top button</span>
                    <FluentChevronUp />
                  </button>
                </div>
              </div>

              {/* search bar here */}
              <div>
                <HomeSearchMobile controlled_height={true} main={false} />
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}
