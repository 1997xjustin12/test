"use client";
import ProductSection from "@/app/components/pages/product/section/product";
import React, { useState, useEffect } from "react";
// import useFetchProducts from "@/app/hooks/useFetchProducts";
import useESFetchProduct from "@/app/hooks/useESFetchProduct";
import useESFetchProductShopify from "@/app/hooks/useESFetchProductShopify";
import { notFound } from "next/navigation";
import ProductPlaceholder from "@/app/components/atom/SingleProductPlaceholder";

const shopify_structure = true;
import Link from "next/link";
import MediaGallery from "@/app/components/widget/MediaGalleryV2";
import ProductToCart from "@/app/components/widget/ProductToCartV2";
import ProductMetaTabs from "@/app/components/product/meta/Tabs";
import { createSlug, formatPrice } from "@/app/lib/helpers";
import { useSolanaCategories } from "@/app/context/category";
import FaqSection from "@/app/components/molecule/SingleProductFaqSection";
import YouMayAlsoLike from "@/app/components/molecule/YouMayAlsoLike";

const BreadCrumbs = ({ slug, product_path }) => {
  const { getNameBySlug } = useSolanaCategories();
  if (!slug && !product_path) {
    return;
  }

  return (
    <div className="flex items-center gap-[10px]">
      <Link prefetch={false} href={`/`} className="hover:underline">
        Home
      </Link>
      /
      <Link
        prefetch={false}
        href={`/${slug}`}
        className="hover:underline whitespace-nowrap"
      >
        {getNameBySlug(slug)}
      </Link>
      <span>/</span>
      <div className="underline line-clamp-1">{product_path}</div>
    </div>
  );
};

const CategoryChips = ({ categories }) => {
  const { getProductCategories } = useSolanaCategories();
  const [localCategories, setCategories] = useState(
    getProductCategories(categories)
  );

  if (!categories || localCategories.length === 0) {
    return;
  }

  return (
    <div>
      <div className="font-bold text-sm lg:text-lg mb-[15px]">Category</div>
      <div className="flex gap-[5px] flex-wrap">
        {localCategories &&
          localCategories.length > 0 &&
          localCategories.map((v, i) => (
            <div
              key={`category-tag-${createSlug(v)}`}
              className="text-[9px] py-[4px] px-[8px] bg-theme-200 text-theme-700 font-semibold rounded-full"
            >
              {v}
            </div>
          ))}
      </div>
    </div>
  );
};

const ProductOptions = ({ product, slug }) => {
  if (!product && !product?.accentuate_data) {
    return;
  }

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Gas type */}
      {product.accentuate_data?.[0]?.["bbq.option_related_product"] && (
        <ProductOptionItem
          slug={slug}
          title={product.accentuate_data?.[0]?.["bbq.option_title"]}
          options={product.accentuate_data?.[0]?.["bbq.option_type"]}
          urls={product.accentuate_data?.[0]?.["bbq.option_related_product"]}
          current_url={product.handle}
          product_options={product.sp_product_options}
        />
      )}
      {/* Configuration */}
      {product.accentuate_data?.[0]?.["bbq.configuration_product"] && (
        <ProductOptionItem
          slug={slug}
          title={
            product.accentuate_data?.[0]?.["bbq.configuration_heading_title"]
          }
          options={product.accentuate_data?.[0]?.["bbq.configuration_type"]}
          urls={product.accentuate_data?.[0]?.["bbq.configuration_product"]}
          current_url={product.handle}
          product_options={product.sp_product_options}
        />
      )}
      {/* Product Size */}
      {product.accentuate_data?.[0]?.["bbq.related_product"] && (
        <ProductOptionItem
          slug={slug}
          title={product.accentuate_data?.[0]?.["bbq.size_heading_title"]}
          options={product.accentuate_data?.[0]?.["size_title"]}
          urls={product.accentuate_data?.[0]?.["bbq.related_product"]}
          current_url={product.handle}
          product_options={product.sp_product_options}
        />
      )}
      {/* Product Option */}
      {product.accentuate_data?.[0]?.["bbq.product_option_related_product"] && (
        <ProductOptionItem
          slug={slug}
          title={
            product.accentuate_data?.[0]?.["bbq.product_option_heading_title"]
          }
          options={product.accentuate_data?.[0]?.["bbq.product_option_name"]}
          urls={
            product.accentuate_data?.[0]?.["bbq.product_option_related_product"]
          }
          current_url={product.handle}
          product_options={product.sp_product_options}
        />
      )}
      {/* Hinge */}
      {product.accentuate_data?.[0]?.["bbq.hinge_related_product"] && (
        <ProductOptionItem
          slug={slug}
          title={product.accentuate_data?.[0]?.["hinge_heading_title"]}
          options={product.accentuate_data?.[0]?.["hinge_selection"]}
          urls={product.accentuate_data?.[0]?.["bbq.hinge_related_product"]}
          current_url={product.handle}
          product_options={product.sp_product_options}
        />
      )}
    </div>
  );
};

const UpsellPriceDisplay = ({ product_price, other_product_price }) => {
  if (product_price > other_product_price) {
    return (
      <div className="text-green-500 font-semibold">{`Save $${formatPrice(
        product_price - other_product_price
      )}`}</div>
    );
  }
  if (product_price < other_product_price) {
    return (
      <div className="text-red-500 font-semibold">{`Add $${formatPrice(
        other_product_price - product_price
      )}`}</div>
    );
  }
  if (product_price === other_product_price) {
    return ``;
  }
};

const ProductOptionItem = ({
  title,
  options,
  urls,
  current_url,
  product_options,
  slug,
}) => {
  const [localTitle, setLocalTitle] = useState(null);
  const [localOptions, setLocalOptions] = useState(null);
  const [localUrls, setLocalUrls] = useState(null);
  const [localCurrentUrl, setLocalCurrentUrl] = useState(null);
  const [localProductOptions, setLocalProductOptions] = useState(null);
  const [localSlug, setLocalSlug] = useState(null);
  useEffect(() => {
    if (title) {
      setLocalTitle(title);
    }
    if (options) {
      setLocalOptions(JSON.parse(options));
    }
    if (urls) {
      setLocalUrls(JSON.parse(urls));
    }
    if (current_url) {
      setLocalCurrentUrl(current_url);
    }
    if (product_options) {
      setLocalProductOptions(product_options);
    }
    if (slug) {
      setLocalSlug(slug);
    }
  }, [title, options, urls, current_url, slug]);

  return (
    <div>
      <div className="font-medium text-sm mb-[10px]">{localTitle}</div>
      <div className="flex flex-wrap gap-[5px]">
        {localOptions &&
          Array.isArray(localOptions) &&
          localOptions.map((item, index) => (
            <Link
              prefetch={false}
              href={`/${localSlug}/product/${localUrls[index]}`}
              key={`${createSlug(title)}-option-${index}`}
              className={`px-3 py-1 rounded border flex flex-col items-center justify-center transition-colors duration-200 ${
                localUrls[index] === localCurrentUrl
                  ? "font-semibold text-theme-800 border-theme-500 bg-theme-50"
                  : "bg-white border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50"
              }`}
            >
              <div className="w-full flex justify-center">{item}</div>
              <div className="w-full flex justify-end text-xs">
                {localProductOptions && Array.isArray(localProductOptions) && (
                  <>
                    {
                      <UpsellPriceDisplay
                        product_price={
                          localProductOptions.find(
                            ({ handle }) => handle === localCurrentUrl
                          )?.variants?.[0]?.price
                        }
                        other_product_price={
                          localProductOptions.find(
                            ({ handle }) => handle === localUrls[index]
                          )?.variants?.[0]?.price
                        }
                      />
                    }
                  </>
                )}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default function Product({ params }) {
  const { slug, product_path } = React.use(params);
  const { getProductCategories } = useSolanaCategories();
  const [product, setProduct] = useState(null);
  const {
    product: fetchedProduct,
    loading,
    error,
  } = useESFetchProductShopify({
    handle: product_path,
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

  return (
    <div className="min-h-screen">
      {shopify_structure ? (
        <div className="min-h-screen">
          {/* {product && <JsonViewer product={product} loading={loading} />} */}
          <div className="p-2 bg-theme-300">
            <div className="container max-w-7xl px-[0px] sm:px-[20px] mx-auto flex flex-col gap-[10px]">
              <div className="text-theme-800">
                <BreadCrumbs slug={slug} product_path={product_path} />
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
                  <ProductOptions product={product} slug={slug} />
                  {product?.product_category && (
                    <CategoryChips categories={product.product_category} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="container max-w-7xl px-[0px] sm:px-[20px] mx-auto">
              <ProductMetaTabs product={product} />
            </div>
          </div>
          <FaqSection />
          <div className="p-4">
            <div className="container max-w-7xl px-[0px] sm:px-[20px] mx-auto">
              <YouMayAlsoLike displayItems={4} />
            </div>
          </div>
        </div>
      ) : (
        <ProductSection product={product} loading={loading} />
      )}
    </div>
  );
}
