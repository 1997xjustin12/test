import Link from "next/link";
import StarRating from "@/app/components/oko-design/sections/sp/StarRating";
import AddToCartWidget from "@/app/components/oko-design/sections/sp/AddToCartWidget";
import ProductOptionItemLink from "@/app/components/oko-design/sections/sp/ProductOptionItemLink";
import FicDropDown from "@/app/components/oko-design/ui/FicDropDown";
import { createSlug, formatPrice } from "@/app/lib/helpers";

// Phone is a first-class OKO brand element — always this exact literal (spec §10).
const OKO_PHONE = "888-667-4986";

const ProductCategoryChip = ({ category, url = "#" }) => {
  if (!category)
    return (
      <div className="self-start font-inter text-[10px] font-semibold text-oko-barn dark:text-oko-barn-light bg-oko-barn/10 border border-oko-barn/25 px-2.5 py-1 rounded-[2px] uppercase tracking-[0.06em]">
        Category not assigned
      </div>
    );
  return (
    <Link
      prefetch={false}
      href={url}
      className="self-start inline-block font-inter text-[10px] font-semibold text-oko-char-soft dark:text-oko-ondark bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark px-2.5 py-1 rounded-[2px] uppercase tracking-[0.06em] hover:border-oko-char dark:hover:border-oko-cream transition-colors"
    >
      {category}
    </Link>
  );
};

const ProductOptionGroup = ({ option_group }) => {
  if (!option_group?.options?.length) return null;
  return (
    <div className="w-full">
      <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-oko-stone mb-1.5">
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
    {/* Brand eyebrow + SKU */}
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <Link
        href={product?.brand_url || "#"}
        prefetch={false}
        className="font-inter text-[11px] font-semibold uppercase tracking-[0.04em] text-oko-barn dark:text-oko-barn-light hover:text-oko-barn-dark transition-colors"
      >
        {product?.brand}
      </Link>
      <span className="font-inter text-[11px] text-oko-stone">
        SKU: {product?.sku}
      </span>
    </div>

    {/* Title */}
    <h1 className="font-oko-display font-semibold text-[27px] leading-[1.2] text-oko-char dark:text-oko-cream">
      {product?.name}
    </h1>

    {/* Star row */}
    <StarRating rating={product?.ratings || 0} size="md" showCount count={product?.reviews || 0} />

    <ProductCategoryChip
      category={product?.category}
      url={product?.category_url}
    />

    {/* Price block — struck "was", scaled-up "now", sage "Save $X" */}
    <div className="flex flex-col gap-1.5 my-1">
      <div className="flex items-baseline gap-3 flex-wrap">
        {product?.was && product?.save_pct > 0 && (
          <span className="font-inter text-[16px] text-oko-stone line-through">
            ${formatPrice(product?.was)}
          </span>
        )}
        <span className="font-inter font-semibold text-[29px] leading-none text-oko-char dark:text-oko-cream">
          ${formatPrice(product?.price)}
        </span>
      </div>
      {product?.save_pct > 0 && (
        <span className="font-inter font-semibold text-[14px] text-oko-sage dark:text-oko-sage-light">
          Save ${formatPrice(product?.save_amt)} ({product?.save_pct}%)
          {product?.is_freeshipping && " · Free shipping"}
        </span>
      )}
    </div>

    {/* Ships */}
    <div className="flex items-center gap-2 font-inter text-[13.5px] text-oko-char-soft dark:text-oko-ondark">
      <svg
        className="w-4 h-4 text-oko-sage dark:text-oko-sage-light flex-shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="font-medium">{product?.ships}</span>
    </div>

    {/* Product Options */}
    {Array.isArray(product?.product_options) && product.product_options.length > 0 && (
      <div className="flex flex-col gap-4">
        {product.product_options.map((og, i) => (
          <ProductOptionGroup
            key={`product-option-group-${og?.option_label}-${i}`}
            option_group={og}
          />
        ))}
      </div>
    )}

    {/* Discounts */}
    {Array.isArray(product?.discount_links) &&
      product.discount_links.length > 0 && (
        <div className="bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] p-4">
          <p className="font-inter text-[11px] font-semibold text-oko-stone uppercase tracking-[0.06em] mb-3">
            Discounts &amp; savings available
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {product.discount_links.map((b, i) => (
              <Link
                prefetch={false}
                href={b?.url}
                key={`discount-links-${b?.label}-${i}`}
                className="flex items-center gap-2 font-inter text-[12.5px] text-oko-char-soft dark:text-oko-ondark hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
              >
                <span className="w-1 h-1 rounded-full bg-oko-barn dark:bg-oko-barn-light flex-shrink-0" />
                {b?.label}
              </Link>
            ))}
          </div>
        </div>
      )}

    {/* Qty stepper + Add to cart */}
    <AddToCartWidget product={product} />

    {/* Call for a lower price — cream-dim panel repeating the phone (§9) */}
    <FicDropDown contact_number={OKO_PHONE}>
      <div className="w-full text-left flex items-center justify-between gap-3 bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] px-4 py-3.5 hover:border-oko-barn dark:hover:border-oko-barn-light transition-colors">
        <div>
          <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.06em] text-oko-stone">
            Call for a lower price
          </p>
          <p className="font-oko-display font-bold text-[22px] leading-tight text-oko-char dark:text-oko-cream">
            {OKO_PHONE}
          </p>
        </div>
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-oko-barn text-white flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </span>
      </div>
    </FicDropDown>
  </div>
);

export default ProductInfo;
