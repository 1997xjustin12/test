"use client";
import Link from "next/link";
import ProductMetaTabs from "@/app/components/product/meta/Tabs";
import MediaGallery from "@/app/components/widget/MediaGallery";
import ProductToCart from "@/app/components/widget/ProductToCart";
import BackButton from "@/app/components/atom/BackButton";
import useFetchProductMetaFields from "@/app/hooks/useFetchProductMetaFields";
import ProductOption from "@/app/components/atom/productOption";
import { useState, useEffect } from "react";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
const ProductSection = ({ product, loading }) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const { productMetaFields, loading: metaFieldsLoading } =
    useFetchProductMetaFields({ id: product.id });

  console.log("product_id", product.id);
  useEffect(() => {
    if (product) {
      if (Object.keys(product).length > 0) {
        setMediaItems(product.images);
      }
    }
  }, [product]);

  useEffect(() => {
    if (productMetaFields && productMetaFields.length > 0) {
      setProductOptions(
        productMetaFields[0].value.map((i) => ({
          ...i,
          values: i.values
            .map((i2, idx2) => ({
              ...i2,
              is_checked: i2.sku.value === product?.sku,
            }))
            .sort((a, b) => a.option_label.localeCompare(b.option_label)),
        }))
      );
      console.log(
        "options",
        productMetaFields[0].value.map((i) => ({
          ...i,
          values: i.values.map((i2, idx2) => ({
            ...i2,
            is_checked: i2.sku.value === product?.sku,
          })),
        }))
      );
    }
  }, [productMetaFields]);

  return (
    <>
      <div className="p-4">
        <div className="container mx-auto flex flex-col">
          <div>
            <BackButton />
          </div>
        </div>
        <div className="container mx-auto flex flex-col sm:flex-row gap-[10px] py-[60px]">
          <div className="flex-1">
            <MediaGallery mediaItems={mediaItems} loading={loading} />
          </div>
          <div className="flex-1">
            <ProductToCart product={product} loading={loading} />
            {/* product options */}
            <div className="py-[30px] flex flex-col gap-[15px]">
              {productOptions.length > 0 &&
                productOptions.map((item, idx) => (
                  <div
                    key={`product-option-${idx}`}
                    className="flex flex-col gap-[10px]">
                    <div className="font-medium text-xs lg:text-sm">
                      {item.option}
                    </div>
                    <div className="flex items-center gap-[10px]">
                      {item?.values &&
                        item.values.map((item2, idx2) => (
                          <Link
                            key={`product-option-${idx}-value-${idx2}`}
                            href={`${BASE_URL}/product/${item2.sku.link}`}>
                            <ProductOption option={item2} />
                          </Link>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="container mx-auto">
          <ProductMetaTabs product={product} />
        </div>
      </div>
      {/* <div className="p-4">
      <div className="container mx-auto">
        <RelatedProducts product={product}/>
      </div>
    </div> */}
    </>
  );
};

export default ProductSection;
