import gateway from "@/app/lib/braintree";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { paymentMethodNonce, amount,  nonce } = req.body;

  try {
    const result = await gateway.transaction.sale({
      amount,
      paymentMethodNonce: nonce,
      options: { submitForSettlement: true },
    });

    if (result.success) {
      res.status(200).json({ success: true, transaction: result.transaction });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: "Transaction failed" });
  }
}