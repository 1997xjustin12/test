import braintree from "braintree";

// Fallback sandbox credentials — only used when BRAINTREE_* env vars are not
// set, so local/dev checkouts keep working. Production deployments must set
// BRAINTREE_ENV=production plus the three BRAINTREE_* keys below.
const SANDBOX_FALLBACK = {
  merchantId: "fcywwwbnwzzdknwy",
  publicKey: "3ntx5gdqdf2pcs6c",
  privateKey: "c5bcf05aa2d60a304bff38b087a7f691",
};

const usingFallback = !process.env.BRAINTREE_MERCHANT_ID;
if (usingFallback && process.env.NODE_ENV === "production") {
  console.warn(
    "[braintree] BRAINTREE_MERCHANT_ID/PUBLIC_KEY/PRIVATE_KEY are not set — falling back to sandbox credentials in a production build. Set BRAINTREE_ENV=production and the BRAINTREE_* env vars to process real payments.",
  );
}

const gateway = new braintree.BraintreeGateway({
  environment:
    process.env.BRAINTREE_ENV === "production"
      ? braintree.Environment.Production
      : braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID || SANDBOX_FALLBACK.merchantId,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY || SANDBOX_FALLBACK.publicKey,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY || SANDBOX_FALLBACK.privateKey,
});

export default gateway;