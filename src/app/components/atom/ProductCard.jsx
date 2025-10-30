"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Rating } from "@smastrom/react-rating";
import Image from "next/image";
import { memo } from "react";
import { formatPrice, parseRatingCount } from "@/app/lib/helpers";
import { ICRoundPhone } from "../icons/lib";
import { useQuickView } from "@/app/context/quickview";
import { useSolanaCategories } from "@/app/context/category";

import FicDropDown from "@/app/components/atom/FicDropDown";


import { useRouter } from 'next/navigation';


const ProductCardPriceDisplay = memo(({ price_details }) => {
  if (!price_details) {
    return null;
  }
  if (
    price_details?.price > 0 &&
    price_details?.compare_at_price > price_details?.price
  ) {
    return (
      <div className="text-sm flex flex-wrap gap-[5px]">
        <div className="flex gap-[5px]">
          <div className="font-semibold">
            ${formatPrice(price_details.price)}
          </div>
          <div className="line-through text-stone-400">
            ${formatPrice(price_details.compare_at_price)}
          </div>
        </div>
        <div className="text-green-600  font-semibold">
          Save $
          {formatPrice(price_details.compare_at_price - price_details.price)}
        </div>
      </div>
    );
  } else {
    return (
      <div className="text-sm font-semibold">
        ${formatPrice(price_details.price)}
      </div>
    );
  }
});
ProductCardPriceDisplay.displayName = 'ProductCardPriceDisplay';

const ProductCard = ({ hit, page_details   }) => {
  // console.log("[TEST] ProductCard hit", hit);
  const router = useRouter();
  const { viewItem } = useQuickView();
  const { isPriceVisible, getProductUrl} = useSolanaCategories();

  const handleQuickViewClick = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    viewItem(item);
  };

  
  const handleProductItemClick = (e) => {
    const card = e.target.closest('.product-card-wrap');
    if (!card) return;

    const href = card.getAttribute('data-href');
    if (href) {
      router.push(href);
    }
  }

  return (
    <div
      data-href={`${getProductUrl(hit)}`}
      onClick={handleProductItemClick}
      className="product-card-wrap flex w-full h-full bg-white overflow-hidden rounded-md border duration-500  hover:shadow-xl pb-[8px] hover:border-stone-700 group"
    >
      <div className="w-full">
        <div
          className={`w-full flex items-center justify-center h-[230px] overflow-hidden relative bg-white`}
        >
          {hit?.images &&
            Array.isArray(hit?.images) &&
            hit?.images?.length > 0 &&
            hit.images[0]?.src && (
              <Image
                src={hit.images[0].src}
                alt={hit.images[0].alt || hit.title || "Product image"}
                width={230}
                height={230}
                className={`object-contain h-full opacity-100`}
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 230px"
                quality={75}
              />
            )}

          {hit?.variants &&
            Array.isArray(hit.variants) &&
            hit.variants.length > 0 &&
            hit.variants?.[0]?.price < hit.variants?.[0]?.compare_at_price && (
              <div className="absolute bottom-[60px] left-0 rounded-r-full bg-theme-500 text-white text-[12px] font-bold py-[7px] px-[15px]">
                ONSALE
              </div>
            )}

          {/* Mobile-friendly quick view button */}
          <button
            onClick={(e) => handleQuickViewClick(e, hit)}
            className="md:hidden absolute bottom-0 left-0 right-0 bg-theme-500 text-white text-sm py-3 px-4 flex items-center justify-center gap-2 active:bg-theme-600 transition-colors duration-200"
            aria-label={`Quick view ${hit.title}`}
          >
            <Icon
              icon="mi:shopping-cart-add"
              className="text-lg"
              aria-hidden="true"
            />
            <span className="font-semibold">QUICK VIEW</span>
          </button>

          {/* Desktop hover quick view */}
          <div
            onClick={(e) => handleQuickViewClick(e, hit)}
            className="hidden md:flex absolute bottom-0 left-0 bg-theme-500 text-white text-[12px] py-[5px] md:py-[7px] md:px-[15px] items-center w-full justify-center gap-[5px] invisible group-hover:visible transition-all duration-200"
          >
            <div className="flex justify-center">
              <div className="font-semibold text-[0.775rem] inline-block text-center">
                <Icon
                  icon="mi:shopping-cart-add"
                  className="text-lg font-thin inline-block mr-[5px]"
                  aria-hidden="true"
                />
                QUICK VIEW
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col px-[15px] pt-[5px] border-t">
          <div
            className="text-sm min-h-[40px] line-clamp-2 font-semibold text-stone-700 hover:text-theme-600 hover:underline"
            title={hit.title}
          >
            {hit.title}
          </div>
          <div className={`flex items-center gap-[5px]`}>
            <Rating
              readOnly
              value={parseRatingCount(hit?.ratings?.rating_count)}
              fractions={2}
              style={{ maxWidth: 100 }}
            ></Rating>
            {/* <div className={`text-[0.75rem]`}>git  */}
          </div>
          <div className="mt-3 text-xs">{hit.brand}</div>
          <div className="mt-3 min-h-[45px] flex items-center">
            {!isPriceVisible(hit?.product_category, hit?.brand) ? (
              <div className="font-medium text-[14px] text-stone-700">
                Contact us for pricing.
              </div>
            ) : (
              <ProductCardPriceDisplay price_details={hit?.variants?.[0]} />
            )}
          </div>
          <FicDropDown contact_number={page_details?.contact_number}>
            <div className="text-xs my-[5px] text-blue-500 flex items-center cursor-default gap-[7px] flex-wrap">
              {!isPriceVisible(hit?.product_category, hit?.brand) ? (
                <>Call for Price </>
              ) : (
                <>Found It Cheaper? </>
              )}
              <div className="hover:underline flex items-center gap-[3px] cursor-pointer">
                <ICRoundPhone width={16} height={16} />{" "}
                <div>{page_details?.contact_number || "(888) 575-9720"}</div>
              </div>
            </div>
          </FicDropDown>
        </div>
      </div>
    </div>
  );
};

const MemoizedProductCard = memo(ProductCard, (prevProps, nextProps) => {
  // Only re-render if the product ID or key data changes
  return (
    prevProps.hit?.id === nextProps.hit?.id &&
    prevProps.hit?.updated_at === nextProps.hit?.updated_at &&
    prevProps.page_details?.contact_number === nextProps.page_details?.contact_number
  );
});
MemoizedProductCard.displayName = 'ProductCard';

export default MemoizedProductCard;
