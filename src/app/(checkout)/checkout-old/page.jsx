import CheckoutOldClient from "./CheckoutOldClient";
import CheckoutClosedNotice from "@/app/components/checkout/CheckoutClosedNotice";
import { checkoutMessage, getCheckoutState } from "@/app/lib/checkout-availability";

/**
 * The previous checkout, still reachable at its own address.
 *
 * It is gated by the same switch as /checkout. Leaving one door open while
 * closing the other would be the kind of gap nobody notices until an order
 * arrives through it.
 */
export const dynamic = "force-dynamic";

export default async function CheckoutOldPage() {
  const state = await getCheckoutState();
  if (state.closed) return <CheckoutClosedNotice message={checkoutMessage(state)} />;

  return <CheckoutOldClient />;
}
