"use client";
import { useState, useEffect } from "react";
import CartListItem from "@/app/components/atom/CartListItem";
import CartOrderSummary from "@/app/components/atom/CartOrderSummary";
import YouMayAlsoLike from "@/app/components/molecule/YouMayAlsoLike"

import { useCart } from "@/app/context/cart";
export default function CartPage() {
  const { cartItems, loadingCartItems, clearCartItems, addToCart, updateCart } = useCart();
  const [formattedCartItems, setFormattedCartItems] = useState([]);

  useEffect(() => {
    setFormattedCartItems((prev)=>{
      if (cartItems.length === 0) {
        return [];
      }
  
      return Object.values(
        cartItems.reduce((acc, item) => {
          if (!acc[item.id]) {
            acc[item.id] = { ...item, count: 0 };
          }
          acc[item.id].count += 1;
          return acc;
        }, {})
      );
    });
  }, [cartItems]);

  const handleItemCountUpdate=(value)=>{
    const {increment, product} = value;
    if(increment){
      addToCart([product])
    }else{
      const tmpCartItems = cartItems;
      const idToFindAndPop = product.id;
      if(tmpCartItems.filter(i=> i.id === idToFindAndPop).length > 1){
        const indexToRemove = tmpCartItems.findIndex(item => item.id === idToFindAndPop);

        if (indexToRemove !== -1) {
            // Use pop() to remove the item at that index
            tmpCartItems.splice(indexToRemove, 1);  // Removes 1 element at the found index
        }
        // update cart only if > 1
        updateCart(tmpCartItems);
      }

    }
  }

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
          Shopping Cart
        </h2>

        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              {cartItems &&  cartItems.length > 0  && formattedCartItems ? (
                formattedCartItems.map((item, idx) => (
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
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <YouMayAlsoLike displayItems={4}/>
        </div>
      </div>
    </section>
  );
}
