import { PAYMENT_METHODS } from "@/app/data/new-homepage";
import { STORE_NAME, STORE_FACEBOOK, STORE_PINTEREST } from "@/app/lib/store_constants";
import Link from "next/link";
import Image from "next/image";
import { createSlug, BASE_URL } from "@/app/lib/helpers";
import PaymentIcons from "@/app/components/atom/PaymentIcons";

// Phone is a first-class OKO brand element — always this exact literal (spec §10).
const OKO_PHONE = "888-667-4986";
const OKO_PHONE_HREF = "tel:8886674986";

export const FOOTER_COLS = [
  {
    heading: "Shop",
    links: [
      { name: "BBQ grills and smokers", url: "/grills" },
      { name: "Built-in grills", url: "/built-in-grills" },
      { name: "Freestanding grills", url: "/freestanding-grills" },
      { name: "Accessories", url: "/accessories" },
    ],
  },
  {
    heading: "Deals",
    links: [
      { name: "Open box", url: "/open-box" },
      { name: "Package deals", url: "/package-deals" },
      { name: "Clearance sale", url: "/clearance-sale" },
      { name: "Promotions", url: "/grill-promotions" },
    ],
  },
  {
    heading: "Support",
    links: [
      { name: "Refund & return policy", url: "/return-policy" },
      { name: "Shipping policy", url: "/shipping-policy" },
      { name: "Contact us", url: "/contact" },
      { name: "About us", url: "/about" },
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
    <footer className="bg-oko-char text-oko-ondark">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8 pt-[52px] pb-[88px] lg:pb-9">
        {/* 5-column grid: brand block spans 2 on tablet */}
        <div className="grid grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr] gap-8 mb-10">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-1">
            {logo ? (
              <div className="relative w-[150px] h-[46px] mb-3">
                <Image
                  src={logo}
                  alt={`${STORE_NAME} logo`}
                  fill
                  sizes="150px"
                  className="object-contain object-left"
                  priority={false}
                />
              </div>
            ) : (
              <Link
                href="/"
                className="font-oko-display font-semibold text-[19px] text-white inline-block mb-3"
              >
                Outdoor Kitchen Outlet
              </Link>
            )}

            <p className="text-[12.5px] leading-[1.5] text-oko-ondark-faint max-w-[280px] mb-4">
              Best prices on built-in BBQ grills and outdoor kitchen equipment from 30+ top brands — guaranteed to match or beat any competitor.
            </p>

            {/* Inline newsletter form — bordered container, transparent input, solid barn button, no gap */}
            <div className="flex border border-[rgba(246,242,234,0.22)] rounded-[2px] max-w-[280px] mb-5">
              <label htmlFor="oko-newsletter-email" className="sr-only">
                Your email
              </label>
              <input
                id="oko-newsletter-email"
                type="email"
                placeholder="Your email"
                className="flex-1 min-w-0 bg-transparent border-none px-3 py-2.5 text-[12.5px] text-white placeholder-oko-ondark-faint outline-none"
              />
              <button
                type="button"
                className="bg-oko-barn hover:bg-oko-barn-dark text-white font-semibold text-[12px] px-4 transition-colors"
              >
                Sign up
              </button>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2 mb-5">
              {STORE_FACEBOOK && (
                <Link
                  href={STORE_FACEBOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 flex items-center justify-center border border-[rgba(246,242,234,0.16)] rounded-[2px] text-oko-ondark-faint hover:text-white hover:border-oko-barn-light hover:bg-oko-barn transition-colors"
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
                  className="w-8 h-8 flex items-center justify-center border border-[rgba(246,242,234,0.16)] rounded-[2px] text-oko-ondark-faint hover:text-white hover:border-oko-barn-light hover:bg-oko-barn transition-colors"
                >
                  <PinterestIcon />
                </Link>
              )}
            </div>

            <PaymentIcons methods={PAYMENT_METHODS} walletIconClassName="text-oko-ondark-faint" />
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-oko-barn-light mb-3.5">
                {heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((item, index) => (
                  <li key={`foot-link-${createSlug(heading)}-${index}`}>
                    <Link
                      href={`${BASE_URL}${item?.url}`}
                      prefetch={false}
                      className="text-[12.5px] text-oko-ondark-muted hover:text-white transition-colors"
                    >
                      {item?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Talk to sales */}
          <div>
            <h4 className="font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-oko-barn-light mb-3.5">
              Talk to sales
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link
                  href={OKO_PHONE_HREF}
                  className="font-oko-display font-bold text-[18px] text-white hover:text-oko-barn-light transition-colors"
                >
                  {OKO_PHONE}
                </Link>
              </li>
              <li className="text-[12.5px] text-oko-ondark-muted">Sales: Mon–Fri 4am–6pm PST</li>
              <li className="text-[12.5px] text-oko-ondark-muted">Support: Mon–Fri, closed weekends</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[rgba(246,242,234,0.14)] pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-[11.5px] text-oko-ondark-faint">
            © {new Date().getFullYear()} {STORE_NAME || "Outdoor Kitchen Outlet"}. All rights reserved.
          </span>
          <div className="flex items-center gap-4 flex-wrap">
            {[
              { name: "Privacy", url: "/privacy-policy" },
              { name: "Terms", url: "/terms" },
              { name: "Sitemap", url: "/sitemap" },
            ].map((item) => (
              <Link
                key={item.name}
                href={`${BASE_URL}${item.url}`}
                prefetch={false}
                className="text-[11.5px] text-oko-ondark-faint hover:text-white transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
