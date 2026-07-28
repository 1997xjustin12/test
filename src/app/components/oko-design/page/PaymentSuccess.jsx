"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, BASE_URL } from "@/app/lib/helpers";
import { pixelPurchase } from "@/app/lib/pixel";
import { STORE_CONTACT, STORE_EMAIL } from "@/app/lib/store_constants";

const cardCls =
  "bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] p-5";

const eyebrowCls =
  "font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-stone";

const primaryBtn =
  "text-center font-inter font-semibold text-[13.5px] rounded-[2px] bg-oko-barn hover:bg-oko-barn-dark text-white transition-colors";

const outlineBtn =
  "text-center font-inter font-semibold text-[13.5px] rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark text-oko-char dark:text-oko-cream hover:border-oko-char dark:hover:border-oko-cream transition-colors";

export default function BBQPaymentSuccessPage() {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("order_summary");
    if (!raw) {
      router.replace(BASE_URL || "/");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setOrder(parsed);
      sessionStorage.removeItem("order_summary");
      pixelPurchase({ value: parsed.cartTotal, orderId: parsed.orderId, items: parsed.items });
      if (!parsed.isLoggedIn && parsed.email) {
        sessionStorage.setItem(
          "register_prefill",
          JSON.stringify({
            email: parsed.email,
            first_name: parsed.firstName,
            last_name: parsed.lastName,
          })
        );
      }
    } catch {
      router.replace(BASE_URL || "/");
      return;
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  const { email, items, cartTotal, shipping, transactionId, orderId, isLoggedIn } = order;

  return (
    <div className="min-h-screen py-10 px-4 bg-oko-cream dark:bg-oko-night">
      <div className="max-w-2xl mx-auto flex flex-col gap-5">

        {/* Header */}
        <div className={`${cardCls} flex flex-col items-center text-center gap-3 py-8`}>
          <span className="w-16 h-16 rounded-full border border-oko-sage/30 bg-oko-sage/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-oko-sage" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </span>
          <div>
            <h1 className="font-oko-display font-semibold text-[27px] leading-[1.2] text-oko-char dark:text-oko-cream">
              Order confirmed.
            </h1>
            <p className="font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark mt-1">
              Thank you{order.firstName ? `, ${order.firstName}` : ""}. Your payment was successful.
            </p>
          </div>
          {email && (
            <p className="font-inter text-[12.5px] text-oko-char-soft dark:text-oko-ondark">
              A confirmation email has been sent to{" "}
              <span className="font-semibold text-oko-char dark:text-oko-cream">{email}</span>
            </p>
          )}
          {(orderId || transactionId) && (
            <p className="font-oko-mono text-[11px] tracking-[0.06em] text-oko-char-soft dark:text-oko-ondark bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] px-3 py-1.5">
              {orderId ? `Order #${orderId}` : `Transaction: ${transactionId}`}
            </p>
          )}
        </div>

        {/* Items */}
        {items?.length > 0 && (
          <div className={cardCls}>
            <p className={`${eyebrowCls} mb-4`}>
              Items ordered
            </p>
            <ul className="flex flex-col gap-4">
              {items.map((item, i) => (
                <li key={i} className="flex gap-3 items-center">
                  <div className="relative w-14 h-14 rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark bg-oko-cream-dim dark:bg-oko-night-3 flex-shrink-0 overflow-visible">
                    <span className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-[2px] bg-oko-char dark:bg-oko-cream-dim text-oko-cream dark:text-oko-char font-oko-mono text-[10px] font-medium flex items-center justify-center">
                      {item.quantity}
                    </span>
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title || ""}
                        fill
                        className="object-contain p-1"
                        sizes="56px"
                      />
                    )}
                  </div>
                  <p className="flex-1 min-w-0 font-inter text-[14px] font-medium text-oko-char dark:text-oko-cream line-clamp-2">
                    {item.title}
                  </p>
                  <p className="font-inter text-[14px] font-semibold text-oko-char dark:text-oko-cream flex-shrink-0">
                    ${formatPrice((item.price || 0) * (item.quantity || 1))}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2 pt-4 mt-4 border-t border-oko-stone-line dark:border-oko-line-dark">
              <div className="flex justify-between font-inter text-[13px] text-oko-char-soft dark:text-oko-ondark">
                <span>Subtotal · {cartTotal?.items_count || items.length} items</span>
                <span>${formatPrice(cartTotal?.sub_total || 0)}</span>
              </div>
              <div className="flex justify-between font-inter text-[13px] text-oko-char-soft dark:text-oko-ondark">
                <span>Shipping</span>
                {cartTotal?.total_shipping === 0 ? (
                  <span className="text-oko-sage font-semibold uppercase tracking-[0.04em]">Free</span>
                ) : (
                  <span>${formatPrice(cartTotal?.total_shipping || 0)}</span>
                )}
              </div>
              <div className="flex justify-between font-inter text-[16px] font-semibold text-oko-char dark:text-oko-cream pt-2 border-t border-oko-stone-line dark:border-oko-line-dark">
                <span>Total</span>
                <span>${formatPrice(cartTotal?.total_price || 0)}</span>
              </div>
              <p className="font-inter text-[11px] text-oko-stone -mt-1">
                Including ${formatPrice(cartTotal?.total_tax || 0)} in taxes
              </p>
            </div>
          </div>
        )}

        {/* Shipping Address */}
        {shipping?.address && (
          <div className={cardCls}>
            <p className={`${eyebrowCls} mb-3`}>
              Shipping to
            </p>
            <div className="font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark flex flex-col gap-0.5">
              {shipping.name && <p className="font-semibold text-oko-char dark:text-oko-cream">{shipping.name}</p>}
              <p>{shipping.address}</p>
              <p>{[shipping.city, shipping.state, shipping.zip].filter(Boolean).join(", ")}</p>
              {shipping.country && <p>{shipping.country}</p>}
            </div>
          </div>
        )}

        {/* CTAs */}
        {isLoggedIn ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`${BASE_URL}/my-account/orders`}
              className={`flex-1 py-3 ${primaryBtn}`}
            >
              View my orders
            </Link>
            <Link
              href={BASE_URL || "/"}
              className={`flex-1 py-3 ${outlineBtn}`}
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <div className={`${cardCls} flex flex-col gap-3`}>
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-[2px] bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark flex items-center justify-center flex-shrink-0 mt-0.5 text-oko-char-soft dark:text-oko-ondark">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </span>
                <div>
                  <p className="font-oko-display font-semibold text-[15.5px] leading-[1.3] text-oko-char dark:text-oko-cream">
                    Save time on your next order.
                  </p>
                  <p className="font-inter text-[13px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark mt-0.5">
                    Create a free account to track this order, view order history, and check out faster next time.
                  </p>
                </div>
              </div>
              <Link
                href={`${BASE_URL}/login`}
                className={`w-full py-2.5 ${primaryBtn}`}
              >
                Create account
              </Link>
            </div>

            <Link
              href={BASE_URL || "/"}
              className={`w-full py-3 ${outlineBtn}`}
            >
              Continue shopping
            </Link>
          </>
        )}

        {/* Support */}
        <div className={cardCls}>
          <p className={`${eyebrowCls} mb-3`}>
            Need help?
          </p>
          <div className="flex flex-col gap-2 font-inter text-[13px] text-oko-char-soft dark:text-oko-ondark">
            <Link
              prefetch={false}
              href={`tel:${STORE_CONTACT}`}
              className="flex items-center gap-2 hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0 text-oko-barn dark:text-oko-barn-light" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {STORE_CONTACT}
            </Link>
            <a
              href={`mailto:${STORE_EMAIL}`}
              className="flex items-center gap-2 hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0 text-oko-barn dark:text-oko-barn-light" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              {STORE_EMAIL}
            </a>
            <div className="pt-2 mt-1 border-t border-oko-stone-line dark:border-oko-line-dark">
              <p className="font-oko-mono text-[10px] font-medium uppercase tracking-[0.14em] text-oko-stone">
                Sales &amp; support · Mon–Fri 5:00am–5:00pm PST
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
