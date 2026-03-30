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
import { STORE_CONTACT } from "@/app/lib/store_constants";

const XIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const ExternalIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    className="w-3.5 h-3.5 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.36 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);


const StarIcon = ({ filled }) => (
  <svg className="w-3 h-3" fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

function ProductQuickView({ data, product_link, onClose }) {
  const router = useRouter();
  const { isPriceVisible, getProductUrl } = useSolanaCategories();
  const { addToCart, addToCartLoading } = useCart();
  const [toggle, setToggle] = useState(false);
  const [image, setImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [productUrl, setProductUrl] = useState("#");

  const handleClose = () => {
    setToggle(false);
    onClose();
  };

  useEffect(() => {
    if (data) {
      console.log("data");
      
      const thumbnail =
        data?.images?.find(({ position }) => position === 1)?.src ?? null;

      setImage(thumbnail);
      setProductUrl(getProductUrl(data));
      setToggle(true);
    } else {
      setToggle(false);
    }
  }, [data]);

  const handleAddToCart = async (item) => {
    // console.log("[TEST] QV handleAddToCart item", item)
    const response = await addToCart({ ...item, quantity: quantity });
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

      <div className="fixed inset-0 z-100 w-screen overflow-y-auto">
        <div className="w-screen h-screen relative">
          <div className="absolute inset-0  flex items-end justify-center md:p-4 text-center sm:items-center sm:p-[10px]">
            <DialogPanel
              transition
              className="relative transform text-left  transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[800px] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 overflow-y-auto bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-[640px] overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl max-h-svh"
            >
              <div className="absolute right-[15px] top-[15px] rounded-bl-lg z-10">
                {/* <div onClick={handleClose} className="cursor-pointer p-1">
                  <MaterialSymbolsClose width={24} height={24} />
                </div>
                 */}
                <button
                  onClick={handleClose}
                  className="w-7 h-7 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <XIcon />
                </button>
              </div>
              {data && (
                <div className="flex flex-col lg:flex-row relative">
                  <div className="top-[10px] left-0 absolute z-[1]">
                    {/* <OnsaleTag categories={data.categories} /> */}
                    {data?.variants &&
                      Array.isArray(data.variants) &&
                      data.variants.length > 0 &&
                      data.variants?.[0]?.price <
                        data.variants?.[0]?.compare_at_price && (
                        <div className="absolute bottom-[60px] left-0 rounded-r-full bg-theme-500 text-white text-[12px] font-bold py-[7px] px-[15px]">
                          ONSALE
                        </div>
                      )}
                  </div>
                  <div className="w-full lg:w-[40%] p-[5px] flex flex-col gap-[10px] pb-1.5">
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
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-medium border border-theme-600 text-theme-600 hover:bg-theme-50 dark:hover:bg-orange-900/15 transition-colors no-underline"
                        href={productUrl}
                        onClick={handleViewProductClick}
                      >
                        <ExternalIcon />
                        View Item
                      </Link>

                      <button
                        onClick={() => handleAddToCart(data)}
                        className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-medium border border-theme-600 text-white bg-theme-600 hover:bg-theme-500 hover;border-theme-500 dark:hover:bg-orange-900/15 transition-colors no-underline ${
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
                    <div className="flex items-center gap-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5">
                      <PhoneIcon />
                      <div>
                        <p className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                          Exclusive Saving Just One Call Away!
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                          Experts Standing By{" "}
                          <Link
                            href={`tel:${STORE_CONTACT}`}
                            className="text-theme-600 font-medium hover:underline"
                          >
                            (888) 575-9720
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-[60%] p-[10px] pr-[20px]">
                    <div className="flex flex-col gap-3 lg:min-h-[340px] mb-5 lg:mt-[30px]">
                      {/* <div className="font-semibold text-base mt-[20px]">
                        {data?.title}
                      </div>
                      <div className="">
                        {!isPriceVisible(
                          data?.product_category,
                          data?.brand,
                        ) ? (
                          <div className="font-medium text-[14px] text-stone-700">
                            Contact us for pricing.
                          </div>
                        ) : data?.variants?.[0]?.compare_at_price &&
                          data?.variants?.[0]?.price &&
                          data?.variants?.[0]?.compare_at_price >
                            data?.variants?.[0]?.price ? (
                          <>
                            <div className="text-xs font-semibold">Price</div>
                            <div>
                              <div className="flex gap-[10px] items-center">
                                <div className="font-semibold text-base md:text-lg text-theme-600">
                                  {"$" +
                                    formatPrice(data?.variants?.[0]?.price)}
                                </div>
                                <small className="text-stone-500 line-through">
                                  {"$" +
                                    formatPrice(
                                      data?.variants?.[0]?.compare_at_price,
                                    )}
                                </small>
                              </div>
                              <div className="text-theme-600 font-medium">
                                Save $
                                {formatPrice(
                                  data?.variants?.[0]?.compare_at_price -
                                    data?.variants?.[0]?.price,
                                )}
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
                            href={`tel:${STORE_CONTACT}`}
                            className="font-semibold text-theme-600 hover:text-theme-500"
                          >
                            {STORE_CONTACT}
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
                          href={product_link || "#"}
                          onClick={handleViewProductClick}
                        >
                          Read More
                        </Link>
                      </div> */}
                      {/* Brand */}
                      <p className="text-[9px] tracking-widest uppercase text-gray-400 dark:text-gray-500 -mb-1">
                        {data?.brand}
                      </p>

                      {/* Title */}
                      <h2 className="text-[14px] font-semibold text-gray-900 dark:text-gray-50 leading-snug">
                        {data?.title}
                      </h2>

                      {/* Stars */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <StarIcon key={n} filled={n <= parseInt(data?.ratings?.rating_count?.replace("'",""), 10)} />
                          ))}
                        </div>
                        {/* <span className="text-[11px] text-gray-400 dark:text-gray-500">
                          (18 reviews)
                        </span> */}
                      </div>
                      
                      <div className="">
                        {!isPriceVisible(
                          data?.product_category,
                          data?.brand,
                        ) ? (
                          <div className="font-medium text-[14px] text-stone-700">
                            Contact us for pricing.
                          </div>
                        ) : data?.variants?.[0]?.compare_at_price &&
                          data?.variants?.[0]?.price &&
                          data?.variants?.[0]?.compare_at_price >
                            data?.variants?.[0]?.price ? (
                          <>
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-[22px] font-semibold text-[#E85D26] tracking-tight leading-none">
                                ${formatPrice(data?.variants?.[0]?.price)}
                              </span>
                              {
                               !!(data?.variants?.[0]?.compare_at_price) && <>
                              <span className="text-[12px] text-gray-400 dark:text-gray-500 line-through">
                                ${formatPrice(data?.variants?.[0]?.compare_at_price)}
                              </span>
                              <span className="text-[9px] font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/30 rounded px-1.5 py-0.5">
                                Save ${formatPrice(data?.variants?.[0]?.compare_at_price - data?.variants?.[0]?.price)}
                              </span>
                                </>
                              }
                            </div>
                          </>
                        ) : (
                          <div className="font-semibold text-base md:text-lg text-theme-600">
                            ${formatPrice(data?.variants?.[0]?.price)}
                          </div>
                        )}
                      </div>

                      {/* Open box callout */}
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                        <AkarIconsShippingV1 width={20} height={20} />
                        <span>Call for Open Box Availability</span>
                        <Link
                          href={`tel:${STORE_CONTACT}`}
                          className="text-theme-500 font-medium hover:underline"
                        >
                          {STORE_CONTACT}
                        </Link>
                      </div>

                      {/* Description */}
                      <div>
                        <p className="text-[11px] font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </p>
                        <p className={`text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3`}>
                          {stripHtmlTags(data.body_html)}
                        </p>
                        <Link
                          href={productUrl}
                          className="text-[11px] text-[#E85D26] font-medium mt-0.5 bg-transparent border-none cursor-pointer p-0 hover:underline"
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
