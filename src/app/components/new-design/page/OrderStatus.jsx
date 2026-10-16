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

// Solana — the guest order page. Wording and logic: lib/order-status-view.js.

const cardCls =
  "bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 p-5";

const labelCls = "text-xs font-bold text-charcoal dark:text-white uppercase tracking-wider";

const toneCls = {
  attention: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
  neutral: "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400",
  positive: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400",
  progress: "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400",
  negative: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400",
};

const StatusBadge = ({ meta }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${toneCls[meta.tone]}`}>
    {meta.label}
  </span>
);

const Progress = ({ step }) => (
  <ol className="grid grid-cols-5 gap-1.5" aria-label="Order progress">
    {PROGRESS_STEPS.map((label, i) => (
      <li key={label} className="flex flex-col gap-1.5" aria-current={i === step ? "step" : undefined}>
        <span className={`h-1.5 rounded-full ${i <= step ? "bg-fire" : "bg-stone-200 dark:bg-stone-700"}`} />
        <span className={`text-[10px] leading-tight ${i <= step ? "font-semibold text-charcoal dark:text-white" : "text-stone-400 dark:text-stone-500"}`}>
          {label}
        </span>
      </li>
    ))}
  </ol>
);

const Row = ({ label, value, strong }) =>
  value === null ? null : (
    <div className={`flex justify-between ${strong ? "text-sm font-bold text-charcoal dark:text-white pt-2 border-t border-stone-200 dark:border-stone-700" : "text-xs text-stone-500 dark:text-stone-400"}`}>
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
          <h2 id={`order-${order.orderNumber}`} className="text-sm font-bold text-charcoal dark:text-white">
            Order #{order.orderNumber}
          </h2>
          {placed && <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Placed {placed}</p>}
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge meta={meta} />
          {formatMoney(order.total) && (
            <p className="text-sm font-bold text-charcoal dark:text-white">{formatMoney(order.total)}</p>
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
            className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-fire hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
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
        <div className="flex flex-col gap-4 pt-4 border-t border-stone-100 dark:border-stone-800">
          <p className={labelCls}>Items</p>
          <ul className="flex flex-col gap-4">
            {order.items.map((item, i) => (
              <li key={i} className="flex gap-3 items-center">
                <div className="relative w-14 h-14 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 flex-shrink-0 overflow-visible">
                  <span className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-full bg-stone-800 dark:bg-stone-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {item.quantity}
                  </span>
                  {item.image && (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      unoptimized={!item.image.startsWith("/")}
                      className="object-cover rounded-xl"
                      sizes="56px"
                    />
                  )}
                </div>
                <p className="flex-1 min-w-0 text-xs font-medium text-charcoal dark:text-white line-clamp-2">{item.title}</p>
                {formatMoney(item.total) && (
                  <p className="text-xs font-semibold text-charcoal dark:text-white flex-shrink-0">{formatMoney(item.total)}</p>
                )}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 pt-4 border-t border-stone-100 dark:border-stone-800">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-stone-100 dark:border-stone-800">
          {lines.length > 0 && (
            <div>
              <p className={`${labelCls} mb-2`}>Shipping To</p>
              <div className="text-sm text-stone-600 dark:text-stone-400 flex flex-col gap-0.5">
                {lines.map((line, i) => (
                  <p key={i} className={i === 0 ? "font-semibold text-charcoal dark:text-white" : undefined}>{line}</p>
                ))}
              </div>
            </div>
          )}
          {(method || eta || order.tracking) && (
            <div>
              <p className={`${labelCls} mb-2`}>Delivery</p>
              <div className="text-sm text-stone-600 dark:text-stone-400 flex flex-col gap-0.5">
                {method && <p>{method}</p>}
                {eta && <p>Estimated delivery: <span className="font-semibold text-charcoal dark:text-white">{eta}</span></p>}
                {order.tracking && (
                  <p>
                    {order.tracking.carrier && `${order.tracking.carrier} · `}
                    {order.tracking.url ? (
                      <a href={order.tracking.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-fire hover:underline">
                        {order.tracking.number || "Track shipment"}
                      </a>
                    ) : (
                      <span className="font-semibold text-charcoal dark:text-white">{order.tracking.number}</span>
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
      <span className="w-14 h-14 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
        <svg className="w-7 h-7 text-stone-500 dark:text-stone-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </span>
      <h1 className="text-xl font-bold text-charcoal dark:text-white">{copy.title}</h1>
      <p className="text-sm text-stone-500 dark:text-stone-400 max-w-md">{copy.message}</p>
    </div>
  );
}

export default function NewOrderStatusPage({ result, demo = false }) {
  const orders = result?.state === "ok" ? result.orders : [];

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto flex flex-col gap-5">
        {demo && (
          <p className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-4 py-2.5 text-xs font-medium text-amber-700 dark:text-amber-400">
            Preview — this page shows sample orders for demonstration only.
          </p>
        )}

        {orders.length > 0 ? (
          <>
            <div className={`${cardCls} flex flex-col gap-1`}>
              <h1 className="text-xl font-bold text-charcoal dark:text-white">{orders.length === 1 ? "Your Order" : "Your Orders"}</h1>
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
              <a href={`tel:${STORE_CONTACT}`} className="hover:text-fire transition-colors">{STORE_CONTACT}</a>
            )}
            {STORE_EMAIL && (
              <a href={`mailto:${STORE_EMAIL}`} className="hover:text-fire transition-colors">{STORE_EMAIL}</a>
            )}
            <p className="pt-2 mt-1 border-t border-stone-100 dark:border-stone-800 text-[10px] font-semibold text-stone-600 dark:text-stone-300">
              Sales & Support · Mon–Fri 5:00am–5:00pm PST
            </p>
          </div>
        </div>

        <Link
          href={BASE_URL || "/"}
          className="w-full py-3 text-center text-sm font-semibold rounded-xl border border-stone-200 dark:border-stone-700 text-charcoal dark:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
