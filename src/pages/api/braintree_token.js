import gateway from "@/app/lib/braintree";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { clientToken } = await gateway.clientToken.generate({});
    console.log({clientToken});
    res.status(200).json({ clientToken });
  } catch (error) {
    console.log({error});
    res.status(500).json({ error: "Error generating client token" });
  }
}