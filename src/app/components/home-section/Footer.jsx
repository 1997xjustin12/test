import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────

const FOOTER_LINKS = [
  {
    heading: "Products",
    links: [
      { label: "Fireplaces",             href: "/fireplaces" },
      { label: "Patio Heaters",          href: "/patio-heaters" },
      { label: "Built-In Grills",        href: "/built-in-grills" },
      { label: "Freestanding Grills",    href: "/freestanding-grills" },
      { label: "Outdoor Refrigeration",  href: "/outdoor-refrigeration" },
      { label: "Outdoor Storage",        href: "/outdoor-storage" },
    ],
  },
  {
    heading: "Customer Service",
    links: [
      { label: "Contact Us",        href: "/contact" },
      { label: "Returns & Refunds", href: "/returns" },
      { label: "Shipping Policy",   href: "/shipping" },
      { label: "Privacy Policy",    href: "/privacy-policy" },
      { label: "FAQs",              href: "/faqs" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Solana",       href: "/about" },
      { label: "Our Brands",         href: "/brands" },
      { label: "Open Box",           href: "/open-box" },
      { label: "Current Deals",      href: "/deals" },
      { label: "Contractor Program", href: "/contractor" },
      { label: "Blog",               href: "/blog" },
    ],
  },
];

const SOCIAL = [
  { label: "Facebook",  href: "https://facebook.com",  Icon: Facebook  },
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "YouTube",   href: "https://youtube.com",   Icon: Youtube   },
];

const PAYMENT_METHODS = ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay", "Google Pay"];

const CONTACT_ITEMS = [
  { Icon: Phone,  text: "(888) 575-9720",          href: "tel:8885759720"            },
  { Icon: Mail,   text: "support@solanafireplaces.com", href: "mailto:support@solanafireplaces.com" },
  { Icon: MapPin, text: "Serving the US Nationwide", href: null                      },
];

// ─────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-stone-900 text-white/60">

      {/* ── Main Footer Body ── */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-14 sm:pt-16 lg:pt-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]
                        gap-10 lg:gap-12 mb-12 sm:mb-14">

          {/* ── Col 1 – Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1">

            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-700
                              flex items-center justify-center text-lg leading-none shrink-0">
                🔥
              </div>
              <span className="font-serif text-[1.25rem] font-bold text-white
                               group-hover:text-orange-400 transition-colors duration-200">
                Solana Fireplaces
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-sm leading-relaxed max-w-xs mb-6">
              We specialize in creating exceptional indoor and outdoor living
              experiences through expertly curated heating and kitchen products.
            </p>

            {/* Contact items */}
            <ul className="flex flex-col gap-3 mb-7">
              {CONTACT_ITEMS.map(({ Icon, text, href }) => (
                <li key={text}>
                  {href ? (
                    <a
                      href={href}
                      className="inline-flex items-center gap-2.5 text-sm
                                 hover:text-orange-400 transition-colors duration-200"
                    >
                      <Icon size={14} className="text-orange-500 shrink-0" />
                      {text}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2.5 text-sm cursor-default">
                      <Icon size={14} className="text-orange-500 shrink-0" />
                      {text}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {SOCIAL.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-orange-500
                             flex items-center justify-center text-white/50 hover:text-white
                             transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Cols 2-4 – Link columns ── */}
          {FOOTER_LINKS.map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="text-white text-sm font-semibold tracking-wide mb-4 sm:mb-5">
                {heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm hover:text-orange-400
                                 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-white/[0.08] mb-7 sm:mb-8" />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center
                        justify-between gap-5 sm:gap-6">

          {/* Copyright */}
          <p className="text-xs text-center sm:text-left">
            © {currentYear} Solana Fireplaces. All rights reserved.
          </p>

          {/* Payment methods */}
          <div className="flex flex-col items-center sm:items-end gap-2">
            <p className="text-[0.65rem] text-white/30 uppercase tracking-widest">
              We Accept
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-1.5">
              {PAYMENT_METHODS.map((method) => (
                <span
                  key={method}
                  className="bg-white/8 text-white/40 text-[0.65rem]
                             font-medium px-2.5 py-1 rounded-md"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}