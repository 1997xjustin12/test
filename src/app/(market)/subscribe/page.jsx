"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { subscribe } from "@/app/lib/api";

export default function SubscribePage() {
  const params = useSearchParams();
  const email = params.get("email");
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    if (!email) {
      setStatus("error");
      setMessage("Email is required.");
      return;
    }

    if (!isValidEmail(email)) {
      setStatus("error");
      setMessage("Invalid email address. Please check the link.");
      return;
    }

    const subscribeEmail = async () => {
      try {
        const response = await subscribe(email);

        const { data, success } = await response.json();

        if (!success) {
          if (data?.email) {
            setStatus("error");
            setMessage(data?.email?.[0]);
          } else {
            setStatus("error");
            setMessage("Failed to subscribe. Please try again later.");
            console.warn("[subscribeEmail] !response.ok", err);
          }
          return;
        }
        setStatus("success");
        setMessage(`You're now subscribed with ${email}!`);
      } catch (err) {
        setStatus("error");
        setMessage("Failed to subscribe. Please try again later.");
        console.warn("[subscribeEmail] error", err);
      }
    };

    subscribeEmail();
  }, [email]);

  return (
    <div className="container mx-auto flex items-center justify-center p-[20px]">
      <div className="w-full max-w-[600px] rounded p-3 shadow border border-neutral-300 flex flex-col gap-[15px]">
        <h2>Newsletter</h2>
        <div>
          <h4 className="font-bold text-neutral-800">
            Stay Warm with Exclusive Offers
          </h4>
          <p className="mt-1 text-neutral-700">
            Subscribe for fireplace and outdoor heating deals, seasonal
            discounts, and tips to upgrade your home comfort.
          </p>
        </div>
        <div className="mt-[30px]">
          {status === "loading" && <p>Subscribing {email}...</p>}
          {status === "success" && <p style={{ color: "green" }}>{message}</p>}
          {status === "error" && <p style={{ color: "red" }}>{message}</p>}
        </div>
      </div>
    </div>
  );
}
