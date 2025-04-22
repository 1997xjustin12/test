"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Rating } from "@smastrom/react-rating";
import Link from "next/link";
import { useState, useEffect } from "react";
import { formatPrice } from "@/app/lib/helpers";
import { useRouter } from "next/navigation";
import LoaderIcon from "../atom/LoaderIcon";
import OnsaleTag from "@/app/components/atom/productCardOnsaleTag";
import BrandDisplay from "@/app/components/atom/ProductCardBrandDisplay";
import PriceDisplay from "@/app/components/atom/ProductCardPriceDisplay";
import { ICRoundPhone } from "../icons/lib";
// import { useQuickView } from "@/app/context/quickview";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
const ProductCard = ({ hit }) => {
//   const { viewItem } = useQuickView();
console.log("hitCardV2 hits as hit", hit)
  const [thumbnail, setThumbnail] = useState(null);
  useEffect(() => {
    if (hit) {
      setThumbnail((prev) => {
        if (hit.images.length > 0) {
          // setImage
          return hit.images.filter((i) => i.is_thumbnail)[0].url_thumbnail;
        } else {
          // setDefaultImage
        }
      });
    }
  }, [hit]);
  const handleHeartButtonClick = () => {};
  const handleProductItemClick = (e) => {
    e.preventDefault();
    const url = e.target.closest("a").getAttribute("href");
    // console.log(url);
    if (url) {
      // router.push(url);
      // setIsLoading(true);
    } else {
      alert("no url");
    }
  };

  const handleQuickViewClick = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    // viewItem(item);
  };

  const triggerCall = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = "tel:(888)%205759720";
  };

  return (
    <Link
      prefetch={false}
      href={`${BASE_URL}/product/${hit.custom_url.url}`}
      // onClick={handleProductItemClick}
      className="flex w-full h-full bg-white overflow-hidden rounded-md border duration-500  hover:shadow-xl pb-[8px] hover:border-stone-700 group"
    >
      <div className="w-full">
        <div
          className={`w-full flex items-center justify-center h-[230px] overflow-hidden relative ${
            hit.isSelected ? "bg-stone-600" : "bg-white"
          }`}
        >
          <img
            src={thumbnail}
            alt=""
            className={`object-contain h-full ${
              hit?.isSelected ? "opacity-40" : "opacity-100"
            }`}
          />
          <div className={`absolute ${hit?.isSelected ? "" : "hidden"}`}>
            <LoaderIcon dark={false} />
          </div>
          <OnsaleTag categories={hit?.categories} />
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
          <div className="text-sm line-clamp-2 font-semibold text-stone-700" title={hit.name}>
            {hit.name}
          </div>
          <div className={`flex items-center gap-[5px]`}>
            <Rating
              readOnly
              value={hit.reviews_rating_sum}
              fractions={2}
              style={{ maxWidth: 100 }}
            ></Rating>
            <div className={`text-[0.75rem]`}>
              ({hit.reviews_count}){/* (id:{hit.id}) */}
            </div>
          </div>
          <div className="mt-3">
            <BrandDisplay product={hit}/>
          </div>
          <div className="mt-3">
            <PriceDisplay product={hit}/>
          </div>
          <div className="flex  h-[48px] items-center">
            <div className=" flex-wrap flex flex-col md:flex-row md:items-center justify-between gap-[5px]">
              {
                // product.is_free_shipping && (
                // <div className="flex text-[0.7rem] sm:text-base items-center font-bold gap-[3px]">
                //   <div>
                //     <Icon
                //       icon="lucide:circle-check-big"
                //       className={`${
                //         product.is_free_shipping
                //           ? "text-pallete-green"
                //           : "text-pallete-gray"
                //       }`}
                //     />
                //   </div>
                //   <div
                //     className={`text-[0.7rem] sm:text-[0.875rem] relative ${
                //       product.is_free_shipping
                //         ? "text-black"
                //         : "text-pallete-gray line-through"
                //     }`}>
                //     <span
                //       className={`${
                //         product.is_free_shipping
                //           ? "text-pallete-green"
                //           : "text-pallete-gray"
                //       }`}>
                //       FREE
                //     </span>{" "}
                //     Shipping
                //   </div>
                // </div>
                // )
              }
              {/* {product?.custom_fields?.quick_ship && ( */}
              {/* <div className="flex text-[0.7rem] sm:text-base items-center font-bold gap-[3px]">
                <div>
                  <Icon
                    icon="lucide:circle-check-big"
                    className="text-pallete-green"
                  />
                </div>
                <div className="text-[0.7rem] sm:text-[0.875rem]">Quick Ship Available</div>
              </div> */}
              {/* )} */}
            </div>
          </div>

          <div className="text-xs my-[5px] text-blue-500 flex items-center cursor-default gap-[7px] flex-wrap">
            Found It Cheaper?{" "}
            <div
              onClick={triggerCall}
              className="hover:underline flex items-center gap-[3px] cursor-pointer"
            >
              <ICRoundPhone width={16} height={16} /> <div>(888) 575-9720</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
