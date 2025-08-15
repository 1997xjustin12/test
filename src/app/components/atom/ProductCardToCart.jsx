"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Rating } from "@smastrom/react-rating";
import {
  BASE_URL,
  formatPrice,
  createSlug,
  parseRatingCount,
} from "@/app/lib/helpers";
import { Eos3DotsLoading } from "@/app/components/icons/lib";

// CONTEXT
import { useCart } from "@/app/context/cart";
import { useSolanaCategories } from "@/app/context/category";

const ImageDisplay = ({ images, title = "" }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (images && Array.isArray(images)) {
      const img = images.find(({ position }) => position === 1)?.src;
      setImage(img);
    }
  }, [images]);

  if (!images && !Array.isArray(images)) {
    return;
  }

  if (image) {
    return (
      <Image
        src={image}
        title={title}
        alt={`${createSlug(title)}-image`}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, 300px"
      />
    );
  }
};

const PriceDisplay = ({ data }) => {
  const [formattedPrice, setFormattedPrice] = useState("0.00");
  const [formattedComparePrice, setFormattedComparePrice] = useState("0.00");
  useEffect(() => {
    if (data) {
      const price =
        data?.price && data?.price !== "0" ? formatPrice(data?.price) : "0.00";
      setFormattedPrice(price);
      const compare_price =
        data?.compare_at_price && data?.compare_at_price !== "0"
          ? formatPrice(data?.compare_at_price)
          : "0.00";
      setFormattedComparePrice(compare_price);
    }
  }, [data]);

  return (
    <div className="mb-5 flex items-center gap-[10px]">
      {data?.compare_at_price === 0 ? (
        <div className="text-sm">${formattedPrice}</div>
      ) : (
        <>
          <div className="text-sm">${formattedPrice}</div>
          <div className="text-[0.65em] line-through text-neutral-700">
            ${formattedComparePrice}
          </div>
        </>
      )}
    </div>
  );
};

const AddToCartBtn = ({ item }) => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const createItemsArray = (item, quantity) => {
    return new Array(quantity).fill(item);
  };

  const handleAddToCart = async (item) => {
    setLoading(true);
    const quantity = 1;
    const items = createItemsArray(item, quantity);
    const response = await addToCart(items);
    setLoading(false);
  };

  return (
    <button
      onClick={() => handleAddToCart(item)}
      className="hover:bg-theme-600 bg-theme-700 text-white rounded py-1 px-4 font-bold text-sm h-[28px] w-[110px] flex items-center justify-center"
      disabled={loading}
    >
      {loading ? <Eos3DotsLoading width={30} height={30} /> : "Add to Cart"}
    </button>
  );
};

function ProductCardToCart({ item }) {
  const { getProductUrl } = useSolanaCategories();
  const product_url = getProductUrl(item);
  return (
    <div className="min-w-[170px] w-full flex flex-col p-3">
      <Link
        prefetch={false}
        href={product_url || "#"}
        className="w-full aspect-1 relative mb-3"
      >
        <ImageDisplay images={item?.images} title={item?.title} />
      </Link>
      <Link
        title={item?.title}
        prefetch={false}
        href={product_url || "#"}
        className="text-xs line-clamp-3 min-h-[50px] mb-2 hover:underline hover:text-theme-700"
      >
        {item?.title}
      </Link>
      <Rating
        className="mb-2"
        readOnly
        value={parseRatingCount(item?.ratings?.rating_count)}
        fractions={2}
        style={{ maxWidth: 80 }}
      ></Rating>
      <PriceDisplay data={item?.variants?.[0]} />
      <AddToCartBtn item={item} />
    </div>
  );
}

export default ProductCardToCart;
