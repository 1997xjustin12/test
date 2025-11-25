"use client";
import { useState, useEffect, useMemo } from "react";
import CartListItem from "@/app/components/atom/CartListItem";
import CartOrderSummary from "@/app/components/atom/CartOrderSummary";
import YouMayAlsoLike from "@/app/components/molecule/YouMayAlsoLike";
import { BASE_URL, mapOrderItems } from "@/app/lib/helpers";
import Link from "next/link";
import { useAuth } from "@/app/context/auth";
import { useCart } from "@/app/context/cart";
import { ICRoundPhone } from "@/app/components/icons/lib";
import { STORE_CONTACT } from "@/app/lib/store_constants";

const TemporaryComponent = () => {
  const { user, userCartGet, userCartCreate, userCartClose, userCartUpdate } =
    useAuth();
  const { cartItems, cartObject, guestCartToActive } = useCart();

  const userProfileToCart = (user = {}) => {
    return {
      billing_address: user?.profile?.billing_address,
      billing_city: user?.profile?.billing_city,
      billing_country: user?.profile?.billing_country,
      billing_email: user?.email,
      billing_first_name: user?.first_name,
      billing_last_name: user?.last_name,
      billing_phone: user?.profile?.phone,
      billing_province: user?.profile?.billing_state,
      billing_zip_code: user?.profile?.billing_zip,
      shipping_address: user?.profile?.shipping_address,
      shipping_city: user?.profile?.shipping_city,
      shipping_country: user?.profile?.shipping_country,
      shipping_email: user?.email,
      shipping_first_name: user?.first_name,
      shipping_last_name: user?.last_name,
      shipping_phone: user?.profile?.phone,
      shipping_province: user?.profile?.shipping_state,
      shipping_zip_code: user?.profile?.shipping_zip,
    };
  };

  const fetchUserCart = async () => {
    const response = await userCartGet();
    // console.log("[GET][CART][REPSPONSE]", response);
  };

  const createUserCart = async () => {
    // console.log("[CREATE][CART] LOCAL CART", cartObject);
    if (!cartObject) {
      // console.log("[CART OBJECT IS NULL]");
      return;
    }
    const response = await userCartCreate({
      items: cartObject?.items,
    });
    // console.log("[CREATE][CART][REPSPONSE]", response);
  };

  const closeUserCart = async () => {
    const response = await userCartClose();
    // console.log("[CREATE][CLOSE][REPSPONSE]", response);
  };

  const updateUserCart = async () => {
    // console.log("[UPDATE][CART] LOCAL CART", cartObject);
    // console.log("[UPDATE][CART] User", user);
    if (!cartObject) {
      // console.log("[CART OBJECT IS NULL]");
      return;
    }
    const user_profile = userProfileToCart(user);
    const injected_items = (cartObject?.items || []).map((item) => ({
      ...item,
    }));
    const response = await userCartUpdate({
      items: injected_items,
      ...user_profile,
    });
    console.log("[UPDATE][CART][REPSPONSE]", response);
  };

  if (!user)
    return (
      <div className="mb-10">
        <h2>TEMPORARY COMPONENT</h2>
        <p className="text-neutral-500 text-sm">Guest Cart Triggers</p>
        <div className="mt-5 flex gap-[20px]">
          <button
            onClick={guestCartToActive}
            className="text-white text-sm font-bold bg-indigo-600 hover:bg-indigo-700 rounded-[2px] py-1 px-4"
          >
            GUEST CART TO STATUS ACTIVE
          </button>
        </div>
      </div>
    );

  return (
    <div className="mb-10">
      <h2>TEMPORARY COMPONENT</h2>
      <p className="text-neutral-500 text-sm">Cart Enpoint Triggers</p>
      <div className="mt-5 flex gap-[20px]">
        <button
          onClick={fetchUserCart}
          className="text-white text-sm font-bold bg-green-600 hover:bg-green-700 rounded-[2px] py-1 px-4"
        >
          GET
        </button>
        <button
          onClick={createUserCart}
          className="text-white text-sm font-bold bg-blue-600 hover:bg-blue-700 rounded-[2px] py-1 px-4"
        >
          CREATE
        </button>
        <button
          onClick={updateUserCart}
          className="text-white text-sm font-bold bg-orange-600 hover:bg-orange-700 rounded-[2px] py-1 px-4"
        >
          UPDATE
        </button>
        <button
          onClick={closeUserCart}
          className="text-white text-sm font-bold bg-red-600 hover:bg-red-700 rounded-[2px] py-1 px-4"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};

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
          href={`tel:${STORE_CONTACT}`}
          className="flex items-center gap-[5px] text-theme-600 text-sm font-bold"
        >
          {" "}
          <ICRoundPhone /> Call Now
        </Link>
        {/* <button className="flex items-center gap-[5px] text-theme-600 text-sm font-bold">
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
        </button> */}
      </div>
    </div>
  );
};

const NoCartItems = () => {
  return (
    <div className="h-[300px] border border-neutral-300 bg-stone-100 w-full flex items-center justify-center p-3">
      <div className="flex flex-col gap-5">
        <div className="text-theme-600 text-center flex justify-center">
          <div className="w-[80px] h-[80px] bg-white border border-neutral-300 shadow flex items-center justify-center rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="42"
              height="42"
              viewBox="0 0 32 32"
            >
              <circle cx="10" cy="28" r="2" fill="currentColor" />
              <circle cx="24" cy="28" r="2" fill="currentColor" />
              <path
                fill="currentColor"
                d="M4.98 2.804A1 1 0 0 0 4 2H0v2h3.18l3.84 19.196A1 1 0 0 0 8 24h18v-2H8.82l-.8-4H26a1 1 0 0 0 .976-.783L29.244 7h-2.047l-1.999 9H7.62Z"
              />
              <path fill="currentColor" d="M18 6V2h-2v4h-4v2h4v4h2V8h4V6z" />
            </svg>
          </div>
        </div>
        <div className="space-y-5">
          <h2 className="text-stone-800 text-center">
            Your shopping cart is empty!
          </h2>
          <p className="text-xs text-neutral-800 text-center">
            You currently do not have any items in your shopping cart.
          </p>
        </div>
        <div className="text-center">
          <Link
            prefetch={false}
            href={`${BASE_URL}/fireplaces`}
            className="border border-neutral-400 font-semibold text-theme-600 py-2 px-4 text-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

const CartOnloadLoader = () => {
  return (
    <div className="h-[300px] border border-neutral-300 bg-stone-100 w-full flex items-center justify-center p-3">
      <div className="flex flex-col gap-5">
        <div className="space-y-5">
          <h2 className="text-stone-800 text-center">Loading Cart...</h2>
          <p className="text-xs text-neutral-800 text-center">
            Please wait a bit, We are loading your cart.
          </p>
        </div>
      </div>
    </div>
  );
};

export default function CartPageComponent() {
  const [cartTotal, setCartTotal] = useState({});
  const {
    cartObject,
    cartItems,
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
    };

    if (!loading && cartItems.length > 0) {
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
          items: cartItems.map((item) => ({
            ...item,
            product_id: item?.custom_fields?.product_id,
          })),
          ...(allFilled ? shipping_details : {}),
        };
      } else {
        // console.log("[TRIGGER RECALCULATE TOTAL AS GUEST]");
        data = {
          items: mapOrderItems(cartItems),
        };
      }
      reloadCartTotal(data);
    }
  }, [loading, isLoggedIn, user, cartItems]);

  const ref_number = useMemo(() => {
    if (loading) return null;

    if (isLoggedIn) {
      return cartObject?.cart_id ? "CI-" + cartObject?.cart_id : null;
    } else {
      return cartObject?.reference_number;
    }
  }, [loading, isLoggedIn, cartObject]);

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-[20px]">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        {/* <TemporaryComponent /> */}
        {loadingCartItems ? (
          <CartOnloadLoader />
        ) : (
          <>
            {cartItems.length === 0 ? (
              <NoCartItems />
            ) : (
              <>
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
                      {ref_number && (
                        <h5 className="font-bold text-neutral-600 text-sm">
                          REF #:{" "}
                          <span className="text-theme-600">{ref_number}</span>
                        </h5>
                      )}
                    </div>
                  </div>
                  <ShoppingAssistanceSection />
                </div>
                <div className="mt-4 sm:mt-8 gap-2 lg:flex lg:items-start xl:gap-4">
                  <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                    <div className="space-y-2">
                      {cartObject &&
                      cartObject?.items &&
                      cartObject.items.length > 0 ? (
                        cartObject.items.map((item, idx) => (
                          <CartListItem
                            key={`cart-list-item-${idx}-${item?.id}`}
                            item={item}
                            onItemCountUpdate={handleItemCountUpdate}
                          />
                        ))
                      ) : (
                        <div className="min-h-[190px] font-bold text-stone-500 text-lg flex items-center justify-center">
                          <div>
                            {loadingCartItems
                              ? "Loading..."
                              : "Nothing to display"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <CartOrderSummary />
                </div>
              </>
            )}
          </>
        )}
        <div className="mt-6">
          <YouMayAlsoLike displayItems={4} />
        </div>
      </div>
    </section>
  );
}
