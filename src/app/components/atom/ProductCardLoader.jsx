"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Rating } from "@smastrom/react-rating";
import LoaderIcon from "../atom/LoaderIcon";

const ProductCardLoader = () => {
  return (
    <div className="overflow-hidden rounded-md border w-full bg-white">
      <div className="w-full flex items-center justify-center h-[230px] overflow-hidden bg-stone-200 relative">
        <div className="opacity-30">
          <LoaderIcon />
        </div>
      </div>
      <div className="px-[8px] py-[10px]">
        <div className="flex flex-col gap-[2px]">
          <div className="text-[14px] bg-stone-200 w-full h-[21px]"></div>
          <div className="text-[14px] bg-stone-200 w-[80%] h-[21px]"></div>
        </div>
        <div className="flex justify-between mt-[10px]">
          <div className="text-[14px] bg-stone-200 w-[50%] h-[21px]"></div>
          <div className="text-[14px] bg-stone-200 w-[30%] h-[21px]"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardLoader;
