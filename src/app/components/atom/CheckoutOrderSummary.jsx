"use client";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "@/app/context/cart";
import { formatPrice } from "@/app/lib/helpers";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;


function CheckoutOrderSummary() {
  const { cartItems } = useCart();
  const [originalPrice, setOriginalPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [savings, setSavings] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState(0);
  const [tax, setTax] = useState(0);
  
  const cartTotal = useMemo(()=>{
    if(cartItems.length > 0){
      const _originalPrice = getSum(cartItems, "price");
      const _salePrice = getSum(cartItems, "sale_price");
      const _savings = _originalPrice - _salePrice;
      const _deliveryOption = 0;
      const _tax = 0;
      setOriginalPrice(_originalPrice);
      setSalePrice(_salePrice);
      setSavings(_savings);
      setDeliveryOption(_deliveryOption);
      setTax(_tax);
      return _salePrice + _deliveryOption + _tax;
    }else{
      return 0;
    }
  },[cartItems])

  function getSum(array, prop) {
    return array.reduce((sum, item) => sum + item?.[prop], 0);
  }
  return (
    <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
      <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <p className="text-xl font-semibold text-gray-900 dark:text-white">
          Order summary
        </p>

        <div className="space-y-4">
          <div>
            Items Display here
          </div>
          <div className="space-y-2">
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                Original price
              </dt>
              <dd className="text-base font-medium text-gray-900 dark:text-white">
                ${formatPrice(originalPrice)}
              </dd>
            </dl>

            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                Savings
              </dt>
              <dd className="text-base font-medium text-green-600">
                -${formatPrice(savings)}
              </dd>
            </dl>

            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                Store Pickup
              </dt>
              <dd className="text-base font-medium text-gray-900 dark:text-white">
                ${formatPrice(deliveryOption)}
              </dd>
            </dl>

            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-500 dark:text-gray-400">
                Tax
              </dt>
              <dd className="text-base font-medium text-gray-900 dark:text-white">
                ${formatPrice(tax)}
              </dd>
            </dl>
          </div>

          <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
            <dt className="text-base font-bold text-gray-900 dark:text-white">
              Total
            </dt>
            <dd className="text-base font-bold text-gray-900 dark:text-white">
              ${formatPrice(cartTotal)}
            </dd>
          </dl>
        </div>

        <div className="flex items-center justify-center gap-2 mt-5">
          <Link
            href={`${BASE_URL}/fireplaces`}
            prefetch={false}
            title=""
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline dark:text-primary-500"
          >
            Continue Shopping
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 12H5m14 0-4 4m4-4-4-4"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckoutOrderSummary;
