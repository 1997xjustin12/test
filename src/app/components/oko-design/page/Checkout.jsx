"use client";
import Image from "next/image";
import Link from "next/link";
import AuthButtons from "@/app/components/molecule/AuthButtons";
import useCheckout, { addressRows } from "@/app/components/checkout/useCheckout";
import { BASE_URL, formatPrice, createSlug } from "@/app/lib/helpers";
import { STORE_EMAIL, STORE_CONTACT } from "@/app/lib/store_constants";

// OKO's checkout, drawn to the OKO design system as the rest of oko-design
// applies it: 2px corners, a mono uppercase barn eyebrow over a slab display
// heading, Inter body copy, cream-dim inputs and panels on stone-line borders,
// barn for the one primary action, sage for success, alerts as a 4px left
// border. Static loading placeholders — §7 forbids skeletons with motion — and
// no emoji (§6). Behaviour lives in components/checkout/useCheckout.js.

const cardCls =
  "bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] p-5 sm:p-6";

const panelCls =
  "bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] p-5";

const inputCls =
  "w-full bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] px-4 py-3 text-[14px] font-inter text-oko-char dark:text-oko-cream placeholder-oko-stone outline-none focus:border-oko-barn dark:focus:border-oko-barn-light disabled:bg-transparent disabled:border-dashed disabled:text-oko-char-soft dark:disabled:text-oko-ondark disabled:cursor-default transition-colors";

const labelCls =
  "block font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-oko-stone mb-1.5";

const eyebrowCls =
  "font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light";

const SectionHeading = ({ overline, title }) => (
  <div className="mb-5">
    <p className={`${eyebrowCls} mb-1.5`}>{overline}</p>
    <h2 className="font-oko-display font-semibold text-[21px] leading-[1.2] text-oko-char dark:text-oko-cream">{title}</h2>
  </div>
);

const Field = ({ field, form, onChange }) => (
  <div className="flex-1 min-w-0">
    <label htmlFor={field.name} className={labelCls}>
      {field.label}
      {field.auto && <span className="ml-1 normal-case tracking-normal font-normal">· from postal code</span>}
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
  <label className="flex items-center gap-2.5 font-inter text-[13.5px] text-oko-char-soft dark:text-oko-ondark cursor-pointer select-none">
    <input
      id={name}
      name={name}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded-[2px] accent-oko-barn flex-shrink-0 cursor-pointer"
    />
    {children}
  </label>
);

const ItemsList = ({ items }) => (
  <ul className="flex flex-col">
    {items?.map((item, i) => {
      const img = item?.images?.find((img) => img?.position === 1);
      return (
        <li key={i} className="flex gap-3 items-center py-3 first:pt-0 border-b border-oko-stone-line dark:border-oko-line-dark">
          <div className="relative w-14 h-14 rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark bg-white flex-shrink-0">
            <span className="absolute -top-1.5 -right-1.5 z-10 min-w-5 h-5 px-1 rounded-[2px] bg-oko-char dark:bg-oko-barn text-white font-oko-mono text-[10px] font-medium flex items-center justify-center">
              {item?.quantity || 0}
            </span>
            {img?.src && (
              <Image src={img.src} alt={createSlug(item?.title || "")} fill className="object-contain p-1" sizes="56px" />
            )}
          </div>
          <p className="flex-1 min-w-0 font-inter text-[13px] font-medium text-oko-char dark:text-oko-cream leading-snug line-clamp-2">{item?.title}</p>
          <p className="font-inter text-[14px] font-semibold text-oko-char dark:text-oko-cream flex-shrink-0">
            ${formatPrice(item?.quantity * item?.variants?.[0]?.price || 0)}
          </p>
        </li>
      );
    })}
  </ul>
);

const rowLabel = "font-inter text-[13.5px] text-oko-char-soft dark:text-oko-ondark";
const rowValue = "font-inter text-[14px] font-semibold text-oko-char dark:text-oko-cream";
const rowCls = "flex justify-between items-center py-2.5 border-t border-oko-stone-line dark:border-oko-line-dark";

const Totals = ({ data, items }) => {
  const empty = !items?.length;
  return (
    <div className="flex flex-col mt-4">
      <div className={rowCls}>
        <span className={rowLabel}>Subtotal · {empty ? 0 : data?.items_count || 0} items</span>
        <span className={rowValue}>${formatPrice(empty ? 0 : data?.sub_total || 0)}</span>
      </div>
      <div className={rowCls}>
        <span className={rowLabel}>Shipping</span>
        {empty || !data?.allowPay ? (
          <span className="font-inter text-[13px] text-oko-stone">Enter postal code</span>
        ) : data?.total_shipping === 0 ? (
          <span className="font-inter text-[14px] font-semibold text-oko-sage dark:text-oko-sage-light">Free</span>
        ) : (
          <span className={rowValue}>${formatPrice(data?.total_shipping)}</span>
        )}
      </div>
      <div className={rowCls}>
        <span className={rowLabel}>Tax</span>
        <span className={rowValue}>${formatPrice(empty ? 0 : data?.total_tax || 0)}</span>
      </div>
      <div className="flex justify-between items-baseline pt-3.5 border-t border-oko-stone-line dark:border-oko-line-dark">
        <span className="font-inter text-[14px] font-semibold text-oko-char dark:text-oko-cream">Total</span>
        <span className="font-oko-display font-semibold text-[21px] leading-none text-oko-char dark:text-oko-cream">
          ${formatPrice(empty ? 0 : data?.total_price || 0)}
        </span>
      </div>
    </div>
  );
};

const HelpCard = ({ refNumber }) => (
  <div className={panelCls}>
    <p className={`${eyebrowCls} mb-2`}>Shopping assistance</p>
    <h3 className="font-oko-display font-semibold text-[19px] leading-[1.2] text-oko-char dark:text-oko-cream mb-1">
      Questions? We&apos;re here to help.
    </h3>
    <p className="font-inter text-[13px] text-oko-char-soft dark:text-oko-ondark mb-4">Mon–Fri, 5 AM – 5 PM PST</p>
    <a
      href={`tel:${STORE_CONTACT}`}
      className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark hover:border-oko-barn dark:hover:border-oko-barn-light text-oko-char dark:text-oko-cream font-inter font-semibold text-[13.5px] rounded-[2px] transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
      Call {STORE_CONTACT}
    </a>
    <a
      href={`mailto:${STORE_EMAIL}`}
      className="mt-3 flex justify-center font-inter text-[13px] text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
    >
      {STORE_EMAIL}
    </a>
    {refNumber && (
      <p className="font-oko-mono text-[11px] uppercase tracking-[0.14em] text-oko-stone mt-4 pt-3 border-t border-oko-stone-line dark:border-oko-line-dark">
        Ref: <span className="text-oko-barn dark:text-oko-barn-light font-medium">{refNumber}</span>
      </p>
    )}
  </div>
);

// Static placeholder — no shimmer (§7).
const FormLoader = () => (
  <div className="flex flex-col gap-4" aria-hidden="true">
    {[64, 360, 120].map((h) => (
      <div
        key={h}
        className="bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px]"
        style={{ height: h }}
      />
    ))}
    <div className="h-12 bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px]" />
  </div>
);

export default function Checkout() {
  const {
    form, handleChange, handleSubmit, cartItems, cartTotal, formError, placedOrder,
    isSubmitting, canSubmit, loading, isLoggedIn, user, askEmail, refNumber, signOut,
  } = useCheckout();

  return (
    <section className="bg-oko-cream dark:bg-oko-night min-h-screen py-8 font-inter">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8">
        <div className="mb-6">
          <Link
            href={`${BASE_URL}/cart`}
            prefetch={false}
            className="inline-flex items-center gap-1.5 font-inter text-[13px] text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to cart
          </Link>
          <h1 className="font-oko-display font-semibold text-[27px] sm:text-[29px] leading-[1.2] text-oko-char dark:text-oko-cream">
            Checkout
          </h1>
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
                      signInClassName="w-full py-3 border border-oko-barn dark:border-oko-barn-light text-oko-barn dark:text-oko-barn-light hover:bg-oko-barn hover:text-white dark:hover:bg-oko-barn dark:hover:text-white font-inter font-semibold text-[13.5px] rounded-[2px] transition-colors"
                      registerClassName="font-inter text-[13px] text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
                    />
                  </div>
                )}

                <div className={cardCls}>
                  {isLoggedIn ? (
                    user && (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-[2px] bg-oko-char dark:bg-oko-barn flex items-center justify-center text-white font-oko-mono text-[12px] font-medium flex-shrink-0 select-none">
                            {user.name_initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-inter text-[14px] font-semibold text-oko-char dark:text-oko-cream truncate">{user.email}</p>
                            <p className="font-oko-mono text-[10px] uppercase tracking-[0.14em] text-oko-stone">Signed in</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={signOut}
                          className="font-inter text-[13px] text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
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
                      Notes <span className="normal-case tracking-normal font-normal">(optional)</span>
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
                  <p className="font-inter text-[13.5px] leading-relaxed text-oko-char-soft dark:text-oko-ondark">
                    After you place your order, we&apos;ll take you to our secure payment page to complete payment.
                  </p>
                  <div className="mt-5 pt-5 border-t border-oko-stone-line dark:border-oko-line-dark">
                    <Checkbox name="shipping_to_billing" checked={form?.shipping_to_billing} onChange={handleChange}>
                      Use shipping address as billing address
                    </Checkbox>
                    {!form?.shipping_to_billing && (
                      <div className="mt-5">
                        <p className="font-oko-display font-semibold text-[17px] text-oko-char dark:text-oko-cream mb-4">Billing address</p>
                        <AddressFields prefix="billing" form={form} onChange={handleChange} />
                      </div>
                    )}
                  </div>
                </div>

                {formError && (
                  <div role="alert" className="flex items-start gap-2.5 px-4 py-3 rounded-[2px] bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark border-l-4 border-l-oko-barn dark:border-l-oko-barn-light">
                    <svg className="w-4 h-4 text-oko-barn dark:text-oko-barn-light flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    {Array.isArray(formError) ? (
                      <ul className="flex flex-col gap-1 font-inter text-[13.5px] text-oko-char dark:text-oko-cream">
                        {formError.map((message, index) => <li key={index}>{message}</li>)}
                      </ul>
                    ) : (
                      <p className="font-inter text-[13.5px] text-oko-char dark:text-oko-cream">{formError}</p>
                    )}
                  </div>
                )}
                {placedOrder && (
                  <div role="status" className="px-4 py-3 rounded-[2px] bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark border-l-4 border-l-oko-sage dark:border-l-oko-sage-light font-inter text-[13.5px] text-oko-char-soft dark:text-oko-ondark">
                    Your order{placedOrder.orderNumber ? ` #${placedOrder.orderNumber}` : ""} has been placed,
                    but we couldn&apos;t open the payment page. Please contact us to complete payment
                    {STORE_CONTACT && <> — call <a href={`tel:${STORE_CONTACT}`} className="font-semibold text-oko-barn dark:text-oko-barn-light underline">{STORE_CONTACT}</a></>}
                    {STORE_EMAIL && <> or email <a href={`mailto:${STORE_EMAIL}`} className="font-semibold text-oko-barn dark:text-oko-barn-light underline">{STORE_EMAIL}</a></>}.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full py-3.5 bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[14px] rounded-[2px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting && (
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" aria-hidden="true" />
                  )}
                  {isSubmitting ? "Placing order…" : "Place order"}
                </button>
                <p className="flex items-center justify-center gap-1.5 text-center font-inter text-[13px] text-oko-stone">
                  <svg className="w-3.5 h-3.5 flex-shrink-0 text-oko-sage dark:text-oko-sage-light" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  Once your order is placed, you will be redirected to our secure payment page.
                </p>
              </form>
            )}
          </div>

          <div className="flex flex-col gap-4 lg:sticky lg:top-6">
            {!loading && (
              <div className={panelCls}>
                <h2 className="font-oko-display font-semibold text-[19px] leading-[1.2] text-oko-char dark:text-oko-cream mb-4">
                  Order summary
                </h2>
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
