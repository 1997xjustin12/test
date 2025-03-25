"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserAccountIconBB } from "@/app/components/icons/lib";
import { useUserSession } from "@/app/context/session";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

export default function MyAccountButton({ className }) {
  const { userSession, loading } = useUserSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  const handleClick = () => {
    if (!userSession) {
      router.push("/login");
    } else {
      setIsOpen(!isOpen);
    }
  };

  if (loading) return null;

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={handleClick}
        className="flex items-center space-x-2"
      >
        <UserAccountIconBB width="24" height="24" />
      </button>

      {isOpen && userSession && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
          <Link
            href={`${BASE_URL}/my-account`}
            className="block px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            My Account
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
