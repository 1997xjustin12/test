import braintree from "braintree";

/**
 * The Braintree gateway.
 *
 * There are no credentials in this file. A set of sandbox keys used to sit here
 * as a fallback for when the BRAINTREE_* variables were unset, which was two
 * problems wearing one coat:
 *
 *   1. A private key in the repository is a committed secret, whatever
 *      environment it belongs to. It is in the git history and has to be
 *      rotated — see docs/audits/security/secsuite-run-7-remediation.pdf.
 *   2. The fallback applied in production too. A deployment missing its
 *      variables logged a warning and then processed real checkouts against
 *      the sandbox: orders would look successful and take no money. A warning
 *      is not a safe answer to "which account am I charging?".
 *
 * So the credentials are required, and missing ones throw at the point of use.
 * Throwing when the module loads would break the build, which has no business
 * knowing payment keys; throwing on the first call fails the checkout that
 * cannot be completed anyway, loudly and with a reason.
 */

const REQUIRED = ["BRAINTREE_MERCHANT_ID", "BRAINTREE_PUBLIC_KEY", "BRAINTREE_PRIVATE_KEY"];

let gateway = null;

/** The configured gateway. Throws if this deployment has no credentials. */
export function braintreeGateway() {
  if (gateway) return gateway;

  const missing = REQUIRED.filter((name) => !process.env[name]);
  if (missing.length) {
    throw new Error(
      `Braintree is not configured: ${missing.join(", ")} ${missing.length === 1 ? "is" : "are"} not set. ` +
        "Set them for this deployment, with BRAINTREE_ENV=production to take real payments.",
    );
  }

  gateway = new braintree.BraintreeGateway({
    environment:
      process.env.BRAINTREE_ENV === "production"
        ? braintree.Environment.Production
        : braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });
  return gateway;
}

/** Whether this deployment can take payments at all. */
export const braintreeConfigured = () => REQUIRED.every((name) => Boolean(process.env[name]));
