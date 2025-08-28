"use client";
import { useState, useEffect } from "react";
import CartListItem from "@/app/components/atom/CartListItem";
import CartOrderSummary from "@/app/components/atom/CartOrderSummary";
import YouMayAlsoLike from "@/app/components/molecule/YouMayAlsoLike";
import { BASE_URL, mapOrderItems } from "@/app/lib/helpers";
import { useCart } from "@/app/context/cart";
export default function CartPage() {
  const [cartTotal, setCartTotal] = useState({});
  const {
    formattedCart,
    loadingCartItems,
    increaseProductQuantity,
    decreaseProductQuantity,
    fetchOrderTotal,
  } = useCart();

  const handleItemCountUpdate = (value) => {
    const { increment, product } = value;
    if (increment) {
      increaseProductQuantity(product);
    } else {
      decreaseProductQuantity(product);
    }
  };

  const getOrderTotal = async () => {
    const items = mapOrderItems(formattedCart);
    if (items.length > 0) {
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
          Shopping Cart
        </h2>

        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
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
          <CartOrderSummary cartTotal={cartTotal} />
        </div>
        <div className="mt-6">
          <YouMayAlsoLike displayItems={4} />
        </div>
      </div>
    </section>
  );
}
