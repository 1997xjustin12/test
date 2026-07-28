"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, createSlug } from "@/app/lib/helpers";
import { Eos3DotsLoading } from "@/app/components/icons/lib";
import StarRating from "./StarRating";
import { useCart } from "@/app/context/cart";

// Compact OKO product card (8.10) — white bordered, cream-dim image well,
// product name (inter) → star row → three-part price → full-width barn add.
const PriceDisplay = ({ data }) => {
  const price = data?.price && data?.price !== "0" ? formatPrice(data.price) : null;
  const comparePrice =
    data?.compare_at_price && data?.compare_at_price !== "0"
      ? formatPrice(data.compare_at_price)
      : null;
  const isOnSale = comparePrice && data?.compare_at_price > data?.price;

  if (!price) return null;

  return (
    <div className="mb-3 flex items-baseline gap-2">
      {isOnSale && (
        <span className="font-inter text-[12px] text-oko-stone line-through">${comparePrice}</span>
      )}
      <span className="font-inter font-semibold text-[16px] text-oko-char dark:text-oko-cream">
        ${price}
      </span>
    </div>
  );
};

const AddToCartBtn = ({ item }) => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    await addToCart({ ...item, quantity: 1 });
    setLoading(false);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      aria-label={`Add ${item?.title || "product"} to cart`}
      className="relative w-full py-2 rounded-[2px] bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[12.5px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {loading ? <Eos3DotsLoading width={30} height={30} /> : "Add to cart"}
    </button>
  );
};

function ProductCardToCart({ item }) {
  return (
    <div className="min-w-[160px] w-full flex flex-col p-2.5 bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px]">
      <Link
        prefetch={false}
        href={item?.url || "#"}
        className="w-full aspect-1 relative mb-2.5 overflow-hidden bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px]"
      >
        {item?.image && (
          <Image
            src={item.image}
            title={item.title}
            alt={`${createSlug(item?.title)}-image`}
            fill
            className="object-contain p-2"
            sizes="200px"
          />
        )}
      </Link>
      <Link
        title={item?.title}
        prefetch={false}
        href={item?.url || "#"}
        className="font-inter text-[13px] font-medium leading-[1.3] line-clamp-3 min-h-[48px] mb-1.5 text-oko-char dark:text-oko-cream hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
      >
        {item?.title}
      </Link>
      <div className="mb-1.5">
        <StarRating rating={item?.ratings} />
      </div>
      <PriceDisplay data={item?.variants?.[0]} />
      <AddToCartBtn item={item} />
    </div>
  );
}

export default ProductCardToCart;
