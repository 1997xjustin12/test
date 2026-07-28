"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/auth";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";
import { subscribe, unsubscribe } from "@/app/lib/api";

const cardCls =
  "bg-white dark:bg-oko-night-2 rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark";

const inlineLink =
  "font-inter font-semibold text-oko-sage hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors";

// ─── Newsletter ───────────────────────────────────────────────────────────────

function NewsletterSection({ email }) {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!email || loading) return;
    setLoading(true);
    try {
      if (isSubscribed) {
        await unsubscribe(email);
        setIsSubscribed(false);
      } else {
        await subscribe(email);
        setIsSubscribed(true);
      }
    } catch (err) {
      console.warn("[NewsletterSection]", err);
    } finally {
      setLoading(false);
    }
  };

  if (user?.is_subscribed)
    return (
      <div className={`${cardCls} p-6`}>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 rounded-[2px] bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark flex items-center justify-center text-oko-char-soft dark:text-oko-ondark flex-shrink-0">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </span>
          <h3 className="font-oko-display font-semibold text-[15.5px] text-oko-char dark:text-oko-cream">
            Newsletter
          </h3>
          <span className="ml-auto flex items-center gap-1 px-2.5 py-1 rounded-[2px] border border-oko-sage/30 bg-oko-sage/10 text-oko-sage font-inter text-[10px] font-semibold uppercase tracking-[0.06em]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3 h-3"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                clipRule="evenodd"
              />
            </svg>
            Subscribed
          </span>
        </div>

        <p className="font-inter text-[14px] font-semibold text-oko-char dark:text-oko-cream mb-1">
          You&rsquo;re all caught up.
        </p>
        <p className="font-inter text-[13px] text-oko-char-soft dark:text-oko-ondark mb-5 leading-[1.55]">
          You&rsquo;ll keep receiving product drops, seasonal discounts, and
          outdoor living inspiration.
        </p>
        <button
          onClick={async () => {
            if (loading) return;
            setLoading(true);
            try {
              await unsubscribe(email);
            } catch (err) {
              console.warn("[NewsletterSection]", err);
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="px-4 py-2 border border-oko-stone-line dark:border-oko-line-dark font-inter text-[12.5px] font-semibold text-oko-char-soft dark:text-oko-ondark hover:border-oko-barn hover:text-oko-barn dark:hover:border-oko-barn-light dark:hover:text-oko-barn-light rounded-[2px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Updating…" : "Unsubscribe"}
        </button>
      </div>
    );

  return (
    <div className={`${cardCls} p-6`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="w-8 h-8 rounded-[2px] bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark flex items-center justify-center text-oko-char-soft dark:text-oko-ondark flex-shrink-0">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </span>
        <h3 className="font-oko-display font-semibold text-[15.5px] text-oko-char dark:text-oko-cream">
          Newsletter
        </h3>
      </div>

      {isSubscribed ? (
        <>
          <p className="font-inter text-[14px] font-semibold text-oko-char dark:text-oko-cream mb-1">
            You&rsquo;re subscribed.
          </p>
          <p className="font-inter text-[13px] text-oko-char-soft dark:text-oko-ondark mb-5 leading-[1.55]">
            You&rsquo;ll keep receiving product drops, seasonal discounts, and outdoor
            living inspiration.
          </p>
          <button
            onClick={handleToggle}
            disabled={loading}
            className="px-4 py-2 border border-oko-stone-line dark:border-oko-line-dark font-inter text-[12.5px] font-semibold text-oko-char-soft dark:text-oko-ondark hover:border-oko-barn hover:text-oko-barn dark:hover:border-oko-barn-light dark:hover:text-oko-barn-light rounded-[2px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Updating…" : "Unsubscribe"}
          </button>
        </>
      ) : (
        <>
          <p className="font-inter text-[14px] font-semibold text-oko-char dark:text-oko-cream mb-1">
            Make every weekend feel like vacation.
          </p>
          <p className="font-inter text-[13px] text-oko-char-soft dark:text-oko-ondark mb-5 leading-[1.55]">
            Join now for bundle deals and outdoor living inspiration.
          </p>
          <button
            onClick={handleToggle}
            disabled={loading || !email}
            className="px-4 py-2 bg-oko-barn hover:bg-oko-barn-dark text-white font-inter text-[12.5px] font-semibold rounded-[2px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Updating…" : "Subscribe"}
          </button>
        </>
      )}
    </div>
  );
}

// ─── Quick Link Card ──────────────────────────────────────────────────────────

const quickLinks = [
  {
    label: "My orders",
    description: "View your order history",
    href: `${BASE_URL}/my-account/orders`,
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    label: "Profile",
    description: "Manage addresses",
    href: `${BASE_URL}/my-account/profile`,
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    ),
  },
  {
    label: "Change password",
    description: "Update your password",
    href: `${BASE_URL}/my-account/change-password`,
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
        />
      </svg>
    ),
  },
];

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function AccountDashboard() {
  const { isLoggedIn, user, fullName } = useAuth();

  if (!isLoggedIn || !user) return null;

  const initial = (fullName || user?.username || "?").charAt(0).toUpperCase();

  return (
    <div className="flex flex-col gap-4">
      {/* Welcome card */}
      <div className={`${cardCls} p-6`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-oko-char dark:bg-oko-cream-dim flex items-center justify-center text-oko-cream dark:text-oko-char font-oko-display text-lg font-semibold flex-shrink-0 select-none">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-oko-display font-semibold text-[16px] text-oko-char dark:text-oko-cream">
              Hello, {fullName}.
            </p>
            {user?.email && (
              <p className="font-inter text-[12px] text-oko-stone mt-0.5 truncate">
                {user.email}
              </p>
            )}
            <p className="font-inter text-[12px] text-oko-stone mt-0.5">
              Not {fullName}?{" "}
              <Link
                prefetch={false}
                href={`${BASE_URL}/logout`}
                className={`${inlineLink} text-[12px]`}
              >
                Sign out
              </Link>
            </p>
          </div>
        </div>

        <p className="font-inter text-[13px] text-oko-char-soft dark:text-oko-ondark mt-5 leading-[1.55]">
          From your dashboard you can view your recent{" "}
          <Link
            prefetch={false}
            href={`${BASE_URL}/my-account/orders`}
            className={`${inlineLink} text-[13px]`}
          >
            orders
          </Link>
          , manage your{" "}
          <Link
            prefetch={false}
            href={`${BASE_URL}/my-account/profile`}
            className={`${inlineLink} text-[13px]`}
          >
            shipping and billing addresses
          </Link>
          , and update your{" "}
          <Link
            prefetch={false}
            href={`${BASE_URL}/my-account/change-password`}
            className={`${inlineLink} text-[13px]`}
          >
            password
          </Link>
          .
        </p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {quickLinks.map(({ label, description, href, icon }) => (
          <Link
            key={href}
            prefetch={false}
            href={href}
            className={`flex items-center gap-3 ${cardCls} p-4 hover:border-oko-barn dark:hover:border-oko-barn-light transition-colors group`}
          >
            <span className="w-8 h-8 rounded-[2px] bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark flex items-center justify-center text-oko-char-soft dark:text-oko-ondark group-hover:text-oko-barn dark:group-hover:text-oko-barn-light transition-colors flex-shrink-0">
              {icon}
            </span>
            <div className="min-w-0">
              <p className="font-inter text-[13px] font-semibold text-oko-char dark:text-oko-cream group-hover:text-oko-barn dark:group-hover:text-oko-barn-light transition-colors truncate">
                {label}
              </p>
              <p className="font-inter text-[11px] text-oko-stone truncate">
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Newsletter */}
      <NewsletterSection email={user?.email} />
    </div>
  );
}
