import CheckoutClosedNotice from "@/app/components/checkout/CheckoutClosedNotice";
import { checkoutMessage, getCheckoutState } from "@/app/lib/checkout-availability";
import { STORE_NAME } from "@/app/lib/store_constants";
import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import Checkout from "@/app/components/new-design/page/Checkout";
import BBQCheckout from "@/app/components/bbq-design/page/Checkout";
import OKOCheckout from "@/app/components/oko-design/page/Checkout";

export const metadata = {
  title: `Checkout | ${STORE_NAME}`,
};

/**
 * The switch is read here, on the server, so a closed checkout never renders
 * the form first and takes it away a moment later. See
 * lib/checkout-availability.js.
 *
 * Each brand draws its own checkout; all three share their behaviour through
 * components/checkout/useCheckout.js.
 */
export const dynamic = "force-dynamic";

async function CheckoutPage() {
  const state = await getCheckoutState();
  if (state.closed) return <CheckoutClosedNotice message={checkoutMessage(state)} />;

  if (ISOKO) return <OKOCheckout />;
  if (ISBBQ) return <BBQCheckout />;
  return <Checkout />;
}

export default CheckoutPage;
