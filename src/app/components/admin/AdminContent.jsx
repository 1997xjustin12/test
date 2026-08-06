"use client";

import React, { useCallback, useEffect, useState } from "react";
import TokenValidator from "@/app/components/admin/TokenValidator";
import Nav from "@/app/components/admin/NavBar";
import SideNav from "@/app/components/admin/SideBar";

const COLLAPSE_STORAGE_KEY = "admin-sidebar-collapsed";

/**
 * AdminContent Component
 * Client-side wrapper for admin content with token validation.
 * Owns the sidebar's drawer (mobile) and collapsed (desktop) state.
 */
export default function AdminContent({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(COLLAPSE_STORAGE_KEY) === "1");
    } catch (e) {
      // storage blocked - keep the expanded default
    }
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(COLLAPSE_STORAGE_KEY, next ? "1" : "0");
      } catch (e) {
        // ignore - the choice just won't survive a reload
      }
      return next;
    });
  }, []);

  return (
    <TokenValidator>
      <div className="min-h-screen bg-zinc-50 antialiased dark:bg-zinc-950">
        <SideNav
          open={menuOpen}
          onClose={closeMenu}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
        />
        <div
          className={`transition-[padding] duration-300 ease-out ${
            collapsed ? "lg:pl-[76px]" : "lg:pl-64"
          }`}
        >
          <Nav onOpenMenu={() => setMenuOpen(true)} />
          <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </TokenValidator>
  );
}
