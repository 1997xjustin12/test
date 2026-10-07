import Link from "next/link";
import { Phone, ShoppingBag } from "lucide-react";
import { STORE_CONTACT, STORE_NAME } from "@/app/lib/store_constants";

/**
 * What stands in for the checkout while it is closed.
 *
 * Deliberately not an error page. Nothing has gone wrong from the shopper's
 * side, their basket is intact, and there is a way to complete the order — so
 * this says that, offers the phone number, and sends them back to the basket
 * rather than leaving them on a dead end.
 *
 * A server component: the checkout page reads the switch on the server, so
 * this never flashes a payment form before deciding.
 *
 * Styled without theme-600. The theme variables are defined by the market
 * layout, and the checkout is its own route group that never sets them — so a
 * themed class here renders as no colour at all, which is how the first
 * version of this page shipped an invisible button.
 */
export default function CheckoutClosedNotice({ message }) {
  const phone = STORE_CONTACT;
  const digits = String(phone ?? "").replace(/[^\d+]/g, "");

  return (
    <main className="flex min-h-[70svh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl text-center">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-charcoal/5 text-charcoal dark:bg-white/10 dark:text-white">
          <ShoppingBag className="h-7 w-7" aria-hidden="true" />
        </span>

        <h1 className="text-2xl font-bold text-charcoal dark:text-white sm:text-3xl">
          Checkout is temporarily unavailable
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-stone-600 dark:text-stone-300 sm:text-base">
          {message}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {digits && (
            <a
              href={`tel:${digits}`}
              className="inline-flex items-center gap-2 rounded-full bg-charcoal px-7 py-3.5 text-[15px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call {phone}
            </a>
          )}
          <Link
            href="/cart"
            className="inline-flex items-center justify-center rounded-full border-2 border-stone-300 px-7 py-3.5 text-[15px] font-semibold text-charcoal transition-colors hover:border-charcoal dark:border-stone-600 dark:hover:border-white dark:text-white"
          >
            Back to basket
          </Link>
        </div>

        <p className="mt-8 text-xs text-stone-500 dark:text-stone-400">
          Nothing has been charged, and your basket is saved. {STORE_NAME} will reopen online
          ordering as soon as the new payment provider is live.
        </p>
      </div>
    </main>
  );
}
