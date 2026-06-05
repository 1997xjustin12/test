import React from "react";

import Link from "next/link";
import { BASE_URL, ISBBQ } from "@/app/lib/helpers";
import { STORE_NAME } from "@/app/lib/store_constants";

import NewForgotPasswordPage from "@/app/components/new-design/page/ForgotPassword";
import BBQForgotPasswordPage from "@/app/components/bbq-design/page/ForgotPassword";

export const metadata = {
  title: `Forgot Password | ${STORE_NAME}`,
};

function ForgotPasswordPage() {
  if(ISBBQ){
    return <BBQForgotPasswordPage />
  }

  return (
    <NewForgotPasswordPage />
  );
}

export default ForgotPasswordPage;
