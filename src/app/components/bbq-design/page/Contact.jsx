import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";
import { STORE_NAME2, STORE_CONTACT, STORE_EMAIL } from "@/app/lib/store_constants";

import Breadcrumb from "@/app/components/bbq-design/utility/Breadcrumb";
import PageHero from "@/app/components/bbq-design/utility/PageHero";
import InfoCard from "@/app/components/bbq-design/utility/InfoCard";

const channels = [
  {
    icon: "📞",
    label: "Call Us",
    value: STORE_CONTACT,
    sub: "Mon–Fri 8am–6pm PST",
    href: `tel:${STORE_CONTACT}`,
  },
  {
    icon: "✉️",
    label: "Email Us",
    value: STORE_EMAIL,
    sub: "Response within 24 hours",
    href: `mailto:${STORE_EMAIL}`,
  },
];

export default function BBQContactPage() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10 font-sora">
      <Breadcrumb items={["Home", "Contact"]} />
      <PageHero
        eyebrow="We're here to help"
        title="Contact Us"
        subtitle="Have a question about a fireplace, an order, or need expert advice? Our team of fireplace specialists is ready to help."
      />

      <div className="max-w-[800px] mx-auto">
        <div className="bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm p-6 sm:p-8">
          <p className="mb-5 text-center text-sm font-light leading-relaxed text-stone-600 dark:text-stone-400">
            At{" "}
            <Link
              prefetch={false}
              href={`${BASE_URL}`}
              className="text-theme-600 font-semibold underline"
            >
              {STORE_NAME2}
            </Link>{" "}
            customer service comes first. Whether you need details about a
            product or assistance with your order, our team is ready to help.
            You can reach us in three convenient ways.
          </p>
        </div>

        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="group flex flex-col gap-3 p-5 rounded-sm border border-grate dark:border-white/10 bg-paper dark:bg-smoke hover:border-theme-600 dark:hover:border-theme-600/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-char/10 dark:hover:shadow-black/30 transition-all duration-200"
              >
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="font-oswald text-[11px] font-semibold uppercase tracking-wide text-char/50 dark:text-ash/40 mb-0.5">
                    {c.label}
                  </p>
                  <p className="font-oswald text-sm font-semibold text-char dark:text-ash group-hover:text-theme-600 dark:group-hover:text-theme-500 transition-colors">
                    {c.value}
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {c.sub}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <InfoCard icon="⏱️" title="Response Times" accent>
          <ul className="space-y-2 mt-1">
            {[
              ["Phone", "Same day"],
              ["Email", "Within 24h"],
              ["Live Chat", "Under 5 min"],
            ].map(([k, v]) => (
              <li key={k} className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">{k}</span>
                <span className="font-semibold text-char dark:text-ash">{v}</span>
              </li>
            ))}
          </ul>
        </InfoCard>
        <InfoCard icon="🕐" title="Business Hours">
          <ul className="space-y-1.5 mt-1">
            {[
              ["Mon – Fri", "8:00 AM – 6:00 PM"],
              ["Saturday", "9:00 AM – 4:00 PM"],
              ["Sunday", "Closed"],
            ].map(([d, t]) => (
              <li key={d} className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">{d}</span>
                <span className="font-semibold text-char dark:text-ash text-xs">{t}</span>
              </li>
            ))}
          </ul>
        </InfoCard>
        <InfoCard icon="🏆" title="Expert Advice">
          <p>
            All our support staff are certified fireplace specialists with 5+
            years of experience. We speak your language — no jargon.
          </p>
        </InfoCard>
      </div>
    </div>
  );
}
