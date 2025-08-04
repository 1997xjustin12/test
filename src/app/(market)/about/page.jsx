import React from "react";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";

function About() {
    const brandName = "SolanaFireplaces";
    const contact = "(888) 575-9720";
  return (
    <div className="w-full p-5">
    <div className="max-w-[700px] mx-auto mt-10 p-6 bg-white rounded shadow-lg text-gray-800 border border-neutral-200">
      <h1 className="text-2xl font-bold mb-4">About Us</h1>

      <p className="mb-4">
        At <Link prefetch={false} href={`${BASE_URL}`}className="text-theme-600 font-bold underline">{brandName}</Link>, we are focused on providing the best prices
        on the largest selection of BBQ grills and outdoor accessories. We’ve
        been selling barbecue grills and accessories for over 20 years and
        strive to become the most trusted source for all outdoor kitchen
        equipment.
      </p>

      <p className="mb-4">
        Not only do we provide the most complete collection of high-quality
        grills, BBQ smokers, and backyard equipment, but our customer service is
        the best in the business. Our BBQ experts help guide our customers
        throughout their shopping experience to ensure that they get the grill
        that best suits their needs at the best possible price. Our goal is for
        our customers to get the most for their money, no matter what their
        budget is.
      </p>

      <p className="mb-4">
        Even after installation, our door is always open to customers who may
        have questions about their new grill. This may include questions about
        grill features, advice on how to make the most out of your backyard
        space, or grilling tips and recipes. We’re here for you!
      </p>

      <p>
        If you are looking for a BBQ grill or outdoor products, or just have
        questions about what is best for you, don’t hesitate to contact us at{" "}
        <a href={`tel:${contact}`} className="text-blue-600 underline">
          {contact}
        </a>
        . Our grilling and outdoor living experts are here to answer all of your
        questions, whether they are general or specific to a product. We hope to
        hear from you soon!
      </p>
    </div>
    </div>
  );
}

export default About;
