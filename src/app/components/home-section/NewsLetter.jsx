"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────

const PERKS = [
  "Exclusive sales & promotions",
  "New product announcements",
  "Expert tips & seasonal guides",
];

// ─────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────

export default function NewsletterSection() {
  const [email, setEmail]     = useState("");
  const [status, setStatus]   = useState("idle"); // "idle" | "loading" | "success" | "error"
  const [touched, setTouched] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showError    = touched && !isValidEmail && email.length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!isValidEmail) return;

    setStatus("loading");
    // TODO: replace with your actual newsletter API call
    await new Promise((res) => setTimeout(res, 1200));
    setStatus("success");
    setEmail("");
  }

  return (
    <section
      id="newsletter"
      className="bg-[#F0E8DF] border-y border-stone-200"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-14 lg:py-16">

        {/* ── Layout: stacked on mobile, side-by-side on lg ── */}
        <div className="flex flex-col lg:flex-row lg:items-center
                        gap-8 lg:gap-16">

          {/* ── Left – Copy ── */}
          <div className="flex-1">
            <p className="text-[0.7rem] sm:text-xs font-semibold tracking-[0.15em]
                          uppercase text-orange-500 mb-2">
              Stay in the Loop
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900
                           leading-tight mb-3">
              Get the Best Deals<br className="hidden sm:block" /> Straight to Your Inbox
            </h2>
            <p className="text-stone-500 text-sm sm:text-base leading-relaxed
                          max-w-md mb-5">
              Join thousands of homeowners and contractors who get exclusive
              sales, new arrivals, and expert tips every week.
            </p>

            {/* Perks list */}
            <ul className="flex flex-col gap-2">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-center gap-2 text-stone-600 text-sm">
                  <CheckCircle2 size={15} className="text-orange-500 shrink-0" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right – Form ── */}
          <div className="flex-1 w-full lg:max-w-md">
            {status === "success" ? (
              /* Success state */
              <div className="flex flex-col items-center text-center
                              bg-white rounded-2xl border border-stone-100
                              shadow-sm px-6 py-10 gap-4">
                <div className="w-14 h-14 rounded-full bg-green-50
                                flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-green-500" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-stone-900 mb-1">
                    You're subscribed!
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    Thanks for signing up. Check your inbox for a welcome email
                    with your first exclusive offer.
                  </p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-xs text-stone-400 hover:text-orange-500
                             underline underline-offset-2 transition-colors"
                >
                  Subscribe another email
                </button>
              </div>
            ) : (
              /* Form state */
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-white rounded-2xl border border-stone-100
                           shadow-sm px-5 sm:px-6 py-6 sm:py-8"
              >
                <label
                  htmlFor="newsletter-email"
                  className="block text-sm font-semibold text-stone-700 mb-2"
                >
                  Email address
                </label>

                {/* Input + Button — stack on xs, row on sm+ */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched(true)}
                      placeholder="you@example.com"
                      disabled={status === "loading"}
                      className={`w-full px-4 py-3 rounded-lg border-2 text-sm
                                  bg-stone-50 placeholder-stone-300
                                  outline-none transition-colors duration-200
                                  disabled:opacity-50
                                  ${showError
                                    ? "border-red-400 focus:border-red-500"
                                    : "border-stone-200 focus:border-orange-400"
                                  }`}
                    />
                    {showError && (
                      <p className="mt-1.5 text-xs text-red-500">
                        Please enter a valid email address.
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex items-center justify-center gap-2
                               bg-orange-500 hover:bg-orange-400 text-white
                               font-semibold px-6 py-3 rounded-lg text-sm
                               transition-all duration-200
                               hover:-translate-y-0.5
                               hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)]
                               disabled:opacity-60 disabled:cursor-not-allowed
                               disabled:hover:translate-y-0 disabled:hover:shadow-none
                               shrink-0 w-full sm:w-auto"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Subscribing…
                      </>
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>

                {/* Privacy note */}
                <p className="mt-4 text-[0.7rem] sm:text-xs text-stone-400 leading-relaxed">
                  We respect your privacy. Unsubscribe at any time.{" "}
                  <a
                    href="/privacy-policy"
                    className="underline underline-offset-2 hover:text-orange-500 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </p>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}