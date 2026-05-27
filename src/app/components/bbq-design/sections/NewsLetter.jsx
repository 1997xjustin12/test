"use client";
import React, { useState } from "react";
import { subscribe, unsubscribe } from "@/app/lib/api";
import { useAuth } from "@/app/context/auth";

export default function Newsletter() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await subscribe(email);
      setDone(true);
      setEmail("");
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      console.warn(err);
    }
  };

  if (user?.is_subscribed)
    return (
      <section className="py-14 sm:py-16 bg-char text-ash text-center">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <h2 className="font-oswald font-bold text-3xl sm:text-4xl uppercase">Stay in the Loop</h2>
          <p className="text-stone-400 font-light text-sm mt-2.5 mb-6">
            You&rsquo;re already subscribed — exclusive sales, grilling guides and recipes are on their way.
          </p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-bbq-green font-semibold text-sm">✓ You&rsquo;re subscribed</span>
            <button
              onClick={async () => {
                try {
                  await unsubscribe(user.email);
                } catch (err) {
                  console.warn(err);
                }
              }}
              className="text-stone-500 text-xs underline hover:text-ash transition-colors"
            >
              Unsubscribe
            </button>
          </div>
        </div>
      </section>
    );

  return (
    <section className="py-14 sm:py-16 bg-char text-ash text-center">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <h2 className="font-oswald font-bold text-3xl sm:text-4xl uppercase">Stay in the Loop</h2>
        <p className="text-stone-400 font-light text-sm mt-2.5 mb-6">
          Exclusive sales, grilling guides and recipes — straight to your inbox.
        </p>
        {done ? (
          <p className="text-bbq-green font-semibold">✓ You&rsquo;re in! Check your inbox soon.</p>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3.5 border border-stone-700 bg-[#211b15] text-ash rounded-sm font-sora text-sm placeholder:text-stone-600 focus:outline-none focus:border-ember"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-ember text-white font-oswald font-semibold text-sm uppercase tracking-wide rounded-sm hover:bg-ember-deep transition-colors"
            >
              Join
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
