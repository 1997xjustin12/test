"use client";
import { useState } from "react";
import { subscribe } from "@/app/lib/api";
import { useAuth } from "@/app/context/auth";

// Compact newsletter signup for the site-wide footer. The homepage keeps its
// full-width `sections/NewsLetter` block; this is the every-page counterpart,
// so already-subscribed users just get a confirmation line instead of a form.
export default function FooterNewsletter() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    if (!email) return;
    try {
      await subscribe(email);
      setDone(true);
      setEmail("");
      setTimeout(() => setDone(false), 3000);
    } catch (err) {
      console.warn("[FooterNewsletter]", err);
    }
  };

  return (
    <div
      className="
        border-t border-white/8 pt-6 pb-6
        flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
      "
    >
      <div>
        <h4 className="font-serif text-lg text-white mb-1">Stay in the Loop</h4>
        <p className="text-xs leading-relaxed">
          {user?.is_subscribed
            ? "You're subscribed — exclusive sales, guides & seasonal inspiration are on their way."
            : "Exclusive sales, guides, tips & seasonal inspiration — straight to your inbox."}
        </p>
      </div>

      {!user?.is_subscribed && (
        <form
          onSubmit={submit}
          className="flex gap-2 w-full sm:w-auto sm:min-w-[360px]"
        >
          <input
            type="email"
            required
            placeholder="Enter your email address"
            aria-label="Email address for newsletter"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              flex-1 px-4 py-2.5 rounded-lg text-sm
              bg-white/5 border-2 border-white/10
              text-white placeholder-white/35
              focus:border-fire outline-none transition-colors
            "
          />
          <button
            type="submit"
            className={`
              px-5 py-2.5 rounded-lg font-semibold text-sm text-gray-900 flex-shrink-0
              transition-all duration-300
              ${done ? "bg-green-600 text-white" : "bg-theme-600 hover:bg-theme-500 hover:-translate-y-0.5"}
            `}
          >
            {done ? "✓ Subscribed!" : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
}
