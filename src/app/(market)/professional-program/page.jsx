import React from "react";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";
import { ICRoundPhone, MDIEmailOutline } from "@/app/components/icons/lib";
function ReturnPolicy() {
  const brandName = "SolanaFireplaces";
  const brandSite = "SolanaFireplaces,com";
  const contact = "(888) 575-9720";
  const email = "info@solanafireplaces.com";
  return (
    <div className="w-full p-5">
      <div className="max-w-4xl mx-auto px-10 py-10 text-gray-800 rounded shadow-lg border border-neutral-200">
        <h1 className="text-3xl font-bold mb-6">
          SolanaFireplaces Contractor Program
        </h1>
        <ul className="space-y-5">
          <li>
            <p className="mb-3">
              The <span className="font-bold">{brandName} Contractor Program</span> is an exclusive discount program created specifically for licensed
              contractors who design and install outdoor kitchens. As a member,
              you’ll unlock special pricing on our entire product line—from
              grills and refrigerators to ovens, cabinets, and more. Plus,
              you’ll gain direct access to our team of experts for guidance and
              support on all your outdoor kitchen projects.
            </p>

            <p className="mb-3">
              Getting started is easy: just complete the online application on our website. Once approved, you’ll immediately begin enjoying the perks of membership.
            </p>
            <h3>Program Benefits Include:</h3>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>Free Shipping on selected items.</li>
              <li>
                We use standard ground shipping services to deliver orders
                within the continental United States.
              </li>
              <li>
                Orders are typically processed and shipped within 2-3 business
                days after payment is received.
              </li>
              <li>
                Customer is responsible for return/restocking fee of orders made
                by mistake. Contact us to know more about the return policy.
              </li>
              <li>
                Delivery times may vary depending on your location and the
                shipping carrier's schedule.
              </li>
              <li>We do not ship to PO boxes or APO/FPO addresses.</li>
              <li>
                Oversized or overweight items may incur additional shipping
                charges.
              </li>
              <li>
                Customers will be notified of any shipping delays or issues.
              </li>
              <li>
                Customers can track their order status through their account or
                by contacting our customer service team.
              </li>
            </ul>
          </li>
          <p>
            If you’re a licensed contractor installing outdoor kitchens, this program is designed to help you save money, access expert resources, and grow your business. Apply today and start taking advantage of everything the <span className="font-bold">{brandName} Contractor Program</span> has to offer!
          </p>
        </ul>
        <div className="flex flex-col gap-[15px] py-5 justify-center items-center">
          {/* <h3>To sign up, please fill out the form below.</h3> */}
          <h3>Call <Link prefetch={false} href={`tel:${contact}`} className="text-theme-600 hover:underline">{contact}</Link>  for assistance!</h3>
        </div>
        {/* <div className="aspect-1 bg-neutral-200 flex items-center justify-center">
          <div className="text-neutral-500 text-2xl font-bold">{"Insert Form Here"}</div>
        </div> */}
      </div>
    </div>
  );
}

export default ReturnPolicy;
