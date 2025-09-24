"use client";
import { useState } from "react";
import Link from "next/link";
// import { UserAccountIconBB } from "@/app/components/icons/lib";
// import { useUserSession } from "@/app/context/session";
import { useAuth } from "@/app/context/auth";
import { BASE_URL } from "@/app/lib/helpers";

export default function MyAccountButton({ className }) {
  const { isLoggedIn, loading, logout, myAccountLinks, accountBenefits } =
    useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleLoginRedirect = (e) => {
    e.preventDefault();
    const link = e.target.closest("a");
    
    if (link) {
        window.location.href = link;
    }
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <Link
        prefetch={false}
        onClick={handleClick}
        href={`${BASE_URL}/login`}
        className="flex items-center space-x-2 hover:text-theme-600"
      >
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

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 border-neutral-300 bg-white border rounded shadow-md z-50 text-black flex flex-col">
          <div className="bg-gray-200 flex justify-between items-center px-[8px] py-[5px]">
            <div className="text-sm font-bold text-neutral-800">My Acount</div>
            <button className="text-theme-600 hover:text-neutral-700" onClick={()=> setIsOpen(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07M11.4 10l2.83-2.83l-1.41-1.41L10 8.59L7.17 5.76L5.76 7.17L8.59 10l-2.83 2.83l1.41 1.41L10 11.41l2.83 2.83l1.41-1.41L11.41 10z"
                />
              </svg>
            </button>
          </div>
          {isLoggedIn &&
            myAccountLinks.map((item) => (
              <Link
                key={`my-account-link-item-${item?.label?.toLowerCase()}`}
                prefetch={false}
                href={item?.url}
                className="px-4 py-2 text-sm hover:bg-gray-100 hover:text-theme-600"
              >
                {item?.label}
              </Link>
            ))}
          {!isLoggedIn && (
            <div className="relative">
              <div className="p-2">
                <div className="w-full flex">
                  <Link href={`${BASE_URL}/login`} onClick={handleLoginRedirect} className="text-center bg-theme-600 hover:bg-theme-700 p-2 text-white font-bold text-sm rounded w-full mb-2">
                    Login/Register
                  </Link>
                </div>
                <div>
                  <h5 className="text-sm font-bold mb-2">Account Benefits</h5>
                  <ul className="list-disc list-inside space-y-2 marker:text-red-500">
                    {accountBenefits &&
                      Array.isArray(accountBenefits) &&
                      accountBenefits.length > 0 &&
                      accountBenefits.map((item, index) => (
                        <li
                          key={`li-acc-benefit-${index}`}
                          className="text-xs text-neutral-600"
                        >
                          {item}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
