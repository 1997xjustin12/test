"use client";
import { useState } from "react";
import Image from "next/image";
import { ICRoundPhone } from "../icons/lib";

export default function HomePageAboutProduct({data, textColor="text-black", bgColor="bg-white", children}) {
  const [expand, setExpand] = useState(false);

  const handleExpandContent = () => {
    setExpand((prev) => !prev);
  };
  return (
    <div className={`container mx-auto ${textColor} ${bgColor}`}>
      <div className="w-full flex flex-col md:flex-row">
        <div className="w-full xl:w-[60%] p-[40px] flex flex-col gap-[30px]">
          <h2 className="md:text-4xl text-[30px] font-normal italic font-libre">
            {data?.content?.title}
          </h2>
          <div className={`flex items-center justify-center xl:hidden ${data?.imageWrap?.className || "relative w-full aspect-2"}`}>
            {
              <Image
                src={data?.image}
                alt={data?.content?.title}
                className="w-full h-full object-cover"
                fill
                sizes="100vw"
                loading="lazy"
                priority={false}
              />
            }
          </div>
          <div className="text-sm md:text-base font-medium">
            <p className="text-left">{data?.content?.par[0]}</p>
            <p
              className={`${
                expand ? "block" : "hidden"
              } text-left mt-[20px] md:hidden`}
            >
              {data?.content?.par[1]}
            </p>
            <button
              onClick={handleExpandContent}
              className="md:hidden py-[10px] underline italic"
            >
              {expand ? "Show Less..." : "Show More..."}
            </button>
            {data?.content?.par && Array.isArray(data?.content?.par) && data?.content?.par?.length > 1 && data.content.par.slice(1).map((item, index) => (
              <p
                key={`col-par-${index}`}
                className="hidden md:block text-left mt-[20px]"
              >
                {item}
              </p>
            ))}
          </div>
          <div className="flex justify-center md:justify-start">
            {
              children ? children: <a href={`tel:${data?.contact}`}>
              <button className={data?.button?.className || "font-bold bg-theme-600 hover:bg-theme-500 text-white py-[4px] px-[10px] md:py-[7px] md:px-[25px] rounded-md flex items-center gap-[5px] md:gap-[10px]"}>
                <ICRoundPhone />
                <div className="text-sm md:text-base">
                  Call Now {data?.contact}
                </div>
              </button>
            </a>
            }
          </div>
        </div>
        <div className="hidden xl:flex w-full xl:w-[40%] p-[40px] items-center justify-center">
          <div className={data?.imageWrap?.className||"w-full relative aspect-2"}>
            {
              <Image
                src={data?.image}
                alt={data?.content?.title}
                className="w-full h-full object-cover"
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
