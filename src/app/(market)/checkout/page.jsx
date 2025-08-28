"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import CheckoutOrderSummary from "@/app/components/atom/CheckoutOrderSummary";
import CartOrderSummary from "@/app/components/atom/CartOrderSummary";
import { BASE_URL, mapOrderItems } from "@/app/lib/helpers";

import { useCart } from "@/app/context/cart";

// import BraintreeForm from "@/app/components/template/BraintreeForm"
const BraintreeForm = dynamic(
  () => import("@/app/components/template/BraintreeForm"),
  {
    ssr: false,
  }
);

function CheckoutPage() {
  const [cartTotal, setCartTotal] = useState({});
  const { cartItems, formattedCart, fetchOrderTotal } = useCart();

  const getOrderTotal = async () => {
    const items = mapOrderItems(formattedCart);
    if(items.length > 0){
      const orderTotal = await fetchOrderTotal({ items });
      if (orderTotal?.success) {
        setCartTotal(orderTotal?.data);
      }
    }
  };

  useEffect(() => {
    if (formattedCart) {
      getOrderTotal();
    }
  }, [formattedCart]);

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          Checkout
        </h2>
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              <BraintreeForm cartTotal={cartTotal}/>
            </div>
          </div>
          <CartOrderSummary cartTotal={cartTotal} checkoutButton={false}/>
        </div>
      </div>
    </section>
  );
}

export default CheckoutPage;
