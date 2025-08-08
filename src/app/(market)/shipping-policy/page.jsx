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
        <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>
        <ul className="space-y-5">
          <li>
            <p className="mb-3">
              The{" "}
              <Link
                prefetch={false}
                href={BASE_URL}
                className="font-bold text-theme-600 underline"
              >
                {brandName}
              </Link>{" "}
              wants to make sure that our customers have a seamless and
              hassle-free shopping experience.
            </p>

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
                Customer is responsible for return/restocking fee of orders made by mistake. Contact us to know more about the return policy.
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
            If you need any further assistance with your shipping policy or have
            any other questions, don't hesitate to reach out to our customer
            service team at{" "}
            <Link prefetch={false} href={`tel:${contact}`} className="hover:underline text-blue-600">
              {contact}
            </Link>
          </p>
        </ul>
      </div>
    </div>
  );
}

export default ReturnPolicy;
