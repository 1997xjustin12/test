"use client";
import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eos3DotsLoading } from "../icons/lib";
import YmalCarousel from "@/app/components/atom/YmalCarousel";
import ProductCartToCart from "@/app/components/atom/ProductCardToCart"
import { BASE_URL, createSlug, formatPrice, parseRatingCount } from "@/app/lib/helpers";
const cartPageUrl = `${BASE_URL}/cart`;
import { useCart } from "@/app/context/cart";
import { Rating } from "@smastrom/react-rating";

export async function getCollectionProducts(id) {
  const res = await fetch(
    `${BASE_URL}/api/collections/collection-products/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch collection products");
  }

  return res.json();
}


const YouMightAlsoLike = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const ymal_products = await getCollectionProducts(1);
        setProducts(ymal_products);
      } catch (error) {
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const items_per_break_point = [
    { minWidth: 0, value: 1 },
    { minWidth: 640, value: 2 },
    { minWidth: 768, value: 3 },
    { minWidth: 1280, value: 4 },
  ];

  return (
    <div>
      <h3>You Might Also Like</h3>
      <div className="min-h-[366px]">
        {products && Array.isArray(products) && products.length > 0 && (
          <YmalCarousel breakpoints={items_per_break_point}>
            {products.map((item, index) => (
              <div
                key={`ymal-product-${index}`}
                className="min-w-[170px] flex flex-col p-3"
              >
                    <ProductCartToCart
                    item={item}
                    />
              </div>
            ))}
          </YmalCarousel>
        )}
      </div>
    </div>
  );
};

const GrillProtectionSection = () => {
  return (
    <div className="w-full flex bg-slate-50 border border-slate-200">
      <div className="w-[calc(100%-240px)] p-4">
        <h4 className="font-bold text-sm">Grill Protection Plan</h4>
        <div className="flex mt-4">
          <div className="">
            <div className="bg-neutral-200 w-[140px] aspect-1 flex relative items-center justify-center">
              IMG
            </div>
          </div>
          <div className="w-full pl-4 flex flex-col gap-[25px]">
            <ul className="list-disc list-inside marker:text-theme-500 text-sm font-medium">
              <li className="mb-2">Hassle-free repairs</li>
              <li className="mb-2">Mechanical and electrical failures</li>
              <li>Failures caused by power surges</li>
            </ul>
            <div className="text-sm">
              <Link
                href="#"
                prefetch={false}
                className="flex gap-[8px] underline"
              >
                <div>See Plan Details</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M14 3v2h3.59l-9.83 9.83l1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2z"
                  />
                </svg>
              </Link>
            </div>
            <div className="text-sm flex gap-[20px] items-center">
              <div className="flex gap-[12px] items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M5.005 9.003a1 1 0 0 1 1 1a6.97 6.97 0 0 1 4.33 1.5h2.17c1.332 0 2.529.579 3.353 1.498l3.147.002a5 5 0 0 1 4.516 2.851c-2.365 3.12-6.194 5.149-10.516 5.149c-2.79 0-5.15-.604-7.061-1.658a1 1 0 0 1-.94.658h-3a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm1 3v5.02l.045.034c1.794 1.26 4.133 1.946 6.955 1.946c3.004 0 5.798-1.156 7.835-3.13l.133-.133l-.12-.1a3 3 0 0 0-1.643-.63l-.205-.007l-2.112-.001q.11.484.112 1v1h-9v-2h6.79l-.034-.079a2.5 2.5 0 0 0-2.092-1.415l-.164-.005h-2.93a5 5 0 0 0-3.57-1.5m-2-1h-1v7h1zm9.646-7.425l.354.354l.353-.354a2.5 2.5 0 0 1 3.536 3.536l-3.89 3.889l-3.888-3.89a2.5 2.5 0 1 1 3.535-3.535M11.53 4.992a.5.5 0 0 0-.059.637l.058.07l2.475 2.475l2.476-2.475a.5.5 0 0 0 .058-.637l-.058-.07a.5.5 0 0 0-.638-.057l-.07.057l-1.769 1.77l-1.767-1.77l-.068-.058a.5.5 0 0 0-.638.058"
                  />
                </svg>
                <div>Simple claims process</div>
              </div>
              <div className="flex gap-[12px] items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M10.081 4.089c.53.366 1.037.607 1.454.66a5 5 0 0 0-.47 1.44c-.672-.149-1.311-.504-1.836-.866a10 10 0 0 1-.729-.557V7a.75.75 0 0 1-.47.695l-.006.003a3 3 0 0 0-.166.074c-.117.055-.287.14-.486.254A6.5 6.5 0 0 0 6.03 9.03c-.453.453-.733 1.063-.89 1.536c-.203.606-.719 1.165-1.453 1.288a.224.224 0 0 0-.187.22v1.754c0 .165.12.306.283.333c.624.104 1.115.512 1.392 1.006a8.4 8.4 0 0 0 1.355 1.802a5 5 0 0 0 1.585 1.039a5 5 0 0 0 .774.254l.005.002A.75.75 0 0 1 9.5 19v1.25c0 .138.112.25.25.25H11a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 1.5 1.5h1.25a.25.25 0 0 0 .25-.25V18c0-.283.16-.542.412-.67l.013-.007l.07-.04c.065-.039.164-.1.285-.188c.242-.176.571-.449.9-.833c.653-.761 1.32-1.968 1.32-3.762c0-1.007-.188-1.82-.509-2.488a5 5 0 0 0 .798-1.576q.15.204.282.423c.604.999.929 2.204.929 3.64c0 2.207-.833 3.75-1.68 4.739A6.7 6.7 0 0 1 19 18.42v1.829A1.75 1.75 0 0 1 17.25 22H16a1.5 1.5 0 0 1-1.5-1.5h-2A1.5 1.5 0 0 1 11 22H9.75A1.75 1.75 0 0 1 8 20.25v-.683a7 7 0 0 1-.464-.175A6.5 6.5 0 0 1 5.47 18.03a10 10 0 0 1-1.605-2.131a.49.49 0 0 0-.329-.258A1.84 1.84 0 0 1 2 13.828v-1.753c0-.843.61-1.562 1.44-1.7c.087-.015.216-.102.277-.284c.192-.577.565-1.434 1.253-2.122a8 8 0 0 1 1.658-1.246q.206-.117.372-.2V3.67c0-.938 1.13-1.323 1.74-.716c.33.329.81.767 1.341 1.134m2.989 4.759c-.49-.203-.904-.589-1.002-1.11a4.002 4.002 0 0 1 7.627-2.27a4 4 0 0 1-1.436 4.834c-.438.299-1.003.279-1.493.076zm4.394.18a2.502 2.502 0 0 0-2.42-4.338a2.5 2.5 0 0 0-1.513 2.708l.021.016a.5.5 0 0 0 .092.048l3.696 1.53a.5.5 0 0 0 .124.035M9 10a1 1 0 1 1-2 0a1 1 0 0 1 2 0"
                  />
                </svg>
                <div>No deductibles</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[240px] p-4 flex flex-col items-center justify-evenly">
        <button className="border px-5 py-2 w-full rounded text-theme-800 font-bold text-sm bg-white border-theme-800">
          5 Year - $159.99
        </button>
        <button className="border px-5 py-2 w-full rounded text-theme-800 font-bold text-sm bg-white border-theme-800">
          3 Year - $99.99
        </button>
        <button className="border px-5 py-2 w-full rounded text-theme-800 font-bold text-sm bg-white border-theme-800">
          2 Year - $79.99
        </button>
      </div>
    </div>
  );
};

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
        addedToCartItems?.images?.find(({ position }) => position === 1)?.src ??
        null;
      setImage(thumbnail);
      setToggle(true);
    } else {
      setToggle(false);
      // setToggle(true);
    }
  }, [addedToCartItems]);

  const handleClose = () => {
    setToggle(false);
    onClose();
  };

  const handleGoToCartClick = (e) => {
    e.preventDefault();
    handleClose();
    window.location.href = cartPageUrl;
    // router.push(cartPageUrl);
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
              <div className="flex bg-white border-y border-neutral-300 shadow-inner px-[15px] py-[15px] gap-[10px]">
                <div className="w-[100px] h-[100px] relative rounded-md overflow-hidden">
                  {image && (
                    <Image
                      src={image}
                      alt={addedToCartItems?.title}
                      className="w-full h-full"
                      objectFit="contain"
                      fill
                    />
                  )}
                </div>
                <div
                  className={`w-[calc(100%-100px)] text-stone-700 flex gap-[10px] ${
                    data ? "flex-col" : "justify-center items-center h-[100px]"
                  }`}
                >
                  {data ? (
                    <>
                      <div className="font-bold">{addedToCartItems?.title}</div>
                      <div className="flex gap-[20px] items-center">
                        <div className="font-extrabold text-theme-600 text-right">{`$${formatPrice(
                          addedToCartItems?.count *
                            addedToCartItems?.variants?.[0]?.price
                        )}`}</div>
                        <div className="font-medium text-neutral-700">{`($${formatPrice(
                          addedToCartItems?.variants?.[0]?.price
                        )}x${addedToCartItems?.count})`}</div>
                      </div>
                      <div className="flex justify-between items-center gap-[10px]">
                        <Link
                          onClick={handleGoToCartClick}
                          href={cartPageUrl}
                          className="border border-theme-600 py-2 px-4 text-white bg-theme-600 hover:bg-theme-500 font-medium w-full text-center"
                        >
                          Go to Cart
                        </Link>
                        <button
                          onClick={handleClose}
                          className="border border-theme-700 text-theme-700 py-2 px-4 hover:bg-theme-50 bg-white font-medium w-full"
                        >
                          Continue Shopping
                        </button>
                      </div>
                    </>
                  ) : (
                    <Eos3DotsLoading />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <GrillProtectionSection />
              </div>
              <div className="flex flex-col p-3">
                <YouMightAlsoLike />
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default AddedToCartDialog;
