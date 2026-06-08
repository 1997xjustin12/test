"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { subscribe } from "@/app/lib/api";

export default function NewSubscribePage() {
  const params = useSearchParams();
  const email = params.get("email");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

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
          setStatus("error");
          setMessage(data?.email?.[0] || "Failed to subscribe. Please try again later.");
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
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
          <h2 className="font-serif text-2xl text-charcoal dark:text-white mb-1">Newsletter</h2>
          <div className="mb-6">
            <p className="font-bold text-gray-900 dark:text-gray-100 mb-1">
              Stay Warm with Exclusive Offers
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Subscribe for fireplace and outdoor heating deals, seasonal discounts, and tips
              to upgrade your home comfort.
            </p>
          </div>

          <div>
            {status === "loading" && (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-theme-600 animate-spin flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Subscribing {email}…
                </p>
              </div>
            )}
            {status === "success" && (
              <span className="flex items-center gap-2 px-5 py-3 rounded-lg bg-green-600/10 dark:bg-green-600/20 text-green-700 dark:text-green-400 font-semibold text-sm">
                ✓ {message}
              </span>
            )}
            {status === "error" && (
              <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50">
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
