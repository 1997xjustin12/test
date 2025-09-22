"use client";
import { useMemo } from "react";
import { useAuth } from "@/app/context/auth";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";
export default function MyAccountPage() {
  const { isLoggedIn, user, fullName } = useAuth();

  
  const handleLinkClick = (e) => {
    e.preventDefault();
    const link = e.target.closest("a");

    if (link) {
        window.location.href = link;
    }
  };


  if (!isLoggedIn && !user) return null;

  return (
    <div className="bg-white w-full p-[20px] shadow-lg border rounded-lg">
      <h3>Dashboard</h3>

      {user && (
        <div className="pt-[20px] flex gap-[20px] flex-col">
          <p>
            Hello{" "}
            <span className="font-bold">
              {fullName}
            </span>,{" "}
            (<span className="text-neutral-500">Not</span>{" "}
            <span className="text-neutral-500 font-bold">
              {fullName}?
            </span>{" "}
            <Link onClick={handleLinkClick} prefetch={false} href={`${BASE_URL}/logout`} className="text-red-700 font-semibold">Logout</Link>)
          </p>
          <p>From your account dashboard you can view your recent <Link onClick={handleLinkClick} prefetch={false} href={`${BASE_URL}/my-account/orders`} className="text-red-700 font-semibold">orders</Link>, manage your{" "}<Link onClick={handleLinkClick} prefetch={false} href={`${BASE_URL}/my-account/profile`} className="text-red-700 font-semibold">shipping and billing addresses</Link>, and change your{" "}<Link onClick={handleLinkClick} prefetch={false} href={`${BASE_URL}/my-account/change-password`} className="text-red-700 font-semibold">password.</Link>
          </p>
        </div>
      )}
    </div>
  );
}
