"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { unsubscribe } from "@/app/lib/api";

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

    const unsubscribeEmail = async () => {
      try {
        const response = await unsubscribe(email);

        const { data, success } = await response.json();

        if (!success) {
          if (data?.email) {
            setStatus("error");
            setMessage(data?.email?.[0]);
          } else {
            setStatus("error");
            setMessage("Failed to unsubscribe. Please try again later.");
            console.warn("[unsubscribeEmail] !response?.ok", err);
          }
          return;
        }
        setStatus("success");
        setMessage(`You're now unsubscribed with ${email}!`);
      } catch (err) {
        setStatus("error");
        setMessage("Failed to unsubscribe. Please try again later.");
        console.warn("[unsubscribeEmail] error", err);
      }
    };

    unsubscribeEmail();
  }, [email]);

  return (
    <div className="container mx-auto flex items-center justify-center p-[20px]">
      <div className="w-full max-w-[600px] rounded p-3 shadow border border-neutral-300 flex flex-col gap-[15px]">
        <h2>Newsletter</h2>
        <div>
          <h4 className="font-bold text-neutral-800">Before you go…</h4>
          <p className="mt-1 text-neutral-700">
            Unsubscribing means no more discounts, installation tips, or new
            arrivals from us. Continue?
          </p>
        </div>
        <div className="mt-[30px]">
          {status === "loading" && <p>Unsubscribing {email}...</p>}
          {status === "success" && <p style={{ color: "green" }}>{message}</p>}
          {status === "error" && <p style={{ color: "red" }}>{message}</p>}
        </div>
      </div>
    </div>
  );
}
