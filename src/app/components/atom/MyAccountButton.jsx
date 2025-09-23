"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { UserAccountIconBB } from "@/app/components/icons/lib";
// import { useUserSession } from "@/app/context/session";
import { useAuth } from "@/app/context/auth";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

export default function MyAccountButton({ className }) {
  const { isLoggedIn, loading, logout, myAccountLinks } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    logout();
  };

  const handleClick = (e) => {
    if (!loading && !isLoggedIn) {
      // redirect to login
      const link = e.target.closest("a");
      if (link) window.location.href = link;
    } else if (!loading && isLoggedIn) {
      // open dropdown
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <Link
        prefetch={false}
        onClick={handleClick}
        href={`${BASE_URL}/login`}
        className="flex items-center space-x-2"
      >
        {/* <UserAccountIconBB width="24" height="24" /> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 19.2c-2.5 0-4.71-1.28-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.23 7.23 0 0 1-6 3.2M12 5a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-3A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10c0-5.53-4.5-10-10-10"
          />
        </svg>
      </Link>

      {isOpen && isLoggedIn && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50 text-black flex flex-col">
          {/* <Link
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
          </button> */}
          {myAccountLinks.map((item) => (
            <Link
              key={`my-account-link-item-${item?.label?.toLowerCase()}`}
              prefetch={false}
              href={item?.url}
              className="px-4 py-2 text-sm hover:bg-gray-100 hover:text-theme-600"
            >
              {item?.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
