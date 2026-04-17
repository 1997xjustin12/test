"use client";

import { useState } from "react";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";
import { STORE_NAME2 as brandName } from "@/app/lib/store_constants";

const F = "#E85D26", FL = "#F97316", FD = "rgba(232,93,38,0.10)";

// ─── SHARED PRIMITIVES ────────────────────────────────────────────────────────
const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mb-8">
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-1.5">
        {i > 0 && <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>}
        {i === items.length - 1
          ? <span className="font-semibold text-gray-700 dark:text-gray-300">{item}</span>
          : <Link prefetch={false} href={BASE_URL} className="hover:text-orange-500 transition-colors">{item}</Link>}
      </span>
    ))}
  </nav>
);

const PageHero = ({ eyebrow, title, subtitle, children }) => (
  <div className="relative overflow-hidden rounded-2xl mb-10 px-6 sm:px-10 py-12">
    <div className="absolute inset-0" style={{background:"linear-gradient(120deg,#1a0600,#3d1208)"}}/>
    <div className="absolute inset-0" style={{background:`radial-gradient(ellipse at 75% 50%,${F}40,transparent 65%)`}}/>
    <div className="relative z-10">
      {eyebrow && <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{color:FL}}>{eyebrow}</p>}
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3" style={{fontFamily:"Georgia,serif"}}>{title}</h1>
      {subtitle && <p className="text-orange-200 text-sm sm:text-base max-w-xl leading-relaxed">{subtitle}</p>}
      {children}
    </div>
  </div>
);

const SectionLabel = ({ children }) => (
  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{color:F}}>{children}</p>
);

const Divider = () => <hr className="border-gray-100 dark:border-gray-800 py-8"/>;

const InfoCard = ({ icon, title, children, accent }) => (
  <div className={`rounded-2xl p-6 border ${accent ? "border-orange-200 dark:border-orange-900/50" : "border-gray-200 dark:border-gray-800"} bg-white dark:bg-gray-900`}>
    {icon && <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-xl" style={{background:FD}}>{icon}</div>}
    {title && <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-base">{title}</h3>}
    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{children}</div>
  </div>
);

const PolicySection = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
      <span className="w-1 h-5 rounded-full shrink-0 inline-block" style={{background:F}}/>
      {title}
    </h2>
    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-3 pl-3">{children}</div>
  </div>
);

export default function ReturnPolicyPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const steps = [
    { n:"01", title:"Contact Us", desc:"Reach out within 30 days of delivery via phone or email to initiate your return. We require detailed pictures showing the condition of all item(s) being returned." },
    { n:"02", title:"Get Your RMA", desc:"We'll issue a Return Merchandise Authorization (RMA) number. All returns require a valid RMA — returns without one will not be accepted." },
    { n:"03", title:"Ship It Back", desc:"Package the item securely in its original packaging and clearly label your RMA number on the outside. The customer is responsible for all return shipping costs." },
    { n:"04", title:"Receive Refund", desc:"Once received and inspected, refunds are issued within 3–5 business days. Allow up to 14 business days depending on your payment method. All shipping costs to and from will be deducted from the refund." },
  ];

  const faqs = [
    { q:"Can I return an installed fireplace?", a:"No. Once a fireplace has been installed or assembled it cannot be returned. Please verify the unit is correct before installation. Contact us before installing if you have any concerns." },
    { q:"What if my item arrives damaged?", a:"All orders must be received by someone 18 years or older. While the driver is present, inspect the box and contents for damage. If damage is found, do not sign — reject the delivery and call us immediately. If a defect is discovered after delivery, contact us right away. Most products include a manufacturer's warranty and we will help direct you to the manufacturer for a replacement." },
    { q:"Are there restocking fees?", a:"A restocking fee of 20% applies to all returned items. Shipping fees also apply — all shipping costs incurred to and from will be deducted from your refund." },
    { q:"How long do refunds take?", a:"Refunds are issued within 3–5 business days after the return is received and inspected. Allow up to 14 business days depending on your payment method." },
    { q:`Can I cancel my order?`, a:`${brandName} ships most orders within 24 hours. If your order has already shipped when you request a cancellation, you are responsible for all shipping costs. Please contact us immediately to avoid being charged shipping.` },
  ];

  return (
    <div className="max-w-[1240] mx-auto px-4 sm:px-6 py-10">
      <Breadcrumb items={["Home", "Return Policy"]}/>
      <PageHero
        eyebrow="Hassle-Free Returns"
        title="Return Policy"
        subtitle={`${brandName} offers a straightforward return policy. If you need to return an item, please give us a call. We strive to provide a superior shopping experience for all of our customers.`}
      />

      {/* Key facts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {[
          { icon:"📅", title:"30-Day Window", desc:"Return most items within 30 calendar days of delivery." },
          { icon:"📦", title:"Original Condition", desc:"Items must be unused, uninstalled, and in original packaging with all labels intact." },
          { icon:"💳", title:"Refund Issued", desc:"Refunds processed within 3–5 business days after inspection. Up to 14 business days depending on payment method." },
        ].map(c => <InfoCard key={c.title} icon={c.icon} title={c.title} accent>{c.desc}</InfoCard>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-0">

          {/* Return steps */}
          <div className="mb-10">
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6" style={{fontFamily:"Georgia,serif"}}>4 Steps to Return an Item</h2>
            <div className="space-y-4">
              {steps.map(s => (
                <div key={s.n} className="flex gap-4 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-orange-300 dark:hover:border-orange-800 transition-colors">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0" style={{background:F}}>{s.n}</div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100 mb-1">{s.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Divider/>

          <PolicySection title="Return Eligibility">
            <p>
              You have <span className="font-semibold text-gray-800 dark:text-gray-200 underline">30 calendar days</span> to return an item from the date you received it. To be eligible, your item must be unused and in the same condition you received it, with all original packaging intact.
            </p>
            <p>
              Shipping fees apply to all returns. To return a qualified item, please{" "}
              <Link prefetch={false} href={BASE_URL + "/contact"} className="underline text-orange-600 dark:text-orange-400 hover:text-orange-700 transition-colors">contact us</Link>{" "}
              to obtain a Return Merchandise Authorization (RMA). A <strong className="text-gray-800 dark:text-gray-200">20% restocking fee</strong> is applicable for all items.
            </p>
            <ul className="list-none space-y-2 mt-1">
              {[
                "We require detailed pictures showing the condition of all item(s) being returned.",
                "The customer is responsible for all return shipping costs. All shipping costs to and from will be deducted from the refund.",
              ].map(item => (
                <li key={item} className="flex items-start gap-2"><span style={{color:F}} className="mt-0.5 shrink-0">•</span>{item}</li>
              ))}
            </ul>
          </PolicySection>

          <Divider/>

          <PolicySection title="Damaged or Defective Items">
            <p>All orders must be received by someone <strong className="text-gray-800 dark:text-gray-200">18 years old or older</strong>. While the driver is at your location, inspect the box and contents for any damage.</p>
            <ul className="list-none space-y-2 mt-1">
              {[
                "If damage is found upon delivery, do not sign for the item — reject the delivery and call us immediately so we can provide instructions.",
                "If you receive a defective or damaged item after delivery, contact us immediately. Most products come with a manufacturer's warranty. We will help direct you to the manufacturer to receive a replacement.",
                "Customers must obtain a Return Merchandise Authorization (RMA) prior to all returns.",
              ].map(item => (
                <li key={item} className="flex items-start gap-2"><span style={{color:F}} className="mt-0.5 shrink-0">•</span>{item}</li>
              ))}
            </ul>
          </PolicySection>

          <Divider/>

          <PolicySection title="Cancellations">
            <p>
              {brandName} wants to get your order to you as quickly as possible. Most orders ship within <strong className="text-gray-800 dark:text-gray-200">24 hours</strong>. If an order is cancelled after the item has shipped, the customer is responsible for all shipping costs. Please{" "}
              <Link prefetch={false} href={BASE_URL + "/contact"} className="underline text-orange-600 dark:text-orange-400 hover:text-orange-700 transition-colors">contact us</Link>{" "}
              immediately when wanting to cancel your order to avoid being charged shipping.
            </p>
          </PolicySection>

          <Divider/>

          <PolicySection title="Items That Do Not Qualify for Returns">
            <ul className="list-none space-y-2">
              {[
                "Used items, including items that have been installed or assembled",
                "Special promotional items, special order, made-to-order, customer order, clearance, open box, scratch & dent, or items marked as \"No Return\" or \"Non-Returnable\"",
                "Items with a return request more than 30 calendar days from the date received",
                "Items without a valid Return Merchandise Authorization (RMA)",
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-red-500 dark:text-red-400">
                  <span className="mt-0.5 shrink-0">✗</span>
                  <span className="text-gray-600 dark:text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              {brandName} is here to make your experience as simple as possible. If you have any questions about how to return your item,{" "}
              <Link prefetch={false} href={BASE_URL + "/contact"} className="underline text-orange-600 dark:text-orange-400 hover:text-orange-700 transition-colors">contact us</Link>.
            </p>
          </PolicySection>

          <Divider/>

          {/* FAQ */}
          <div>
            <SectionLabel>Common Questions</SectionLabel>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4" style={{fontFamily:"Georgia,serif"}}>FAQs</h2>
            <div className="space-y-2">
              {faqs.map((f, i) => (
                <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    {f.q}
                    <svg className={`w-4 h-4 text-gray-400 shrink-0 ml-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-3">
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-[120px] self-start">
          <InfoCard icon="📞" title="Need Help?" accent>
            <p className="mb-3">Our team is ready to assist with your return.</p>
            <Link
              prefetch={false}
              href={BASE_URL + "/contact"}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white mb-2 hover:opacity-90 transition-opacity"
              style={{background:F}}
            >
              Contact Us
            </Link>
          </InfoCard>
          <InfoCard icon="📋" title="Quick Summary">
            <ul className="space-y-2 text-xs">
              {[
                ["Return window", "30 calendar days"],
                ["Condition required", "Unused, uninstalled"],
                ["Restocking fee", "20% on all items"],
                ["Shipping costs", "Customer's responsibility"],
                ["Refund timeline", "3–5 business days"],
                ["Damaged items", "Reject at delivery or call immediately"],
              ].map(([k, v]) => (
                <li key={k} className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1.5 last:border-0 last:pb-0">
                  <span className="text-gray-500 dark:text-gray-400">{k}</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 text-right max-w-[55%]">{v}</span>
                </li>
              ))}
            </ul>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}
