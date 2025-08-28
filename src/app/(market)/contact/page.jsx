import React from "react";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";
import { ICRoundPhone, MDIEmailOutline } from "@/app/components/icons/lib";
function Contact() {
    const brandName = "SolanaFireplaces";
    const contact = "(888) 575-9720";
    const email = "info@solanafireplaces.com";
  return (
    <div className="w-full p-5">
    <div className="max-w-[700px] mx-auto mt-10 p-6 bg-white rounded shadow-lg text-gray-800 border border-neutral-200">
      <h1 className="text-2xl font-bold mb-4 text-center">Contact Us</h1>

      <p className="mb-10 text-center">
        At <Link prefetch={false} href={`${BASE_URL}`}className="text-theme-600 font-bold underline">{brandName}</Link> customer service comes first. Whether you need details about a product or assistance with your order, our team is ready to help. You can reach us in three convenient ways.
      </p>

      <div className="mb-4 flex flex-col items-center justify-center">
        <h5>Give us a call at</h5>
        <Link prefetch={false} href={`tel:${contact}`} className="flex items-center gap-1 font-semibold text-theme-600">
          <ICRoundPhone/>
          <div>{contact}</div>
        </Link>
      </div>

      <div className="mb-4 flex flex-col items-center justify-center">
        <h5>Email us at</h5>
        <Link prefetch={false} href={`mailto:${email}`} className="flex items-center gap-1 font-semibold text-theme-600">
          <MDIEmailOutline/>
          <div>{email}</div>
        </Link>
      </div>

    </div>
    </div>
  );
}

export default Contact;
