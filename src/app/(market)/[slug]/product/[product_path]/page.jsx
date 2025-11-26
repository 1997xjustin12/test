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
import Image from "next/image";
import MediaGallery from "@/app/components/widget/MediaGalleryV2";
import ProductToCart from "@/app/components/widget/ProductToCartV2";
import ProductMetaTabs from "@/app/components/product/meta/Tabs";
import { createSlug, formatPrice } from "@/app/lib/helpers";
import { useSolanaCategories } from "@/app/context/category";
import FaqSection from "@/app/components/molecule/SingleProductFaqSection";
import YouMayAlsoLike from "@/app/components/molecule/YouMayAlsoLike";
import CompareProductsTable from "@/app/components/molecule/CompareProductsTable";
import ProductReviewSection from "@/app/components/molecule/ProductReviewSection";

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

  const accentuate_data = product.accentuate_data;

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Gas type */}
      {accentuate_data?.["bbq.option_related_product"] && (
        <ProductOptionItem
          slug={slug}
          title={accentuate_data?.["bbq.option_title"]}
          options={accentuate_data?.["bbq.option_type"]}
          urls={accentuate_data?.["bbq.option_related_product"]}
          current_url={product.handle}
          product_options={product.sp_product_options}
        />
      )}
      {/* Configuration */}
      {accentuate_data?.["bbq.configuration_product"] && (
        <ProductOptionItem
          slug={slug}
          title={accentuate_data?.["bbq.configuration_heading_title"]}
          options={accentuate_data?.["bbq.configuration_type"]}
          urls={accentuate_data?.["bbq.configuration_product"]}
          current_url={product.handle}
          product_options={product.sp_product_options}
        />
      )}
      {/* Product Size */}
      {accentuate_data?.["bbq.related_product"] && (
        <ProductOptionItem
          slug={slug}
          title={accentuate_data?.["bbq.size_heading_title"]}
          options={accentuate_data?.["size_title"]}
          urls={accentuate_data?.["bbq.related_product"]}
          current_url={product.handle}
          product_options={product.sp_product_options}
        />
      )}
      {/* Product Option */}
      {accentuate_data?.["bbq.product_option_related_product"] && (
        <ProductOptionItem
          slug={slug}
          title={accentuate_data?.["bbq.product_option_heading_title"]}
          options={accentuate_data?.["bbq.product_option_name"]}
          urls={accentuate_data?.["bbq.product_option_related_product"]}
          current_url={product.handle}
          product_options={product.sp_product_options}
        />
      )}
      {/* Hinge */}
      {accentuate_data?.["bbq.hinge_related_product"] && (
        <ProductOptionItem
          slug={slug}
          title={accentuate_data?.["hinge_heading_title"]}
          options={accentuate_data?.["hinge_selection"]}
          urls={accentuate_data?.["bbq.hinge_related_product"]}
          current_url={product.handle}
          product_options={product.sp_product_options}
        />
      )}
    </div>
  );
};

const UpsellPriceDisplay = ({
  product_price,
  other_product_price,
  isSelected,
}) => {
  if (product_price > other_product_price) {
    return (
      <div
        className={`font-semibold ${
          isSelected ? "text-green-200" : "text-green-600"
        }`}
      >
        {`Save $${formatPrice(product_price - other_product_price)}`}
      </div>
    );
  }
  if (product_price < other_product_price) {
    return (
      <div
        className={`font-semibold ${
          isSelected ? "text-red-200" : "text-red-600"
        }`}
      >
        {`Add $${formatPrice(other_product_price - product_price)}`}
      </div>
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
  const [image, setImage] = useState(null);
  const extractOptions = (options) => {
    if (typeof options === "string") {
      return JSON.parse(options);
    } else if (
      Array.isArray(options) ||
      (typeof options === "object" && options !== null)
    ) {
      return options;
    } else {
      console.error("Options is an unexpected data type:", options);
      return null;
    }
  };

  useEffect(() => {
    if (title) {
      setLocalTitle(title);
    }
    if (options) {
      setLocalOptions(extractOptions(options));
    }
    if (urls) {
      setLocalUrls(extractOptions(urls));
    }
    if (current_url) {
      setLocalCurrentUrl(current_url);
      // setLocalCurrentUrl(extractOptions(current_url));
    }
    if (product_options) {
      setLocalProductOptions(product_options);
      // setLocalProductOptions(extractOptions(product_options));
    }
    if (slug) {
      setLocalSlug(slug);
      // setLocalSlug(extractOptions(slug));
    }
  }, [title, options, urls, current_url, slug]);

  return (
    <div>
      <div className="font-semibold text-base mb-[12px] text-neutral-800">
        {localTitle}
      </div>
      <div className="flex flex-wrap gap-[10px]">
        {localOptions &&
          Array.isArray(localOptions) &&
          localOptions.map((item, index) => (
            <Link
              prefetch={false}
              href={`/${localSlug}/product/${localUrls[index]}`}
              key={`${createSlug(title)}-option-${index}`}
              className={`group relative flex items-center gap-1 p-0 transition-all duration-300 border rounded-lg overflow-hidden ${
                localUrls[index] === localCurrentUrl
                  ? "bg-theme-500 text-white shadow-lg shadow-theme-500/30 border-theme-500 border-2"
                  : "bg-white border-2 border-neutral-200 hover:border-theme-400 hover:shadow-md"
              }`}
            >
              {/* Image Container */}
              <div
                className={`flex-shrink-0 w-[50px] bg-white h-[50px] overflow-hidden relative p-1`}
              >
                {localProductOptions &&
                  Array.isArray(localProductOptions) &&
                  localProductOptions.find(
                    ({ handle }) => handle === localUrls[index]
                  )?.images?.[0]?.src && (
                    <Image
                      src={
                        localProductOptions.find(
                          ({ handle }) => handle === localUrls[index]
                        )?.images?.[0]?.src
                      }
                      alt={item}
                      width={50}
                      height={50}
                      className="object-contain w-full h-full"
                    />
                  )}
              </div>

              {/* Content Container */}
              <div className="flex flex-col gap-1 min-w-0 flex-1 px-2">
                <div
                  className={`font-semibold text-sm ${
                    localUrls[index] === localCurrentUrl
                      ? "text-white"
                      : "text-neutral-800 group-hover:text-theme-600"
                  }`}
                >
                  {item}
                </div>
                {localProductOptions && Array.isArray(localProductOptions) && (
                  <div className="text-xs font-medium">
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
                      isSelected={localUrls[index] === localCurrentUrl}
                    />
                  </div>
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

          <div className="p-4">
            <div className="container max-w-7xl px-[0px] sm:px-[20px] mx-auto">
              <ProductReviewSection product={product} />
            </div>
          </div>
          {product && product?.sp_product_options && product?.handle && (
            <div className="p-4">
              <div className="container max-w-7xl px-[0px] sm:px-[20px] mx-auto">
                <CompareProductsTable
                  similar_products={product.sp_product_options}
                  product={product}
                />
              </div>
            </div>
          )}
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
