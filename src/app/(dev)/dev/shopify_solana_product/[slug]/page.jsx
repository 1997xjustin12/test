"use client";
import ProductSection from "@/app/components/pages/product/section/product";
import React, { useState, useEffect } from "react";
// import useFetchProducts from "@/app/hooks/useFetchProducts";
import useESFetchProductShopify from "@/app/hooks/useESFetchProductShopify";
import { notFound } from "next/navigation";
import ProductPlaceholder from "@/app/components/atom/SingleProductPlaceholder";
import MediaGallery from "@/app/components/widget/MediaGalleryV2";
import ProductToCart from "@/app/components/widget/ProductToCartV2";
export default function ShopifySolanaProduct({ params }) {
  const { slug } = React.use(params);

  const [product, setProduct] = useState(null);
  const {
    product: fetchedProduct,
    loading,
    error,
  } = useESFetchProductShopify({
    handle: slug,
  });

  useEffect(() => {
    if (error) {
      notFound();
    }

    if (!loading && fetchedProduct === null) {
      notFound();
    }

    if (fetchedProduct && fetchedProduct.length > 0) {
      setProduct(fetchedProduct[0]);
    }
  }, [loading, fetchedProduct, error]);

  if (!product && loading) {
    return <ProductPlaceholder />;
  }
  const JsonViewer = ({ product }) => {
    return (
      <pre
        style={{
          background: "#f5f5f5",
          padding: "1rem",
          borderRadius: "8px",
          overflowX: "auto",
        }}
      >
        {JSON.stringify(product, null, 2)}
      </pre>
    );
  };


  return (
    <div className="min-h-screen">
      {/* {product && <JsonViewer product={product} loading={loading} />} */}
      <div className="p-2 bg-theme-300">
        <div className="container max-w-7xl px-[0px] sm:px-[20px] mx-auto flex flex-col gap-[10px]">
          <div className="uppercase font-bold">
            {/* <BackButton /> */}
            {/* <BreadCrumbs product={product} /> */}
            Component BreadCrumbs Need Update
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="container max-w-7xl px-[0px] sm:px-[20px] mx-auto flex flex-col lg:flex-row gap-[0px] lg:gap-[40px] py-[20px]">
          <div className="w-full relative">
            <MediaGallery mediaItems={product?.images} />
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
                {/* <CategoryChips categories={product?.categories} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
