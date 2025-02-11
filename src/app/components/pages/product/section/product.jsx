"use client";
import Link from "next/link";
import ProductMetaTabs from "@/app/components/product/meta/Tabs";
import MediaGallery from "@/app/components/widget/MediaGallery";
import ProductToCart from "@/app/components/widget/ProductToCart";
import BackButton from "@/app/components/atom/BackButton";
import useFetchProductMetaFields from "@/app/hooks/useFetchProductMetaFields";
import ProductOption from "@/app/components/atom/productOption";
import CategoryChips from "@/app/components/atom/SingleProductCategoryChips";
import YouMayAlsoLike from "@/app/components/molecule/YouMayAlsoLike";

import { useState, useEffect } from "react";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
const ProductSection = ({ product, loading }) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [metafieldParam, setMetafieldParam] = useState({ id: product?.id });
  const { productMetaFields, loading: metaFieldsLoading } =
    useFetchProductMetaFields(metafieldParam);

  // console.log("product_id", product.id);
  useEffect(() => {
    if (product) {
      if (Object.keys(product).length > 0) {
        setMediaItems(product.images);
        setMetafieldParam({ id: product.id });
      }
    }
  }, [product]);

  useEffect(() => {
    if (productMetaFields && productMetaFields.length > 0) {
      setProductOptions(
        productMetaFields[0].value
          .filter((i) => i.option !== "") // remove data with empty string
          .map((i) => ({
            ...i,
            values: i.values
              .filter((i2) => i2.option_label !== "") // remove data with empty string
              .map((i2, idx2) => ({
                ...i2,
                is_checked: i2.sku.value === product?.sku,
              }))
              .sort((a, b) => a.option_label.localeCompare(b.option_label)),
          }))
      );
    }
  }, [productMetaFields]);

  return (
    <>
      <div className="p-4">
        <div className="container max-w-7xl px-[20px] mx-auto flex flex-col gap-[10px]">
          <div>
            <BackButton />
          </div>
        </div>
        <div className="container max-w-7xl px-[20px] mx-auto flex flex-col lg:flex-row gap-[0px] lg:gap-[40px] py-[20px]">
          <div className="w-full relative">
            <MediaGallery mediaItems={mediaItems} loading={loading} />
          </div>
          <div className="w-full">
            <ProductToCart product={product} loading={loading} />
            <div className="py-[30px] flex flex-col gap-[15px]">
              {/* product options */}
              {productOptions && productOptions.length > 0 && (
                <div className="flex flex-col gap-[15px]">
                  <div className="font-bold text-sm lg:text-lg">Options</div>
                  <div className="border">
                    {productOptions.map((item, idx) => (
                      <div
                        key={`product-option-${idx}`}
                        className="flex flex-col gap-[10px]"
                      >
                        <div className="font-medium text-xs lg:text-sm px-4 py-1 bg-stone-300 text-black">
                          {item.option}
                        </div>
                        <div className="flex items-center gap-[10px] p-1 pb-3">
                          {item?.values &&
                            item.values.map((item2, idx2) => (
                              <Link
                                key={`product-option-${idx}-value-${idx2}`}
                                href={`${BASE_URL}/product/${item2.sku.link}`}
                              >
                                <ProductOption option={item2} />
                              </Link>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Category */}
              <div>
                <div className="font-bold text-sm lg:text-lg mb-[15px]">
                  Category
                </div>
                <CategoryChips categories={product?.categories} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="container max-w-7xl px-[20px] mx-auto">
          <ProductMetaTabs product={product} />
        </div>
      </div>
      <div className="p-4">
        <div className="container max-w-7xl px-[20px] mx-auto">
          <YouMayAlsoLike displayItems={4} />
        </div>
      </div>
    </>
  );
};

export default ProductSection;
