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
        <h1 className="text-3xl font-bold mb-6">Return Policy</h1>
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
              offers a straightforward return policy. If you need to return an
              item please give us a call. We strive to provide a superior
              shopping experience for all of our customers. Our Return Policy
              requirements are detailed below.
            </p>
            <div className="mb-3">
              You have{" "}
              <span className="font-medium underline">30 calendar days</span> to
              return an item from the date you received it. To be eligible for a
              return, your item must be unused and in the same condition that
              you received it with all original packaging. All refunds are
              provided 3-5 business days after return is received.
            </div>
            <p className="mb-3">
              Shipping fees apply to all returns. To return a qualified item
              please{" "}
              <Link
                prefetch={false}
                href={BASE_URL + "/contact"}
                className="underline text-blue-800"
              >
                contact us
              </Link>{" "}
              to get a Return Merchandise Authorization (RMA). Restocking fee of
              20% is applicable for all items.
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                We will require detail pictures showing the condition of all
                item(s) being returned.
              </li>
              <li>
                The customer is responsible for all return shipping cost. All
                incurred shipping costs to and from will be deducted from the
                refund. Once we receive the item(s) it will be inspected. Once
                the item(s) passes the return inspection a refund/partial refund
                will be issued and the customer will receive the refund within
                14 business days depending on payment method.
              </li>
            </ul>
          </li>
          <li>
            <h4 className="font-semibold mb-3">Damage or Defective Order</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                All orders must be received by someone 18 years old or older.
                While the driver is at your location please inspect the box and
                the contents for any damage. If damage is found please do not
                sign for item and reject delivery. Please call us immediately so
                we can provide instructions
              </li>
              <li>
                If you receive a defective or damage item please contact us
                immediately. Most products come with a manufacturer's warranty.
                We will help direct you to the manufacturer to receive a
                replacement. Customers must call us to receive Return
                Merchandise Authorization (RMA) prior to all returns.
              </li>
            </ul>
          </li>

          <li>
            <h4 className="font-semibold mb-3">Cancellation</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                {brandName} wants to get your order to you as soon as possible.
                Most orders ship within 24 hours. If an order is cancelled and
                the item has been shipped, the customer is responsible for all
                shipping costs. Please contact us immediately when wanting to
                cancel your order to avoid being charged shipping..
              </li>
            </ul>
          </li>

          <li>
            <h4 className="font-semibold mb-3">
              Items that do not qualify for returns
            </h4>
            <ul className="list-disc pl-6 space-y-2 mb-3">
              <li>
                Used items including items that have been installed or have been
                assembled
              </li>
              <li>
                Special promotional items, special order, made-to-order,
                customer order, clearance items, open box, scratch & dent or
                items marked as "No Return" or "Non-Returnable".
              </li>
              <li>
                Items with a return request that is more than 30 calendar days
                from the date the item was received.
              </li>
              <li>
                Items without a valid Return Merchandise Authorization (RMA)
              </li>
            </ul>
            <p>
              {brandName} is here to make your experience as simple as possible.
              If you have any questions about how to return your item to us,
              please{" "}
              <Link
                prefetch={false}
                href={BASE_URL + "/contact"}
                className="underline text-blue-800"
              >
                contact us
              </Link>
              .
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ReturnPolicy;
