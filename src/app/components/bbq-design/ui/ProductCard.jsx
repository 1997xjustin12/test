"use client";
import { useState, useMemo } from "react";
import { useSolanaCategories } from "@/app/context/category";
import { useCart } from "@/app/context/cart";

import Link from "next/link";
import Image from "next/image";

import FicDropDown from "@/app/components/bbq-design/ui/FicDropDown";
import { ICRoundPhone } from "@/app/components/icons/lib";
import { STORE_CONTACT } from "@/app/lib/store_constants";
import { useQuickView } from "@/app/context/quickview";
import { formatPrice, formatProduct } from "@/app/lib/helpers";
import StarRating from "@/app/components/bbq-design/ui/StarRating";
import { Eos3DotsLoading } from "@/app/components/icons/lib";


const BADGE_STYLES = {
  bestseller: "bg-gold text-white",
  sale: "bg-ember text-white",
  new: "bg-char text-white",
  openbox: "bg-smoke text-white",
};
const BADGE_LABELS = {
  bestseller: "Bestseller",
  sale: "Sale",
  new: "New",
  openbox: "Open Box",
};

function FireplaceThumb({ product }) {
  const mainImage = useMemo(() => {
    return product?.images?.find(({ position }) => position == 1)?.src;
  }, [product]);

  if (!mainImage) return null;

  return (
    <Image
      src={mainImage}
      alt={product?.name || "Product Image"}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-cover transition-transform duration-300 group-hover:scale-105"
      priority={false}
    />
  );
}

function ProductCard({ hit, page_details, onCompare }) {
  const { viewItem } = useQuickView();
  const { addToCart } = useCart();
  const { isPriceVisible } = useSolanaCategories();
  const [product] = useState(formatProduct(hit, "card"));
  const [atcLoading, setAtcLoading] = useState(false);

  async function handleAdd() {
    setAtcLoading(true);
    try {
      await addToCart({ ...formatProduct(product), quantity: 1 });
    } catch (err) {
      console.log("[ERROR]", err);
    } finally {
      setAtcLoading(false);
    }
  }

  return (
    <article className="group bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm overflow-hidden hover:border-theme-600 dark:hover:border-theme-600/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-char/10 dark:hover:shadow-black/30 transition-all duration-300">
      {/* Image */}
      <div className="relative h-40 sm:h-52 bg-white dark:bg-char overflow-hidden">
        <Link aria-label={product?.name} title={product?.name} href={product?.url} prefetch={false}>
          <FireplaceThumb product={hit} />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-0">
          {product?.badge && (
            <span className={`font-oswald text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wide ${BADGE_STYLES[product?.badge]}`}>
              {BADGE_LABELS[product?.badge]}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-2.5 sm:p-4">
        <p
          title={product?.brand}
          className="line-clamp-1 font-oswald text-[10px] uppercase tracking-widest text-theme-600 mb-1"
        >
          {product?.brand}
        </p>

        <Link aria-label={product?.name} title={product?.name} href={product?.url} prefetch={false}>
          <h2 className="line-clamp-2 min-h-[38.5px] font-sora text-sm font-semibold text-char dark:text-ash leading-snug mb-2 group-hover:text-theme-600 dark:group-hover:text-theme-500 transition-colors">
            {product?.name}
          </h2>
        </Link>

        <div className="flex items-center gap-1.5 mb-2">
          <StarRating rating={product?.ratings} />
          <span className="text-xs text-char/40 dark:text-ash/30">
            {product?.ratings} {!!product?.reviews && `(${product?.reviews})`}
          </span>
        </div>

        {/* Price */}
        <div className="pt-2 border-t border-grate dark:border-white/10 min-h-[55px]">
          {!isPriceVisible(hit?.product_category, hit?.brand) ? (
            <div className="font-oswald font-medium text-sm text-char/60 dark:text-ash/50">
              Contact us for pricing.
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-1.5">
                <span className="font-oswald text-base sm:text-lg font-bold text-ember-deep dark:text-ember">
                  ${formatPrice(product?.price)}
                </span>
                {!!product?.was && (
                  <span className="font-oswald text-xs text-char/40 dark:text-ash/30 line-through">
                    ${formatPrice(product?.was)}
                  </span>
                )}
              </div>
              {!!(product?.was && product?.was > product?.price) && (
                <p className="font-oswald text-xs text-bbq-green font-medium mt-0.5">
                  Save ${formatPrice(product.was - product.price)}
                </p>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex mt-2">
          <button
            title="Quick View"
            onClick={() => viewItem(hit)}
            aria-label="Quick view"
            className="w-9 h-9 min-w-9 flex items-center justify-center bg-ash dark:bg-white/10 text-char/50 dark:text-ash/40 hover:bg-theme-600 hover:text-white dark:hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <button
            onClick={handleAdd}
            disabled={atcLoading}
            className="relative w-full uppercase font-oswald tracking-wide flex justify-center items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors bg-ember hover:bg-ember-deep text-white"
          >
            {atcLoading ? (
              <Eos3DotsLoading />
            ) : (
              <>
                🔥<span className="hidden sm:inline">&nbsp;Add to Cart</span>
              </>
            )}
          </button>
        </div>

        <FicDropDown contact_number={page_details?.contact_number}>
          <div className="text-xs my-[5px] text-white flex items-center cursor-default gap-[7px] flex-wrap">
            {!isPriceVisible(hit?.product_category, hit?.brand) ? (
              <>Call for Price</>
            ) : (
              <>Found It Cheaper?</>
            )}
            <div className="hover:underline flex items-center gap-[3px] cursor-pointer">
              <ICRoundPhone width={16} height={16} />
              <div>{page_details?.contact_number || STORE_CONTACT}</div>
            </div>
          </div>
        </FicDropDown>
      </div>
    </article>
  );
}

export default ProductCard;
