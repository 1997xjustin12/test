"use client";
import { useMemo } from "react";
import { useCart } from "@/app/context/cart";
import { formatPrice, formatProduct, BASE_URL } from "@/app/lib/helpers";
import { pixelInitiateCheckout } from "@/app/lib/pixel";
import Link from "next/link";
import AuthButtons from "@/app/components/molecule/AuthButtons";
import { useAuth } from "@/app/context/auth";

// Phone is a first-class OKO brand element — always this exact literal (§10).
const OKO_PHONE = "888-667-4986";

// Sage-bordered savings alert (§ alerts: success uses a 4px sage left border).
const SavingsBanner = ({ savings, shipping_cost }) => (
  <div className="flex items-center gap-2.5 px-4 py-3 bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark border-l-4 border-l-oko-sage dark:border-l-oko-sage-light rounded-[2px]">
    <svg className="w-4 h-4 text-oko-sage dark:text-oko-sage-light flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p className="font-inter text-[13.5px] text-oko-char-soft dark:text-oko-ondark">
      You&apos;re saving{" "}
      <span className="font-semibold text-oko-sage dark:text-oko-sage-light">${formatPrice(savings)}</span>
      {shipping_cost === 0 && (
        <> plus <span className="font-semibold text-oko-sage dark:text-oko-sage-light">free</span> shipping</>
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
      ? "Free"
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

  const rowLabel = "font-inter text-[13.5px] text-oko-char-soft dark:text-oko-ondark";
  const rowValue = "font-inter text-[14px] font-semibold text-oko-char dark:text-oko-cream";

  return (
    <div className="flex flex-col gap-3">
      {order_summary?.saveAmtSum > 0 && (
        <SavingsBanner savings={order_summary.saveAmtSum} shipping_cost={cartObject?.total_shipping} />
      )}

      <div className="bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] p-5">
        <h2 className="font-oko-display font-semibold text-[19px] leading-[1.2] text-oko-char dark:text-oko-cream mb-4">
          Order summary
        </h2>

        <div className="flex flex-col">
          <div className="flex justify-between items-center py-2.5 border-t border-oko-stone-line dark:border-oko-line-dark">
            <span className={rowLabel}>Original price</span>
            <span className={rowValue}>${formatPrice(order_summary?.origPriceSum)}</span>
          </div>

          {order_summary?.saveAmtSum > 0 && (
            <div className="flex justify-between items-center py-2.5 border-t border-oko-stone-line dark:border-oko-line-dark">
              <span className={rowLabel}>Savings</span>
              <span className="font-inter text-[14px] font-semibold text-oko-sage dark:text-oko-sage-light">
                −${formatPrice(order_summary.saveAmtSum)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-2.5 border-t border-oko-stone-line dark:border-oko-line-dark">
            <span className={rowLabel}>Shipping</span>
            <span
              className={
                shippingIsFree
                  ? "font-inter text-[14px] font-semibold text-oko-sage dark:text-oko-sage-light"
                  : rowValue
              }
            >
              {order_summary?.shipAmt}
            </span>
          </div>

          <div className="flex justify-between items-center py-2.5 border-t border-oko-stone-line dark:border-oko-line-dark">
            <span className={rowLabel}>Tax</span>
            <span className="font-inter text-[13px] text-oko-stone">Calculated at checkout</span>
          </div>

          <div className="flex justify-between items-baseline pt-3.5 border-t border-oko-stone-line dark:border-oko-line-dark">
            <span className="font-inter text-[14px] font-semibold text-oko-char dark:text-oko-cream">Total</span>
            <span className="font-oko-display font-semibold text-[21px] leading-none text-oko-char dark:text-oko-cream">
              ${formatPrice(cartObject?.total_price || 0)}
            </span>
          </div>
        </div>

        {checkoutButton && (
          <div className="mt-5">
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[13.5px] rounded-[2px] transition-colors"
            >
              Proceed to checkout
            </button>

            <p className="mt-3.5 text-center font-inter text-[13px] text-oko-char-soft dark:text-oko-ondark">
              Call for a lower price —{" "}
              <a
                href={`tel:${OKO_PHONE}`}
                className="font-semibold text-oko-barn dark:text-oko-barn-light hover:text-oko-barn-dark transition-colors"
              >
                {OKO_PHONE}
              </a>
            </p>

            <Link
              href={`${BASE_URL}/grills`}
              prefetch={false}
              className="mt-3 flex items-center justify-center font-inter text-[13px] text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
            >
              or continue shopping
            </Link>
          </div>
        )}
      </div>

      {loading ? (
        <div className="h-10 bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px]" />
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
