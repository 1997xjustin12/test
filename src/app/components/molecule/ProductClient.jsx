"use client";
import ProductSection from "@/app/components/pages/product/section/product";
import React, { useState, useEffect, useMemo } from "react";
import useESFetchProductShopify from "@/app/hooks/useESFetchProductShopify";
import { notFound } from "next/navigation";
import ProductPlaceholder from "@/app/components/atom/SingleProductPlaceholder";

const shopify_structure = true;
import Link from "next/link";
import Image from "next/image";
import MediaGallery from "@/app/components/widget/MediaGallery";
// import MediaGallery from "@/app/components/widget/MediaGalleryV2";
import ProductToCart from "@/app/components/widget/ProductToCartV2";
import ProductDescription from "@/app/components/product/ProductDescription";
import ProductSpecifications from "@/app/components/product/ProductSpecifications";
import ProductGuidesInstallations from "@/app/components/product/ProductGuidesInstallations";
import ProductShippingInformation from "@/app/components/product/ProductShippingInformation";
import {
  BASE_URL,
  calculateRatingSummary,
  createSlug,
  formatPrice,
} from "@/app/lib/helpers";
import { useSolanaCategories } from "@/app/context/category";
import { useCart } from "@/app/context/cart";
import FaqSection from "@/app/components/molecule/SingleProductFaqSection";
import YouMayAlsoLike from "@/app/components/molecule/YouMayAlsoLike";
import CompareProductsTable from "@/app/components/molecule/CompareProductsTable";
import ProductReviewSection from "@/app/components/molecule/ProductReviewSection";
import ProductCard from "@/app/components/atom/ProductCard";
import ProductCardV2 from "@/app/components/atom/ProductCardV2";
import ProductCardLoader from "@/app/components/atom/ProductCardLoader";
import { Eos3DotsLoading } from "@/app/components/icons/lib";
import { STORE_CONTACT } from "@/app/lib/store_constants";
import AddToCartWidget from "@/app/components/widget/AddToCartWidget";
import { Icon } from "@iconify/react";
import {
  getProductsByCollectionId,
  getReviewsByProductId,
} from "@/app/lib/api";

const discount_links = [
    {
      hidden: false,
      url: `tel:${STORE_CONTACT}`,
      label: "Phone Discounts",
      icon: "mdi:phone",
    },
    {
      hidden: false,
      url: `${BASE_URL}/package-deals`,
      label: "Package Deals",
      icon: "mdi:package-variant-closed",
    },
    {
      hidden: false,
      url: `${BASE_URL}/open-box`,
      label: "Open Box",
      icon: "mdi:package-variant",
    },
    {
      hidden: false,
      url: `${BASE_URL}/close-out-deals`,
      label: "Close Out",
      icon: "mdi:sale",
    },
    {
      hidden: false,
      url: ``,
      label: "Scratch + Dent",
      icon: "mdi:hammer-wrench",
    },
    {
      hidden: false,
      url: ``,
      label: "Low Monthly Payments",
      icon: "mdi:calendar-month",
    },
    {
      hidden: false,
      url: ``,
      label: "Free Accessory Bundle",
      icon: "mdi:gift",
    },
  ];


const Badge = ({ children, variant = "orange" }) => {
  const variants = {
    orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    green:  "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    blue:   "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    gray:   "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  };
  return <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase ${variants[variant]}`}>{children}</span>;
};

const BreadCrumbs = ({ slug, product_title }) => {
  const { getNameBySlug } = useSolanaCategories();
  if (!slug && !product_title) {
    return;
  }

  return (
    <div className="max-w-[1240px] mx-auto px-6 flex items-center gap-[10px] text-sm">
      <Link
        prefetch={false}
        href={`/`}
        className="hover:underline hover:text-theme-600 transition-all"
      >
        Home
      </Link>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m11 9l3 3l-3 3"
        />
      </svg>
      <Link
        prefetch={false}
        href={`/${slug}`}
        className="hover:underline hover:text-theme-600 transition-all whitespace-nowrap"
      >
        {getNameBySlug(slug)}
      </Link>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m11 9l3 3l-3 3"
        />
      </svg>
      <div title={product_title} className="underline line-clamp-1">
        {product_title}
      </div>
    </div>
  );
};

const CategoryChips = ({ categories }) => {
  const { getProductCategories } = useSolanaCategories();
  const [localCategories, setCategories] = useState(
    getProductCategories(categories),
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
  const [isGalleryFullscreen, setIsGalleryFullscreen] = useState(false);

  // Monitor fullscreen state from MediaGallery
  useEffect(() => {
    const checkFullscreen = () => {
      setIsGalleryFullscreen(
        document.body.classList.contains("gallery-fullscreen-active"),
      );
    };

    // Check initially
    checkFullscreen();

    // Set up a MutationObserver to watch for class changes on body
    const observer = new MutationObserver(checkFullscreen);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  if (!product && !product?.accentuate_data) {
    return;
  }

  const accentuate_data = product.accentuate_data;

  // Dynamic z-index: negative when gallery is fullscreen, positive otherwise
  const zIndexClass = isGalleryFullscreen ? "-z-20" : "z-0";

  return (
    <div className={`flex flex-col gap-[10px] relative ${zIndexClass}`}>
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

  const formatOptionLabel = (label) => {
    const labels = {
      NG: "Natural Gas",
      LP: "Liquid Propane",
    };

    return labels?.[label] || label;
  };

  useEffect(() => {
    // console.log("options", options);

    if (title) {
      setLocalTitle(title);
    }
    if (options) {
      setLocalOptions(extractOptions(options));
    } else {
      const sku_options = [];
      urls.forEach((v, i) => {
        const option =
          product_options.find((item) => item.handle === v)?.variants?.[0]
            ?.sku || "NA";
        sku_options.push(option);
      });
      setLocalOptions(extractOptions(sku_options));
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
      <div className="font-semibold text-base text-neutral-800">
        {localTitle}
      </div>
      <div className="mt-1 grid grid-cols-1 sm:grid-cols-3 gap-[10px]">
        {localOptions &&
          Array.isArray(localOptions) &&
          localOptions.map((item, index) => (
            <Link
              prefetch={false}
              href={`/${localSlug}/product/${localUrls[index]}`}
              title={item}
              key={`${createSlug(title)}-option-${index}`}
              className={`product-option-item-link group relative flex items-center gap-1 p-0 transition-all duration-300 border rounded-lg overflow-hidden ${
                localUrls[index] === localCurrentUrl
                  ? "bg-theme-600 text-white shadow-xs shadow-theme-500/30 border-theme-600 border-2"
                  : "bg-white border-2 border-neutral-300 hover:border-theme-600 hover:shadow-md"
              }`}
            >
              {/* Active Check Icon */}
              {localUrls[index] === localCurrentUrl && (
                <div className="absolute top-1 right-1 z-10 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <Icon icon="mdi:check" className="text-theme-600 text-sm" />
                </div>
              )}

              {/* Image Container */}
              <div
                className={`flex-shrink-0 w-[60px] bg-white h-[60px] overflow-hidden relative p-1`}
              >
                {localProductOptions &&
                  Array.isArray(localProductOptions) &&
                  localProductOptions.find(
                    ({ handle }) => handle === localUrls[index],
                  )?.images?.[0]?.src && (
                    <Image
                      src={
                        localProductOptions.find(
                          ({ handle }) => handle === localUrls[index],
                        )?.images?.[0]?.src
                      }
                      alt={item}
                      width={60}
                      height={60}
                      className="object-contain w-full h-full"
                    />
                  )}
              </div>

              {/* Content Container */}
              <div className="flex flex-col gap-1 min-w-0 flex-1 px-2">
                <div
                  className={`font-semibold text-xs line-clamp-2 ${
                    localUrls[index] === localCurrentUrl
                      ? "text-white"
                      : "text-neutral-800 group-hover:text-theme-600"
                  }`}
                >
                  {formatOptionLabel(item)}
                </div>
                {localProductOptions && Array.isArray(localProductOptions) && (
                  <div className="text-xs">
                    <UpsellPriceDisplay
                      product_price={
                        localProductOptions.find(
                          ({ handle }) => handle === localCurrentUrl,
                        )?.variants?.[0]?.price
                      }
                      other_product_price={
                        localProductOptions.find(
                          ({ handle }) => handle === localUrls[index],
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

const FBTSection = ({ products }) => {
  if (!products || !Array.isArray(products) || products.length === 0) return;
  const displayItems = 4;
  return (
    <div className="p-4">
      <div className="container max-w-7xl px-[0px] sm:px-[20px] mx-auto">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Frequently Bought Together
        </h3>
        <div className="mt-6 gap-4 sm:mt-8 flex flex-wrap">
          {products && Array.isArray(products) && products.length > 0
            ? products.map((item, idx) => (
                <div
                  key={`product-card-wrapper-${idx}`}
                  className={`space-y-6 overflow-hidden ${
                    displayItems === 4 &&
                    "w-[calc(50%-10px)] md:w-[calc(33%-10px)] lg:w-[calc(25%-12px)]"
                  } ${
                    (displayItems === undefined || displayItems === 3) &&
                    "w-[calc(50%-10px)] lg:w-[calc(33%-10px)]"
                  }`}
                >
                  <ProductCard key={`product-card-${item}`} hit={item} />
                </div>
              ))
            : makeArray(displayItems ?? 3).map((item, idx) => (
                <div
                  key={`product-card-${idx}`}
                  className={`space-y-6 overflow-hidden ${
                    displayItems === 4 &&
                    "w-[calc(50%-10px)] md:w-[calc(33%-10px)] lg:w-[calc(25%-12px)]"
                  } ${
                    (displayItems === undefined || displayItems === 3) &&
                    "w-[calc(50%-10px)] lg:w-[calc(33%-10px)]"
                  }`}
                >
                  <ProductCardLoader />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

const makeArray = (n) => {
  return Array.from({ length: n }, (_, i) => i);
};

const RecentViewedProducts = ({ recents }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const displayItems = 4;
  useEffect(() => {
    if (!recents || !Array.isArray(recents) || recents.length < 1) return;
    const getProducts = async () => {
      const raw = await fetch(
        `/api/es/products-by-ids?${recents
          .map((item) => `product_ids=${item}`)
          .join("&")}`,
      );

      const response = await raw.json();

      if (response?.data) {
        setProducts(response.data);
      }
      setLoading(false);
    };

    getProducts();
  }, [recents]);

  if (!recents || !Array.isArray(recents) || recents.length < 1) {
    return; // dont display the component
  }

  if (products.length === 0 && !loading) {
    return <div>NO DATA</div>;
  }

  return (
    <div className="p-4">
      <div className="container max-w-7xl px-[0px] sm:px-[20px] mx-auto">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Recently Viewed
        </h3>
        <div className="mt-6 gap-4 sm:mt-8 flex flex-wrap">
          {!loading &&
          products &&
          Array.isArray(products) &&
          products.length > 0
            ? products.slice(0, 4).map((item, idx) => (
                <div
                  key={`product-card-wrapper-${idx}`}
                  className={`space-y-6 overflow-hidden ${
                    displayItems === 4 &&
                    "w-[calc(50%-10px)] md:w-[calc(33%-10px)] lg:w-[calc(25%-12px)]"
                  } ${
                    (displayItems === undefined || displayItems === 3) &&
                    "w-[calc(50%-10px)] lg:w-[calc(33%-10px)]"
                  }`}
                >
                  <ProductCard key={`product-card-${item}`} hit={item} />
                </div>
              ))
            : makeArray(displayItems ?? 3).map((item, idx) => (
                <div
                  key={`product-card-${idx}`}
                  className={`space-y-6 overflow-hidden ${
                    displayItems === 4 &&
                    "w-[calc(50%-10px)] md:w-[calc(33%-10px)] lg:w-[calc(25%-12px)]"
                  } ${
                    (displayItems === undefined || displayItems === 3) &&
                    "w-[calc(50%-10px)] lg:w-[calc(33%-10px)]"
                  }`}
                >
                  <ProductCardLoader />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

const DiscountLinksSection = () => {
  const [isGalleryFullscreen, setIsGalleryFullscreen] = useState(false);

  // Monitor fullscreen state from MediaGallery
  useEffect(() => {
    const checkFullscreen = () => {
      setIsGalleryFullscreen(
        document.body.classList.contains("gallery-fullscreen-active"),
      );
    };

    // Check initially
    checkFullscreen();

    // Set up a MutationObserver to watch for class changes on body
    const observer = new MutationObserver(checkFullscreen);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const links = [
    {
      hidden: false,
      url: `tel:${STORE_CONTACT}`,
      label: "Phone Discounts",
      icon: "mdi:phone",
    },
    {
      hidden: false,
      url: `${BASE_URL}/package-deals`,
      label: "Package Deals",
      icon: "mdi:package-variant-closed",
    },
    {
      hidden: false,
      url: `${BASE_URL}/open-box`,
      label: "Open Box",
      icon: "mdi:package-variant",
    },
    {
      hidden: false,
      url: `${BASE_URL}/close-out-deals`,
      label: "Close Out",
      icon: "mdi:sale",
    },
    {
      hidden: false,
      url: ``,
      label: "Scratch + Dent",
      icon: "mdi:hammer-wrench",
    },
    {
      hidden: false,
      url: ``,
      label: "Low Monthly Payments",
      icon: "mdi:calendar-month",
    },
    {
      hidden: false,
      url: ``,
      label: "Free Accessory Bundle",
      icon: "mdi:gift",
    },
  ];

  // Dynamic z-index: negative when gallery is fullscreen, positive otherwise
  const zIndexClass = isGalleryFullscreen ? "-z-20" : "z-0";

  return (
    <div className={`relative overflow-hidden ${zIndexClass}`}>
      {/* Corner Badge */}
      <div className="absolute top-0 right-0 z-10 pointer-events-none">
        <div className="bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 shadow-sm">
          SPECIAL OFFERS
        </div>
      </div>

      {/* Header with Icons */}
      <div className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white px-2 py-1.5 flex items-center justify-center gap-2 uppercase rounded relative z-0 text-sm">
        <Icon icon="mdi:tag-multiple" className="text-green-200 text-lg" />
        <span>Discounts & Savings</span>
        <Icon icon="mdi:tag-multiple" className="text-green-200 text-lg" />
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-2 gap-1.5 mt-2 relative z-0">
        {links
          .filter((item) => !item.hidden)
          .map((link, index) => (
            <Link
              key={`discount-section-link-item-${index}`}
              href={`${link.url || "#"}`}
              className="flex gap-1.5 items-center p-1.5 rounded-md bg-white border border-green-200 hover:border-green-400 hover:bg-green-50 hover:shadow-md transition-all group"
            >
              <Icon
                icon={link.icon}
                className="text-green-600 group-hover:text-green-700 text-base flex-shrink-0"
              />
              <div className="text-xs text-stone-700 group-hover:text-green-800 transition-all font-semibold line-clamp-2">
                {link.label}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

const FrequentlyBoughtTogetherSection = ({ products, product }) => {
  const { addItemsToCart, addToCartLoading } = useCart();
  const { getProductUrl } = useSolanaCategories();
  const [fbwProducts, setFbwProducts] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const isActiveProduct = (item, active_item) => {
    if (!item || !active_item) return false;
    return item?.handle === product?.handle;
  };

  const handleAddSelectionToCart = async () => {
    console.log("selectedItems", selectedItems);
    try {
      if (selectedCount === 0) return;
      const result = await addItemsToCart(selectedItems);
      if (result.status === "success") {
        console.log(result.message);
      }
    } catch (error) {
      console.log("[handleAddSelectionToCart]", error);
    }
  };

  const handleCheckboxChange = (data) => {
    const { id, checked } = data;
    setFbwProducts((prev) => {
      if (!id || !prev) return prev;
      const newProducts = prev.map((item) => ({
        ...item,
        isSelected: item?.product_id === id ? checked : item?.isSelected,
      }));
      return newProducts;
    });
    setUpdateTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (!products) return;
    const tmp_products = [product, ...products].map((item) => ({
      ...item,
      isSelected: true,
      thisProduct: item?.product_id == product?.product_id,
    }));
    setFbwProducts(tmp_products);
  }, [products, product]);

  const total_price = useMemo(() => {
    if (!fbwProducts) return `$${formatPrice("0.00")}`;

    const total = fbwProducts
      .filter((item) => item?.isSelected)
      .map((item) => parseFloat(item.variants?.[0]?.price) || 0)
      .reduce((sum, price) => sum + price, 0);

    return `$${formatPrice(total.toFixed(2))}`;
  }, [fbwProducts, updateTrigger]);

  const hasSelectedItems = useMemo(() => {
    return fbwProducts?.some((item) => item?.isSelected) || false;
  }, [fbwProducts, updateTrigger]);

  const selectedCount = useMemo(() => {
    return fbwProducts?.filter((item) => item?.isSelected).length || 0;
  }, [fbwProducts, updateTrigger]);

  const selectedItems = useMemo(() => {
    return (
      fbwProducts
        ?.filter((item) => item?.isSelected)
        .map((item) => ({ ...item, quantity: 1 })) || []
    );
  }, [fbwProducts, updateTrigger]);

  if (!fbwProducts || fbwProducts.length < 2) return null;

  return (
    <div className="my-5">
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Frequently Bought Together
      </h3>
      <div className="flex flex-wrap md:flex-nowrap items-center mt-5 gap-1">
        {selectedItems?.map((item, index) => {
          const productImage = item?.images?.find(
            (img) => img.position === 1,
          )?.src;

          return (
            <React.Fragment key={`fbt-product-${index}`}>
              {index > 0 && (
                <Icon
                  icon="mdi:plus"
                  className="text-neutral-600 text-2xl font-bold"
                />
              )}
              <Link
                prefetch={false}
                href={
                  isActiveProduct(item, product) ? "#" : getProductUrl(item)
                }
                className="w-[120px] h-[120px] bg-white rounded-sm border border-neutral-300 relative overflow-hidden group"
              >
                {productImage && (
                  <Image
                    src={productImage}
                    alt={item?.title || "Product"}
                    fill
                    className="object-contain p-2"
                  />
                )}
                <div className="w-full aspect-1 bg-slate-950/70 absolute left-0 top-0 hidden group-hover:flex items-center justify-center transition-all text-white font-bold">
                  {isActiveProduct(item, product) ? "Active" : "View Item"}
                </div>
              </Link>
            </React.Fragment>
          );
        })}
        <div className="flex flex-col justify-between h-[120px] ml-5">
          <div>
            <div>Total</div>
            <div className="text-lg font-semibold">{total_price}</div>
          </div>
          <button
            disabled={!hasSelectedItems}
            onClick={handleAddSelectionToCart}
            className={`rounded-sm bg-theme-600 hover:bg-theme-700 text-white font-bold h-[48px] w-[250px] relative ${
              hasSelectedItems
                ? "bg-neutral-800 hover:bg-neutral-900 text-white cursor-pointer"
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            }`}
          >
            <div className={addToCartLoading === true ? "hidden" : "block"}>
              Add {selectedCount > 0 ? `${selectedCount} ` : ""}selected item
              {selectedCount !== 1 ? "s" : ""} to cart
            </div>
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                addToCartLoading === true ? "visible" : "invisible"
              }`}
            >
              <Eos3DotsLoading width={50} height={50} />
            </div>
          </button>
        </div>
      </div>
      <div className="space-y-1.5 mt-5">
        {fbwProducts.map((product, index) => (
          <FrequentlyBoughtItemV2
            key={`fbw-item-v2-${index}`}
            product={product}
            onChange={handleCheckboxChange}
          />
        ))}
      </div>
    </div>
  );
};

const FrequentlyBoughtItemV2 = ({ product, onChange }) => {
  const [checked, setChecked] = useState(true);
  const handleCheckboxChange = (event) => {
    const newChecked = event.target.checked;
    setChecked(newChecked);
    onChange({ id: product?.product_id, checked: newChecked });
  };

  useEffect(() => {
    setChecked(product?.isSelected);
  }, [product]);

  return (
    <label
      htmlFor={product?.product_id}
      className={`flex items-center gap-5 py-1.5 px-2 cursor-pointer transition-all bg-neutral-200 rounded-sm `}
    >
      {/* Checkbox */}
      <div
        className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center ${
          checked
            ? "bg-theme-600 border-theme-600"
            : "border-neutral-400 bg-white"
        }`}
      >
        {checked && (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-grow min-w-0">
        <div className="text-base text-neutral-700 line-clamp-1 leading-tight">
          {product?.thisProduct ? (
            <>
              <span className="font-semibold">This Item: </span>{" "}
              {product?.title}
            </>
          ) : (
            product?.title
          )}
        </div>
        <div className="text-base font-bold text-theme-600 mt-0.5">
          ${formatPrice(product?.variants?.[0].price)}
        </div>
      </div>

      {/* Hidden Input */}
      <input
        type="checkbox"
        id={product?.product_id}
        checked={checked}
        onChange={handleCheckboxChange}
        className="sr-only"
      />
    </label>
  );
};

const ShopCollectionSection = ({ product }) => {
  const [collectionProducts, setCollectionProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const loader = [1, 2, 3, 4];

  useEffect(() => {
    const brand = product?.brand;
    const collections = product?.collections;
    if (brand && collections) {
      const collection_id =
        collections.find(({ name }) => name === brand)?.id || null;
      if (collection_id) {
        getProductsByCollectionId(collection_id)
          .then((res) => res.json())
          .then((res) => {
            setCollectionProducts(res);
          })
          .catch((err) => {
            console.log("Error", err);
            setCollectionProducts([]);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  }, [product]);

  return (
    <div className="my-5">
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Shop This Collection
      </h3>
      <div className="w-full flex gap-1 overflow-x-auto py-1">
        {isLoading &&
          loader &&
          loader.map((item, index) => (
            <div
              key={`loader-collection-product-${index}`}
              className="flex items-center justify-center py-1 px-5 flex-col gap-1  min-w-[220px] max-w-[220px] bg-neutral-100 border border-neutral-200 h-[360px] rounded-sm text-neutral-400"
            >
              Loading...
            </div>
          ))}
        {!isLoading &&
          collectionProducts &&
          Array.isArray(collectionProducts) &&
          collectionProducts.length > 0 &&
          collectionProducts.map((product, index) => (
            <ProductCardV2
              key={`collection-product-${index}`}
              product={product}
            />
          ))}
      </div>
    </div>
  );
};

const StarRating = ({ rating, size = "sm", showCount, count }) => {
  const s = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg
            key={i}
            className={`${s} ${i <= Math.round(rating) ? "text-amber-400" : "text-gray-200 dark:text-gray-600"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </span>
      {showCount && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ({count})
        </span>
      )}
    </span>
  );
};

const ProductInfo = ({ product }) => {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const memProduct = useMemo(() => {
    const price = product?.variants?.[0]?.price;
    const was = product?.variants?.[0]?.compare_at_price;
    const save_amount = was - price;

    return {
      ...product,
      ratings: parseInt(product?.ratings?.rating_count?.replace("'", "")),
      sku: product?.variants?.[0]?.sku,
      price: price,
      was: was,
      save_amount: save_amount,
      save_percentage: was > price ? Math.round((save_amount / was) * 100) : 0,
    };
  }, [product]);

  return (
    <div className="flex flex-col gap-5">
      {/* Brand + SKU */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <Link
          href="#"
          prefetch={false}
          className="text-[10px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 px-2.5 py-1 rounded-full uppercase tracking-widest hover:bg-orange-100 transition-colors"
        >
          {product?.brand}
        </Link>
        <span className="text-[10px] text-gray-400 dark:text-gray-500">
          SKU: {memProduct?.sku}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
        {product?.title}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-3 flex-wrap pb-4 border-b border-gray-100 dark:border-gray-800">
        <StarRating rating={memProduct?.ratings} showCount count={0} />
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {memProduct?.ratings} out of 5
        </span>
        {/* <span className="text-gray-200 dark:text-gray-700">·</span>
        <a
          href="#reviews"
          className="text-xs font-semibold text-orange-500 hover:underline"
        >
          Write a Review
        </a> */}
      </div>

      {/* Price */}
      <div className="flex items-end gap-3 flex-wrap">
        <span className="text-4xl font-black text-gray-900 dark:text-white">
          ${formatPrice(memProduct?.price)}
        </span>
        {
          !!(memProduct?.was) && (
        <div className="flex flex-col pb-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 line-through">
              ${formatPrice(memProduct?.was)}
            </span>
            <Badge variant="green">SAVE {memProduct?.save_percentage}%</Badge>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            You save ${formatPrice(memProduct?.save_amount)}
          </span>
        </div>)
        }
      </div>

      {/* Ships */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <svg
          className="w-4 h-4 text-green-500 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">{`Ships Within 1–2 Business Days`}</span>
        {/* <span className="font-medium">{product.ships}</span> */}
      </div>

      {/* Discounts */}
      <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-md bg-orange-500 flex items-center justify-center text-xs flex-shrink-0">
            🔥
          </span>
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
            Discounts & Savings Available
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {discount_links.filter(({hidden}) => !hidden).map((dlink,index) => (
            <Link
              key={`discount-item-${index}`}
              href={dlink?.url || "#"}
              className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:underline"
            >
              <span className="w-4 h-4 rounded-full bg-orange-100 dark:bg-orange-900/40 border border-orange-200 dark:border-orange-800 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-2 h-2 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              {dlink?.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Qty + CTA */}
      <div className="flex items-stretch gap-3 flex-wrap">
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-11 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xl font-light transition-colors"
          >
            −
          </button>
          <span className="w-9 text-center text-sm font-bold text-gray-900 dark:text-white">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-10 h-11 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 text-xl font-light transition-colors"
          >
            +
          </button>
        </div>
        <button
          onClick={handleCart}
          className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-sm font-bold text-white transition-all duration-200 ${added ? "bg-green-500" : "bg-orange-500 hover:bg-orange-600 active:scale-[.98]"}`}
        >
          {added ? (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>{" "}
              Added to Cart
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>{" "}
              Add to Cart
            </>
          )}
        </button>
        <a
          href={`tel:${STORE_CONTACT}`}
          className="flex items-center gap-2 h-11 px-4 rounded-xl border-2 border-orange-500 text-orange-600 dark:text-orange-400 text-sm font-bold hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors whitespace-nowrap"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call Expert
        </a>
      </div>
    </div>
  );
};

export default function ProductClient({ params }) {
  const { slug, product_path } = React.use(params);
  const [product, setProduct] = useState(null);
  const [forage, setForage] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [reviews, setReviews] = useState(null);
  const {
    product: fetchedProduct,
    loading,
    error,
  } = useESFetchProductShopify({
    handle: product_path,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let mounted = true;

    import("@/app/lib/localForage").then(async (module) => {
      if (!mounted) return;
      const recent_products = (await module.getItem("recentProducts")) || [];
      setRecentlyViewed(recent_products);
      setForage(module);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (error) {
      notFound();
    }

    if (!loading && fetchedProduct === null) {
      notFound();
    }

    if (fetchedProduct && fetchedProduct.length > 0) {
      setProduct(fetchedProduct[0]);
      console.log("[product]", fetchedProduct[0]);

      if (fetchedProduct[0]?.published) {
        const new_recents = [
          ...new Set([fetchedProduct[0]?.product_id, ...recentlyViewed]),
        ];
        forage.setItem("recentProducts", new_recents.slice(0, 5));
      }
    }
  }, [loading, fetchedProduct, error]);

  useEffect(() => {
    if (!product || !product?.product_id) return;
    const product_id = product.product_id;
    // load reviews
    const fetchReviews = async () => {
      try {
        const response = await getReviewsByProductId(product_id);
        if (!response?.ok) {
          setReviews(null);
          return;
        }
        const data = await response.json();
        const reviewStats = calculateRatingSummary(data);
        const reviews = { ...data, ...reviewStats };
        console.log(reviews);
        setReviews(reviews);
      } catch (err) {
        console.warn("[fetchReviews]", err);
      }
    };
    fetchReviews();
  }, [product]);

  if (!product && loading) {
    return <ProductPlaceholder />;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen font-sans">
      <BreadCrumbs slug={slug} product_title={product?.title} />
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-20">
        {/* ── HERO: GALLERY + INFO ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-6 lg:gap-10 mb-12 lg:items-start">
          <div className="lg:sticky lg:top-4">
            <MediaGallery gallery={product?.images || []} />
          </div>
          <ProductInfo product={product} />
        </div>

        {/* ── BELOW-FOLD SECTIONS ── */}
        {/* <CollectionStrip/>
        <DescriptionSection/>
        <SpecsShipping specs={PRODUCT.specs} shipping={PRODUCT.shipping}/>
        <ReviewsSection rating={PRODUCT.rating} reviewCount={PRODUCT.reviewCount}/>
        <FAQSection faqs={PRODUCT.faqs}/>
        <SupportCTA/>
        <ProductGrid title="You May Also Like" items={RELATED}
          action={<a href="#" className="text-xs font-semibold text-orange-500 hover:underline flex items-center gap-1">View all <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></a>}/>
        <ProductGrid title="Recently Viewed" items={RECENT}
          action={<a href="#" className="text-xs font-semibold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors">Clear <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg></a>}/> */}
      </div>

      {/* <StickyCTA price={PRODUCT.price} was={PRODUCT.was}/>
      <MobileStickyCTA price={PRODUCT.price} was={PRODUCT.was}/> */}
    </div>
  );
}
