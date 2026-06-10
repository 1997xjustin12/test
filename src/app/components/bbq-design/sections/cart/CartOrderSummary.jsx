"use client";
import { useMemo } from "react";
import { useCart } from "@/app/context/cart";
import { formatPrice, formatProduct, BASE_URL } from "@/app/lib/helpers";
import { pixelInitiateCheckout } from "@/app/lib/pixel";
import Link from "next/link";
import AuthButtons from "@/app/components/molecule/AuthButtons";
import { useAuth } from "@/app/context/auth";

const SavingsBanner = ({ savings, shipping_cost }) => (
  <div className="flex items-center gap-2.5 px-4 py-3 bg-bbq-green/10 dark:bg-bbq-green/5 border border-bbq-green/30 dark:border-bbq-green/20 rounded-sm">
    <svg className="w-4 h-4 text-bbq-green flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p className="text-xs font-medium text-bbq-green">
      You're saving{" "}
      <span className="font-bold">${formatPrice(savings)}</span>
      {shipping_cost === 0 && (
        <> + <span className="font-bold">FREE</span> shipping</>
      )}
    </p>
  </div>
);

function CartOrderSummary({ checkoutButton = true }) {
  const { loading, user } = useAuth();
  const { cartObject, cartItems } = useCart();

  const order_summary = useMemo(() => {
    const items = (cartObject?.items || []).map(i => formatProduct(i, "cart_item"));
    const origPriceSum = items.reduce((t, i) => t + (i?.was || i?.price || 0) * (i.quantity || 0), 0);
    const salePriceSum = items.reduce((t, i) => t + (i?.price || 0) * (i.quantity || 0), 0);
    const shipAmt = cartObject?.total_shipping
      ? `$${formatPrice(cartObject.total_shipping)}`
      : cartItems.length > 0
      ? "FREE"
      : "$0.00";
    return {
      origPriceSum,
      salePriceSum,
      saveAmtSum: origPriceSum - salePriceSum,
      shipAmt,
    };
  }, [cartObject, cartItems.length]);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("You don't have items in your cart yet.");
      return;
    }
    pixelInitiateCheckout({ value: order_summary.salePriceSum, numItems: cartItems.length });
    window.location.href = `${BASE_URL}/checkout`;
  };

  const shippingIsFree = cartObject && !cartObject?.total_shipping && cartItems.length > 0;

  return (
    <div className="flex flex-col gap-3">
      {order_summary?.saveAmtSum > 0 && (
        <SavingsBanner savings={order_summary.saveAmtSum} shipping_cost={cartObject?.total_shipping} />
      )}

      <div className="bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm p-5">
        <h2 className="font-oswald text-sm font-semibold uppercase tracking-wide text-char dark:text-ash mb-4">
          Order Summary
        </h2>

        <div className="flex flex-col gap-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-char/50 dark:text-ash/40">Original price</span>
            <span className="text-xs font-semibold text-char dark:text-ash">
              ${formatPrice(order_summary?.origPriceSum)}
            </span>
          </div>

          {order_summary?.saveAmtSum > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-char/50 dark:text-ash/40">Savings</span>
              <span className="text-xs font-semibold text-bbq-green">
                −${formatPrice(order_summary.saveAmtSum)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-xs text-char/50 dark:text-ash/40">Shipping</span>
            <span
              className={`text-xs font-semibold ${
                shippingIsFree ? "text-bbq-green" : "text-char dark:text-ash"
              }`}
            >
              {order_summary?.shipAmt}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-char/50 dark:text-ash/40">Tax</span>
            <span className="text-xs text-char/30 dark:text-ash/30 italic">
              Calculated at checkout
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-grate dark:border-white/10 mb-5">
          <span className="font-oswald text-sm font-semibold uppercase tracking-wide text-char dark:text-ash">
            Total
          </span>
          <span className="font-oswald text-sm font-bold text-char dark:text-ash">
            ${formatPrice(cartObject?.total_price || 0)}
          </span>
        </div>

        {checkoutButton && (
          <>
            <button
              onClick={handleCheckout}
              className="w-full py-2.5 bg-theme-600 hover:bg-theme-700 text-white font-oswald font-semibold text-sm uppercase tracking-wide rounded-sm transition-colors mb-3"
            >
              Proceed to Checkout
            </button>
            <Link
              href={`${BASE_URL}/fireplaces`}
              prefetch={false}
              className="flex items-center justify-center font-oswald text-xs uppercase tracking-wide text-char/40 dark:text-ash/30 hover:text-theme-600 dark:hover:text-theme-500 transition-colors"
            >
              or continue shopping
            </Link>
          </>
        )}
      </div>

      {loading ? (
        <div className="h-10 bg-grate/60 dark:bg-white/5 rounded-sm animate-pulse" />
      ) : (
        !user && (
          <div className="w-full flex items-center justify-center">
            <AuthButtons uiVersion={2} />
          </div>
        )
      )}
    </div>
  );
}

export default CartOrderSummary;
