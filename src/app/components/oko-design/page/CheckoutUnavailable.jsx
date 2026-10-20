import Link from "next/link";
import { STORE_CONTACT } from "@/app/lib/store_constants";

// OKO's "checkout isn't open yet" page, drawn to the OKO design system as the
// rest of oko-design applies it: 2px corners, a mono uppercase barn eyebrow
// over a slab display heading, Inter body copy, barn for the one primary
// action and a bordered secondary. No emoji (§6). Not an error page — the cart
// is intact and the order can be placed by phone.

export default function CheckoutUnavailable({ message }) {
  const digits = String(STORE_CONTACT ?? "").replace(/[^\d+]/g, "");

  return (
    <section className="flex min-h-[70svh] items-center justify-center bg-oko-cream px-5 py-16 font-inter dark:bg-oko-night sm:px-8">
      <div className="w-full max-w-xl rounded-[2px] border border-oko-stone-line bg-white p-8 text-center dark:border-oko-line-dark dark:bg-oko-night-2 sm:p-10">
        <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[2px] border border-oko-stone-line bg-oko-cream-dim text-oko-barn dark:border-oko-line-dark dark:bg-oko-night-3 dark:text-oko-barn-light">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
          </svg>
        </span>

        <p className="font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light">
          Checkout
        </p>
        <h1 className="mt-1.5 font-oko-display text-[29px] font-semibold leading-[1.2] text-oko-char dark:text-oko-cream sm:text-[33px]">
          Checkout isn&apos;t open yet
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-oko-char-soft dark:text-oko-ondark sm:text-[15px]">
          {message}
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          {digits && (
            <a
              href={`tel:${digits}`}
              className="inline-flex items-center justify-center gap-2 rounded-[2px] bg-oko-barn px-6 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-oko-barn-dark"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Call {STORE_CONTACT}
            </a>
          )}
          <Link
            href="/cart"
            prefetch={false}
            className="inline-flex items-center justify-center rounded-[2px] border border-oko-stone-line bg-white px-6 py-3.5 text-[14px] font-semibold text-oko-char transition-colors hover:border-oko-barn dark:border-oko-line-dark dark:bg-oko-night-2 dark:text-oko-cream dark:hover:border-oko-barn-light"
          >
            Back to cart
          </Link>
        </div>

        <p className="mt-6 font-oko-mono text-[11px] uppercase tracking-[0.14em] text-oko-stone">
          Your cart is saved — nothing has been charged
        </p>
      </div>
    </section>
  );
}
