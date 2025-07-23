"use client";

import { useEffect, useRef, useState } from "react";
import dropin from "braintree-web-drop-in";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/cart";
import { formatPrice, getSum } from "@/app/lib/helpers";


const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

export default function BraintreeForm() {
  const router = useRouter();
  const { cartItems, clearCartItems } = useCart();
  const [totalPayable, setTotalPayable] = useState(0);
  const [clientToken, setClientToken] = useState(null);
  const [instance, setInstance] = useState(null);
  const dropinContainer = useRef(null);
  console.log("cartItems", cartItems);

  useEffect(() => {
    setTotalPayable(getSum(cartItems, "price").toFixed(2));
  }, [cartItems]);

  useEffect(() => {
    async function initializeDropIn() {
      if (!dropinContainer.current) return;

      try {
        const res = await fetch("/api/braintree_token");
        const data = await res.json();
        setClientToken(data.clientToken);

        if (!data.clientToken) {
          alert("Error: No client token received");
          return;
        }

        if (instance) {
          await instance.teardown();
          setInstance(null);
        }

        const dropinInstance = await dropin.create({
          authorization: data.clientToken,
          container: dropinContainer.current,
          vaultManager: false, // Disable stored payment methods
          card: {
            cardholderName: { required: true },
            overrides: {
              fields: {
                number: { placeholder: "4111 1111 1111 1111" },
                cvv: { required: true, placeholder: "123" }, // ✅ Force CVV
                expirationDate: { placeholder: "MM/YY" },
              },
            },
          },
        });

        setInstance(dropinInstance);
      } catch (error) {
        // console.error("Braintree Drop-in Error:", error);
        // alert("Payment UI failed to load.");
      }
    }

    initializeDropIn();
  }, []);

  const handlePayment = async () => {
    // console.log("total_payable",totalPayable);
    // return;
    if (!instance) {
      alert("Drop-in UI is not initialized");
      return;
    }

    try {
      const { nonce } = await instance.requestPaymentMethod();
      console.log("Generated Nonce:", nonce);

      if (!nonce) {
        alert("Error: No nonce received. Try again.");
        return;
      }

      const response = await fetch("/api/braintree_checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nonce, amount: `${totalPayable}` }),
      });

      const result = await response.json();
      if (result.success) {
        instance.teardown();
        setInstance(null);
        // clear Cart
        clearCartItems();
        // redirect to succes payment page
        router.push(`${BASE_URL}/payment_success`)
      } else {
        alert(`Payment failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment error. Try again.");
    }
  };

  return (
    <div className="shadow-sm border p-3 rounded-lg">
      <div ref={dropinContainer} className="min-h-[350px]"></div>
      <button
        onClick={handlePayment}
        disabled={!instance}
        className="text-sm md:text-base mt-2 font-bold bg-theme-600 hover:bg-theme-500 text-white py-[4px] px-[10px] md:py-[7px] md:px-[25px] rounded-md w-full max-w-[250px]"
      >
        Pay
      </button>
    </div>
  );
}
