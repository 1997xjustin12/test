"use client";
import Image from "next/image";
import Link from "next/link";
import AuthButtons from "@/app/components/molecule/AuthButtons";
import useCheckout, { addressRows } from "@/app/components/checkout/useCheckout";
import { BASE_URL, formatPrice, createSlug } from "@/app/lib/helpers";
import { STORE_EMAIL, STORE_CONTACT } from "@/app/lib/store_constants";

// Solana's checkout, drawn to new-design-patterns.md: soft rounded-2xl cards,
// serif headings under a theme overline, rounded-lg inputs with the fire focus
// ring. Stone throughout, as the pattern's forms (FormCard, Login) use, so the
// inputs and the cards around them are the same warm neutral in dark mode. Behaviour lives in components/checkout/useCheckout.js.

const cardCls =
  "bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-2xl p-5 sm:p-6";

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm text-charcoal dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:border-fire focus:ring-2 focus:ring-fire/20 disabled:bg-stone-50 dark:disabled:bg-stone-900 disabled:text-stone-500 dark:disabled:text-stone-400 transition-colors";

const labelCls = "block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5";

// accent-*, not text-*: there is no forms plugin, so only accent-color tints
// a native checkbox.
const checkboxCls = "h-4 w-4 rounded accent-[var(--theme-primary-600)] flex-shrink-0 cursor-pointer";

const SectionHeading = ({ overline, title }) => (
  <div className="mb-5">
    <p className="text-[11px] tracking-[.15em] uppercase font-semibold text-theme-600 dark:text-theme-500 mb-1">
      {overline}
    </p>
    <h2 className="font-serif text-xl text-charcoal dark:text-white leading-tight">{title}</h2>
  </div>
);

const Field = ({ field, form, onChange }) => (
  <div className="flex-1 min-w-0">
    <label htmlFor={field.name} className={labelCls}>
      {field.label}
      {field.auto && (
        <span className="ml-1 font-normal text-stone-400 dark:text-stone-500">· from postal code</span>
      )}
    </label>
    <input
      id={field.name}
      name={field.name}
      type={field.type || "text"}
      autoComplete={field.autoComplete}
      value={form?.[field.name] || ""}
      onChange={onChange}
      disabled={field.auto}
      required
      className={inputCls}
    />
  </div>
);

const AddressFields = ({ prefix, form, onChange }) => (
  <div className="flex flex-col gap-4">
    {addressRows(prefix).map((row, i) => (
      <div key={i} className={row.length > 1 ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : ""}>
        {row.map((field) => (
          <Field key={field.name} field={field} form={form} onChange={onChange} />
        ))}
      </div>
    ))}
  </div>
);

const Checkbox = ({ name, checked, onChange, children }) => (
  <label className="flex items-center gap-2.5 text-sm text-stone-600 dark:text-stone-400 cursor-pointer select-none">
    <input id={name} name={name} type="checkbox" checked={checked} onChange={onChange} className={checkboxCls} />
    {children}
  </label>
);

const ItemsList = ({ items }) => (
  <ul className="flex flex-col gap-4">
    {items?.map((item, i) => {
      const img = item?.images?.find((img) => img?.position === 1);
      return (
        <li key={i} className="flex gap-3 items-center">
          <div className="relative w-14 h-14 rounded-xl border border-stone-200 dark:border-stone-700 bg-white flex-shrink-0">
            <span className="absolute -top-1.5 -right-1.5 z-10 min-w-5 h-5 px-1 rounded-full bg-stone-900 dark:bg-stone-600 text-white text-[10px] font-bold flex items-center justify-center">
              {item?.quantity || 0}
            </span>
            {img?.src && (
              <Image src={img.src} alt={createSlug(item?.title || "")} fill className="object-contain p-1 rounded-xl" sizes="56px" />
            )}
          </div>
          <p className="flex-1 min-w-0 text-xs font-medium text-charcoal dark:text-white line-clamp-2">{item?.title}</p>
          <p className="text-xs font-semibold text-charcoal dark:text-white flex-shrink-0">
            ${formatPrice(item?.quantity * item?.variants?.[0]?.price || 0)}
          </p>
        </li>
      );
    })}
  </ul>
);

const Totals = ({ data, items }) => {
  const empty = !items?.length;
  return (
    <div className="flex flex-col gap-3 pt-4 mt-4 border-t border-stone-100 dark:border-stone-800">
      <div className="flex justify-between items-center">
        <span className="text-xs text-stone-500 dark:text-stone-400">Subtotal · {empty ? 0 : data?.items_count || 0} items</span>
        <span className="text-xs font-semibold text-charcoal dark:text-white">${formatPrice(empty ? 0 : data?.sub_total || 0)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-stone-500 dark:text-stone-400">Shipping</span>
        {empty || !data?.allowPay ? (
          <span className="text-xs text-stone-400 dark:text-stone-500 italic">Enter postal code</span>
        ) : data?.total_shipping === 0 ? (
          <span className="text-xs font-semibold text-green-600 dark:text-green-400">FREE</span>
        ) : (
          <span className="text-xs font-semibold text-charcoal dark:text-white">${formatPrice(data?.total_shipping)}</span>
        )}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-stone-500 dark:text-stone-400">Tax</span>
        <span className="text-xs font-semibold text-charcoal dark:text-white">${formatPrice(empty ? 0 : data?.total_tax || 0)}</span>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-stone-100 dark:border-stone-800">
        <span className="text-sm font-bold text-stone-900 dark:text-white">Total</span>
        <span className="text-lg font-bold text-stone-900 dark:text-white">${formatPrice(empty ? 0 : data?.total_price || 0)}</span>
      </div>
    </div>
  );
};

const HelpCard = ({ refNumber }) => (
  <div className={cardCls}>
    <div className="flex items-center gap-3 mb-4">
      <span className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 flex-shrink-0">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      </span>
      <div>
        <p className="text-sm font-bold text-stone-900 dark:text-white">Need help?</p>
        <p className="text-xs text-stone-500 dark:text-stone-400">Mon–Fri 5:00am–5:00pm PST</p>
      </div>
    </div>
    <div className="flex flex-col gap-2 text-xs text-stone-600 dark:text-stone-400">
      <a href={`tel:${STORE_CONTACT}`} className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">{STORE_CONTACT}</a>
      <a href={`mailto:${STORE_EMAIL}`} className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors">{STORE_EMAIL}</a>
    </div>
    {refNumber && (
      <p className="text-xs text-stone-400 dark:text-stone-500 mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
        Ref: <span className="text-orange-500 font-semibold">{refNumber}</span>
      </p>
    )}
  </div>
);

const FormLoader = () => (
  <div className="flex flex-col gap-4" aria-hidden="true">
    {[64, 360, 120].map((h) => (
      <div key={h} className="rounded-2xl bg-stone-100 dark:bg-stone-800 animate-pulse" style={{ height: h }} />
    ))}
    <div className="h-12 rounded-xl bg-stone-100 dark:bg-stone-800 animate-pulse" />
  </div>
);

export default function Checkout() {
  const {
    form, handleChange, handleSubmit, cartItems, cartTotal, formError, placedOrder,
    isSubmitting, canSubmit, loading, isLoggedIn, user, askEmail, refNumber, signOut,
  } = useCheckout();

  return (
    <section className="bg-stone-50 dark:bg-stone-950 min-h-screen py-8">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <Link
            href={`${BASE_URL}/cart`}
            prefetch={false}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-orange-500 dark:text-stone-400 dark:hover:text-orange-400 transition-colors mb-3"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to cart
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal dark:text-white leading-tight">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
          <div>
            {loading ? (
              <FormLoader />
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {!isLoggedIn && (
                  <div className={cardCls}>
                    <AuthButtons
                      signInClassName="w-full py-3 rounded-xl border-2 border-theme-500 text-theme-600 dark:text-theme-500 hover:bg-theme-500 hover:text-white text-sm font-semibold transition-all duration-200"
                      registerClassName="text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                    />
                  </div>
                )}

                <div className={cardCls}>
                  {isLoggedIn ? (
                    user && (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-theme-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 select-none">
                            {user.name_initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-charcoal dark:text-white truncate">{user.email}</p>
                            <p className="text-xs text-stone-400 dark:text-stone-500">Signed in</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={signOut}
                          className="text-xs font-medium text-stone-500 hover:text-orange-500 dark:text-stone-400 dark:hover:text-orange-400 transition-colors"
                        >
                          Sign out
                        </button>
                      </div>
                    )
                  ) : (
                    <>
                      <SectionHeading overline="Step 1" title="Contact" />
                      <div className="flex flex-col gap-4">
                        <div>
                          <label htmlFor="shipping_email" className={labelCls}>Email</label>
                          <input
                            id="shipping_email"
                            type="email"
                            name="shipping_email"
                            autoComplete="email"
                            value={form?.shipping_email || ""}
                            onChange={handleChange}
                            required
                            className={inputCls}
                          />
                        </div>
                        <Checkbox name="newsletter" checked={form?.newsletter} onChange={handleChange}>
                          Email me with news and offers
                        </Checkbox>
                      </div>
                    </>
                  )}
                  {askEmail && (
                    <div className="mt-4">
                      <label htmlFor="shipping_email" className={labelCls}>Email</label>
                      <input
                        id="shipping_email"
                        type="email"
                        name="shipping_email"
                        autoComplete="email"
                        value={form?.shipping_email || ""}
                        onChange={handleChange}
                        required
                        className={inputCls}
                      />
                    </div>
                  )}
                </div>

                <div className={cardCls}>
                  <SectionHeading overline={isLoggedIn ? "Step 1" : "Step 2"} title="Shipping address" />
                  <AddressFields prefix="shipping" form={form} onChange={handleChange} />
                  <div className="mt-4">
                    <label htmlFor="notes" className={labelCls}>
                      Notes <span className="font-normal text-stone-400 dark:text-stone-500">(optional)</span>
                    </label>
                    <input id="notes" type="text" name="notes" value={form?.notes || ""} onChange={handleChange} className={inputCls} />
                  </div>
                  <div className="mt-4">
                    <Checkbox name="save_information" checked={form?.save_information} onChange={handleChange}>
                      Save this information for next time
                    </Checkbox>
                  </div>
                </div>

                <div className={cardCls}>
                  <SectionHeading overline={isLoggedIn ? "Step 2" : "Step 3"} title="Payment" />
                  <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                    After you place your order, we&apos;ll take you to our secure payment page to complete payment.
                  </p>
                  <div className="mt-5 pt-5 border-t border-stone-100 dark:border-stone-800">
                    <Checkbox name="shipping_to_billing" checked={form?.shipping_to_billing} onChange={handleChange}>
                      Use shipping address as billing address
                    </Checkbox>
                    {!form?.shipping_to_billing && (
                      <div className="mt-5">
                        <p className="text-sm font-bold text-stone-900 dark:text-white mb-4">Billing address</p>
                        <AddressFields prefix="billing" form={form} onChange={handleChange} />
                      </div>
                    )}
                  </div>
                </div>

                {formError && (
                  <div role="alert" className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    {Array.isArray(formError) ? (
                      <ul className="flex flex-col gap-1 text-xs text-red-600 dark:text-red-400 font-medium">
                        {formError.map((message, index) => <li key={index}>{message}</li>)}
                      </ul>
                    ) : (
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium">{formError}</p>
                    )}
                  </div>
                )}
                {placedOrder && (
                  <div role="status" className="px-3.5 py-3 rounded-lg bg-green-600/10 dark:bg-green-600/20 text-xs text-green-700 dark:text-green-400 font-medium">
                    Your order{placedOrder.orderNumber ? ` #${placedOrder.orderNumber}` : ""} has been placed,
                    but we couldn&apos;t open the payment page. Please contact us to complete payment
                    {STORE_CONTACT && <> — call <a href={`tel:${STORE_CONTACT}`} className="underline">{STORE_CONTACT}</a></>}
                    {STORE_EMAIL && <> or email <a href={`mailto:${STORE_EMAIL}`} className="underline">{STORE_EMAIL}</a></>}.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full py-3.5 bg-theme-600 hover:bg-theme-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting && (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  )}
                  {isSubmitting ? "Placing order…" : "Place Order"}
                </button>
                <p className="flex items-center justify-center gap-1.5 text-center text-xs text-stone-500 dark:text-stone-400">
                  <svg className="w-3.5 h-3.5 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  Once your order is placed, you will be redirected to our secure payment page.
                </p>
              </form>
            )}
          </div>

          <div className="flex flex-col gap-4 lg:sticky lg:top-6">
            {!loading && (
              <div className={cardCls}>
                <h2 className="text-sm font-bold text-stone-900 dark:text-white mb-4">Order Summary</h2>
                <ItemsList items={cartItems} />
                <Totals data={cartTotal} items={cartItems} />
              </div>
            )}
            <HelpCard refNumber={refNumber} />
          </div>
        </div>
      </div>
    </section>
  );
}
