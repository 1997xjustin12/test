"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { subscribe } from "@/app/lib/api";

export default function BBQSubscribePage() {
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
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 font-sora">
      <div className="w-full max-w-md">
        <div className="bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm p-8">
          <h2 className="font-oswald font-bold text-2xl uppercase tracking-tight text-char dark:text-ash mb-1">
            Newsletter
          </h2>
          <div className="mb-6">
            <p className="font-oswald font-semibold text-sm uppercase tracking-wide text-char dark:text-ash mb-1">
              Stay Warm with Exclusive Offers
            </p>
            <p className="text-sm font-light leading-relaxed text-stone-600 dark:text-stone-400">
              Subscribe for fireplace and outdoor heating deals, seasonal discounts, and tips
              to upgrade your home comfort.
            </p>
          </div>

          <div>
            {status === "loading" && (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-grate dark:border-white/10 border-t-fire animate-spin flex-shrink-0" />
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Subscribing {email}…
                </p>
              </div>
            )}
            {status === "success" && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-sm border border-bbq-green/30 bg-bbq-green/10 text-bbq-green font-oswald font-semibold text-sm uppercase tracking-wide">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {message}
              </div>
            )}
            {status === "error" && (
              <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-sm bg-ember/5 border border-ember/20">
                <p className="text-xs text-ember font-medium">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
