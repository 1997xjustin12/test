"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";

const inputClass =
  "w-full bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] px-4 py-3 text-[14px] font-inter text-oko-char dark:text-oko-cream placeholder-oko-stone outline-none focus:border-oko-barn dark:focus:border-oko-barn-light transition-colors";

const labelClass =
  "block font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-oko-stone mb-1.5";

const buttonClass =
  "w-full py-3 bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[13.5px] rounded-[2px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

function LoginForm({ successLogin = null }) {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data?.error || data?.detail || "Login failed. Please try again.");
      return;
    }

    await login(data);

    if (successLogin) {
      successLogin(true);
    } else {
      router.push(`${BASE_URL}/my-account`);
    }
  };

  return (
    <div>
      <h2 className="font-oko-display font-semibold text-[21px] leading-[1.3] text-oko-char dark:text-oko-cream mb-1">
        Sign in to your account.
      </h2>
      <p className="font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark mb-7">
        Faster checkout, order history, and phone-only pricing.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor="username" className={labelClass}>
            Username <span className="text-oko-barn dark:text-oko-barn-light">*</span>
          </label>
          <input
            id="username"
            name="username"
            placeholder="Enter your username"
            value={form.username}
            onChange={handleChange}
            required
            autoComplete="username"
            className={inputClass}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-oko-stone">
              Password <span className="text-oko-barn dark:text-oko-barn-light">*</span>
            </label>
            <Link
              prefetch={false}
              href={`${BASE_URL}/forgot-password`}
              className="font-inter text-[12px] font-semibold text-oko-sage hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            className={inputClass}
          />
        </div>

        {error && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-[2px] bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark border-l-4 border-l-oko-barn dark:border-l-oko-barn-light">
            <svg className="w-4 h-4 text-oko-barn dark:text-oko-barn-light shrink-0 mt-px" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="font-inter text-[13.5px] leading-[1.5] text-oko-char-soft dark:text-oko-ondark">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={buttonClass}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>

      </form>
    </div>
  );
}

export default LoginForm;
