"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/auth"

function MyAccountLinks() {
  const pathname = usePathname();
  const {myAccountLinks} = useAuth();

  const handleLinkClick = (e) => {
    e.preventDefault();
    const link = e.target.closest("a");

    if (link) {
        window.location.href = link;
    }
  };

  return (
    <nav className="flex flex-col space-y-2">
      {myAccountLinks.map(({ label, url, icon }) => {
        const isActive = pathname === new URL(url).pathname;
        return (
          <Link
            prefetch={false}
            key={url}
            href={url}
            onClick={handleLinkClick}
            className={`flex items-center space-x-2 px-4 py-2 rounded shadow transition-colors border ${
              isActive
                ? "bg-theme-600 text-white"
                : "text-gray-800 hover:bg-theme-400"
            }`}
          >
            <span className="pointer-events-none">{icon}</span>
            <span className="pointer-events-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default MyAccountLinks;
