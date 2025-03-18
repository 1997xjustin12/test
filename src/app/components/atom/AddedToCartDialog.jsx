"use client";
import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eos3DotsLoading } from "../icons/lib";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
const cartPageUrl = `${BASE_URL}/cart`;
function AddedToCartDialog({ data, onClose }) { 
  const router = useRouter();
  const [toggle, setToggle] = useState(true);
  const [image, setImage] = useState(null);

  const addedToCartItems = useMemo(() => {
    if (!data || data.length === 0) {
      return null;
    }

    const formattedVal = Object.values(
      data.reduce((acc, item) => {
        if (!acc[item.id]) {
          acc[item.id] = { ...item, count: 0 };
        }
        acc[item.id].count += 1;
        return acc;
      }, {})
    );

    return formattedVal[0];
  }, [data]);

  
  useEffect(() => {
    if (addedToCartItems) {
      const thumbnail =
      addedToCartItems?.images?.find(({ is_thumbnail }) => is_thumbnail)?.url_standard ??
        null;
      setImage(thumbnail);
      setToggle(true);
    } else {
      setToggle(false);
    }
  }, [addedToCartItems]);

  const handleClose = () => {
    setToggle(false);
    onClose();
  }

  const handleGoToCartClick = (e) => {
    e.preventDefault();
    handleClose();
    router.push(cartPageUrl);
  };

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
              <div className="flex items-center justify-center h-[100px]">
                <div className="font-bold text-xl text-stone-700">
                  <div className="flex justify-center text-green-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="27"
                      viewBox="0 0 32 27"
                    >
                      <path
                        fill="currentColor"
                        d="M26.99 0L10.13 17.17l-5.44-5.54L0 16.41L10.4 27l4.65-4.73l.04.04L32 5.1z"
                      />
                    </svg>
                  </div>
                  <div className="font-bold text-xl text-stone-700">
                    Item added to your cart
                  </div>
                </div>
              </div>
              <div className="flex bg-stone-200 px-[15px] py-[15px] gap-[10px]">
                <div className="w-[100px] h-[100px] relative rounded-md overflow-hidden">
                  {image && (
                    <Image
                      src={image}
                      alt={addedToCartItems?.name}
                      className="w-full h-full"
                      objectFit="contain"
                      fill
                    />
                  )}
                </div>
                <div className={`w-[calc(100%-100px)] text-stone-700 flex gap-[10px] ${data ? "flex-col":"justify-center items-center h-[100px]"}`}>
                  {
                    data ? <>
                  <div className="font-bold text-sm lg:text-xl">{addedToCartItems?.name}</div>
                  <div className="font-medium text-sm">{`$${addedToCartItems?.price}x${addedToCartItems?.count}`}</div>
                  <div className="font-extrabold text-theme-600 text-lg lg:text-2xl text-right">{`$${addedToCartItems?.count * addedToCartItems?.price}`}</div>
                  </>:
                  <Eos3DotsLoading />
                  }
                </div>
              </div>
              <div className="flex items-center justify-center h-[100px]">
                <div className="font-bold text-xl text-stone-700">
                  Other Contents Here
                </div>
              </div>

              {/* action buttons */}
              <div className="flex justify-between items-center p-[10px] border-t ">
                <button
                  onClick={handleClose}
                  className="border border-stone-300 rounded-md py-1 px-2 hover:bg-stone-50 text-sm font-medium"
                >
                  Continue Shopping
                </button>
                <Link
                  onClick={handleGoToCartClick}
                  href={cartPageUrl}
                  className="border border-stone-300 rounded-md py-1 px-2 text-white bg-theme-600 hover:bg-theme-500 text-sm font-medium"
                >
                  Go to Cart
                </Link>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default AddedToCartDialog;
