import { PAYMENT_METHODS } from "@/app/data/new-homepage";
import { STORE_NAME, STORE_FACEBOOK, STORE_PINTEREST, STORE_CONTACT } from "@/app/lib/store_constants";
import Link from "next/link";
import Image from "next/image";
import { createSlug } from "@/app/lib/helpers";

export const FOOTER_COLS = [
  {
    heading: "Products",
    links: [
      { name: "Fireplaces", url: "/fireplaces" },
      { name: "Patio Heaters", url: "/patio-heaters" },
      { name: "Built-In Grills", url: "/built-in-grills" },
      { name: "Freestanding Grills", url: "/freestanding-grills" },
      { name: "Outdoor Refrigeration", url: "/outdoor-refrigeration" },
      { name: "Outdoor Storage", url: "/outdoor-storage" },
    ],
  },
  {
    heading: "Customer Service",
    links: [
      { name: "Contact Us", url: "/contact" },
      { name: "Returns & Refunds", url: "/return-policy" },
      { name: "Shipping Policy", url: "/shipping-policy" },
      { name: "Privacy Policy", url: "/privacy-policy" },
    ],
  },
  {
    heading: "Company",
    links: [
      { name: "About Solana", url: "/about" },
      { name: "Our Brands", url: "/brands" },
      { name: "Open Box", url: "/open-box" },
      { name: "Package Deals", url: "/package-deals" },
      { name: "Clearance Sale", url: "/clearance-sale" },
      { name: "Current Deals", url: "/brand/eloquence" },
      { name: "Contractor Program", url: "/professional-program" },
    ],
  },
];

export default function Footer({ logo }) {
  return (
    <footer className="bg-[#100c08] text-stone-500 pt-12 pb-7">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand col */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            {logo ? (
              <div className="relative w-[130px] aspect-square mb-3">
                <Image
                  src="/solana-new-logo-orig-white.png"
                  alt={`${STORE_NAME} logo`}
                  fill
                  sizes="130px"
                  className="object-contain"
                  priority={false}
                />
              </div>
            ) : (
              <Link href="/" className="font-oswald font-bold text-xl text-ash">
                BBQ Grill<span className="text-ember">Outlet</span>
              </Link>
            )}
            <p className="text-sm mt-3 leading-relaxed">
              Premium outdoor kitchen equipment at outlet prices. Authorized dealer for every brand we carry.
            </p>
            <p className="text-sm mt-2">
              📞 <a href={`tel:${STORE_CONTACT}`} className="hover:text-ember transition-colors">{STORE_CONTACT}</a>
            </p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {PAYMENT_METHODS.map((p) => (
                <span key={p} className="bg-[#211b15] border border-[#2f2820] text-[9px] px-2 py-1 rounded-sm tracking-wide">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {FOOTER_COLS.map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="font-oswald text-ash text-sm font-semibold tracking-wide uppercase mb-4">{heading}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((item, index) => (
                  <li key={`foot-link-${createSlug(heading)}-${index}`}>
                    <Link href={item?.url || "#"} className="text-sm hover:text-ember transition-colors">
                      {item?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="border-t border-[#2a2118] pt-5 flex flex-col sm:flex-row justify-between gap-2 text-xs">
          <span>© {new Date().getFullYear()} {STORE_NAME}. All rights reserved.</span>
          <span>Authorized Dealer · Secure Checkout · Price-Match Guarantee</span>
        </div>

      </div>
    </footer>
  );
}
