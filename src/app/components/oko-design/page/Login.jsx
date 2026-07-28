"use client";

import { useState } from "react";
import FormCard from "@/app/components/oko-design/form/FormCard";
import LoginForm from "@/app/components/oko-design/form/Login";
import RegisterForm from "@/app/components/oko-design/form/Register";

export default function LoginPage() {
  const [tab, setTab] = useState("login");
  const isLogin = tab === "login";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-oko-cream dark:bg-oko-night py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Page header */}
        <div className="text-center mb-8">
          <h1 className="font-oko-display font-semibold text-[27px] sm:text-[29px] leading-[1.2] text-oko-char dark:text-oko-cream">
            Your account.
          </h1>
          <p className="mt-2 font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark">
            Sign in or create an account to get started.
          </p>
        </div>

        {/* Mobile tab switcher — §8.3 nav treatment, 2px barn underline */}
        <div className="flex md:hidden border-b border-oko-stone-line dark:border-oko-line-dark mb-6">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-2.5 font-inter text-[12.5px] font-semibold uppercase tracking-[0.05em] border-b-2 transition-colors ${
              isLogin
                ? "border-oko-barn text-oko-barn dark:border-oko-barn-light dark:text-oko-barn-light"
                : "border-transparent text-oko-stone hover:text-oko-char dark:hover:text-oko-cream"
            }`}
          >
            Sign in
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-2.5 font-inter text-[12.5px] font-semibold uppercase tracking-[0.05em] border-b-2 transition-colors ${
              !isLogin
                ? "border-oko-barn text-oko-barn dark:border-oko-barn-light dark:text-oko-barn-light"
                : "border-transparent text-oko-stone hover:text-oko-char dark:hover:text-oko-cream"
            }`}
          >
            Register
          </button>
        </div>

        {/* Two-panel card */}
        <FormCard>
          <div className="flex">
            {/* Login panel */}
            <div
              className={`flex-1 p-8 lg:p-10 ${isLogin ? "block" : "hidden"} md:block`}
            >
              <LoginForm />
            </div>

            {/* Divider — desktop only */}
            <div className="hidden md:block w-px bg-oko-stone-line dark:bg-oko-line-dark my-8" />

            {/* Register panel */}
            <div
              className={`flex-1 p-8 lg:p-10 ${!isLogin ? "block" : "hidden"} md:block`}
            >
              <RegisterForm />
            </div>
          </div>
        </FormCard>
      </div>
    </div>
  );
}
