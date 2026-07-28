"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/auth";
import { BASE_URL } from "@/app/lib/helpers";

export default function MyAccountButton({ className }) {
  const { isLoggedIn, logout, myAccountLinks, accountBenefits } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative inline-block ${className || ""}`}>
      {/* Trigger — icon over label */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-label="My account"
        aria-expanded={isOpen}
        className="flex flex-col items-center justify-center gap-1 w-11 text-oko-char dark:text-oko-cream hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
        <span className="font-inter text-[10.5px] tracking-[0.06em] leading-none">Account</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-[220px] bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] overflow-hidden z-50">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-oko-cream-dim dark:bg-oko-night-3 border-b border-oko-stone-line dark:border-oko-line-dark">
              <span className="font-inter text-[11px] font-semibold uppercase tracking-[0.06em] text-oko-char dark:text-oko-cream">
                My account
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close account menu"
                className="p-1 text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M18 6 6 18M6 6l12 12" />
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
                    className="flex items-center px-3 py-2 text-[12.5px] text-oko-char-soft dark:text-oko-ondark hover:bg-oko-cream-dim dark:hover:bg-oko-night-3 hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors rounded-[2px]"
                  >
                    {item?.label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full mt-1 flex items-center px-3 py-2 text-[12.5px] text-oko-stone hover:bg-oko-cream-dim dark:hover:bg-oko-night-3 hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors rounded-[2px]"
                >
                  Sign out
                </button>
              </div>
            )}

            {/* Logged out */}
            {!isLoggedIn && (
              <div className="p-3 flex flex-col gap-3">
                <Link
                  href={`${BASE_URL}/login`}
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 font-inter font-semibold text-[12.5px] bg-oko-barn hover:bg-oko-barn-dark text-white rounded-[2px] transition-colors"
                >
                  Login / register
                </Link>

                {accountBenefits?.length > 0 && (
                  <div>
                    <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.06em] text-oko-stone mb-2">
                      Benefits
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {accountBenefits.map((item, i) => (
                        <li key={`acc-benefit-${i}`} className="flex items-center gap-2 text-[12.5px] text-oko-char-soft dark:text-oko-ondark">
                          <span className="text-oko-barn dark:text-oko-barn-light font-bold text-[11px]">✓</span>
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
