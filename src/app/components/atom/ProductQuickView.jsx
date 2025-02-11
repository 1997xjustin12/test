"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Quantity from "@/app/components/atom/QuickViewQuantity";
import OnsaleTag from "@/app/components/atom/SingleProductOnsaleTag";
import Image from "next/image";
import Link from "next/link";
import { Rating } from "@smastrom/react-rating";
import { formatPrice } from "@/app/lib/helpers";
import { Eos3DotsLoading, MaterialSymbolsClose } from "../icons/lib";
import { useRouter } from "next/navigation";

import { useCart } from "@/app/context/cart";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

function ProductQuickView({ data, onClose }) {
  const router = useRouter();
  const { addToCart, addToCartLoading } = useCart();
  const [toggle, setToggle] = useState(false);
  const [image, setImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [disableATCButton, setDisableATCButton] = useState(false);
  useEffect(() => {
    if (data) {
      const thumbnail =
        data?.images?.find(({ is_thumbnail }) => is_thumbnail)?.url_standard ??
        null;
      setImage(thumbnail);
      setToggle(true);
    } else {
      setToggle(false);
    }
  }, [data]);

  useEffect(() => {
    if (!toggle) {
      onClose();
    }
  }, [toggle]);

  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  const createItemsArray = (item, quantity) => {
    return new Array(quantity).fill(item);
  };

  const handleAddToCart = (item) => {
    setDisableATCButton(true);
    const items = createItemsArray(item, quantity);
    addToCart(items);
    setDisableATCButton(false);
  };

  const handleViewProductClick = (e) => {
    const {href} = e.target;
    e.preventDefault();
    setToggle(false);
    router.push(href);    
  }

  return (
    <Dialog open={toggle} onClose={setToggle} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="w-screen h-screen relative">
          <div className="absolute inset-0  flex items-end justify-center md:p-4 text-center sm:items-center sm:p-[10px]">
            <DialogPanel
              transition
              className="w-full relative transform overflow-hidden bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[800px] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 overflow-y-auto rounded-lg"
            >
              <div className="absolute right-0 top-0 rounded-bl-lg z-10">
                <div onClick={()=>setToggle(false)} className="cursor-pointer p-1"><MaterialSymbolsClose width={24} height={24}/></div>
              </div>
              {data && (
                <div className="flex flex-col lg:flex-row relative">
                  <div className="top-[10px] left-0 absolute z-[1]">
                    <OnsaleTag categories={data.categories} />
                  </div>
                  <div className="w-full lg:w-[50%] p-[5px]">
                    <div className="aspect-w-2 aspect-h-1 lg:aspect-w-1 lg:aspect-h-1 relative rounded-md overflow-hidden">
                      {image && (
                        <Image
                          src={image}
                          alt={data?.name}
                          objectFit="contain"
                          fill
                        />
                      )}
                    </div>
                  </div>
                  <div className="w-full lg:w-[50%] p-[10px]">
                    <div className="flex flex-col gap-[15px] lg:min-h-[340px] mb-5">
                      <div className="font-bold text-lg mt-[20px]">{data?.name}</div>
                      <div className="flex items-center gap-[3px]">
                        <Rating
                          readOnly
                          value={data.reviews_rating_sum}
                          fractions={2}
                          style={{ maxWidth: 110 }}
                        ></Rating>
                        <div>{`(${data.reviews_count})`}</div>
                      </div>
                      <div className="font-semibold text-base md:text-2xl">
                        ${formatPrice(data.price)}
                      </div>
                      <div className="hover:underline text-stone-600 font-medium text-xs">
                        <Link
                          href={`${BASE_URL}/product/${data.custom_url.url}`}
                          onClick={handleViewProductClick}
                        >
                          View Product and Options
                        </Link>
                      </div>
                      {data.sale_price < data.price && (
                        <div className="flex gap-[5px] items-end">
                          <div className="line-through">
                            ${formatPrice(data.price)}
                          </div>
                          <div className="text-2xl font-semibold text-orange-600">
                            ${formatPrice(data.sale_price)}
                          </div>
                          <div className="bg-green-400 px-2 font-bold">
                            <small>SAVED</small>
                            {` $` + formatPrice(data.price - data.sale_price)}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <div className="mr-10">
                        <Quantity
                          quantity={quantity}
                          onQuantityChange={handleQuantityChange}
                        />
                      </div>
                      <button
                        onClick={() => handleAddToCart(data)}
                        className={`bg-orange-600 flex justify-center hover:bg-orange-500 text-white h-[32px] items-center rounded w-full font-medium ${addToCartLoading?"pointer-events-none": "pointer-events-auto"}`}
                        disabled={disableATCButton}
                      >
                        {addToCartLoading ? <Eos3DotsLoading width={52} height={52}/>:"Add to cart" }
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default ProductQuickView;
