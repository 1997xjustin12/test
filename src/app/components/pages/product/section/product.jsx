"use client";
import Link from "next/link";
import ProductMetaTabs from "@/app/components/product/meta/Tabs";
import MediaGallery from "@/app/components/widget/MediaGallery";
import ProductToCart from "@/app/components/widget/ProductToCart";
import useFetchProductMetaFields from "@/app/hooks/useFetchProductMetaFields";
import ProductOption from "@/app/components/atom/productOption";
import CategoryChips from "@/app/components/atom/SingleProductCategoryChips";
import YouMayAlsoLike from "@/app/components/molecule/YouMayAlsoLike";
import BreadCrumbs from "@/app/components/atom/SingleProductBreadCrumbs";
import parse from "html-react-parser";
import { useState, useEffect } from "react";
import { keys, redisGet } from "@/app/lib/redis";
import { MingcuteUpLine, MingcuteDownLine } from "@/app/components/icons/lib";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

const about = keys.faqs_about_solana.value;
const shipping_policy = keys.faqs_shipping_policy.value;
const return_policy = keys.faqs_return_policy.value;
const warranty = keys.faqs_warranty.value;
const ProductSection = ({ product, loading }) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [metafieldParam, setMetafieldParam] = useState({ id: product?.id });
  const { productMetaFields, loading: metaFieldsLoading } =
    useFetchProductMetaFields(metafieldParam);
  const [policy_section, setPolicySection] = useState([
    {
      key: about,
      label: "About Solana Fireplaces",
      content: "",
      expanded: false,
    },
    {
      key: shipping_policy,
      label: "Shipping Policy",
      content: "",
      expanded: false,
    },
    {
      key: return_policy,
      label: "Return Policy",
      content: "",
      expanded: false,
    },
    { key: warranty, label: "Warranty", content: "", expanded: false },
  ]);

  const handleExpandFAQsSection = (key) => {
    setPolicySection((prev) => {
      return prev.map((i) => ({
        ...i,
        expanded: i.key === key ? !i.expanded : i.expanded,
      }));
    });
  };

  // console.log("product_id", product.id);
  useEffect(() => {
    if (product) {
      if (Object.keys(product).length > 0) {
        setMediaItems(product.images);
        setMetafieldParam({ id: product.id });
        // setProductOptions((prev) => {
        //   if (product?.metafields && product.metafields.length > 0) {
        //     const product_options = product.metafields
        //       .map((i) => ({ ...i, value: JSON.parse(i.value) }))
        //       .find(({ namespace }) => namespace === "product_options");
        //     if (!product_options) {
        //       return null;
        //     }
        //     console.log("product_options", product_options);
        //     return product_options.value
        //       .filter((i) => i.option !== "") // remove data with empty string
        //       .map((i) => ({
        //         ...i,
        //         values: i?.values
        //           ? i.values
        //               .filter((i2) => i2.option_label !== "") // remove data with empty string
        //               .map((i2, idx2) => ({
        //                 ...i2,
        //                 is_checked: i2.sku.value === product?.sku,
        //               }))
        //               .sort((a, b) =>
        //                 a.option_label.localeCompare(b.option_label)
        //               )
        //           : i?.handle,
        //       }));
        //   }
        // });
      }
    }
  }, [product]);

  useEffect(() => {
    if (productMetaFields && productMetaFields.length > 0) {
      setProductOptions((prev) => {
        // console.log("productMetaFields",productMetaFields);
        const product_options = productMetaFields.find(
          ({ namespace }) => namespace === "product_options"
        );
        if (!product_options) {
          return null;
        }
        return product_options.value
          .filter((i) => i.option !== "") // remove data with empty string
          .map((i) => ({
            ...i,
            values: i?.values
              ? i.values
                  .filter((i2) => i2.option_label !== "") // remove data with empty string
                  .map((i2, idx2) => ({
                    ...i2,
                    is_checked: i2.sku.value === product?.sku,
                  }))
                  .sort((a, b) => a.option_label.localeCompare(b.option_label))
              : i?.handle,
          }));
      });
    }
  }, [productMetaFields]);

  useEffect(() => {
    redisGet([about, shipping_policy, return_policy, warranty])
      .then((response) => {
        console.log("redisGetResponse", response);
        setPolicySection((prev) => {
          return prev.map((item, index) => {
            return { ...item, content: response[index] };
          });
        });
      })
      .catch((err) => console.log("error", err));
  }, []);

  return (
    <>
      <div className="p-2 bg-theme-300">
        <div className="container max-w-7xl px-[0px] sm:px-[20px] mx-auto flex flex-col gap-[10px]">
          <div>
            {/* <BackButton /> */}
            <BreadCrumbs product={product} />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="container max-w-7xl px-[0px] sm:px-[20px] mx-auto flex flex-col lg:flex-row gap-[0px] lg:gap-[40px] py-[20px]">
          <div className="w-full relative">
            <MediaGallery mediaItems={mediaItems} loading={loading} />
          </div>
          <div className="w-full">
            <ProductToCart product={product} loading={loading} />
            <div className="py-[30px] flex flex-col gap-[15px]">
              {/* product options */}
              {/* commented code because property metafield was changed */}
              {/* {productOptions && productOptions.length > 0 && (
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
              )} */}
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
        <div className="container max-w-7xl px-[0px] sm:px-[20px] mx-auto">
          <ProductMetaTabs product={product} />
        </div>
      </div>
      <div className="p-4">
        <div className="container max-w-7xl px-[0px] sm:px-[20px] mx-auto">
          <div className="text-2xl font-semibold text-stone-900 my-[20px]">
            FAQS
          </div>
          <div className="bg-zinc-100 p-5 flex flex-col gap-[10px] rounded">
            {policy_section.map((i) => (
              <div key={`section-${i.key}`} className="">
                <div className="text-lg font-semibold text-stone-900 border-b">
                  {i.label}
                </div>
                {i.content && (
                  <div className="relative">
                    <div
                      className={`text-sm flex flex-col gap-[10px] py-[10px] ${ i.key !== warranty ? i.expanded ? "" : "!line-clamp-2": "" }`}
                    >
                      {parse(i.content)}
                    </div>
                    <div className="bg-zinc-100 w-full h-3 absolute left-0 bottom-0"></div>
                  </div>
                )}
                {
                  i.key !== warranty && 
                  <button
                    className="text-sm font-semibold text-blue-400 flex items-center"
                    onClick={() => handleExpandFAQsSection(i.key)}
                  >
                    {i.expanded ? <MingcuteUpLine width={18} height={18}/> : <MingcuteDownLine width={18} height={18}/>}
                    {i.expanded ? "See Less" : "See More"}
                  </button>
                }
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="container max-w-7xl px-[0px] sm:px-[20px] mx-auto">
          <YouMayAlsoLike displayItems={4} />
        </div>
      </div>
    </>
  );
};

export default ProductSection;
