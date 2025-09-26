import React from "react";

import ForgotPassword from "@/app/components/form/ForgotPassword";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";

export const metadata = {
  title: "Reset Password | Solana Fireplaces",
};

function ForgorPasswordPage() {
  return (
    <div className="container mx-auto">
      <div className="px-4 py-[50px]">
        <div className="flex justify-center">
          <div className="max-w-[400px] flex flex-col items-center">
            <h2 className="font-extrabold mb-5">Forgot your password?</h2>
            <p className="mb-5 text-sm font-medium text-neutral-600 text-center">
              No worries. Enter your email address below and we’ll send you a
              link to reset your password.
            </p>
            <div className="my-[20px] w-full">
                <ForgotPassword />
            </div>
            <Link
                prefetch={false}
                href={`${BASE_URL}/login`}
                className="text-theme-600 hover:underline block text-sm font-bold"
            >
                Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgorPasswordPage;
