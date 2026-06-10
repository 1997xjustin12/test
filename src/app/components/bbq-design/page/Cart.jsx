"use client";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import CartListItem from "@/app/components/bbq-design/sections/cart/CartListItem";
import CartOrderSummary from "@/app/components/bbq-design/sections/cart/CartOrderSummary";
import YouMayAlsoLike from "@/app/components/bbq-design/ui/YouMayAlsoLike";
import { BASE_URL, mapOrderItems } from "@/app/lib/helpers";
import { useAuth } from "@/app/context/auth";
import { useCart } from "@/app/context/cart";
import { STORE_CONTACT } from "@/app/lib/store_constants";

const PhoneIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const ShoppingAssistance = () => (
  <div className="bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm p-5">
    <div className="flex items-center gap-3 mb-3">
      <span className="w-8 h-8 bg-theme-600/10 dark:bg-theme-600/20 flex items-center justify-center flex-shrink-0 text-theme-600">
        <PhoneIcon />
      </span>
      <h3 className="font-oswald text-sm font-semibold uppercase tracking-wide text-char dark:text-ash">
        Shopping Assistance
      </h3>
    </div>
    <p className="text-xs text-char/50 dark:text-ash/40 mb-0.5">Questions? We're here to help.</p>
    <p className="text-xs text-char/30 dark:text-ash/30 mb-4">Mon–Fri &nbsp; 6 AM – 5 PM PST</p>
    <Link
      prefetch={false}
      href={`tel:${STORE_CONTACT}`}
      className="flex items-center justify-center gap-2 w-full py-2.5 bg-theme-600 hover:bg-theme-700 text-white font-oswald font-semibold text-xs uppercase tracking-wide rounded-sm transition-colors"
    >
      <PhoneIcon className="w-3.5 h-3.5" />
      Call Now
    </Link>
  </div>
);

const CartItemSkeleton = () => (
  <div className="flex gap-4 p-4 bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm animate-pulse">
    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-grate/60 dark:bg-white/5 flex-shrink-0" />
    <div className="flex-1 flex flex-col gap-2 py-1">
      <div className="h-2.5 w-20 bg-grate/60 dark:bg-white/5 rounded-sm" />
      <div className="h-3.5 w-full bg-grate/60 dark:bg-white/5 rounded-sm" />
      <div className="h-3.5 w-3/4 bg-grate/60 dark:bg-white/5 rounded-sm" />
      <div className="h-4 w-24 bg-grate/60 dark:bg-white/5 rounded-sm mt-1" />
    </div>
  </div>
);

const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center py-20 px-4 bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm text-center">
    <span className="w-16 h-16 bg-theme-600/10 dark:bg-theme-600/20 flex items-center justify-center mb-5 text-theme-600">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    </span>
    <h2 className="font-oswald font-bold text-xl uppercase tracking-wide text-char dark:text-ash mb-2">
      Your cart is empty
    </h2>
    <p className="text-sm text-char/50 dark:text-ash/40 mb-6 max-w-xs leading-relaxed">
      You haven't added any items yet. Browse our collection and find something you'll love.
    </p>
    <Link
      prefetch={false}
      href={`${BASE_URL}/fireplaces`}
      className="px-6 py-2.5 bg-theme-600 hover:bg-theme-700 hover:-translate-y-0.5 text-white font-oswald font-semibold text-sm uppercase tracking-wide rounded-sm transition-all"
    >
      Continue Shopping →
    </Link>
  </div>
);

export default function Cart() {
  const { cartObject, cartItems, loadingCartItems, increaseProductQuantity, decreaseProductQuantity, fetchOrderTotal } = useCart();
  const { loading, user, isLoggedIn } = useAuth();

  const handleItemCountUpdate = ({ increment, product }) => {
    increment ? increaseProductQuantity(product) : decreaseProductQuantity(product);
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
    <section className="bg-ash dark:bg-char min-h-screen py-8 font-sora">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {loadingCartItems ? (
          <div className="flex flex-col gap-2">
            <CartItemSkeleton /><CartItemSkeleton /><CartItemSkeleton />
          </div>
        ) : cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div className="mb-6">
              <Link
                href={`${BASE_URL}/fireplaces`}
                prefetch={false}
                className="inline-flex items-center gap-1.5 font-oswald text-xs uppercase tracking-wide text-char/40 dark:text-ash/40 hover:text-theme-600 dark:hover:text-theme-500 transition-colors mb-4"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Back to Shopping
              </Link>
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <h1 className="font-oswald font-bold text-2xl sm:text-3xl uppercase tracking-wide text-char dark:text-ash">
                  Shopping Cart
                </h1>
                {ref_number && (
                  <span className="font-oswald text-xs uppercase tracking-wide text-char/40 dark:text-ash/30">
                    Ref: <span className="text-theme-600 font-semibold">{ref_number}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 lg:items-start">
              <div className="flex-1 min-w-0 flex flex-col gap-2">
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
