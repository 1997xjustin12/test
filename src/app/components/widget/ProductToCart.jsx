"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Rating } from "@smastrom/react-rating";
import { useState, useEffect } from "react";
import { bc_categories as bccat_json } from "../../lib/category-helpers";
import FicDropDown from "@/app/components/atom/FicDropDown";
import {
  createSlug,
  formatPrice,
  getCategoryNameById,
} from "@/app/lib/helpers";
import OnsaleTag from "@/app/components/atom/SingleProductOnsaleTag";
import Link from "next/link";
import { useCart } from "@/app/context/cart";
import {
  ICRoundPhone,
  AkarIconsShippingV1,
  Eos3DotsLoading,
} from "../icons/lib";

import { useSolanaCategories } from "@/app/context/category";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

const ProductToCart = ({ product, loading }) => {
  const { price_hidden_categories } = useSolanaCategories();
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

  return (
    <div className="flex flex-col gap-[10px] w-full relative">
      <div className="relative">
        {product && <OnsaleTag categories={product?.categories} />}
      </div>
      <div className="">
        <div className="font-bold text-sm md:text-lg">{productData?.name}</div>
        <div className="text-stone-400 text-xs md:text-sm uppercase">
          <Link
            prefetch={false}
            href={createBrandUrl(productData?.brand?.name)}
          >
            {productData?.brand?.name + " "}
          </Link>
          &#9679; SKU: {productData?.sku}
        </div>
      </div>
      <div className="flex items-center">
        <Rating
          value={productData?.reviews_rating_sum}
          style={{ maxWidth: 100 }}
        ></Rating>
        <div>({productData?.reviews_count})</div>
      </div>
      <div className="text-sm md:text-base flex items-center gap-[8px] text-stone-500">
        <AkarIconsShippingV1 width={24} height={24} />
        Ships Within 1 to 2 Business Days
      </div>
      <FicDropDown>
      <div className="text-blue-500 text-sm my-[5px] flex items-center gap-[7px]">
          <>Call for Best Price{" "}</>
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
