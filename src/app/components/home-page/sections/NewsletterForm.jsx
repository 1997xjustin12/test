"use client";

import { useState } from "react";
import { subscribe } from "@/app/lib/api";

/**
 * The only interactive part of the newsletter band.
 *
 * Split out so the section itself stays a server component: a heading and a
 * line of copy do not need to be shipped to the browser as JavaScript to be
 * re-rendered there. This is the piece that genuinely does.
 *
 * Colours arrive as CSS variables from the section, so the two cannot disagree
 * about what an operator picked.
 *
 * A failure says so. The existing newsletter swallows the error into a
 * console.warn and leaves the form looking untouched, which reads as nothing
 * having happened — and the visitor tries again, or gives up.
 */
export default function NewsletterForm({ scope, placeholder, label, successMessage }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | sending | done | error

  const submit = async (event) => {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      const res = await subscribe(email.trim());
      if (!res?.ok) throw new Error(`subscribe responded ${res?.status ?? "not at all"}`);
      setEmail("");
      setState("done");
    } catch (error) {
      console.warn("[newsletter]", error);
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <p
        className="mt-7 text-center text-base font-semibold"
        style={{ color: `var(--${scope}-heading)` }}
        role="status"
      >
        {successMessage || "Thanks — you're on the list."}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-7 flex flex-col items-center gap-3">
      <div className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-center">
        <label className="sr-only" htmlFor={`${scope}-email`}>
          {placeholder || "Email address"}
        </label>
        <input
          id={`${scope}-email`}
          type="email"
          required
          autoComplete="email"
          value={email}
          placeholder={placeholder}
          onChange={(event) => {
            setEmail(event.target.value);
            if (state === "error") setState("idle");
          }}
          className="w-full px-5 py-3.5 text-center text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-offset-2 sm:max-w-sm"
          style={{ background: `var(--${scope}-input-bg)`, color: `var(--${scope}-input-text)` }}
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-full px-8 py-3.5 text-[15px] font-bold transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
          style={{ background: `var(--${scope}-button-bg)`, color: `var(--${scope}-button-text)` }}
        >
          {state === "sending" ? "Signing you up…" : label}
        </button>
      </div>

      {state === "error" && (
        <p className="text-sm font-medium text-red-600 dark:text-red-400" role="alert">
          That did not go through. Please check the address and try again.
        </p>
      )}
    </form>
  );
}
