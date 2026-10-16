import Image from "next/image";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";
import { STORE_CONTACT, STORE_EMAIL } from "@/app/lib/store_constants";
import {
  EMPTY_STATES,
  PROGRESS_STEPS,
  addressLines,
  formatMoney,
  formatOrderDate,
  shippingMethodLabel,
  statusMeta,
} from "@/app/lib/order-status-view";

// OKO — the guest order page. Wording and logic: lib/order-status-view.js.

const cardCls =
  "bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] p-5";

const eyebrowCls =
  "font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-stone";

const divider = "border-oko-stone-line dark:border-oko-line-dark";

const outlineBtn =
  "text-center font-inter font-semibold text-[13.5px] rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark text-oko-char dark:text-oko-cream hover:border-oko-char dark:hover:border-oko-cream transition-colors";

const toneCls = {
  attention: "text-oko-barn dark:text-oko-barn-light border-oko-barn/30 bg-oko-barn/10",
  neutral: "text-oko-stone border-oko-stone-line bg-oko-cream-dim dark:bg-oko-night-3 dark:border-oko-line-dark",
  positive: "text-oko-sage border-oko-sage/30 bg-oko-sage/10",
  progress: "text-oko-sage border-oko-sage/30 bg-oko-sage/10",
  negative: "text-oko-barn dark:text-oko-barn-light border-oko-barn/30 bg-oko-barn/10",
};

const StatusBadge = ({ meta }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[2px] border font-inter text-[10px] font-semibold uppercase tracking-[0.06em] ${toneCls[meta.tone]}`}>
    {meta.label}
  </span>
);

const Progress = ({ step }) => (
  <ol className="grid grid-cols-5 gap-1" aria-label="Order progress">
    {PROGRESS_STEPS.map((label, i) => (
      <li key={label} className="flex flex-col gap-1.5" aria-current={i === step ? "step" : undefined}>
        <span className={`h-[3px] ${i <= step ? "bg-oko-barn dark:bg-oko-barn-light" : "bg-oko-stone-line dark:bg-oko-line-dark"}`} />
        <span className={`font-oko-mono text-[9.5px] uppercase tracking-[0.08em] leading-tight ${i <= step ? "text-oko-char dark:text-oko-cream" : "text-oko-stone"}`}>
          {label}
        </span>
      </li>
    ))}
  </ol>
);

const Row = ({ label, value, strong }) =>
  value === null ? null : (
    <div className={`flex justify-between font-inter ${strong ? `text-[16px] font-semibold text-oko-char dark:text-oko-cream pt-2 border-t ${divider}` : "text-[13px] text-oko-char-soft dark:text-oko-ondark"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );

function OrderCard({ order }) {
  const meta = statusMeta(order.status);
  const placed = formatOrderDate(order.createdAt);
  const eta = formatOrderDate(order.estimatedDelivery);
  const method = shippingMethodLabel(order.shippingMethod);
  const lines = addressLines(order.shippingAddress);

  return (
    <article className={`${cardCls} flex flex-col gap-5`} aria-labelledby={`order-${order.orderNumber}`}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={eyebrowCls}>{placed ? `Placed ${placed}` : "Order"}</p>
          <h2 id={`order-${order.orderNumber}`} className="font-oko-display font-semibold text-[19px] leading-[1.25] text-oko-char dark:text-oko-cream mt-1">
            Order #{order.orderNumber}
          </h2>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <StatusBadge meta={meta} />
          {formatMoney(order.total) && (
            <p className="font-inter text-[15px] font-semibold text-oko-char dark:text-oko-cream">{formatMoney(order.total)}</p>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-3">
        <p className="font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark">{meta.message}</p>
        {meta.step !== null && <Progress step={meta.step} />}
        {order.paymentLink && (
          <a
            href={order.paymentLink}
            rel="noopener noreferrer"
            className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-[2px] bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[13.5px] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Complete payment
          </a>
        )}
      </div>

      {/* Items */}
      {order.items.length > 0 && (
        <div className={`flex flex-col gap-4 pt-4 border-t ${divider}`}>
          <p className={eyebrowCls}>Items</p>
          <ul className="flex flex-col gap-4">
            {order.items.map((item, i) => (
              <li key={i} className="flex gap-3 items-center">
                <div className="relative w-14 h-14 rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark bg-oko-cream-dim dark:bg-oko-night-3 flex-shrink-0 overflow-visible">
                  <span className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-[2px] bg-oko-char dark:bg-oko-cream-dim text-oko-cream dark:text-oko-char font-oko-mono text-[10px] font-medium flex items-center justify-center">
                    {item.quantity}
                  </span>
                  {item.image && (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      unoptimized={!item.image.startsWith("/")}
                      className="object-cover"
                      sizes="56px"
                    />
                  )}
                </div>
                <p className="flex-1 min-w-0 font-inter text-[14px] font-medium text-oko-char dark:text-oko-cream line-clamp-2">{item.title}</p>
                {formatMoney(item.total) && (
                  <p className="font-inter text-[14px] font-semibold text-oko-char dark:text-oko-cream flex-shrink-0">{formatMoney(item.total)}</p>
                )}
              </li>
            ))}
          </ul>
          <div className={`flex flex-col gap-2 pt-4 border-t ${divider}`}>
            <Row label="Subtotal" value={formatMoney(order.subTotal)} />
            <Row label="Shipping" value={order.shipping === 0 ? "Free" : formatMoney(order.shipping)} />
            <Row label="Tax" value={formatMoney(order.tax)} />
            {order.discount ? <Row label="Discount" value={`−${formatMoney(order.discount)}`} /> : null}
            <Row label="Total" value={formatMoney(order.total)} strong />
          </div>
        </div>
      )}

      {/* Delivery */}
      {(lines.length > 0 || method || eta || order.tracking) && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t ${divider}`}>
          {lines.length > 0 && (
            <div>
              <p className={`${eyebrowCls} mb-2`}>Shipping to</p>
              <div className="font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark flex flex-col gap-0.5">
                {lines.map((line, i) => (
                  <p key={i} className={i === 0 ? "font-semibold text-oko-char dark:text-oko-cream" : undefined}>{line}</p>
                ))}
              </div>
            </div>
          )}
          {(method || eta || order.tracking) && (
            <div>
              <p className={`${eyebrowCls} mb-2`}>Delivery</p>
              <div className="font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark flex flex-col gap-0.5">
                {method && <p>{method}</p>}
                {eta && <p>Estimated delivery: <span className="font-semibold text-oko-char dark:text-oko-cream">{eta}</span></p>}
                {order.tracking && (
                  <p>
                    {order.tracking.carrier && `${order.tracking.carrier} · `}
                    {order.tracking.url ? (
                      <a href={order.tracking.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-oko-barn dark:text-oko-barn-light hover:underline">
                        {order.tracking.number || "Track shipment"}
                      </a>
                    ) : (
                      <span className="font-semibold text-oko-char dark:text-oko-cream">{order.tracking.number}</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function EmptyState({ state }) {
  const copy = EMPTY_STATES[state] ?? EMPTY_STATES.invalid;
  return (
    <div className={`${cardCls} flex flex-col items-center text-center gap-3 py-10`}>
      <span className="w-14 h-14 rounded-full border border-oko-stone-line dark:border-oko-line-dark bg-oko-cream-dim dark:bg-oko-night-3 flex items-center justify-center">
        <svg className="w-7 h-7 text-oko-stone" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </span>
      <h1 className="font-oko-display font-semibold text-[24px] leading-[1.2] text-oko-char dark:text-oko-cream">{copy.title}</h1>
      <p className="font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark max-w-md">{copy.message}</p>
    </div>
  );
}

export default function OKOOrderStatusPage({ result, demo = false }) {
  const orders = result?.state === "ok" ? result.orders : [];

  return (
    <div className="min-h-screen py-10 px-4 bg-oko-cream dark:bg-oko-night">
      <div className="max-w-3xl mx-auto flex flex-col gap-5">
        {demo && (
          <p className="rounded-[2px] border border-oko-barn/30 bg-oko-barn/10 px-4 py-2.5 font-inter text-[12.5px] font-medium text-oko-barn dark:text-oko-barn-light">
            Preview — this page shows sample orders for demonstration only.
          </p>
        )}

        {orders.length > 0 ? (
          <>
            <div className={`${cardCls} flex flex-col gap-1.5`}>
              <p className={eyebrowCls}>Order status</p>
              <h1 className="font-oko-display font-semibold text-[27px] leading-[1.2] text-oko-char dark:text-oko-cream">{orders.length === 1 ? "Your order." : "Your orders."}</h1>
              <p className="font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark">
                {orders.length === 1 ? "1 order" : `${orders.length} orders`} · status updates appear here as your order progresses.
              </p>
            </div>
            {orders.map((order) => (
              <OrderCard key={order.orderNumber} order={order} />
            ))}
          </>
        ) : (
          <EmptyState state={result?.state} />
        )}

        {/* Support */}
        <div className={cardCls}>
          <p className={`${eyebrowCls} mb-3`}>Need help?</p>
          <div className="flex flex-col gap-2 font-inter text-[13px] text-oko-char-soft dark:text-oko-ondark">
            {STORE_CONTACT && (
              <a href={`tel:${STORE_CONTACT}`} className="hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors">{STORE_CONTACT}</a>
            )}
            {STORE_EMAIL && (
              <a href={`mailto:${STORE_EMAIL}`} className="hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors">{STORE_EMAIL}</a>
            )}
            <p className={`pt-2 mt-1 border-t ${divider} font-oko-mono text-[10px] font-medium uppercase tracking-[0.14em] text-oko-stone`}>
              Sales &amp; support · Mon–Fri 5:00am–5:00pm PST
            </p>
          </div>
        </div>

        <Link href={BASE_URL || "/"} className={`w-full py-3 ${outlineBtn}`}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
