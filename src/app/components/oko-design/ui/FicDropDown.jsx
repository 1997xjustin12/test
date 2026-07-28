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
      <Link href={`tel:${STORE_CONTACT}`} prefetch={false}>
        {children}
      </Link>
    );
  }

  return (
    <Popover>
      <PopoverButton className="focus:outline-none">{children}</PopoverButton>

      <PopoverPanel
        transition
        anchor="bottom"
        className="z-50 w-60 bg-paper dark:bg-char border border-grate dark:border-white/10 shadow-xl shadow-char/20 dark:shadow-black/50 text-sm transition duration-150 ease-out data-[closed]:-translate-y-1 data-[closed]:opacity-0 [--anchor-gap:6px]"
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-ash dark:bg-smoke border-b border-grate dark:border-white/10">
          <span className="w-1 h-4 bg-ember flex-shrink-0" />
          <p className="font-oswald text-[10px] font-semibold uppercase tracking-widest text-char/60 dark:text-ash/50">
            Contact Us
          </p>
        </div>

        {/* Links */}
        <div className="px-2 py-2 border-b border-grate dark:border-white/10">
          <Link
            href={`tel:${contact_number || STORE_CONTACT}`}
            className="flex items-center gap-3 px-2 py-2.5 text-char dark:text-ash hover:bg-ash dark:hover:bg-white/5 transition-colors"
          >
            <ICRoundPhone className="w-4 h-4 text-char/40 dark:text-ash/30 flex-shrink-0" />
            <span className="font-oswald text-xs uppercase tracking-wide">{contact_number || STORE_CONTACT}</span>
          </Link>
          <Link
            href="mailto:info@solanafireplaces.com"
            className="flex items-center gap-3 px-2 py-2.5 text-char dark:text-ash hover:bg-ash dark:hover:bg-white/5 transition-colors"
          >
            <MDIEmailOutline className="w-4 h-4 text-char/40 dark:text-ash/30 flex-shrink-0" />
            <span className="font-oswald text-xs uppercase tracking-wide">Email Us</span>
          </Link>
        </div>

        {/* Hours */}
        <div className="px-4 py-3 space-y-3">
          {[{ label: "Sales" }, { label: "Support" }].map(({ label }) => (
            <div key={label}>
              <p className="font-oswald text-[10px] font-semibold uppercase tracking-wide text-char/50 dark:text-ash/50 mb-1">
                {label}
              </p>
              <p className="text-xs text-char/50 dark:text-ash/40">Mon – Fri &nbsp; 5:00am – 5:00pm PST</p>
              <p className="text-xs text-char/30 dark:text-ash/25">Sat – Sun &nbsp; Closed</p>
            </div>
          ))}
        </div>
      </PopoverPanel>
    </Popover>
  );
}

export default FicDropDown;
