import React from "react";

import ForgotPassword from "@/app/components/oko-design/form/ForgotPassword";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";
import { STORE_NAME } from "@/app/lib/store_constants";

function ForgotPasswordPage() {
  return (
    <div className="bg-oko-cream dark:bg-oko-night">
      <div className="max-w-[1260px] mx-auto px-4 sm:px-8 py-[50px]">
        <div className="flex justify-center">
          <div className="max-w-[470px] w-full flex flex-col items-center">
            <h1 className="font-oko-display font-semibold text-[27px] sm:text-[29px] leading-[1.2] text-oko-char dark:text-oko-cream text-center">
              Forgot your password?
            </h1>
            <p className="mt-2 font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark text-center">
              No worries. Enter your email address below and we&apos;ll send you a
              link to reset your password.
            </p>
            <div className="my-[20px] w-full">
              <ForgotPassword />
            </div>
            <Link
              prefetch={false}
              href={`${BASE_URL}/login`}
              className="font-inter text-[12.5px] font-semibold uppercase tracking-[0.05em] text-oko-sage hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
