import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ICRoundPhone } from "../icons/lib";
import {useSolanaCategories} from "@/app/context/category"
import YouMayAlsoLike from "../molecule/YouMayAlsoLike";
function NoSearchResultFound({ query }) {
  const {solana_categories} = useSolanaCategories();
  return (
    <div className="container mx-auto min-h-screen">
      {/* row1 */}
      <div className="flex w-full flex-wrap bg-stone-200 py-[30px] px-2 md:px-4">
        <div className="w-full text-center flex flex-col gap-[10px] md:gap-[20px]">
          <div className="font-bold text-lg md:text-2xl">Search Result</div>
          <div className="text-xs md:text-base">
            No search result found for: {query}
          </div>
          <div className="text-xs md:text-base font-medium">
            Please Try Another Query
          </div>
        </div>
      </div>
      <div className="flex w-full flex-wrap bg-[#4C4C53] py-[10px] px-2 md:px-4">
        <div className="w-full text-center justify-center items-center flex flex-col">
          <div className="font-bold text-white text-sm md:text-base">
            Call For Inquiries and Best Pricing!
          </div>
          <Link
            href="tel:(888)%20575-9720"
            prefetch={false}
            className="flex items-center gap-[10px] font-bold text-theme-400 text-sm md:text-base"
          >
            <ICRoundPhone />
            <div>(888) 575-9720</div>
          </Link>
        </div>
      </div>
      <div className="w-full py-[30px] px-2 md:px-4 flex gap-[20px] flex-wrap">
        <div className="text-lg md:text-2xl font-bold w-full">Category</div>
        {solana_categories
          .filter((i) => !["Home", "Search"].includes(i.name))
          .map((i) => (
            <Link
              key={`main-category-item-${i.url}`}
              prefetch={false}
              href={i.url}
              className="flex items-center gap-[20px] hover:shadow rounded-md overflow-hidden border hover:border-theme-500 xl:w-[calc(25%-15px)] lg:w-[calc(33.3%-15px)] sm:w-[calc(50%-15px)] w-full"
            >
              <div className="relative w-[70px] h-[70px] min-w-[70px] min-h-[70px] bg-stone-100 border-stone-300 border-r">
                {
                  i?.banner?.img?.src && 
                  <Image
                    src={i?.banner?.img?.src}
                    alt={i?.banner?.img?.alt}
                    objectFit="contain"
                    fill
                  />
                }
              </div>
              <div className="font-semibold text-stone-600">{i.name}</div>
            </Link>
          ))}
      </div>
      <div className="w-full pb-[30px] px-2 md:px-4 flex gap-[20px] flex-wrap">
        <YouMayAlsoLike displayItems={4} />
      </div>
    </div>
  );
}

export default NoSearchResultFound;
