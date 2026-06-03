"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/auth";
import { BASE_URL } from "@/app/lib/helpers";
import { UserIcon } from "@/app/components/bbq-design/ui/Icons";

export default function MyAccountButton({ className }) {
  const { isLoggedIn, logout, myAccountLinks, accountBenefits } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label="My account"
        className="flex flex-col items-center justify-center w-10 h-10 text-char dark:text-ash hover:text-theme-600 dark:hover:text-theme-500 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[18px] h-[18px]"
        >
          <path d="M5 6 H19 L17 16 L12 21 L7 16 Z" />
        </svg>
        <span className="font-oswald text-[10px] uppercase tracking-wide hidden sm:block leading-none mt-0.5">
          Account
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-[220px] bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm shadow-xl shadow-char/10 dark:shadow-black/40 overflow-hidden z-50">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-ash dark:bg-char border-b border-grate dark:border-white/10">
              <span className="font-oswald text-xs font-semibold uppercase tracking-wide text-char dark:text-ash">
                My Account
              </span>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="p-1 text-char/40 dark:text-ash/40 hover:text-theme-600 dark:hover:text-theme-500 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Logged in — nav links */}
            {isLoggedIn && (
              <div className="p-2">
                {myAccountLinks.map((item) => (
                  <Link
                    key={`my-account-link-${item?.label?.toLowerCase()}`}
                    prefetch={false}
                    href={item?.url}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-oswald uppercase tracking-wide text-char/70 dark:text-ash/60 hover:bg-ash dark:hover:bg-white/5 hover:text-theme-600 dark:hover:text-theme-500 transition-colors rounded-sm"
                  >
                    {item?.label}
                  </Link>
                ))}
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-xs font-oswald uppercase tracking-wide text-char/40 dark:text-ash/30 hover:bg-ash dark:hover:bg-white/5 hover:text-ember dark:hover:text-ember transition-colors rounded-sm"
                >
                  Sign Out
                </button>
              </div>
            )}

            {/* Logged out */}
            {!isLoggedIn && (
              <div className="p-3 flex flex-col gap-3">
                <Link
                  href={`${BASE_URL}/login`}
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 font-oswald font-semibold text-xs uppercase tracking-wide bg-theme-600 hover:bg-theme-700 text-white rounded-sm transition-colors"
                >
                  Login / Register
                </Link>

                {accountBenefits?.length > 0 && (
                  <div>
                    <p className="font-oswald text-[10px] font-semibold uppercase tracking-widest text-char/40 dark:text-ash/30 mb-2">
                      Benefits
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {accountBenefits.map((item, i) => (
                        <li key={`acc-benefit-${i}`} className="flex items-center gap-2 text-xs text-char/60 dark:text-ash/50">
                          <span className="font-oswald font-bold text-[10px] text-theme-600">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
