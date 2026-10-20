import { headers } from "next/headers";
import { checkoutMessage, getCheckoutState } from "@/app/lib/checkout-availability";
import { STORE_NAME } from "@/app/lib/store_constants";
import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import CheckoutUnavailable from "@/app/components/new-design/page/CheckoutUnavailable";
import BBQCheckoutUnavailable from "@/app/components/bbq-design/page/CheckoutUnavailable";
import OKOCheckoutUnavailable from "@/app/components/oko-design/page/CheckoutUnavailable";

/**
 * Where /checkout sends shoppers while checkout is switched off for this
 * domain (see lib/checkout-availability.js). In the storefront's layout, so it
 * carries the brand's own header and footer, and drawn by each brand's design.
 *
 * Never indexed: it is a temporary state of the checkout, not a page of the
 * store.
 */
export const metadata = {
  title: `Checkout isn't open yet | ${STORE_NAME}`,
  robots: { index: false, follow: false },
};

// Per domain and per admin change; nothing here can be cached.
export const dynamic = "force-dynamic";

export default async function CheckoutUnavailablePage() {
  const state = await getCheckoutState((await headers()).get("host"));
  const message = checkoutMessage(state);

  if (ISOKO) return <OKOCheckoutUnavailable message={message} />;
  if (ISBBQ) return <BBQCheckoutUnavailable message={message} />;
  return <CheckoutUnavailable message={message} />;
}
