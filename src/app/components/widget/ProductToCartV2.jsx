"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Rating } from "@smastrom/react-rating";
import { useState, useEffect } from "react";
import { createSlug, formatPrice } from "@/app/lib/helpers";
import Link from "next/link";
import { ICRoundPhone, AkarIconsShippingV1 } from "../icons/lib";
import { BASE_URL } from "@/app/lib/helpers";
import { useSolanaCategories } from "@/app/context/category";

const OnsaleTag = ({ price_details }) => {
  if (
    price_details?.compare_at_price &&
    price_details?.compare_at_price &&
    price_details?.compare_at_price > price_details?.compare_at_price
  ) {
    return (
      <div className="py-[2px] px-[10px] text-white bg-theme-500 w-fit rounded-r-full text-xs md:text-base font-semibold">
        ON SALE
      </div>
    );
  }
};

const OpenBoxItemLink = ({ product, compare_price }) => {
  if (!product || !compare_price) return;
  const product_price = product?.variants?.[0]?.price || 0;
  const savings = compare_price - product_price;
  const savings_percentage = ((savings / compare_price) * 100).toFixed(0);
  return (
    <Link
      href={`${BASE_URL}/${createSlug(product?.brand)}/product/${
        product?.handle
      }`}
      target="_blank"
      rel="noopener noreferrer"
      className="py-2 px-5 border-[transparent] hover:bg-stone-800 group hover:border-neutral-300 transition-all border-b border-stone-400"
    >
      <div className="line-clamp-1 text-xs font-bold text-stone-700 text-center group-hover:text-white group-hover:font-medium">
        {product?.title}
      </div>
      <div className="text-green-700 font-bold text-center text-xs group-hover:text-green-400 group-hover:font-medium">
        {`Open Box: From $${formatPrice(product_price)} Save $${formatPrice(
          savings
        )}(${savings_percentage}%)`}
      </div>
    </Link>
  );
};

const OpenBoxSection = ({ products, product_price }) => {
  if (!products || !Array.isArray(products) || products.length === 0) return;

  return (
    <div className="bg-neutral-100 px-3 py-3 shadow-xl border">
      <div className="font-bold bg-green-800 text-white underline px-3  flex items-center justify-center uppercase">
        Save Big - Shop Open Box
      </div>
      <div className="flex flex-col w-full mt-2">
        {products.map((product, index) => (
          <OpenBoxItemLink
            key={`open-box-offers-${index}`}
            product={product}
            compare_price={product_price}
          />
        ))}
      </div>
    </div>
  );
};

const ProductToCart = ({ product, loading }) => {
  const { isPriceVisible } = useSolanaCategories();
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

  const createBrandUrl = (brandName) => {
    const slug_name = createSlug(brandName);
    return `${BASE_URL}/brands-${slug_name}`;
  };

  function parseRatingCount(value) {
    if (typeof value === "string") {
      value = value.replace(/[^\d]/g, "");
    }
    const count = parseInt(value, 10);
    return isNaN(count) ? 0 : count;
  }

  return (
    <div className="flex flex-col gap-4 w-full relative">
      {/* <div className="relative">
        {product && <OnsaleTag price_details={productData?.variants?.[0]} />}
      </div> */}
      <div className="space-y-1">
        <div className="font-bold text-lg md:text-2xl text-stone-900 leading-tight">
          {productData?.title}
        </div>
        <div className="text-stone-500 text-sm md:text-base uppercase">
          <Link
            prefetch={false}
            href="#"
            className="hover:text-stone-700 transition-colors"
            // href={createBrandUrl(productData?.brand?.name)}
          >
            {productData?.brand + " "}
          </Link>
          <span className="text-stone-400">&#9679;</span> SKU:{" "}
          <span className="font-medium">{productData?.variants?.[0]?.sku}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Rating
          value={parseRatingCount(productData?.ratings?.rating_count)}
          style={{ maxWidth: 110 }}
          readOnly
        ></Rating>
        {/* <div>({productData?.reviews_count})</div> */}
      </div>
      <div className="text-sm md:text-base flex items-center gap-2 text-stone-600 font-medium">
        <AkarIconsShippingV1 width={24} height={24} />
        <span>Ships Within 1 to 2 Business Days</span>
      </div>
      {!isPriceVisible(productData?.product_category, productData?.brand) ? (
        // display no price
        <div className="font-semibold text-base md:text-lg text-stone-700 py-2">
          Contact us for pricing.
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {/* Price Section */}
            <div>
              {productData?.variants?.[0]?.price > 0 &&
              productData?.variants?.[0]?.compare_at_price >
                productData?.variants?.[0]?.price ? (
                <div className="flex flex-col gap-1">
                  <div className="flex gap-3 items-center flex-wrap">
                    <div className="text-3xl md:text-4xl font-extrabold text-pallete-green">
                      ${formatPrice(productData?.variants?.[0]?.price)}
                    </div>
                    <div className="text-base md:text-lg font-semibold text-stone-400 line-through">
                      $
                      {formatPrice(
                        productData?.variants?.[0]?.compare_at_price
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="text-base md:text-lg font-bold text-red-600">
                      Save $
                      {formatPrice(
                        productData?.variants?.[0]?.compare_at_price -
                          productData?.variants?.[0]?.price
                      )}
                    </div>
                    {productData?.is_free_shipping && (
                      <div className="text-base md:text-lg font-bold text-green-700">
                        + Free Shipping
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-3xl md:text-4xl font-extrabold text-pallete-green">
                  ${formatPrice(productData?.variants?.[0]?.price)}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <OpenBoxSection
        products={productData?.open_box}
        product_price={productData?.variants?.[0]?.price}
      />
    </div>
  );
};

export default ProductToCart;
