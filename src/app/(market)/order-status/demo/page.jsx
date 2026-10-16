import { notFound } from "next/navigation";
import { STORE_NAME } from "@/app/lib/store_constants";
import { DEMO_ORDERS } from "@/app/lib/order-status-demo";
import BrandOrderStatus from "../BrandOrderStatus";

/**
 * /order-status/demo — the guest order page with a sample order, in this
 * brand's design, for showing before real links are in the order emails.
 *
 * Off on production deployments unless ORDER_STATUS_DEMO=1 is set: a page of
 * made-up orders on the live storefront is not something a customer should
 * stumble on. Local, preview and staging deployments always have it.
 *
 *   ?status=unpaid | preparing | shipped | delivered | cancelled   (default unpaid)
 *   ?state=invalid | error                                         the empty states
 */

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Order Status (Preview) | ${STORE_NAME}`,
  robots: { index: false, follow: false },
};

const demoEnabled = () =>
  process.env.VERCEL_ENV !== "production" || process.env.ORDER_STATUS_DEMO === "1";

export default async function OrderStatusDemoPage({ searchParams }) {
  if (!demoEnabled()) notFound();

  const { state, status } = await searchParams;
  if (state === "invalid" || state === "error") {
    return <BrandOrderStatus result={{ state }} demo />;
  }

  const order = DEMO_ORDERS.find((o) => o.status === status) ?? DEMO_ORDERS[0];
  return <BrandOrderStatus result={{ state: "ok", orders: [order] }} demo />;
}
