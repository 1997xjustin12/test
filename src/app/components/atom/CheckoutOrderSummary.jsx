"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/app/context/cart";
import { formatPrice } from "@/app/lib/helpers";
function CheckoutOrderSummary() {
  const { cartItems } = useCart();
  const [originalPrice, setOriginalPrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [savings, setSavings] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState(0);
  const [tax, setTax] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    if (cartItems.length === 0) {
      setOriginalPrice(0);
    } else {
      setCartTotal((prev) => {
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
        return _salePrice + deliveryOption + _tax;
      });
    }
  }, [cartItems]);

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
          {/* <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            {" "}
            or{" "}
          </span> */}
          <a
            href="#"
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
          </a>
        </div>
      </div>
      {/* Voucher or giftcard seciton */}
      {/* <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
        <form className="space-y-4">
          <div>
            <label
              htmlFor="voucher"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              {" "}
              Do you have a voucher or gift card?{" "}
            </label>
            <input
              type="text"
              id="voucher"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              placeholder=""
              required
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Apply Code
          </button>
        </form>
      </div> */}
    </div>
  );
}

export default CheckoutOrderSummary;
