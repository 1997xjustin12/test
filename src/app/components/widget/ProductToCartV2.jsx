"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Rating } from "@smastrom/react-rating";
import { useState, useEffect } from "react";
import FicDropDown from "@/app/components/atom/FicDropDown";
import {
  createSlug,
  formatPrice,
} from "@/app/lib/helpers";
import Link from "next/link";
import { useCart } from "@/app/context/cart";
import {
  ICRoundPhone,
  AkarIconsShippingV1,
  Eos3DotsLoading,
} from "../icons/lib";

import { useSolanaCategories } from "@/app/context/category";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;



const OnsaleTag = ({ price_details }) => {
  if (price_details?.compare_at_price && price_details?.compare_at_price && price_details?.compare_at_price > price_details?.compare_at_price) {
    return (
      <div className="py-[2px] px-[10px] text-white bg-theme-500 w-fit rounded-r-full text-xs md:text-base font-semibold">
        ON SALE
      </div>
    );
  }
}


const ProductToCart = ({ product, loading }) => {
  const { isPriceVisible } = useSolanaCategories();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [ATCLoading, setATCLoading] = useState(false);
  const [filteredCategoryIds, setFilteredCategoryIds] = useState([]);

  useEffect(() => {
    // if (product?.categories.length > 0) {
    //   let filterCat = [];
    //   product.categories.forEach((v, i) => {
    //     const cat_name = getCategoryNameById(v, bccat_json);
    //     if (
    //       cat_name !== undefined &&
    //       !cat_name.toLowerCase().includes("shop all")
    //     ) {
    //       filterCat.push(v);
    //     }
    //   });
    //   setFilteredCategoryIds(filterCat);
    // }
  }, [product]);

  const handleQuantityChange = (e) => {
    const { value } = e.target;
    setQuantity((prev) => {
      if (value === "") {
        return 0;
      } else {
        return parseInt(value);
      }
    });
  };

  const handleQuantityButtons = (direction) => {
    setQuantity((prev) => {
      let newQuantity = typeof prev === "number" ? prev : 0;
      if (direction === "inc") {
        newQuantity = newQuantity + 1;
      } else if (direction === "dec") {
        if (newQuantity > 1) {
          newQuantity = newQuantity - 1;
        }
      }
      return newQuantity;
    });
  };

  const [productData, setProductData] = useState(product);
  useEffect(() => {
    // console.log("product data", product);
    setProductData(product);
  }, [product]);

  const capitalizeFirstLetter = (string) => {
    if (!string) return ""; // Handle empty or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleHeartToggle = (e) => {
    setProductData((prev) => ({ ...prev, like: !prev.like }));
  };
  const createItemsArray = (item, quantity) => {
    return new Array(quantity).fill(item);
  };

  const handleAddToCart = async (item) => {
    setATCLoading(true);
    const items = createItemsArray(item, quantity);
    const response = await addToCart(items);
    setATCLoading(false);
  };

  const createBrandUrl = (brandName) => {
    const slug_name = createSlug(brandName);
    return `${BASE_URL}/brands-${slug_name}`;
  };

  function parseRatingCount(value) {
    if (typeof value === 'string') {
      value = value.replace(/[^\d]/g, '');
    }
    const count = parseInt(value, 10);
    return isNaN(count) ? 0 : count;
  }



  return (
    <div className="flex flex-col gap-[10px] w-full relative">
      <div className="relative">
        {product && <OnsaleTag price_details={productData?.variants?.[0]} />}
      </div>
      <div className="">
        <div className="font-bold text-sm md:text-lg">{productData?.title}</div>
        <div className="text-stone-400 text-xs md:text-sm uppercase">
          <Link
            prefetch={false}
            href="#"
            // href={createBrandUrl(productData?.brand?.name)}
          >
            {productData?.brand + " "}
          </Link>
          &#9679; SKU: {productData?.variants?.[0]?.sku}
        </div>
      </div>
      <div className="flex items-center">
        <Rating
          value={parseRatingCount(productData?.ratings?.rating_count)}
          style={{ maxWidth: 100 }}
          readOnly
        ></Rating>
        {/* <div>({productData?.reviews_count})</div> */}
      </div>
      <div className="text-sm md:text-base flex items-center gap-[8px] text-stone-500">
        <AkarIconsShippingV1 width={24} height={24} />
        Ships Within 1 to 2 Business Days
      </div>

      {
        !isPriceVisible(productData?.product_category, productData?.brand)   ?
        // display no price
        <div className="font-medium text-[14px] text-stone-700">Contact us for pricing.</div>:<>
          <div className="flex items-center gap-[20px]">
            {productData?.variants?.[0]?.price > 0 &&
            productData?.variants?.[0]?.compare_at_price > productData?.variants?.[0]?.price ? (
              <div className="flex flex-col gap-[10px]">
                <div className="flex gap-[10px]">
                  <div className="text-2xl md:text-3xl font-semibold text-stone-400 line-through">
                    ${formatPrice(productData?.variants?.[0]?.compare_at_price)}
                  </div>
                  <div className="text-2xl md:text-3xl font-extrabold text-pallete-green">
                    ${formatPrice(productData?.variants?.[0]?.price)}
                  </div>
                </div>
                <div>
                  <div className="font-semibold border-green-500 text-green-500 w-auto py-1 px-2 inline-block border-2">
                    Save $
                    {formatPrice(productData?.variants?.[0]?.compare_at_price - productData?.variants?.[0]?.price)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-2xl md:text-3xl font-extrabold text-pallete-green">
                ${formatPrice(productData?.variants?.[0]?.price)}
              </div>
            )}
            <div className="font-bold">QTY</div>
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityButtons("dec")}
                type="button"
                id="decrement-button"
                data-input-counter-decrement="counter-input"
                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
              >
                <svg
                  className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 2"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h16"
                  />
                </svg>
              </button>
              <input
                value={quantity}
                onChange={handleQuantityChange}
                readOnly
                min={1}
                type="text"
                id="counter-input"
                data-input-counter
                className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                placeholder=""
                required
              />
              <button
                onClick={() => handleQuantityButtons("inc")}
                type="button"
                id="increment-button"
                data-input-counter-increment="counter-input"
                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
              >
                <svg
                  className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="font-bold text-white">
            <button
              className={`bg-pallete-green rounded-full py-[5px] px-[20px] ${
                ATCLoading
                  ? "pointer-events-none relative"
                  : "pointer-events-auto"
              }`}
              onClick={() => handleAddToCart(productData)}
              disabled={ATCLoading}
            >
              {ATCLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Eos3DotsLoading width={48} height={48} />
                </div>
              )}
              <div
                className={`flex items-center gap-[5px] ${
                  ATCLoading ? "opacity-0" : "opacity-100"
                }`}
              >
                <div>
                  <Icon
                    icon="ph:shopping-cart-simple-bold"
                    className="text-[22px]"
                  />
                </div>
                <div className="font-bold uppercase text-sm md:text-base">
                  add to cart
                </div>
              </div>
            </button>
          </div>
        </>
      }
      <FicDropDown>
      <div className="text-blue-500 text-sm my-[5px] flex items-center gap-[7px]">
        {
          !isPriceVisible(productData?.product_category, productData?.brand)  ?
          <>Call for Price{" "}</>
          :
          <>Found It Cheaper?{" "}</>
        }
        <div
          className="hover:underline flex gap-[3px]"
        >
          <ICRoundPhone width={20} height={20} /> (888) 575-9720
        </div>
      </div>
      </FicDropDown>
      <div className="flex  flex-col md:flex-row md:items-center gap-[10px] md:gap-[25px]">
        <div className="flex items-center font-bold gap-[8px]">
          <div>
            <Icon
              icon="lucide:circle-check-big"
              className={`${
                productData?.is_free_shipping
                  ? "text-pallete-green"
                  : "text-stone-400"
              }`}
            />
          </div>
          <div
            className={`text-xs md:text-sm ${
              productData?.is_free_shipping ? "" : "line-through text-stone-400"
            }`}
          >
            <span
              className={`${
                productData?.is_free_shipping
                  ? "text-pallete-green"
                  : "text-stone-400"
              }`}
            >
              FREE
            </span>{" "}
            Shipping
          </div>
        </div>
        <div className="flex items-center font-bold gap-[8px]">
          <div>
            <Icon
              icon="lucide:circle-check-big"
              className="text-pallete-green"
            />
          </div>
          <div className="text-xs md:text-sm">Quick Ship Available</div>
        </div>
        {/* <div className="py-[5px] px-[15px] md:py-[6.5px] md:px-[25px] w-fit gap-[5px] flex items-center rounded-full bg-pallete-lightgray">
          <div>
            <Icon
              icon="material-symbols:info-outline"
              className="text-pallete-dark text-[18px]"
            />
          </div>
          <div className="text-xs md:text-sm text-pallete-dark font-semibold">
            Learn More
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default ProductToCart;
