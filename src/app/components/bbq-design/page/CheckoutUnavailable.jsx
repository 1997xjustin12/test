import Link from "next/link";
import { STORE_CONTACT } from "@/app/lib/store_constants";

// BBQ's "checkout isn't open yet" page, drawn to bbq-design-patterns.md:
// near-square rounded-sm, a paper/smoke card on grate borders, an Oswald
// uppercase overline and heading over Sora body copy, and theme-600 buttons.
// Not an error page — the cart is intact and the order can be placed by phone.

export default function CheckoutUnavailable({ message }) {
  const digits = String(STORE_CONTACT ?? "").replace(/[^\d+]/g, "");

  return (
    <section className="flex min-h-[70svh] items-center justify-center bg-ash px-4 py-16 font-sora dark:bg-char">
      <div className="w-full max-w-xl rounded-sm border border-grate bg-paper p-8 text-center dark:border-white/10 dark:bg-smoke sm:p-10">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border border-grate bg-ash text-theme-600 dark:border-white/10 dark:bg-char">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
          </svg>
        </span>

        <p className="font-oswald text-xs font-semibold uppercase tracking-[.14em] text-theme-600">Checkout</p>
        <h1 className="mt-1 font-oswald text-3xl font-bold uppercase tracking-wide text-char dark:text-ash sm:text-4xl">
          Checkout isn&apos;t open yet
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm font-light leading-relaxed text-stone-600 dark:text-stone-400 sm:text-base">
          {message}
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          {digits && (
            <a
              href={`tel:${digits}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-theme-600 px-6 font-oswald text-sm font-semibold uppercase tracking-wide text-white transition-all hover:-translate-y-0.5 hover:bg-theme-700 active:scale-[.98]"
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
            className="inline-flex h-12 items-center justify-center rounded-sm border border-theme-600 px-6 font-oswald text-sm font-semibold uppercase tracking-wide text-theme-600 transition-colors hover:bg-theme-600 hover:text-white"
          >
            Back to cart
          </Link>
        </div>

        <p className="mt-6 font-oswald text-[11px] uppercase tracking-widest text-char/40 dark:text-ash/40">
          Your cart is saved — nothing has been charged
        </p>
      </div>
    </section>
  );
}
