"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Quantity from "@/app/components/atom/QuickViewQuantity";
import OnsaleTag from "@/app/components/atom/SingleProductOnsaleTag";
import Image from "next/image";
import Link from "next/link";
import { Rating } from "@smastrom/react-rating";
import { formatPrice, stripHtmlTags } from "@/app/lib/helpers";
import { useRouter } from "next/navigation";
import {
  AkarIconsShippingV1,
  MDITruckOutline,
  Eos3DotsLoading,
  MaterialSymbolsClose,
} from "@/app/components/icons/lib";
import { useCart } from "@/app/context/cart";
import { useSolanaCategories } from "@/app/context/category";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

function ProductQuickView({ data, product_link, onClose }) {
  const router = useRouter();
  const { isPriceVisible, getProductUrl } = useSolanaCategories();
  const { addToCart, addToCartLoading } = useCart();
  const [toggle, setToggle] = useState(false);
  const [image, setImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleClose = () => {
    setToggle(false);
    onClose();
  };

  useEffect(() => {
    if (data) {
      // console.log("data", data);
      const thumbnail =
        data?.images?.find(({ position }) => position===1)?.src ??
        null;

      setImage(thumbnail);
      setToggle(true);
    } else {
      setToggle(false);
    }
  }, [data]);

  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  const createItemsArray = (item, quantity) => {
    return new Array(quantity).fill(item);
  };

  const handleAddToCart = async (item) => {
    const items = createItemsArray(item, quantity);
    const response = await addToCart(items);
    const { code, message } = response;
    if (code === 200) {
      handleClose();
    } else {
      // console.log("handleAddToCart:Error", message);
    }
  };

  const handleViewProductClick = (e) => {
    const { href } = e.target;
    e.preventDefault();
    handleClose();
    router.push(href);
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
              <div className="absolute right-0 top-0 rounded-bl-lg z-10">
                <div onClick={handleClose} className="cursor-pointer p-1">
                  <MaterialSymbolsClose width={24} height={24} />
                </div>
              </div>
              {data && (
                <div className="flex flex-col lg:flex-row relative">
                  <div className="top-[10px] left-0 absolute z-[1]">
                    {/* <OnsaleTag categories={data.categories} /> */}
                    {
                      data?.variants && Array.isArray(data.variants) && data.variants.length > 0 && data.variants?.[0]?.price < data.variants?.[0]?.compare_at_price &&   
                      <div className="absolute bottom-[60px] left-0 rounded-r-full bg-theme-500 text-white text-[12px] font-bold py-[7px] px-[15px]">
                        ONSALE
                      </div>
                    }
                  </div>
                  <div className="w-full lg:w-[40%] p-[5px] flex flex-col gap-[10px] pb-5">
                    <div className="aspect-w-2 aspect-h-1 lg:aspect-w-1 lg:aspect-h-1 relative rounded-md overflow-hidden">
                      {image && (
                        <Image
                          src={image}
                          alt={data?.title}
                          objectFit="contain"
                          objectPosition="center"
                          fill
                        />
                      )}
                    </div>
                    <div className="flex gap-[10px]">
                      <Link
                        className="w-full border border-theme-600 text-theme-600 p-2 text-center font-semibold text-sm"
                        href={getProductUrl(data)}
                        onClick={handleViewProductClick}
                      >
                        View Item
                      </Link>

                      <button
                        onClick={() => handleAddToCart(data)}
                        className={`w-full bg-theme-600 hover:bg-theme-500 text-white p-2 font-semibold text-sm h-[38px] flex justify-center items-center ${
                          addToCartLoading
                            ? "pointer-events-none"
                            : "pointer-events-auto"
                        }`}
                        disabled={
                          addToCartLoading ||
                          !isPriceVisible(data?.product_category, data?.brand)
                        }
                      >
                        {addToCartLoading ? (
                          <Eos3DotsLoading width={52} height={52} />
                        ) : (
                          "Add to cart"
                        )}
                      </button>
                    </div>
                    <Link
                      href={`tel:(888) 575-9720`}
                      className="border text-xs p-2 flex flex-col items-center border-stone-600 hover:border-theme-600 hover:bg-theme-600 hover:text-white transition-a;; duration-300 cursor-pointer text-stone-600 font-semibold"
                    >
                      <div>Exclusive Saving Just One Call Away!</div>
                      <div>Experts Standing By (888) 575-9720</div>
                    </Link>
                  </div>
                  <div className="w-full lg:w-[60%] p-[10px]">
                    <div className="flex flex-col gap-[15px] lg:min-h-[340px] mb-5">
                      <div className="font-semibold text-base mt-[20px]">
                        {data?.title}
                      </div>
                      <div className="">
                        {/* {price_hidden_categories.some((id) =>
                          data?.categories.some((cat) => cat.id === id)
                        ) ? (
                          <div className="font-medium text-[14px] text-stone-700">
                            Contact us for pricing.
                          </div>
                        ) : data.sale_price !== 0 &&
                          data.sale_price < data.price ? (
                          <>
                            <div className="text-xs font-semibold">Price</div>
                            <div>
                              <div className="flex gap-[10px] items-center">
                                <div className="text-stone-500 line-through">
                                  {formatPrice(data.price)}
                                </div>
                                <div className="font-semibold text-base md:text-lg text-theme-600">
                                  {formatPrice(data.sale_price)}
                                </div>
                              </div>
                              <div className="text-lg font-semibold text-theme-600">
                                Save $
                                {formatPrice(data.price - data.sale_price)}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="font-semibold text-base md:text-lg text-theme-600">
                            ${formatPrice(data.price)}
                          </div>
                        )} */}

                        
                        {
                        !isPriceVisible(data?.product_category, data?.brand)
                        ? (
                          <div className="font-medium text-[14px] text-stone-700">
                            Contact us for pricing.
                          </div>
                        ) : data?.variants?.[0]?.compare_at_price &&
                        data?.variants?.[0]?.price &&
                          data?.variants?.[0]?.compare_at_price > data?.variants?.[0]?.price ? (
                          <>
                            <div className="text-xs font-semibold">Price</div>
                            <div>
                              <div className="flex gap-[10px] items-center">
                                <div className="text-stone-500 line-through">
                                  {formatPrice(data?.variants?.[0]?.compare_at_price)}
                                </div>
                                <div className="font-semibold text-base md:text-lg text-theme-600">
                                  {formatPrice(data?.variants?.[0]?.price)}
                                </div>
                              </div>
                              <div className="text-lg font-semibold text-theme-600">
                                Save $
                                {formatPrice(data?.variants?.[0]?.compare_at_price - data?.variants?.[0]?.price)}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="font-semibold text-base md:text-lg text-theme-600">
                            ${formatPrice(data?.variants?.[0]?.price)}
                          </div>
                        )}
                      </div>
                      <div className="text-sm flex items-center gap-[5px] text-stone-600">
                        <AkarIconsShippingV1 width={24} height={24} />
                        <div className="text-sm text-black">
                          Call for Open Box Availability{" "}
                          <Link
                            href={`tel:(888) 575-9720`}
                            className="font-semibold text-theme-600 hover:text-theme-500"
                          >
                            (888) 575-9720
                          </Link>
                        </div>
                      </div>
                      {data.is_free_shipping && (
                        <div className="text-sm flex items-center gap-[5px] text-green-600">
                          <MDITruckOutline width={24} height={24} />
                          <div className="text-sm font-semibold">
                            Free Shipping
                          </div>
                        </div>
                      )}
                      <div className="">
                        <div className="text-xs font-semibold">Description</div>
                        <div className="line-clamp-3 text-sm leading-relaxed">
                          {stripHtmlTags(data.body_html)}
                        </div>

                        <Link
                          className="text-[10px] text-blue-600 font-semibold"
                          href={product_link || '#'}
                          onClick={handleViewProductClick}
                        >
                          Read More
                        </Link>
                      </div>
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
