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
          <span className="font-oswald font-bold text-base text-ember-deep dark:text-ember">${price}</span>
          <span className="text-xs text-char/40 dark:text-ash/30 line-through">${comparePrice}</span>
        </>
      ) : (
        <span className="font-oswald font-bold text-base text-char dark:text-ash">${price}</span>
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
      className="relative w-full py-1.5 rounded-sm bg-theme-600 hover:bg-theme-700 text-white font-oswald font-semibold text-xs uppercase tracking-wide transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {loading ? <Eos3DotsLoading width={30} height={30} /> : "Add to Cart"}
    </button>
  );
};

function ProductCardToCart({ item }) {
  return (
    <div className="min-w-[160px] w-full flex flex-col p-2.5 bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm">
      <Link
        prefetch={false}
        href={item?.url || "#"}
        className="w-full aspect-1 relative mb-2.5 overflow-hidden bg-white dark:bg-char"
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
        className="font-sora text-xs leading-snug line-clamp-3 min-h-[48px] mb-1.5 text-char dark:text-ash hover:text-theme-600 dark:hover:text-theme-500 transition-colors"
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
