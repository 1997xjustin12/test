"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, stripHtmlTags } from "@/app/lib/helpers";
import { useRouter } from "next/navigation";
import { AkarIconsShippingV1, Eos3DotsLoading } from "@/app/components/icons/lib";
import { useCart } from "@/app/context/cart";
import { useSolanaCategories } from "@/app/context/category";
import { STORE_CONTACT } from "@/app/lib/store_constants";

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const ExternalIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.36 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg className="w-3 h-3" fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

function ProductQuickView({ data, onClose }) {
  const router = useRouter();
  const { isPriceVisible, getProductUrl } = useSolanaCategories();
  const { addToCart, addToCartLoading } = useCart();
  const [toggle, setToggle] = useState(false);
  const [image, setImage] = useState(null);
  const [productUrl, setProductUrl] = useState("#");

  const handleClose = () => {
    setToggle(false);
    onClose();
  };

  useEffect(() => {
    if (data) {
      setImage(data?.images?.find(({ position }) => position === 1)?.src ?? null);
      setProductUrl(getProductUrl(data));
      setToggle(true);
    } else {
      setToggle(false);
    }
  }, [data]);

  const handleAddToCart = async (item) => {
    const response = await addToCart({ ...item, quantity: 1 });
    if (response?.code === 200) handleClose();
  };

  const handleViewProductClick = (e) => {
    e.preventDefault();
    handleClose();
    router.push(e.currentTarget.href);
  };

  const price = data?.variants?.[0]?.price;
  const compareAt = data?.variants?.[0]?.compare_at_price;
  const onSale = compareAt && price && compareAt > price;

  return (
    <Dialog open={toggle} onClose={handleClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-[350ms] data-[leave]:duration-200 data-[enter]:ease-[cubic-bezier(0.16,1,0.3,1)] data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-[100] w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center sm:items-center sm:p-4">
          <DialogPanel
            transition
            className="relative w-full max-w-[800px] bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden max-h-svh transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-[400ms] data-[leave]:duration-200 data-[enter]:ease-[cubic-bezier(0.16,1,0.3,1)] data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 w-7 h-7 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <XIcon />
            </button>

            {data && (
              <div className="flex flex-col lg:flex-row overflow-y-auto">
                {/* Left — image + CTAs */}
                <div className="w-full lg:w-[40%] p-4 flex flex-col gap-3">
                  {/* Sale tag */}
                  {onSale && (
                    <span className="self-start text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-green-600 text-white uppercase tracking-wide">
                      On Sale
                    </span>
                  )}

                  {/* Image */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-white/5">
                    {image && <Image src={image} alt={data?.title || "Product"} fill className="object-contain p-3" />}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={productUrl}
                      onClick={handleViewProductClick}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border border-theme-600 text-theme-600 hover:bg-theme-50 dark:hover:bg-orange-900/15 transition-colors"
                    >
                      <ExternalIcon />
                      View Item
                    </Link>
                    <button
                      onClick={() => handleAddToCart(data)}
                      disabled={addToCartLoading || !isPriceVisible(data?.product_category, data?.brand)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-theme-600 hover:bg-theme-700 text-white transition-colors disabled:opacity-60"
                    >
                      {addToCartLoading ? <Eos3DotsLoading /> : "Add to Cart"}
                    </button>
                  </div>

                  {/* Phone callout */}
                  <div className="flex items-center gap-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5">
                    <PhoneIcon />
                    <div>
                      <p className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                        Exclusive Savings Just One Call Away!
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                        Experts Standing By{" "}
                        <Link href={`tel:${STORE_CONTACT}`} className="text-theme-600 font-medium hover:underline">
                          {STORE_CONTACT}
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right — product info */}
                <div className="w-full lg:w-[60%] p-4 lg:pt-10 flex flex-col gap-3 overflow-y-auto">
                  <p className="text-[9px] tracking-widest uppercase text-gray-400 dark:text-gray-500">
                    {data?.brand}
                  </p>

                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
                    {data?.title}
                  </h2>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <StarIcon key={n} filled={n <= parseInt(data?.ratings?.rating_count?.replace("'", ""), 10)} />
                    ))}
                  </div>

                  {/* Price */}
                  <div>
                    {!isPriceVisible(data?.product_category, data?.brand) ? (
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact us for pricing.</p>
                    ) : (
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-[22px] font-bold text-orange-500 dark:text-orange-400 leading-none">
                          ${formatPrice(price)}
                        </span>
                        {onSale && (
                          <>
                            <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                              ${formatPrice(compareAt)}
                            </span>
                            <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/30 rounded px-1.5 py-0.5">
                              Save ${formatPrice(compareAt - price)}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Open box callout */}
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                    <AkarIconsShippingV1 width={16} height={16} />
                    <span>Call for Open Box Availability &nbsp;</span>
                    <Link href={`tel:${STORE_CONTACT}`} className="text-theme-500 font-medium hover:underline">
                      {STORE_CONTACT}
                    </Link>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Description
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-4">
                      {stripHtmlTags(data.body_html)}
                    </p>
                    <Link
                      href={productUrl}
                      onClick={handleViewProductClick}
                      className="text-[11px] text-orange-500 font-medium mt-1 inline-block hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export default ProductQuickView;
