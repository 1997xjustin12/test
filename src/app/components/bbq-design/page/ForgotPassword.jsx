import React from "react";

import ForgotPassword from "@/app/components/bbq-design/form/ForgotPassword";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";
import { STORE_NAME } from "@/app/lib/store_constants";

function ForgotPasswordPage() {
  return (
    <div className="container mx-auto">
      <div className="px-4 py-[50px]">
        <div className="flex justify-center">
          <div className="max-w-[470px] flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal dark:text-white tracking-tight">Forgot your password?</h2>
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400 text-center">
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

export default ForgotPasswordPage;
