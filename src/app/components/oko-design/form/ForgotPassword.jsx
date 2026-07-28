"use client";

import { useState, useEffect } from "react";
import FormCard from "@/app/components/oko-design/form/FormCard.jsx";

const inputClass =
  "w-full bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] px-4 py-3 text-[14px] font-inter text-oko-char dark:text-oko-cream placeholder-oko-stone outline-none focus:border-oko-barn dark:focus:border-oko-barn-light transition-colors";

const labelClass =
  "block font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-oko-stone mb-1.5";

const buttonClass =
  "w-full py-3 bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[13.5px] rounded-[2px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState({ status: "", message: "" });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cooldown > 0) return;

    setLoading(true);
    setNotif({ status: "", message: "" });
    setCooldown(30);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      setNotif({
        status: res.ok ? "success" : "error",
        message: res.ok
          ? data?.detail || "Check your email for reset instructions."
          : data?.detail || data?.email || "Something went wrong.",
      });
    } catch {
      setNotif({
        status: "error",
        message: "Network error, please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const isBusy = loading || cooldown > 0;

  return (
    <FormCard>
      <div className="p-8 lg:p-10">
        <h2 className="font-oko-display font-semibold text-[21px] leading-[1.3] text-oko-char dark:text-oko-cream mb-1">
          Reset your password.
        </h2>
        <p className="font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark mb-7">
          Enter the email linked to your account and we&apos;ll send you reset
          instructions.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email address <span className="text-oko-barn dark:text-oko-barn-light">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>

          {notif.message && (
            <div
              className={`flex items-start gap-2.5 px-4 py-3 rounded-[2px] bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark border-l-4 ${
                notif.status === "success"
                  ? "border-l-oko-sage dark:border-l-oko-sage"
                  : "border-l-oko-barn dark:border-l-oko-barn-light"
              }`}
            >
              {notif.status === "success" ? (
                <svg
                  className="w-4 h-4 text-oko-sage shrink-0 mt-px"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-oko-barn dark:text-oko-barn-light shrink-0 mt-px"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  />
                </svg>
              )}
              <p className="font-inter text-[13.5px] leading-[1.5] text-oko-char-soft dark:text-oko-ondark">
                {notif.message}
              </p>
            </div>
          )}

          <button type="submit" disabled={isBusy} className={buttonClass}>
            {cooldown > 0
              ? `Resend in ${cooldown}s`
              : loading
                ? "Sending…"
                : "Send reset link"}
          </button>
        </form>
      </div>
    </FormCard>
  );
}

export default ForgotPassword;
