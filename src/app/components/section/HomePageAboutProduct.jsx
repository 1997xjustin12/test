"use client";
import { useState } from "react";
import Image from "next/image";
import { ICRoundPhone } from "../icons/lib";
export default function HomePageAboutProduct() {
  const img = "/images/banner/fireplace-banner.webp";
  const [expand, setExpand] = useState(false);

  const handleExpandContent = () => {
    setExpand((prev) => !prev);
  };
  return (
    <div className="container mx-auto bg-[#F6F6F6] mt-5">
      <div className="w-full flex flex-col md:flex-row">
        <div className="w-full xl:w-[60%] p-[40px] flex flex-col gap-[30px]">
          <div className="text-xl md:text-3xl font-semibold">
            {/* font-bell */}
            {/* About Blaze Grill Products */}
            About Solana Fireplaces
          </div>
          <div className="relative w-full flex items-center justify-center xl:hidden aspect-2">
            {
              <Image
                src={img}
                alt="About-Blaze-Image"
                className="w-full h-full object-cover"
                // width={500}
                // height={500}
                fill
                sizes="100vw"
                loading="lazy"
                priority={false}
              />
            }
          </div>
          <div className="text-sm md:text-base font-medium">
            <p className="text-left">
              At Solana Fireplaces, we believe that the heart of a home extends
              beyond its walls. We specialize in creating exceptional outdoor
              living experiences through our expertly curated selection of
              high-quality fireplaces, fire pits, and related accessories. We
              are committed to providing you with products and the knowledge and
              support you need to transform your outdoor space into a warm,
              inviting haven.
            </p>
            <p
              className={`${
                expand ? "block" : "hidden"
              } text-left mt-[20px] md:hidden`}>
              Beyond fireplaces, Solana also caters to outdoor living
              enthusiasts by offering a wide range of outdoor kitchen products.
              Our selection includes top-of-the-line grills, BBQ islands, and
              accessories to create the ultimate outdoor cooking and
              entertainment area. With Solana Fireplaces, you can rely on our
              expertise and dedication to quality, knowing that you are choosing
              a partner committed to enhancing your home and lifestyle with the
              best in both indoor and outdoor heating and cooking solutions.
            </p>
            <button
              onClick={handleExpandContent}
              className="md:hidden py-[10px] underline italic">
              {expand ? "Show Less..." : "Show More..."}
            </button>
            <p className="hidden md:block text-left mt-[20px]">
              Beyond fireplaces, Solana also caters to outdoor living
              enthusiasts by offering a wide range of outdoor kitchen products.
              Our selection includes top-of-the-line grills, BBQ islands, and
              accessories to create the ultimate outdoor cooking and
              entertainment area. With Solana Fireplaces, you can rely on our
              expertise and dedication to quality, knowing that you are choosing
              a partner committed to enhancing your home and lifestyle with the
              best in both indoor and outdoor heating and cooking solutions.
            </p>
          </div>
          <div className="flex justify-center md:justify-start">
            <a href="tel:(888)%20977-9085">
              <button className="font-bold bg-orange-600 hover:bg-orange-500 text-white py-[4px] px-[10px] md:py-[7px] md:px-[25px] rounded-md flex items-center gap-[5px] md:gap-[10px]">
                <ICRoundPhone />
                <div className="text-sm md:text-base">
                  Call Now 888-667-4986
                </div>
              </button>
            </a>
          </div>
        </div>
        <div className="hidden xl:flex w-full xl:w-[40%] p-[40px] items-center justify-center">
          <div className="w-full relative aspect-2">
            {
              <Image
                src={img}
                alt="About-Blaze-Image"
                className="w-full h-full object-cover"
                // width={500}
                // height={500}
                fill
                sizes="100vw"
                loading="lazy"
                priority={false}
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
