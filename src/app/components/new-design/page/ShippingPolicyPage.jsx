"use client";

import { useState } from "react";

const F = "#E85D26", FL = "#F97316", FD = "rgba(232,93,38,0.10)";

// ─── SHARED PRIMITIVES ────────────────────────────────────────────────────────
const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mb-8">
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-1.5">
        {i > 0 && <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>}
        {i === items.length - 1
          ? <span className="font-semibold text-gray-700 dark:text-gray-300">{item}</span>
          : <a href="#" className="hover:text-orange-500 transition-colors">{item}</a>}
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

const Badge = ({ children, color = "orange" }) => {
  const styles = {
    orange: { background: FD, color: F },
    green:  { background: "rgba(22,163,74,0.1)",  color: "#16a34a" },
    blue:   { background: "rgba(37,99,235,0.1)",   color: "#2563eb" },
    gray:   { background: "rgba(107,114,128,0.1)", color: "#6b7280" },
  };
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold" style={styles[color]}>{children}</span>
  );
};

export default function ShippingPolicyPage() {
  const methods = [
    { name:"Standard Freight",    time:"5–10 business days", price:"Free on orders $999+", icon:"🚚", badge:"Most Common" },
    { name:"Expedited Shipping",  time:"3–5 business days",  price:"From $149",             icon:"⚡", badge:null },
    { name:"White-Glove Delivery",time:"7–14 business days", price:"From $299",             icon:"🤍", badge:"Recommended" },
    { name:"In-Store Pickup",     time:"Same day",           price:"Free",                  icon:"🏪", badge:null },
  ];
  const carriers = ["UPS","FedEx","XPO Logistics","Estes Express","Old Dominion","R+L Carriers"];

  return (
    <div className="max-w-[1240] mx-auto px-4 sm:px-6 py-10">
      <Breadcrumb items={["Home","Shipping Policy"]}/>
      <PageHero
        eyebrow="Fast & Reliable Delivery"
        title="Shipping Policy"
        subtitle="We ship to all 50 states. Most in-stock items ship within 1–2 business days. Track your order every step of the way."
      >
        <p className="text-orange-300 text-xs mt-4">Last updated: January 15, 2025</p>
      </PageHero>

      {/* Key highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { icon:"🆓", title:"Free Shipping", sub:"On orders over $999" },
          { icon:"📦", title:"Ships in 1–2 Days", sub:"For in-stock items" },
          { icon:"🔎", title:"Real-Time Tracking", sub:"From warehouse to door" },
          { icon:"🇺🇸", title:"All 50 States", sub:"Including Hawaii & Alaska" },
        ].map(h=>(
          <div key={h.title} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 text-center hover:border-orange-300 dark:hover:border-orange-800 transition-colors">
            <span className="text-2xl block mb-2">{h.icon}</span>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{h.title}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{h.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-0">
          {/* Shipping Methods */}
          <div className="mb-10">
            <SectionLabel>Delivery Options</SectionLabel>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5" style={{fontFamily:"Georgia,serif"}}>Shipping Methods</h2>
            <div className="space-y-3">
              {methods.map(m=>(
                <div key={m.name} className="flex items-start gap-4 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-orange-300 dark:hover:border-orange-800 transition-colors">
                  <span className="text-2xl shrink-0">{m.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{m.name}</p>
                      {m.badge && <Badge color={m.badge==="Recommended"?"green":"orange"}>{m.badge}</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{m.time}</p>
                  </div>
                  <p className="text-sm font-bold shrink-0" style={{color:F}}>{m.price}</p>
                </div>
              ))}
            </div>
          </div>

          <Divider/>

          <PolicySection title="Processing Time">
            <p>Orders placed before <strong className="text-gray-800 dark:text-gray-200">2:00 PM PST on business days</strong> are processed the same day. Orders placed after 2:00 PM or on weekends/holidays are processed the next business day.</p>
            <p>Custom or special-order items may require 2–6 weeks for manufacturing before shipping. You will be notified with an estimated ship date at time of purchase.</p>
          </PolicySection>

          <Divider/>

          <PolicySection title="Freight & Large Item Delivery">
            <p>Fireplaces and large items ship via freight carrier. Here's what to expect:</p>
            <ul className="list-none space-y-2 mt-3">
              {[
                ["Curbside Delivery","Carrier brings item to the curb. Customer is responsible for moving inside."],
                ["Threshold Delivery","Item delivered to first dry area (garage or first room). Additional charge applies."],
                ["White-Glove Service","Full-service delivery, unpacking, placement, and debris removal."],
              ].map(([t,d])=>(
                <li key={t} className="flex gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="w-1 h-auto rounded-full shrink-0 mt-1" style={{background:F, minHeight:"16px", width:"3px"}}/>
                  <div><p className="font-semibold text-gray-800 dark:text-gray-200 text-xs mb-0.5">{t}</p><p>{d}</p></div>
                </li>
              ))}
            </ul>
          </PolicySection>

          <Divider/>

          <PolicySection title="Receiving Your Delivery">
            <p>When your freight shipment arrives, please:</p>
            <ul className="list-none space-y-1.5 mt-2">
              {[
                "Inspect all packaging for visible damage before signing",
                "Open and inspect the product in the presence of the driver",
                "Note any damage on the Bill of Lading before signing",
                "Take photos of any damage — this is critical for claims",
                "Contact us within 48 hours if damage is discovered after the driver leaves",
              ].map((t,i)=>(
                <li key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5" style={{background:F}}>{i+1}</span>
                  {t}
                </li>
              ))}
            </ul>
          </PolicySection>

          <Divider/>

          <PolicySection title="International Shipping">
            <p>We currently ship to the <strong className="text-gray-800 dark:text-gray-200">contiguous 48 states</strong> with standard freight. Hawaii and Alaska shipments are available at an additional surcharge — please contact us for a custom quote. We do not ship internationally at this time.</p>
          </PolicySection>

          <Divider/>

          {/* Carriers */}
          <div>
            <SectionLabel>Our Carriers</SectionLabel>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4" style={{fontFamily:"Georgia,serif"}}>Trusted Shipping Partners</h2>
            <div className="flex flex-wrap gap-2">
              {carriers.map(c=>(
                <span key={c} className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-semibold text-gray-700 dark:text-gray-300">{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-24 self-start">
          <InfoCard icon="📞" title="Shipping Questions?" accent>
            <p className="mb-3">Our logistics team can provide real-time status on any order.</p>
            <a href="tel:8885759720" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white mb-2" style={{background:F}}>(888) 575-9720</a>
            <a href="#" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-orange-400 transition-colors">Track My Order</a>
          </InfoCard>
          <InfoCard icon="📋" title="Shipping Summary">
            <ul className="space-y-2 text-xs">
              {[["Free shipping","Orders over $999"],["Processing","1–2 business days"],["Standard delivery","5–10 business days"],["Expedited","3–5 business days"],["White-glove","7–14 business days"],["In-store pickup","Same day, free"]].map(([k,v])=>(
                <li key={k} className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1.5 last:border-0 last:pb-0">
                  <span className="text-gray-500 dark:text-gray-400">{k}</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 text-right max-w-[100px]">{v}</span>
                </li>
              ))}
            </ul>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}