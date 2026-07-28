"use client";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import CartListItem from "@/app/components/oko-design/sections/cart/CartListItem";
import CartOrderSummary from "@/app/components/oko-design/sections/cart/CartOrderSummary";
import YouMayAlsoLike from "@/app/components/oko-design/ui/YouMayAlsoLike";
import { BASE_URL, mapOrderItems } from "@/app/lib/helpers";
import { useAuth } from "@/app/context/auth";
import { useCart } from "@/app/context/cart";

// Phone is a first-class OKO brand element — always this exact literal (§10).
const OKO_PHONE = "888-667-4986";

const PhoneIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

// Bordered cream-dim assistance panel repeating the phone number (§9 voice).
const ShoppingAssistance = () => (
  <div className="bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] p-5">
    <p className="font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light mb-2">
      Shopping assistance
    </p>
    <h3 className="font-oko-display font-semibold text-[19px] leading-[1.2] text-oko-char dark:text-oko-cream mb-1">
      Questions? We&apos;re here to help.
    </h3>
    <p className="font-inter text-[13px] text-oko-char-soft dark:text-oko-ondark mb-4">
      Mon–Fri, 6 AM – 5 PM PST
    </p>
    <Link
      prefetch={false}
      href={`tel:${OKO_PHONE}`}
      className="flex items-center justify-center gap-2 w-full py-3 bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[13.5px] rounded-[2px] transition-colors"
    >
      <PhoneIcon className="w-4 h-4" />
      Call {OKO_PHONE}
    </Link>
  </div>
);

// Static placeholder — no shimmer (spec §7 forbids loading skeletons w/ motion).
const CartItemPlaceholder = () => (
  <div className="flex gap-4 p-4 bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px]">
    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px] flex-shrink-0" />
    <div className="flex-1 flex flex-col gap-2 py-1">
      <div className="h-2.5 w-20 bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px]" />
      <div className="h-3.5 w-full bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px]" />
      <div className="h-3.5 w-3/4 bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px]" />
      <div className="h-4 w-24 bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px] mt-1" />
    </div>
  </div>
);

// Empty state (§9) — centered slab heading, 13.5px stone line, one barn button.
const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] text-center">
    <h2 className="font-oko-display font-semibold text-[27px] leading-[1.2] text-oko-char dark:text-oko-cream mb-2">
      Your cart is empty
    </h2>
    <p className="font-inter text-[13.5px] text-oko-stone mb-6 max-w-xs leading-relaxed">
      Browse the lineup and add a grill to get started.
    </p>
    <Link
      prefetch={false}
      href={`${BASE_URL}/grills`}
      className="px-6 py-3 bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[13.5px] rounded-[2px] transition-colors"
    >
      Shop grills
    </Link>
  </div>
);

export default function Cart() {
  const { cartObject, cartItems, loadingCartItems, increaseProductQuantity, decreaseProductQuantity, fetchOrderTotal } = useCart();
  const { loading, user, isLoggedIn } = useAuth();

  const handleItemCountUpdate = ({ increment, product }) => {
    if (increment) {
      increaseProductQuantity(product);
    } else {
      decreaseProductQuantity(product);
    }
  };

  useEffect(() => {
    if (loading || cartItems.length === 0) return;
    const data = user
      ? (() => {
          const sd = {
            shipping_address: user?.profile?.shipping_address ?? "",
            shipping_country: user?.profile?.shipping_country ?? "",
            shipping_city: user?.profile?.shipping_city ?? "",
            shipping_province: user?.profile?.shipping_state ?? "",
            shipping_zip_code: user?.profile?.shipping_zip ?? "",
          };
          return { items: cartItems.map((i) => ({ ...i, product_id: i?.custom_fields?.product_id })), ...(Object.values(sd).every((v) => v !== "") ? sd : {}) };
        })()
      : { items: mapOrderItems(cartItems) };
    fetchOrderTotal(data);
  }, [loading, isLoggedIn, user, cartItems]);

  const ref_number = useMemo(() => {
    if (loading) return null;
    return isLoggedIn ? (cartObject?.cart_id ? `CI-${cartObject.cart_id}` : null) : cartObject?.reference_number ?? null;
  }, [loading, isLoggedIn, cartObject]);

  return (
    <section className="bg-oko-cream dark:bg-oko-night min-h-screen py-8 font-inter">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8">
        {loadingCartItems ? (
          <div className="flex flex-col gap-3">
            <CartItemPlaceholder /><CartItemPlaceholder /><CartItemPlaceholder />
          </div>
        ) : cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div className="mb-6">
              <Link
                href={`${BASE_URL}/grills`}
                prefetch={false}
                className="inline-flex items-center gap-1.5 font-inter text-[13px] text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors mb-4"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Back to shopping
              </Link>
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <h1 className="font-oko-display font-semibold text-[27px] sm:text-[29px] leading-[1.2] text-oko-char dark:text-oko-cream">
                  Shopping cart
                </h1>
                {ref_number && (
                  <span className="font-oko-mono text-[11px] uppercase tracking-[0.14em] text-oko-stone">
                    Ref:{" "}
                    <span className="text-oko-barn dark:text-oko-barn-light font-medium">{ref_number}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 lg:items-start">
              <div className="flex-1 min-w-0 flex flex-col gap-3">
                {cartObject?.items?.map((item, idx) => (
                  <CartListItem key={`cart-item-${idx}-${item?.id}`} item={item} onItemCountUpdate={handleItemCountUpdate} />
                ))}
              </div>
              <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-4">
                <CartOrderSummary />
                <ShoppingAssistance />
              </div>
            </div>
          </>
        )}
        <div className="mt-8">
          <YouMayAlsoLike displayItems={4} />
        </div>
      </div>
    </section>
  );
}
