import { braintreeGateway } from "@/app/lib/braintree";
import { checkoutMessage, getCheckoutState } from "@/app/lib/checkout-availability";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  // No payment token while the checkout is closed. The page already refuses,
  // but the guarantee belongs on the server: a token is what a browser needs
  // before it can submit a payment at all.
  const state = await getCheckoutState();
  if (state.closed) {
    return res.status(503).json({ error: checkoutMessage(state), checkoutClosed: true });
  }

  try {
    const { clientToken } = await braintreeGateway().clientToken.generate({});
    // Not logged: the client token authorises payment operations for a session,
    // and printing it puts a live credential in the server log.
    res.status(200).json({ clientToken });
  } catch (error) {
    console.error("[braintree] client token failed:", error?.message || error);
    res.status(500).json({ error: "Error generating client token" });
  }
}