import { STORE_NAME } from "@/app/lib/store_constants";
import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import Checkout from "@/app/components/new-design/page/Checkout";
import BBQCheckout from "@/app/components/bbq-design/page/Checkout";
import OKOCheckout from "@/app/components/oko-design/page/Checkout";

export const metadata = {
  title: `Checkout | ${STORE_NAME}`,
};

/**
 * Whether checkout is open on this domain is decided in (checkout)/layout.jsx,
 * which redirects to /checkout-unavailable when it isn't — before anything is
 * sent, so the form is never rendered first. See lib/checkout-availability.js.
 * The order API refuses on its own as well.
 *
 * Each brand draws its own checkout; all three share their behaviour through
 * components/checkout/useCheckout.js.
 */
export const dynamic = "force-dynamic";

function CheckoutPage() {
  if (ISOKO) return <OKOCheckout />;
  if (ISBBQ) return <BBQCheckout />;
  return <Checkout />;
}

export default CheckoutPage;
