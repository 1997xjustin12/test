"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BASE_URL, formatPrice, createSlug } from "@/app/lib/helpers";
import { Eos3DotsLoading } from "@/app/components/icons/lib";
import StarRating from "./StarRating";
import { useCart } from "@/app/context/cart";

const PriceDisplay = ({ data }) => {
  const price = data?.price && data?.price !== "0" ? formatPrice(data.price) : null;
  const comparePrice =
    data?.compare_at_price && data?.compare_at_price !== "0"
      ? formatPrice(data.compare_at_price)
      : null;
  const isOnSale = comparePrice && data?.compare_at_price > data?.price;

  if (!price) return null;

  return (
    <div className="mb-4 flex items-baseline gap-1.5">
      {isOnSale ? (
        <>
          <span className="text-base font-bold text-theme-500">${price}</span>
          <s className="text-xs text-stone-400 dark:text-stone-500">${comparePrice}</s>
        </>
      ) : (
        <span className="text-base font-bold text-charcoal dark:text-white">${price}</span>
      )}
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
      className="w-full py-1.5 rounded-lg bg-theme-600 hover:bg-theme-500 text-gray-900 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-theme-500/20 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
    >
      {loading ? <Eos3DotsLoading width={30} height={30} /> : "Add to Cart"}
    </button>
  );
};

function ProductCardToCart({ item }) {
  return (
    <div className="min-w-[160px] w-full flex flex-col p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800">
      <Link
        prefetch={false}
        href={item?.url || "#"}
        className="w-full aspect-1 relative mb-2.5 overflow-hidden rounded-lg"
      >
        {item?.image && (
          <Image
            src={item.image}
            title={item.title}
            alt={`${createSlug(item?.title)}-image`}
            fill
            className="object-contain"
            sizes="200px"
          />
        )}
      </Link>
      <Link
        title={item?.title}
        prefetch={false}
        href={item?.url || "#"}
        className="text-xs leading-snug line-clamp-3 min-h-[48px] mb-1.5 text-charcoal dark:text-white hover:text-theme-500 dark:hover:text-theme-500 transition-colors"
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
