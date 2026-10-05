import { braintreeGateway } from "@/app/lib/braintree";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
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