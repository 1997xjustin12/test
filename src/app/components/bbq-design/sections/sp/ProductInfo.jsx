import Link from "next/link";
import StarRating from "@/app/components/bbq-design/sections/sp/StarRating";
import Badge from "@/app/components/bbq-design/sections/sp/Badge";
import AddToCartWidget from "@/app/components/bbq-design/sections/sp/AddToCartWidget";
import ProductOptionItemLink from "@/app/components/bbq-design/sections/sp/ProductOptionItemLink";
import FicDropDown from "@/app/components/bbq-design/ui/FicDropDown";
import { ICRoundPhone } from "@/app/components/icons/lib";
import { STORE_CONTACT } from "@/app/lib/store_constants";
import { createSlug, formatPrice } from "@/app/lib/helpers";

const ProductCategoryChip = ({ category, url = "#" }) => {
  if (!category)
    return (
      <div className="self-start text-[10px] font-oswald font-semibold text-red-500 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-sm uppercase tracking-widest">
        Category Not Assigned
      </div>
    );
  return (
    <Link
      prefetch={false}
      href={url}
      className="self-start inline-block text-[10px] font-oswald font-semibold text-theme-600 bg-theme-600/10 dark:bg-theme-600/20 border border-theme-600/20 dark:border-theme-600/30 px-2.5 py-1 rounded-sm uppercase tracking-widest hover:bg-theme-600/20 transition-colors"
    >
      {category}
    </Link>
  );
};

const ProductOptionGroup = ({ option_group }) => {
  if (!option_group?.options?.length) return null;
  return (
    <div className="w-full">
      <p className="font-oswald font-semibold text-sm uppercase tracking-wide text-char/60 dark:text-ash/50 mb-1">
        {option_group?.option_label}
      </p>
      <div className="mt-1 grid grid-cols-1 sm:grid-cols-3 gap-[10px]">
        {option_group.options.map((opt, i) => (
          <ProductOptionItemLink
            key={`${createSlug(opt?.title)}-option-${i}`}
            product={opt}
          />
        ))}
      </div>
    </div>
  );
};

const ProductInfo = ({ product }) => (
  <div className="flex flex-col gap-5">
    {/* Brand + SKU */}
    <div className="flex items-center gap-2.5 flex-wrap">
      <Link
        href={product?.brand_url || "#"}
        prefetch={false}
        className="text-[10px] font-oswald font-semibold text-theme-600 bg-theme-600/10 dark:bg-theme-600/20 border border-theme-600/20 dark:border-theme-600/30 px-2.5 py-1 rounded-sm uppercase tracking-widest hover:bg-theme-600/20 transition-colors"
      >
        {product?.brand}
      </Link>
      <span className="text-[10px] text-char/30 dark:text-ash/30">
        SKU: {product?.sku}
      </span>
    </div>

    {/* Title */}
    <h1 className="font-oswald font-bold text-2xl sm:text-3xl uppercase text-char dark:text-ash leading-tight">
      {product?.name}
    </h1>

    <ProductCategoryChip
      category={product?.category}
      url={product?.category_url}
    />

    {/* Price */}
    <div className="flex flex-col items-start gap-2 my-2">
      <div className="font-oswald font-bold text-4xl text-ember-deep dark:text-ember">
        ${formatPrice(product?.price)}
      </div>
      {product?.save_pct > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-char/40 dark:text-ash/30 line-through">
            ${formatPrice(product?.was)}
          </span>
          <Badge variant="green">SAVE {product?.save_pct}%</Badge>
          <span className="text-xs text-char/50 dark:text-ash/40">
            You save{" "}
            <strong className="text-bbq-green">
              ${formatPrice(product?.save_amt)}
            </strong>
            {product?.is_freeshipping && " · Free Shipping"}
          </span>
        </div>
      )}
    </div>

    {/* Ships */}
    <div>
      <div className="flex items-center gap-2 text-sm text-char/60 dark:text-ash/50">
        <svg
          className="w-4 h-4 text-bbq-green flex-shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">{product?.ships}</span>
      </div>
      <FicDropDown contact_number={STORE_CONTACT}>
        <div className="text-xs my-[5px] text-theme-600 flex items-center cursor-default gap-[7px] flex-wrap">
          Found It Cheaper?
          <div className="hover:underline flex items-center gap-[3px] cursor-pointer">
            <ICRoundPhone width={16} height={16} />
            <span>{STORE_CONTACT}</span>
          </div>
        </div>
      </FicDropDown>
    </div>

    {/* Product Options */}
    <div className="flex flex-col gap-4">
      {Array.isArray(product?.product_options) &&
        product.product_options.map((og, i) => (
          <ProductOptionGroup
            key={`product-option-group-${og?.option_label}-${i}`}
            option_group={og}
          />
        ))}
    </div>

    {/* Discounts */}
    {Array.isArray(product?.discount_links) &&
      product.discount_links.length > 0 && (
        <div className="bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs flex-shrink-0">🔥</span>
            <span className="font-oswald text-xs font-semibold text-char/70 dark:text-ash/70 uppercase tracking-wide">
              Discounts &amp; Savings Available
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {product.discount_links.map((b, i) => (
              <Link
                prefetch={false}
                href={b?.url}
                key={`discount-links-${b?.label}-${i}`}
                className="flex items-center gap-2 text-xs text-char/50 dark:text-ash/40 hover:text-theme-600 transition-colors"
              >
                <span className="w-1 h-1 rounded-full bg-theme-600 flex-shrink-0" />
                {b?.label}
              </Link>
            ))}
          </div>
        </div>
      )}

    {/* Qty + CTA */}
    <div className="flex flex-col gap-3">
      <div className="flex items-stretch gap-3 flex-wrap">
        <AddToCartWidget product={product} />
        <Link
          href={`tel:${STORE_CONTACT}`}
          className="hidden items-center gap-2 h-11 px-4 border md:flex border-theme-600 text-theme-600 font-oswald font-semibold text-xs uppercase tracking-wide hover:bg-theme-600/10 transition-colors whitespace-nowrap rounded-sm"
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
        </Link>
      </div>
      <Link
        href={`tel:${STORE_CONTACT}`}
        className="flex md:hidden items-center justify-center gap-2 h-11 px-4 border border-theme-600 text-theme-600 font-oswald font-semibold text-xs uppercase tracking-wide hover:bg-theme-600/10 transition-colors whitespace-nowrap rounded-sm"
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
      </Link>
    </div>
  </div>
);

export default ProductInfo;
