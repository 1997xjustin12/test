"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Rating } from "@smastrom/react-rating";
import Link from "next/link";
import { useState, useEffect } from "react";
import { formatPrice } from "@/app/lib/helpers";
import { useRouter } from "next/navigation";
import LoaderIcon from "../atom/LoaderIcon";
import OnsaleTag from "@/app/components/atom/ProductCardOnsaleTag";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
const ProductCard = ({ product }) => {
  const router = useRouter();
  const [thumbnail, setThumbnail] = useState(null);
  useEffect(() => {
    if (product) {
      setThumbnail((prev) => {
        if (product.images.length > 0) {
          // setImage
          return product.images.filter((i) => i.is_thumbnail)[0].url_thumbnail;
        } else {
          // setDefaultImage
        }
      });
    }
  }, [product]);
  const handleHeartButtonClick = () => {};
  const handleProductItemClick = (e) => {
    e.preventDefault();
    const url = e.target.closest("a").getAttribute("href");
    console.log(url);
    if (url) {
      // router.push(url);
      // setIsLoading(true);
    } else {
      alert("no url");
    }
  };
  return (
    <Link
      href={`${BASE_URL}/product/${product.custom_url.url}`}
      // onClick={handleProductItemClick}
      className="flex w-full h-full bg-white overflow-hidden rounded-md border duration-500  hover:shadow-xl pb-[8px] hover:border-stone-700 group">
      <div className="">
        <div
          className={`w-full flex items-center justify-center h-[230px] overflow-hidden relative ${
            product.isSelected ? "bg-stone-600" : "bg-white"
          }`}>
          <img
            src={thumbnail}
            alt=""
            className={`object-contain h-full ${
              product?.isSelected ? "opacity-40" : "opacity-100"
            }`}
          />
          <div className={`absolute ${product?.isSelected ? "" : "hidden"}`}>
            <LoaderIcon dark={false} />
          </div>
          <OnsaleTag categories={product?.categories} />
          <div className="absolute bottom-0 left-0 bg-pallete-orange text-white text-[12px] py-[5px] md:py-[7px] md:px-[15px] flex items-center w-full justify-center gap-[5px] invisible group-hover:visible">
            <div className="flex justify-center">
              <div className="font-semibold text-[0.775rem] inline-block text-center">
                <Icon
                  icon="mi:shopping-cart-add"
                  className="text-lg font-thin inline-block mr-[5px]"
                />
                {/* <div className="inline-block"> */}
                {/* CUSTOMIZE TO PURCHASE */}
                SHOP NOW
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col px-[15px] pt-[5px] border-t">
          {/* bg-red-500 */}
          <div className="text-xs h-[44px] ">
            STARTING AT{" "}
            <span className="text-pallete-orange font-bold text-lg">
              ${formatPrice(parseFloat(product.price).toFixed(2))}
            </span>
          </div>
          {/* bg-blue-300 */}
          <div className="text-sm h-[80px] ">
            <div className="line-clamp-4 font-semibold text-stone-700">
              {product.name}
            </div>
            {/* <div className="text-stone-400 italic font-semilight">
              by Brand Name
            </div> */}
          </div>
          {/* bg-yellow-300 */}
          <div className={`flex flex-col`}>
            <div className={`flex items-center gap-[5px]`}>
              <Rating
                readOnly
                value={product.reviews_rating_sum}
                fractions={2}
                style={{ maxWidth: 80 }}></Rating>
              <div className={`text-[0.75rem]`}>
                ({product.reviews_count}){/* (id:{product.id}) */}
              </div>
            </div>
            <div className="text-pallete-gray text-[0.65rem] md:text-sm h-[25px]">
              {product.sku}
            </div>
          </div>
          {/* bg-green-300  */}
          <div className="flex  h-[48px] items-center">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-[5px]">
              {
                // product.is_free_shipping && (
                <div className="flex items-center font-bold gap-[3px]">
                  <div>
                    <Icon
                      icon="lucide:circle-check-big"
                      className={`${
                        product.is_free_shipping
                          ? "text-pallete-green"
                          : "text-pallete-gray"
                      }`}
                    />
                  </div>
                  <div
                    className={`text-[0.875rem] relative ${
                      product.is_free_shipping
                        ? "text-black"
                        : "text-pallete-gray line-through"
                    }`}>
                    <span
                      className={`${
                        product.is_free_shipping
                          ? "text-pallete-green"
                          : "text-pallete-gray"
                      }`}>
                      FREE
                    </span>{" "}
                    Shipping
                  </div>
                </div>
                // )
              }
              {/* {product?.custom_fields?.quick_ship && ( */}
              <div className="flex items-center font-bold gap-[3px]">
                <div>
                  <Icon
                    icon="lucide:circle-check-big"
                    className="text-pallete-green"
                  />
                </div>
                <div className="text-[0.875rem]">Quick Ship Available</div>
              </div>
              {/* )} */}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
