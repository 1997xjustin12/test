"use client";

import React from 'react';
import TokenValidator from '@/app/components/admin/TokenValidator';
import Nav from "@/app/components/admin/NavBar";
import SideNav from "@/app/components/admin/SideBar";

/**
 * AdminContent Component
 * Client-side wrapper for admin content with token validation
 */
export default function AdminContent({ children }) {
  return (
    <TokenValidator>
      <div className="antialiased bg-slate-50">
        <Nav />
        <div className="flex">
          <SideNav />
          <div className="mt-20 ml-64 w-full">{children}</div>
        </div>
      </div>
    </TokenValidator>
  );
}
