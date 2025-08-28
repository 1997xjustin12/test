"use client";

import { useEffect, useRef, useState } from "react";
import dropin from "braintree-web-drop-in";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/cart";
import { BASE_URL, getSum, mapOrderItems, store_domain } from "@/app/lib/helpers";
import CheckoutForm from "@/app/components/atom/CheckoutForm";

export default function BraintreeForm({cartTotal}) {
  const router = useRouter();
  const { cartItems, clearCartItems, formattedCart } = useCart();
  // console.log("[TEST] formatted Cart", formattedCart);
  const [checkoutForm, setCheckoutForm] = useState({});
  const [totalPayable, setTotalPayable] = useState(0);
  const [clientToken, setClientToken] = useState(null);
  const [instance, setInstance] = useState(null);
  const dropinContainer = useRef(null);

  useEffect(() => {
    const payable = getSum(
      cartItems.map((i) => ({ ...i, price: i?.variants?.[0]?.price })),
      "price"
    ).toFixed(2);
    setTotalPayable(payable);
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

  async function createOrder(orderData) {
    try {
      const response = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const contentType = response.headers.get("content-type");
      const result = contentType?.includes("application/json")
        ? await response.json()
        : { success: false, message: "Invalid JSON response from server" };

      if (!response.ok || result.success === false) {
        return {
          success: false,
          message: result.message || "Failed to create order",
        };
      }

      return {
        success: true,
        data: result.data || result.order || result,
      };
    } catch (error) {
      console.error("Order creation failed:", error.message || error);
      return {
        success: false,
        message: error.message || "Unexpected error while creating order",
      };
    }
  }

  async function getPrice(orderData) {
    try {
      const response = await fetch("/api/orders/get-total", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const contentType = response.headers.get("content-type");
      const result = contentType?.includes("application/json")
        ? await response.json()
        : { success: false, message: "Invalid JSON response from server" };

      if (!response.ok || result.success === false) {
        return {
          success: false,
          message: result.message || "Failed to create order",
        };
      }

      return {
        success: true,
        data: result.data || result.order || result,
      };
    } catch (error) {
      console.error("Order creation failed:", error.message || error);
      return {
        success: false,
        message: error.message || "Unexpected error while creating order",
      };
    }
  }

  const handlePayment = async () => {
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

      // get-total
      // const get_price_data = checkoutForm?.data;
      // get_price_data["status"] = "pending";
      // get_price_data["payment_method"] = "braintree";
      // get_price_data["payment_status"] = false;
      // get_price_data["payment_details"] = "";
      // get_price_data["store_domain"] = store_domain;
      // get_price_data["items"] = formattedCart.map((item) => ({
      //   product_id: item?.product_id,
      //   price: item?.variants?.[0]?.price,
      //   quantity: item.count,
      //   total: Number((item?.variants?.[0]?.price * item.count).toFixed(2)),
      // }));

      // const get_price = await getPrice(get_price_data);
      // if (get_price?.success) {
        const total_amount = parseFloat(cartTotal?.total_price || 0).toFixed(2);
        const response = await fetch("/api/braintree_checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nonce, amount: `${total_amount}` }),
        });

        const result = await response.json();
        if (result.success) {
          const orders = checkoutForm?.data;
          orders["status"] = "paid";
          orders["payment_method"] = "braintree";
          orders["payment_status"] = true;
          orders["payment_details"] = result?.transaction?.id;
          orders["store_domain"] = store_domain;
          orders["items"] = mapOrderItems(formattedCart);

          const order_response = await createOrder(orders);

          if (order_response.success) {
            instance.teardown();
            setInstance(null);
            clearCartItems();
            router.push(`${BASE_URL}/payment_success`);
          } else {
            alert("Something went wrong! Please try again.");
          }
        } else {
          alert(`Payment failed: ${result.error}`);
        }
      // }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment error. Try again.");
    }
  };

  const handleCheckoutFormChange = (data) => {
    setCheckoutForm(data);
  };

  return (
    <>
      <CheckoutForm onChange={handleCheckoutFormChange} />
      <div className="shadow-sm border p-3 rounded-lg">
        <div ref={dropinContainer} className="min-h-[350px]"></div>
        <button
          onClick={handlePayment}
          disabled={!instance || !checkoutForm?.is_ready || !(totalPayable > 0)}
          className="text-sm md:text-base mt-2 font-bold bg-theme-600 hover:bg-theme-500 text-white py-[4px] px-[10px] md:py-[7px] md:px-[25px] rounded-md w-full max-w-[250px]"
        >
          Pay
        </button>
      </div>
    </>
  );
}
