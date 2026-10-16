import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import NewOrderStatusPage from "@/app/components/new-design/page/OrderStatus";
import BBQOrderStatusPage from "@/app/components/bbq-design/page/OrderStatus";
import OKOOrderStatusPage from "@/app/components/oko-design/page/OrderStatus";

/**
 * Picks this brand's design of the guest order page. Shared by the real page
 * (/order-status) and the demo (/order-status/demo), so the two cannot render
 * differently.
 *
 * @param result  { state: "ok", orders } | { state: "invalid" } | { state: "error" }
 */
export default function BrandOrderStatus({ result, demo = false }) {
  if (ISOKO) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <OKOOrderStatusPage result={result} demo={demo} />
      </div>
    );
  }
  if (ISBBQ) {
    return (
      <div className="min-h-svh bg-ash dark:bg-char">
        <BBQOrderStatusPage result={result} demo={demo} />
      </div>
    );
  }
  return (
    <div className="min-h-svh bg-stone-50 dark:bg-stone-950">
      <NewOrderStatusPage result={result} demo={demo} />
    </div>
  );
}
