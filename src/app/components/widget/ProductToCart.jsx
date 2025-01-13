"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Rating } from "@smastrom/react-rating";
import { useState, useEffect } from "react";
import { bc_categories as bccat_json } from "../../lib/category-helpers";
import { getCategoryNameById } from "@/app/lib/helpers";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { PhoneIcon } from "@heroicons/react/24/outline";
import OnsaleTag from "@/app/components/atom/SingleProductOnsaleTag";

const ProductToCart = ({ product, loading }) => {
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);

  const handleQuantityChange = (e) => {
    const { value } = e.target;
    setQuantity((prev) => {
      if (value === "") {
        return 0;
      } else {
        return parseInt(value);
      }
    });
  };

  const handleQuantityButtons = (direction) => {
    setQuantity((prev) => {
      let newQuantity = typeof prev === "number" ? prev : 0;
      if (direction === "inc") {
        newQuantity = newQuantity + 1;
      } else if (direction === "dec") {
        if (newQuantity > 0) {
          newQuantity = newQuantity - 1;
        }
      }
      return newQuantity;
    });
  };

  const [productData, setProductData] = useState(product);
  useEffect(() => {
    setProductData(product);
  }, [product]);

  const capitalizeFirstLetter = (string) => {
    if (!string) return ""; // Handle empty or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleHeartToggle = (e) => {
    setProductData((prev) => ({ ...prev, like: !prev.like }));
  };

  const handleAddToCart = (e) => {
    setOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-[15px] w-full">
        <div className="flex gap-[10px]">
          <div className="py-[5px] px-[25px] bg-stone-200 text-stone-600 h-[34px] w-[170px] font-semibold rounded-full"></div>
          <div className="py-[5px] px-[25px] bg-stone-200 text-stone-600 h-[34px] w-[155px] font-semibold rounded-full"></div>
        </div>
        <div className="">
          <div className="font-bold text-4xl flex flex-col gap-[2px]">
            <div className="h-[50px] w-full bg-stone-200"></div>
            <div className="h-[50px] w-[85%] bg-stone-200"></div>
            <div className="h-[50px] w-[60%] bg-stone-200"></div>
            <div className="h-[24px] w-[50%] bg-stone-200"></div>
          </div>
        </div>
        <div className="mt-[100px]">
          <div className="font-bold text-4xl flex gap-[20px]">
            <div className="h-[54px] w-[270px] bg-stone-200 rounded-full"></div>
            <div className="h-[54px] w-[54px] bg-stone-200 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                    <PhoneIcon
                      aria-hidden="true"
                      className="size-6 text-red-600"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold text-gray-900">
                      Please Call for Assistance
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        To complete your purchase or learn more about this
                        product, please contact our support team. We’re here to
                        help!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <a
                  href="tel:(888)%20977-9085"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
                  Call
                </a>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="flex flex-col gap-[15px] w-full">
        <div className="flex gap-[10px] flex-wrap">
          {product &&
            product?.categories.map((v, i) => (
              <div
                key={`category-tag-${i}`}
                className="text-[12px] py-[2px] px-[10px] md:text-[16px] md:py-[5px] md:px-[25px] bg-stone-300 text-stone-600 font-semibold rounded-full">
                {getCategoryNameById(v, bccat_json)}
              </div>
            ))}
        </div>
        <div className="">
          {product && <OnsaleTag categories={product?.categories} />}
        </div>
        <div className="">
          <div className="font-bold text-[24px] md:text-4xl">
            {productData?.name}
          </div>
          <div className="font-light text-stone-400 text-[12px] md:[16px]">
            {productData?.sku}
          </div>
        </div>
        <div className="">
          <div className="text-[14px] md:text-[20px] font-bold">
            Ships Within 1 to 2 Business Days
          </div>
        </div>
        <div className="">
          {/* <div className="flex items-center gap-[20px]">
                    <div className="text-[2.625em] font-extrabold text-pallete-green">
                        ${
                            productData?.price
                        }
                    </div>
                    <div className="product-add-to-cart-quantity-input">
                        <button onClick={() => handleQuantityButtons('dec')}>
                            <Icon icon="icons8:minus" className="text-[32px] text-pallete-gray" />
                        </button>
                        <input type="number" value={quantity} onChange={handleQuantityChange} />
                        <button onClick={() => handleQuantityButtons('inc')}>
                            <Icon icon="icons8:plus" className="text-[32px] text-pallete-gray" />
                        </button>
                    </div>
                </div> */}
          <div className="flex items-center gap-[10px] mt-[7px] md:mt-[10px]">
            <div className="font-bold text-white">
              <button
                className="flex items-cencer gap-[5px] bg-pallete-green rounded-full py-[5px] px-[25px] md:py-[9px] md:px-[35px]"
                onClick={handleAddToCart}>
                <div>
                  <Icon
                    icon="ph:shopping-cart-simple-bold"
                    className="text-[24px] md:text-[30px]"
                  />
                </div>
                <div className="font-bold uppercase text-[18px] md:text-[1.5em]">
                  add to cart
                </div>
              </button>
            </div>
            {/* <div>
                        <button onClick={handleHeartToggle} className={`flex justify-center items-center w-[54px] h-[54px] rounded-full ${productData?.like ? 'bg-pallete-orange' : 'bg-stone-400'}`}>
                            <Icon icon="teenyicons:heart-outline" className="text-white text-[30px]" />
                        </button>
                    </div> */}
          </div>
        </div>
        <div className="mt-[10px] md:mt-[30px] flex flex-col gap-[10px]">
          <div className="flex items-center">
            <Rating
              value={productData?.reviews_rating_sum}
              style={{ maxWidth: 100 }}></Rating>
            <div>({productData?.reviews_count})</div>
          </div>
          <div className="flex  flex-col md:flex-row md:items-center gap-[10px] md:gap-[25px]">
            <div className="flex items-center font-bold gap-[8px]">
              <div>
                <Icon
                  icon="lucide:circle-check-big"
                  className={`${
                    productData?.is_free_shipping
                      ? "text-pallete-green"
                      : "text-stone-400"
                  }`}
                />
              </div>
              <div
                className={`text-[14px] md:text-[20px] ${
                  productData?.is_free_shipping
                    ? ""
                    : "line-through text-stone-400"
                }`}>
                <span
                  className={`${
                    productData?.is_free_shipping
                      ? "text-pallete-green"
                      : "text-stone-400"
                  }`}>
                  FREE
                </span>{" "}
                Shipping
              </div>
            </div>
            <div className="flex items-center font-bold gap-[8px]">
              <div>
                <Icon
                  icon="lucide:circle-check-big"
                  className="text-pallete-green"
                />
              </div>
              <div className="text-[14px] md:text-[20px]">
                Quick Ship Available
              </div>
            </div>
            <div className="py-[5px] px-[15px] md:py-[6.5px] md:px-[25px] w-fit gap-[5px] flex items-center rounded-full bg-pallete-lightgray">
              <div>
                <Icon
                  icon="material-symbols:info-outline"
                  className="text-pallete-dark text-[18px] mdtext-[25px]"
                />
              </div>
              <div className="text-[14px] md:text-[20px] text-pallete-dark font-semibold">
                Learn More
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductToCart;
