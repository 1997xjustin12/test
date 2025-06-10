"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Rating } from "@smastrom/react-rating";
import Link from "next/link";
import { useState, useEffect } from "react";
import { formatPrice } from "@/app/lib/helpers";
import { ICRoundPhone } from "../icons/lib";
import { useQuickView } from "@/app/context/quickview";
import { useSolanaCategories } from "@/app/context/category";
import FicDropDown from "@/app/components/atom/FicDropDown";

const ProductCardPriceDisplay = ({ price_details }) => {
  if (!price_details) {
    return;
  }
  if (
    price_details?.price > 0 &&
    price_details?.compare_at_price > price_details?.price
  ) {
    return (
      <div className="text-sm flex flex-wrap gap-[5px]">
        <div className="flex gap-[5px]">
          <div className="font-semibold">
            ${formatPrice(price_details.price)}
          </div>
          <div className="line-through text-stone-400">
            ${formatPrice(price_details.compare_at_price)}
          </div>
        </div>
        <div className="text-green-600  font-semibold">
          Save $
          {formatPrice(price_details.compare_at_price - price_details.price)}
        </div>
      </div>
    );
  } else {
    return (
      <div className="text-sm font-semibold">
        ${formatPrice(price_details.price)}
      </div>
    );
  }
};

const ProductCard = ({ hit }) => {
  const { viewItem } = useQuickView();
  const { isPriceVisible, getProductUrl} = useSolanaCategories();

  const handleQuickViewClick = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    viewItem(item);
  };

  function parseRatingCount(value) {
    if (typeof value === "string") {
      // Remove any non-digit characters (like surrounding quotes)
      value = value.replace(/[^\d]/g, "");
    }
    const count = parseInt(value, 10);
    return isNaN(count) ? 0 : count;
  }

  return (
    <Link
      prefetch={false}
      href={`${getProductUrl(hit)}`}
      // onClick={handleProductItemClick}
      className="flex w-full h-full bg-white overflow-hidden rounded-md border duration-500  hover:shadow-xl pb-[8px] hover:border-stone-700 group"
    >
      <div className="w-full">
        <div
          className={`w-full flex items-center justify-center h-[230px] overflow-hidden relative bg-white`}
        >
          {hit?.images &&
            Array.isArray(hit?.images) &&
            hit?.images?.length > 0 &&
            hit.images[0]?.src && (
              <img
                src={hit.images[0].src}
                alt={hit.images[0].alt}
                className={`object-contain h-full opacity-100`}
              />
            )}

          {hit?.variants &&
            Array.isArray(hit.variants) &&
            hit.variants.length > 0 &&
            hit.variants?.[0]?.price < hit.variants?.[0]?.compare_at_price && (
              <div className="absolute bottom-[60px] left-0 rounded-r-full bg-theme-500 text-white text-[12px] font-bold py-[7px] px-[15px]">
                ONSALE
              </div>
            )}
          <div
            onClick={(e) => handleQuickViewClick(e, hit)}
            className="absolute bottom-0 left-0 bg-theme-500 text-white text-[12px] py-[5px] md:py-[7px] md:px-[15px] flex items-center w-full justify-center gap-[5px] invisible group-hover:visible"
          >
            <div className="flex justify-center">
              <div className="font-semibold text-[0.775rem] inline-block text-center">
                <Icon
                  icon="mi:shopping-cart-add"
                  className="text-lg font-thin inline-block mr-[5px]"
                />
                {/* CUSTOMIZE TO PURCHASE */}
                QUICK VIEW
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col px-[15px] pt-[5px] border-t">
          <div
            className="text-sm line-clamp-2 font-semibold text-stone-700"
            title={hit.title}
          >
            {hit.title}
          </div>
          <div className={`flex items-center gap-[5px]`}>
            <Rating
              readOnly
              value={parseRatingCount(hit?.ratings?.rating_count)}
              fractions={2}
              style={{ maxWidth: 100 }}
            ></Rating>
            {/* <div className={`text-[0.75rem]`}>git  */}
          </div>
          <div className="mt-3">{hit.brand}</div>
          <div className="mt-3">
            {!isPriceVisible(hit?.product_category, hit?.brand) ? (
              <div className="font-medium text-[14px] text-stone-700">
                Contact us for pricing.
              </div>
            ) : (
              <ProductCardPriceDisplay price_details={hit?.variants?.[0]} />
            )}
          </div>
          <FicDropDown>
            <div className="text-xs my-[5px] text-blue-500 flex items-center cursor-default gap-[7px] flex-wrap">
              {!isPriceVisible(hit?.product_category, hit?.brand) ? (
                <>Call for Price </>
              ) : (
                <>Found It Cheaper? </>
              )}
              <div className="hover:underline flex items-center gap-[3px] cursor-pointer">
                <ICRoundPhone width={16} height={16} />{" "}
                <div>(888) 575-9720</div>
              </div>
            </div>
          </FicDropDown>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
