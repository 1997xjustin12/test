import braintree from "braintree";

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "fcywwwbnwzzdknwy",
  publicKey: "3ntx5gdqdf2pcs6c",
  privateKey: "c5bcf05aa2d60a304bff38b087a7f691",
});

export default gateway;