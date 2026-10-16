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

// BBQ — the guest order page. Wording and logic: lib/order-status-view.js.

const cardCls =
  "bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm p-5";

const labelCls = "font-oswald text-xs font-semibold text-char dark:text-ash uppercase tracking-wider";

const divider = "border-grate dark:border-white/10";

const toneCls = {
  attention: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
  neutral: "bg-grate/30 dark:bg-white/5 text-stone-600 dark:text-stone-400",
  positive: "bg-green-50 dark:bg-green-900/20 text-bbq-green",
  progress: "bg-theme-600/10 dark:bg-theme-600/20 text-theme-600",
  negative: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400",
};

const StatusBadge = ({ meta }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm font-oswald text-[11px] font-semibold uppercase tracking-wide ${toneCls[meta.tone]}`}>
    {meta.label}
  </span>
);

const Progress = ({ step }) => (
  <ol className="grid grid-cols-5 gap-1" aria-label="Order progress">
    {PROGRESS_STEPS.map((label, i) => (
      <li key={label} className="flex flex-col gap-1.5" aria-current={i === step ? "step" : undefined}>
        <span className={`h-1.5 ${i <= step ? "bg-theme-600" : "bg-grate dark:bg-white/10"}`} />
        <span className={`font-oswald text-[10px] uppercase tracking-wide leading-tight ${i <= step ? "font-semibold text-char dark:text-ash" : "text-stone-400 dark:text-stone-500"}`}>
          {label}
        </span>
      </li>
    ))}
  </ol>
);

const Row = ({ label, value, strong }) =>
  value === null ? null : (
    <div className={`flex justify-between ${strong ? `text-sm font-bold text-char dark:text-ash pt-2 border-t ${divider}` : "text-xs text-stone-500 dark:text-stone-400"}`}>
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
          <h2 id={`order-${order.orderNumber}`} className="font-oswald font-bold text-base uppercase tracking-tight text-char dark:text-ash">
            Order #{order.orderNumber}
          </h2>
          {placed && <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Placed {placed}</p>}
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge meta={meta} />
          {formatMoney(order.total) && (
            <p className="text-sm font-bold text-char dark:text-ash">{formatMoney(order.total)}</p>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="flex flex-col gap-3">
        <p className="text-sm text-stone-600 dark:text-stone-300">{meta.message}</p>
        {meta.step !== null && <Progress step={meta.step} />}
        {order.paymentLink && (
          <a
            href={order.paymentLink}
            rel="noopener noreferrer"
            className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-theme-600 hover:bg-theme-700 text-white font-oswald font-semibold text-sm uppercase tracking-wide transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Complete Payment
          </a>
        )}
      </div>

      {/* Items */}
      {order.items.length > 0 && (
        <div className={`flex flex-col gap-4 pt-4 border-t ${divider}`}>
          <p className={labelCls}>Items</p>
          <ul className="flex flex-col gap-4">
            {order.items.map((item, i) => (
              <li key={i} className="flex gap-3 items-center">
                <div className="relative w-14 h-14 rounded-sm border border-grate dark:border-white/10 bg-white dark:bg-char flex-shrink-0 overflow-visible">
                  <span className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-sm bg-charcoal dark:bg-smoke text-white text-[10px] font-bold flex items-center justify-center">
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
                <p className="flex-1 min-w-0 text-xs font-medium text-char dark:text-ash line-clamp-2">{item.title}</p>
                {formatMoney(item.total) && (
                  <p className="text-xs font-semibold text-char dark:text-ash flex-shrink-0">{formatMoney(item.total)}</p>
                )}
              </li>
            ))}
          </ul>
          <div className={`flex flex-col gap-2 pt-4 border-t ${divider}`}>
            <Row label="Subtotal" value={formatMoney(order.subTotal)} />
            <Row label="Shipping" value={order.shipping === 0 ? "FREE" : formatMoney(order.shipping)} />
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
              <p className={`${labelCls} mb-2`}>Shipping To</p>
              <div className="text-sm text-stone-600 dark:text-stone-400 flex flex-col gap-0.5">
                {lines.map((line, i) => (
                  <p key={i} className={i === 0 ? "font-semibold text-char dark:text-ash" : undefined}>{line}</p>
                ))}
              </div>
            </div>
          )}
          {(method || eta || order.tracking) && (
            <div>
              <p className={`${labelCls} mb-2`}>Delivery</p>
              <div className="text-sm text-stone-600 dark:text-stone-400 flex flex-col gap-0.5">
                {method && <p>{method}</p>}
                {eta && <p>Estimated delivery: <span className="font-semibold text-char dark:text-ash">{eta}</span></p>}
                {order.tracking && (
                  <p>
                    {order.tracking.carrier && `${order.tracking.carrier} · `}
                    {order.tracking.url ? (
                      <a href={order.tracking.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-theme-600 hover:underline">
                        {order.tracking.number || "Track shipment"}
                      </a>
                    ) : (
                      <span className="font-semibold text-char dark:text-ash">{order.tracking.number}</span>
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
      <span className="w-14 h-14 rounded-sm bg-grate/30 dark:bg-white/5 flex items-center justify-center">
        <svg className="w-7 h-7 text-stone-500 dark:text-stone-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </span>
      <h1 className="font-oswald font-bold text-xl uppercase tracking-tight text-char dark:text-ash">{copy.title}</h1>
      <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md">{copy.message}</p>
    </div>
  );
}

export default function BBQOrderStatusPage({ result, demo = false }) {
  const orders = result?.state === "ok" ? result.orders : [];

  return (
    <div className="min-h-screen py-10 px-4 font-sora">
      <div className="max-w-3xl mx-auto flex flex-col gap-5">
        {demo && (
          <p className="rounded-sm border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-4 py-2.5 text-xs font-medium text-amber-700 dark:text-amber-400">
            Preview — this page shows sample orders for demonstration only.
          </p>
        )}

        {orders.length > 0 ? (
          <>
            <div className={`${cardCls} flex flex-col gap-1`}>
              <h1 className="font-oswald font-bold text-xl uppercase tracking-tight text-char dark:text-ash">{orders.length === 1 ? "Your Order" : "Your Orders"}</h1>
              <p className="text-sm text-stone-500 dark:text-stone-400">
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
          <p className={`${labelCls} mb-3`}>Need Help?</p>
          <div className="flex flex-col gap-2 text-xs text-stone-500 dark:text-stone-400">
            {STORE_CONTACT && (
              <a href={`tel:${STORE_CONTACT}`} className="hover:text-theme-600 transition-colors">{STORE_CONTACT}</a>
            )}
            {STORE_EMAIL && (
              <a href={`mailto:${STORE_EMAIL}`} className="hover:text-theme-600 transition-colors">{STORE_EMAIL}</a>
            )}
            <p className={`pt-2 mt-1 border-t ${divider} font-oswald text-[10px] font-semibold uppercase tracking-wide text-char/50 dark:text-ash/40`}>
              Sales & Support · Mon–Fri 5:00am–5:00pm PST
            </p>
          </div>
        </div>

        <Link
          href={BASE_URL || "/"}
          className="w-full py-3 text-center font-oswald font-semibold text-sm uppercase tracking-wide rounded-sm border border-grate dark:border-white/10 text-char dark:text-ash hover:bg-paper dark:hover:bg-smoke transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
