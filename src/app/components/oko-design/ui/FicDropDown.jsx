"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ICRoundPhone, MDIEmailOutline } from "@/app/components/icons/lib";
import Link from "next/link";
import { useEffect, useState } from "react";
import { STORE_CONTACT } from "@/app/lib/store_constants";

function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function FicDropDown({ children, contact_number }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  if (isMobile) {
    return (
      <Link href={`tel:${contact_number || STORE_CONTACT}`} prefetch={false}>
        {children}
      </Link>
    );
  }

  // §5: floating surfaces use a solid --char background + border, never a shadow.
  return (
    <Popover>
      <PopoverButton className="focus:outline-none">{children}</PopoverButton>

      <PopoverPanel
        transition
        anchor="bottom"
        className="z-50 w-60 bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] text-sm transition duration-150 ease-out data-[closed]:-translate-y-1 data-[closed]:opacity-0 [--anchor-gap:6px]"
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-oko-cream-dim dark:bg-oko-night-3 border-b border-oko-stone-line dark:border-oko-line-dark">
          <span className="w-1 h-4 bg-oko-barn flex-shrink-0" />
          <p className="font-oko-mono text-[10px] font-medium uppercase tracking-[0.14em] text-oko-stone">
            Contact us
          </p>
        </div>

        {/* Links */}
        <div className="px-2 py-2 border-b border-oko-stone-line dark:border-oko-line-dark">
          <Link
            href={`tel:${contact_number || STORE_CONTACT}`}
            className="flex items-center gap-3 px-2 py-2.5 text-oko-char dark:text-oko-cream hover:bg-oko-cream-dim dark:hover:bg-white/5 transition-colors"
          >
            <ICRoundPhone className="w-4 h-4 text-oko-barn flex-shrink-0" />
            <span className="font-inter text-xs font-semibold">{contact_number || STORE_CONTACT}</span>
          </Link>
          <Link
            href="mailto:info@solanafireplaces.com"
            className="flex items-center gap-3 px-2 py-2.5 text-oko-char dark:text-oko-cream hover:bg-oko-cream-dim dark:hover:bg-white/5 transition-colors"
          >
            <MDIEmailOutline className="w-4 h-4 text-oko-barn flex-shrink-0" />
            <span className="font-inter text-xs">Email us</span>
          </Link>
        </div>

        {/* Hours */}
        <div className="px-4 py-3 space-y-3">
          {[{ label: "Sales" }, { label: "Support" }].map(({ label }) => (
            <div key={label}>
              <p className="font-oko-mono text-[10px] font-medium uppercase tracking-[0.08em] text-oko-stone mb-1">
                {label}
              </p>
              <p className="text-xs text-oko-char-soft dark:text-oko-ondark">Mon – Fri &nbsp; 5:00am – 5:00pm PST</p>
              <p className="text-xs text-oko-stone">Sat – Sun &nbsp; Closed</p>
            </div>
          ))}
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export default FicDropDown;
