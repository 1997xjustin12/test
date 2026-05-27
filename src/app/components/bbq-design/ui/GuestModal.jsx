"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { STORE_DOMAIN } from "@/app/lib/store_constants";

const initial_info = {
  billing_first_name: null,
  billing_last_name: null,
  billing_email: null,
  billing_phone: null,
  billing_address: null,
  billing_city: null,
  billing_province: null,
  billing_zip_code: null,
  billing_country: null,
  shipping_first_name: null,
  shipping_last_name: null,
  shipping_email: null,
  shipping_phone: null,
  shipping_address: null,
  shipping_city: null,
  shipping_province: null,
  shipping_zip_code: null,
  shipping_country: null,
  notes: null,
  shipping_to_billing: true,
  store_domain: STORE_DOMAIN,
};

export default function GuestModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false); // controls CSS transition
  const [forage, setForage] = useState(null);
  const [infoEmail, setInfoEmail] = useState(null);

  const inputRef = useRef(null);

  // Sync open → visible with a tiny delay so the enter transition fires
  useEffect(() => {
    if (isOpen) {
      // Mount first, then trigger transition on next frame
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true)),
      );
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    // Wait for exit transition before unmounting
    setTimeout(() => {
      onClose();
      setEmail("");
      setError("");
      setSubmitted(false);
    }, 350);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");

    try {
      await forage.setItem("checkout_info", {
        ...initial_info,
        billing_email: email,
        shipping_email: email,
      });
      //   setInfoEmail(email);
      setSubmitted(true);
      setToggle(false);
    } catch (err) {
      console.warn("[forage]", err);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    let mounted = true;

    import("@/app/lib/localForage").then(async (module) => {
      if (!mounted) return;
      //   const info = await module.getItem("checkout_info");
      //   setInfoEmail(info?.billing_email || null);
      setForage(module);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!isOpen) return null;

  return (
    /* ── Backdrop ── */
    <div
      onClick={handleClose}
      className={`
        fixed inset-0 z-[100] flex items-center justify-center p-4
        bg-black/60 backdrop-blur-sm
        transition-opacity duration-[350ms] ease-in-out
        ${visible ? "opacity-100" : "opacity-0"}
      `}
    >
      {/* ── Panel ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          relative w-full max-w-[860px] max-h-[90vh]
          bg-white dark:bg-stone-900
          rounded-2xl overflow-hidden shadow-2xl
          flex flex-col sm:flex-row
          transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]
          ${visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}
        `}
      >
        {/* ── Left: Hero image ── */}
        <div className="relative w-full sm:w-[42%] min-h-[200px] sm:min-h-0 flex-shrink-0 overflow-hidden">
          <Image
            src="/images/outdoor-kitchen-email-capture.webp"
            alt="Luxurious outdoor kitchen featuring a professional built-in grill"
            fill
            sizes="100vw"
            className="object-cover transition-opacity duration-500"
          />
          {/* Fallback gradient behind image */}
          {/* <div className="absolute inset-0 bg-gradient-to-br from-stone-700 via-stone-800 to-stone-900 opacity-50" /> */}
          {/* Brand watermark */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="text-black/60 text-xs font-serif">
              Solana Fireplaces
            </span>
          </div>
        </div>

        {/* ── Right: Form ── */}
        <div className="flex-1 p-7 sm:p-9 flex flex-col justify-center">
          {/* Close button */}
          <button
            onClick={handleClose}
            aria-label="Close"
            className="
              absolute top-4 right-4 w-8 h-8 rounded-full
              bg-stone-100 dark:bg-stone-800
              text-stone-400 hover:text-stone-700 dark:hover:text-white
              flex items-center justify-center text-lg leading-none
              transition-colors duration-150
            "
          >
            ×
          </button>

          {!submitted ? (
            <>
              <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed mb-6">
                Enter your email to continue as a guest, or create an account to
                save your cart across devices.
              </p>

              {/* Email field */}
              <form onSubmit={handleSubmit} noValidate>
                <label className="block text-xs font-semibold text-charcoal dark:text-white mb-1.5">
                  <span className="text-fire mr-0.5">*</span> Email
                </label>
                <div className="flex gap-0 mb-1">
                  <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className={`
                      flex-1 px-4 py-3 text-sm rounded-l-lg border-2 border-r-0 outline-none
                      bg-white dark:bg-stone-800
                      text-charcoal dark:text-white
                      placeholder-stone-300 dark:placeholder-stone-600
                      transition-colors duration-200
                      ${
                        error
                          ? "border-red-400 focus:border-red-500"
                          : "border-stone-200 dark:border-stone-700 focus:border-fire"
                      }
                    `}
                  />
                  <button
                    type="submit"
                    aria-label="Submit email"
                    className="
                      px-5 py-3 rounded-r-lg
                      bg-charcoal dark:bg-stone-700 hover:bg-stone-800 dark:hover:bg-stone-600
                      text-white font-bold text-lg
                      transition-colors duration-200 flex-shrink-0
                    "
                  >
                    →
                  </button>
                </div>
                {error && (
                  <p className="text-red-500 text-xs mt-1.5 animate-[fadeIn_.2s_ease]">
                    {error}
                  </p>
                )}
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 border-t border-dashed border-stone-200 dark:border-stone-700" />
                <span className="text-xs text-stone-400 font-medium tracking-widest">
                  OR
                </span>
                <div className="flex-1 border-t border-dashed border-stone-200 dark:border-stone-700" />
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  className="
                    w-full py-3.5 rounded-xl font-bold text-sm text-white
                    bg-fire hover:bg-fire-light
                    transition-all duration-200 hover:-translate-y-0.5
                    shadow-md hover:shadow-lg hover:shadow-fire/30 text-center
                  "
                >
                  Signup
                </Link>
                <button
                  onClick={handleClose}
                  className="
                    w-full py-3.5 rounded-xl font-bold text-sm
                    bg-stone-600 hover:bg-stone-700 dark:bg-stone-700 dark:hover:bg-stone-600
                    text-white
                    transition-all duration-200 hover:-translate-y-0.5
                  "
                >
                  Continue Shopping
                </button>
              </div>
            </>
          ) : (
            /* ── Success state ── */
            <div className="text-center py-4 animate-[fadeIn_.4s_ease]">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-3xl mx-auto mb-4">
                ✓
              </div>
              <h3 className="font-serif text-2xl text-charcoal dark:text-white mb-2">
                You're in!
              </h3>
              <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">
                We've noted{" "}
                <strong className="text-charcoal dark:text-white">
                  {email}
                </strong>
                .<br />
                Your cart is ready.
              </p>
              <button
                onClick={handleClose}
                className="px-8 py-3 rounded-xl font-semibold text-sm bg-fire hover:bg-fire-light text-white transition-all duration-200 hover:-translate-y-0.5"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
