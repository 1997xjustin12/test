import React from "react";

import Link from "next/link";
import { BASE_URL, ISBBQ } from "@/app/lib/helpers";
import { STORE_NAME } from "@/app/lib/store_constants";

import NewForgotPasswordPage from "@/app/components/new-design/page/ForgotPassword";
import BBQForgotPasswordPage from "@/app/components/bbq-design/page/ForgotPassword";

export const metadata = {
  title: `Forgot Password | ${STORE_NAME}`,
};

const wrapperClass = "min-h-svh py-10 px-4 sm:px-6";

function ThemeComponent() {
  if (ISBBQ) {
    return (
      <div className={`${wrapperClass} bg-stone-50 dark:bg-stone-950`}>
        <BBQForgotPasswordPage />;
      </div>
    );
  }

  return (
    <div className={`${wrapperClass} bg-stone-50 dark:bg-stone-950`}>
      <NewForgotPasswordPage />
    </div>
  );
}

function ForgotPasswordPage() {
  return <ThemeComponent />;
}

export default ForgotPasswordPage;
