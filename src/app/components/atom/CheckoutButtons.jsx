"use client";
import { useEffect, useState } from "react";
import dropin from "braintree-web-drop-in";
import braintree from "braintree-web";

export default function CheckoutButtons() {
  const [clientToken, setClientToken] = useState(null);

  useEffect(() => {
    async function fetchToken() {
      const res = await fetch("/api/braintree_token");
      const data = await res.json();
      setClientToken(data.clientToken);
    }
    fetchToken();
  }, []);

  useEffect(() => {
    if (!clientToken) return;

    braintree.client.create({ authorization: clientToken }).then((clientInstance) => {
      /** -------------------------
       * PayPal Button
       * ------------------------*/
    //   braintree.paypalCheckout.create({ client: clientInstance }).then((paypalCheckoutInstance) => {
    //     paypal.Buttons({
    //       createBillingAgreement: () =>
    //         paypalCheckoutInstance.createPayment({
    //           flow: "checkout",
    //           amount: "10.00", // dynamic cart amount
    //           currency: "USD",
    //         }),
    //       onApprove: async (data, actions) => {
    //         const payload = await paypalCheckoutInstance.tokenizePayment(data);
    //         console.log("PayPal nonce:", payload.nonce);
    //         // send payload.nonce to your server to create transaction
    //       },
    //     }).render("#paypal-button");
    //   });

      /** -------------------------
       * Google Pay Button
       * ------------------------*/
      braintree.googlePayment.create({ client: clientInstance }).then(async (googlePaymentInstance) => {
        const isReady = await googlePaymentInstance.isReadyToPay();
        if (!isReady) return;

        const paymentsClient = new window.google.payments.api.PaymentsClient({
          environment: "TEST", // or "PRODUCTION"
        });

        const button = paymentsClient.createButton({
          onClick: async () => {
            const paymentDataRequest = googlePaymentInstance.createPaymentDataRequest({
              transactionInfo: {
                totalPriceStatus: "FINAL",
                totalPrice: "10.00", // dynamic cart amount
                currencyCode: "USD",
              },
            });

            const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
            const payload = await googlePaymentInstance.parseResponse(paymentData);
            console.log("Google Pay nonce:", payload.nonce);
            // send payload.nonce to your server to create transaction
          },
        });

        document.getElementById("googlepay-button").appendChild(button);
      });
    });
  }, [clientToken]);

  return (
    <div className="space-y-4">
      <div id="paypal-button"></div>
      <div id="googlepay-button"></div>
    </div>
  );
}