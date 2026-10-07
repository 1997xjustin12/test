import CheckoutComponent from "@/app/components/molecule/CheckoutComponent";
import CheckoutClosedNotice from "@/app/components/checkout/CheckoutClosedNotice";
import { checkoutMessage, getCheckoutState } from "@/app/lib/checkout-availability";
import { STORE_NAME } from "@/app/lib/store_constants";

export const metadata = {
  title: `Checkout | ${STORE_NAME}`,
};

/**
 * The switch is read here, on the server, so a closed checkout never renders
 * the payment form first and takes it away a moment later. CheckoutComponent
 * is untouched and still does everything it did — it simply is not reached
 * while the door is shut. See lib/checkout-availability.js.
 */
export const dynamic = "force-dynamic";

async function CheckoutPage() {
  const state = await getCheckoutState();
  if (state.closed) return <CheckoutClosedNotice message={checkoutMessage(state)} />;

  return <CheckoutComponent />;
}

export default CheckoutPage;
