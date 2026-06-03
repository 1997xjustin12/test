import { PAYMENT_METHODS } from "@/app/data/new-homepage";
import { STORE_NAME, STORE_FACEBOOK, STORE_PINTEREST, STORE_CONTACT } from "@/app/lib/store_constants";
import Link from "next/link";
import Image from "next/image";
import { createSlug, BASE_URL } from "@/app/lib/helpers";

export const FOOTER_COLS = [
  {
    heading: "Products",
    links: [
      { name: "Fireplaces",              url: "/fireplaces" },
      { name: "Patio Heaters",           url: "/patio-heaters" },
      { name: "Built-In Grills",         url: "/built-in-grills" },
      { name: "Freestanding Grills",     url: "/freestanding-grills" },
      { name: "Outdoor Refrigeration",   url: "/outdoor-refrigeration" },
      { name: "Outdoor Storage",         url: "/outdoor-storage" },
    ],
  },
  {
    heading: "Customer Service",
    links: [
      { name: "Contact Us",      url: "/contact" },
      { name: "Returns & Refunds", url: "/return-policy" },
      { name: "Shipping Policy", url: "/shipping-policy" },
      { name: "Privacy Policy",  url: "/privacy-policy" },
    ],
  },
  {
    heading: "Company",
    links: [
      { name: "About Us",            url: "/about" },
      { name: "Our Brands",          url: "/brands" },
      { name: "Open Box",            url: "/open-box" },
      { name: "Package Deals",       url: "/package-deals" },
      { name: "Clearance Sale",      url: "/clearance-sale" },
      { name: "Contractor Program",  url: "/professional-program" },
    ],
  },
];

const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

const PinterestIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

export default function Footer({ logo }) {
  return (
    <footer className="bg-char dark:bg-char text-ash/50 dark:text-ash/50 border-t-2 border-ember/50 dark:border-ember/60">

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-12 pb-7">

        {/* Main grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand column */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            {logo ? (
              <div className="relative w-[130px] h-[52px] mb-4">
                <Image
                  src="/solana-new-logo-orig-white.png"
                  alt={`${STORE_NAME} logo`}
                  fill
                  sizes="130px"
                  className="object-contain object-left"
                  priority={false}
                />
              </div>
            ) : (
              <Link href="/" className="font-oswald font-bold text-xl text-ash dark:text-ash inline-block mb-4">
                BBQ Grill<span className="text-ember">Outlet</span>
              </Link>
            )}

            <p className="text-sm leading-relaxed mb-3">
              Premium outdoor kitchen equipment at outlet prices. Authorized dealer for every brand we carry.
            </p>

            <a
              href={`tel:${STORE_CONTACT}`}
              className="inline-flex items-center gap-2 text-sm text-ash/70 dark:text-ash/70 hover:text-ember transition-colors mb-4"
            >
              <svg className="w-3.5 h-3.5 text-ember flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.36 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              {STORE_CONTACT}
            </a>

            {/* Social links */}
            <div className="flex items-center gap-2 mb-5">
              {STORE_FACEBOOK && (
                <Link
                  href={STORE_FACEBOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 flex items-center justify-center bg-smoke dark:bg-smoke border border-white/10 text-ash/50 hover:text-white hover:border-ember hover:bg-ember transition-all"
                >
                  <FacebookIcon />
                </Link>
              )}
              {STORE_PINTEREST && (
                <Link
                  href={STORE_PINTEREST}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Pinterest"
                  className="w-8 h-8 flex items-center justify-center bg-smoke dark:bg-smoke border border-white/10 text-ash/50 hover:text-white hover:border-ember hover:bg-ember transition-all"
                >
                  <PinterestIcon />
                </Link>
              )}
            </div>

            {/* Payment methods */}
            <div className="flex flex-wrap gap-1.5">
              {(PAYMENT_METHODS || []).map((p) => (
                <span
                  key={p}
                  className="bg-smoke dark:bg-smoke border border-white/10 text-[9px] font-oswald uppercase tracking-wide px-2 py-1 text-ash/40"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="font-oswald text-ash dark:text-ash text-xs font-semibold tracking-[.14em] uppercase mb-4">
                {heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((item, index) => (
                  <li key={`foot-link-${createSlug(heading)}-${index}`}>
                    <Link
                      href={`${BASE_URL}${item?.url}` || "#"}
                      prefetch={false}
                      className="text-xs text-ash/40 dark:text-ash/40 hover:text-ember dark:hover:text-ember transition-colors"
                    >
                      {item?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="font-oswald text-[10px] uppercase tracking-widest text-ash/30">
            © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            {["Authorized Dealer", "Secure Checkout", "Price-Match Guarantee"].map((item) => (
              <span key={item} className="flex items-center gap-1.5 font-oswald text-[10px] uppercase tracking-wide text-ash/30">
                <span className="w-1 h-1 rounded-full bg-ember flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
