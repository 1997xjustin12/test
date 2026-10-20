import Link from "next/link";
import { STORE_CONTACT } from "@/app/lib/store_constants";

// Solana's "checkout isn't open yet" page, drawn to new-design-patterns.md:
// a rounded-2xl card on the stone scale, a theme overline over a serif
// heading, a theme-600 primary button and an outline secondary. Not an error
// page — the cart is intact and the order can be placed by phone.

export default function CheckoutUnavailable({ message }) {
  const digits = String(STORE_CONTACT ?? "").replace(/[^\d+]/g, "");

  return (
    <section className="flex min-h-[70svh] items-center justify-center bg-stone-50 px-4 py-16 dark:bg-stone-950">
      <div className="w-full max-w-xl rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:p-10">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 dark:bg-orange-900/20">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
          </svg>
        </span>

        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[.15em] text-theme-600 dark:text-theme-500">Checkout</p>
        <h1 className="font-serif text-3xl leading-tight text-charcoal dark:text-white sm:text-4xl">
          Checkout isn&apos;t open yet
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-stone-600 dark:text-stone-300 sm:text-base">
          {message}
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          {digits && (
            <a
              href={`tel:${digits}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-theme-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-theme-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Call {STORE_CONTACT}
            </a>
          )}
          <Link
            href="/cart"
            prefetch={false}
            className="inline-flex items-center justify-center rounded-xl border-2 border-theme-500 px-6 py-3 text-sm font-semibold text-theme-600 transition-colors hover:bg-theme-500 hover:text-white dark:text-theme-500"
          >
            Back to cart
          </Link>
        </div>

        <p className="mt-6 text-xs text-stone-400 dark:text-stone-500">Your cart is saved — nothing has been charged.</p>
      </div>
    </section>
  );
}
