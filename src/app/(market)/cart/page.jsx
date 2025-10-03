"use client";
import { useState, useEffect } from "react";
import CartListItem from "@/app/components/atom/CartListItem";
import CartOrderSummary from "@/app/components/atom/CartOrderSummary";
import YouMayAlsoLike from "@/app/components/molecule/YouMayAlsoLike";
// import AuthButtons from "@/app/components/molecule/AuthButtons";
import { BASE_URL, mapOrderItems } from "@/app/lib/helpers";
import Link from "next/link";
import { useAuth } from "@/app/context/auth";
import { useCart } from "@/app/context/cart";
import { ICRoundPhone } from "@/app/components/icons/lib";

const ShoppingAssistanceSection = () => {
  return (
    <div className="sm-auto mt-3 flex-1 space-y-2 lg:mt-0 md:w-full">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white text-center">
        Shopping Assistance
      </h2>
      <p className="text-xs text-neutral-700 text-center">
        Questions? We are here to help.
      </p>

      <p className="text-xs text-neutral-700 text-center">
        Monday through Friday 6 AM to 5 PM PST
      </p>
      <div className="flex items-center gap-[10px] justify-center">
        <Link
          prefetch={false}
          href={`tel: (888) 575-9720`}
          className="flex items-center gap-[5px] text-theme-600 text-sm font-bold"
        >
          {" "}
          <ICRoundPhone /> Call Now
        </Link>
        <button className="flex items-center gap-[5px] text-theme-600 text-sm font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M2 22V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18H6zm3.15-6H20V4H4v13.125zM4 16V4z"
            />
          </svg>
          Chat Now
        </button>
      </div>
    </div>
  );
};

export default function CartPage() {
  const [cartTotal, setCartTotal] = useState({});
  const {
    cartObject,
    formattedCart,
    loadingCartItems,
    increaseProductQuantity,
    decreaseProductQuantity,
    fetchOrderTotal,
    // loadCart,
  } = useCart();

  const { loading, user, isLoggedIn } = useAuth();

  const handleItemCountUpdate = (value) => {
    const { increment, product } = value;
    if (increment) {
      increaseProductQuantity(product);
    } else {
      decreaseProductQuantity(product);
    }
  };

  useEffect(() => {
    const reloadCartTotal = async (data) => {
      const response = await fetchOrderTotal({ ...data });
      console.log("[RELOAD CART TOTAL]", response);
    };

    if (!loading && formattedCart.length > 0) {
      let data;
      if (user) {
        // console.log("[TRIGGER RECALCULATE TOTAL USING USER DATA]", user);
        const shipping_details = {
          shipping_address: user?.profile?.shipping_address ?? "",
          shipping_country: user?.profile?.shipping_country ?? "",
          shipping_city: user?.profile?.shipping_city ?? "",
          shipping_province: user?.profile?.shipping_state ?? "",
          shipping_zip_code: user?.profile?.shipping_zip ?? "",
        };
        const allFilled = Object.values(shipping_details).every(
          (v) => v !== ""
        );

        data = {
          items: mapOrderItems(formattedCart),
          ...(allFilled ? shipping_details : {}),
        };
      } else {
        // console.log("[TRIGGER RECALCULATE TOTAL AS GUEST]");
        data = {
          items: mapOrderItems(formattedCart),
        };
      }
      reloadCartTotal(data);
    }
  }, [loading, isLoggedIn, user, formattedCart]);

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-[20px]">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mt-4 sm:mt-8 md:gap-4 md:flex lg:items-start xl:gap-6">
          <div className="mx-auto w-full flex-none md:max-w-lg lg:max-w-2xl xl:max-w-4xl">
            <div>
              <Link
                href={`${BASE_URL}/fireplaces`}
                prefetch={false}
                title=""
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
              >
                {/* flowbite:arrow-left-outline */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h14M5 12l4-4m-4 4l4 4"
                  />
                </svg>
                Back To Shopping
              </Link>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mt-8">
                Shopping Cart
              </h2>
              {cartObject?.order_number && (<h5 className="font-bold text-neutral-600 text-sm">ORDER #: <span className="text-theme-600">{cartObject?.order_number}</span></h5>)}
            </div>
          </div>

          <ShoppingAssistanceSection />
        </div>
        <div className="mt-4 sm:mt-8 md:gap-4 lg:flex lg:items-start xl:gap-6">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              {formattedCart && formattedCart.length > 0 ? (
                formattedCart.map((item, idx) => (
                  <CartListItem
                    key={`cart-list-item-${idx}`}
                    item={item}
                    onItemCountUpdate={handleItemCountUpdate}
                  />
                ))
              ) : (
                <div className="min-h-[190px] font-bold text-stone-500 text-lg flex items-center justify-center">
                  <div>
                    {loadingCartItems ? "Loading..." : "Nothing to display"}
                  </div>
                </div>
              )}
            </div>
          </div>
          <CartOrderSummary />
        </div>
        <div className="mt-6">
          <YouMayAlsoLike displayItems={4} />
        </div>
      </div>
    </section>
  );
}
