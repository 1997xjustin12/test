import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";
import { STORE_NAME2, STORE_CONTACT, HOURS_SUMMARY } from "@/app/lib/store_constants";

import ContractorProgramForm from "@/app/components/oko-design/form/ContractorProgramForm";

// Built to oko-design-patterns.md: cream page, white 2px-cornered cards on
// hairline borders, mono eyebrows over slab-serif headings, barn for the one
// primary action, sage for secondary links, stroke icons and no emoji. The
// shared oko-design/utility components (PageHero, InfoCard…) still carry the
// BBQ scaffold's styling, so this page doesn't use them.

const Icon = ({ d, className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d.map((p) => <path key={p} d={p} />)}
  </svg>
);

const ICONS = {
  tag: ["M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z", "M7.5 7.5h.01"],
  truck: ["M3 6h11v10H3z", "M14 9h4l3 3v4h-7", "M7.5 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z", "M19.5 18.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"],
  people: ["M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20", "M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z", "M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35", "M15.5 4.15a3.5 3.5 0 0 1 0 6.7"],
  clipboard: ["M9 4h6v3H9z", "M9 5.5H6.5a1 1 0 0 0-1 1V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V6.5a1 1 0 0 0-1-1H15", "M9 12h6M9 16h4"],
  clock: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 7v5l3 2"],
  chat: ["M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12Z"],
};

const benefits = [
  { icon: "tag",    title: "Trade pricing",     desc: "Exclusive discounts across our full catalog — from fireplaces and inserts to mantels, accessories, and outdoor heating." },
  { icon: "truck",  title: "Priority shipping", desc: "Free shipping on eligible orders delivered anywhere in the continental US, with real-time tracking from warehouse to job site." },
  { icon: "people", title: "Expert access",     desc: "A direct line to our certified fireplace specialists for product specs, project guidance, and installation support." },
];

const steps = [
  { n: "01", title: "Apply online", desc: "Complete the short application form on our website. Takes less than 5 minutes." },
  { n: "02", title: "Get reviewed", desc: "Our team reviews your application within 1–2 business days and confirms your credentials." },
  { n: "03", title: "Start saving", desc: "Once approved, trade pricing activates immediately on your account — no waiting." },
];

const qualifications = [
  "Licensed fireplace or HVAC contractors",
  "Interior designers and home stagers",
  "Architects and building designers",
  "General contractors and home builders",
  "Property developers and real estate professionals",
];

const programBenefits = [
  "Exclusive trade discounts on the full product catalog",
  "Free shipping on eligible orders within the continental US",
  "Dedicated account support from our specialist team",
  "Access to product specs, CAD drawings, and installation guides",
  "Early access to new arrivals and limited inventory",
  "Flexible ordering with volume pricing available on request",
];

const card = "bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px]";
const eyebrow = "block font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light mb-2";
const h2 = "font-oko-display font-semibold text-[27px] leading-[1.2] text-oko-char dark:text-oko-cream";
const h3 = "font-inter font-semibold text-[15px] text-oko-char dark:text-oko-cream";
const body = "font-inter text-[13.5px] leading-relaxed text-oko-char-soft dark:text-oko-ondark";
const sageLink = "font-semibold text-oko-sage dark:text-oko-sage-light border-b border-oko-sage/40 hover:border-oko-barn hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors";
const rule = "border-t border-oko-stone-line dark:border-oko-line-dark my-14";

const IconBox = ({ name }) => (
  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-[2px] border border-oko-stone-line bg-oko-cream-dim text-oko-barn dark:border-oko-line-dark dark:bg-oko-night-3 dark:text-oko-barn-light">
    <Icon d={ICONS[name]} />
  </span>
);

export default function OKOProfessionalProgramPage() {
  return (
    <div className="max-w-[1260px] mx-auto px-5 sm:px-8 py-10 font-inter">
      <nav aria-label="Breadcrumb" className="mb-8 font-inter text-[12px] text-oko-stone">
        <Link prefetch={false} href={BASE_URL || "/"} className="hover:text-oko-barn transition-colors">Home</Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <span className="text-oko-char dark:text-oko-cream" aria-current="page">Professional Program</span>
      </nav>

      <header className="mb-10 max-w-[720px]">
        <span className={eyebrow}>For trade professionals</span>
        <h1 className="font-oko-display font-semibold text-[clamp(26px,5vw,42px)] leading-[1.12] text-oko-char dark:text-oko-cream mb-3">
          {STORE_NAME2} Professional Program
        </h1>
        <p className={body}>
          An exclusive program for licensed contractors, designers, and builders. Get trade pricing,
          dedicated support, and expert resources on every project.
        </p>
        <a href="#apply" className="mt-6 inline-flex items-center justify-center px-8 py-3 bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[13.5px] rounded-[2px] transition-colors">
          Start your application
        </a>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[22px]">
        {benefits.map((b) => (
          <div key={b.title} className={`${card} p-5 sm:p-6`}>
            <IconBox name={b.icon} />
            <h3 className={`${h3} mb-1.5`}>{b.title}</h3>
            <p className={body}>{b.desc}</p>
          </div>
        ))}
      </div>

      <div className={rule} />

      <section>
        <div className="mb-8">
          <span className={eyebrow}>Simple process</span>
          <h2 className={h2}>How it works</h2>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-[22px]">
          {steps.map((s) => (
            <li key={s.n} className="border-t-2 border-oko-char dark:border-oko-cream pt-4">
              <span className="block font-oko-mono text-[12px] text-oko-barn dark:text-oko-barn-light mb-2">{s.n}</span>
              <p className={`${h3} mb-1`}>{s.title}</p>
              <p className={body}>{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className={rule} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className={`${h2} mb-4`}>Who qualifies</h2>
            <div className={`${body} space-y-4`}>
              <p>
                The {STORE_NAME2} Professional Program is open to verified trade professionals who
                design, specify, or install fireplace and heating systems. Eligible applicants include:
              </p>
              <ul className="space-y-2">
                {qualifications.map((q) => (
                  <li key={q} className="flex items-start gap-2.5">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-oko-barn dark:bg-oko-barn-light" aria-hidden="true" />
                    {q}
                  </li>
                ))}
              </ul>
              <p>
                Not sure if you qualify?{" "}
                <a href={`tel:${STORE_CONTACT}`} className={sageLink}>Give us a call</a>
                {" "}— we&apos;re happy to discuss your situation.
              </p>
            </div>
          </section>

          <section>
            <h2 className={`${h2} mb-4`}>Program benefits</h2>
            <div className={`${body} space-y-4`}>
              <ul className="space-y-2">
                {programBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <svg className="mt-[3px] h-4 w-4 shrink-0 text-oko-sage dark:text-oko-sage-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
              <p>
                Getting started is easy — complete the short online application and our team will
                review it within 1–2 business days. Once approved, trade pricing activates immediately
                on your account.
              </p>
            </div>
          </section>
        </div>

        <aside className="space-y-[22px] lg:sticky lg:top-[120px] self-start">
          <div className={`${card} p-5 sm:p-6 border-t-2 !border-t-oko-barn dark:!border-t-oko-barn-light`}>
            <IconBox name="clipboard" />
            <h3 className={`${h3} mb-1.5`}>Ready to apply?</h3>
            <p className={`${body} mb-4`}>
              Apply online in under 5 minutes. Questions first? Our team is available {HOURS_SUMMARY}.
            </p>
            <a href="#apply" className="flex w-full items-center justify-center py-3 bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[13.5px] rounded-[2px] transition-colors">
              Start your application
            </a>
            <a href={`tel:${STORE_CONTACT}`} className="mt-3 block text-center font-inter text-[12.5px] text-oko-stone hover:text-oko-barn dark:text-oko-ondark-faint transition-colors">
              or call {STORE_CONTACT}
            </a>
          </div>

          <div className={`${card} p-5 sm:p-6`}>
            <IconBox name="clock" />
            <h3 className={`${h3} mb-3`}>Approval timeline</h3>
            <dl className="font-inter text-[12.5px]">
              {[
                ["Application", "Under 5 minutes"],
                ["Review",      "1–2 business days"],
                ["Activation",  "Immediate on approval"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-oko-stone-line dark:border-oko-line-dark py-2 first:pt-0 last:border-0 last:pb-0">
                  <dt className="text-oko-stone dark:text-oko-ondark-faint">{k}</dt>
                  <dd className="font-semibold text-oko-char dark:text-oko-cream">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={`${card} p-5 sm:p-6`}>
            <IconBox name="chat" />
            <h3 className={`${h3} mb-1.5`}>Have questions?</h3>
            <p className={`${body} mb-4`}>
              Our specialists are ready to walk you through the program and answer any questions
              before you apply.
            </p>
            <Link
              prefetch={false}
              href={BASE_URL + "/contact"}
              className="flex w-full items-center justify-center py-3 border border-oko-char dark:border-oko-cream text-oko-char dark:text-oko-cream font-inter font-semibold text-[13.5px] rounded-[2px] hover:bg-oko-char hover:text-oko-cream dark:hover:bg-oko-cream dark:hover:text-oko-char transition-colors"
            >
              Contact us
            </Link>
          </div>
        </aside>
      </div>

      <div className={rule} />

      {/* The application. id="apply" is the hero's and the "Ready to apply?" card's target. */}
      <section id="apply" className="scroll-mt-[140px]">
        <div className="mb-8 text-center">
          <span className={eyebrow}>Apply online</span>
          <h2 className={h2}>Professional Program application</h2>
          <p className="mt-2 font-inter text-[13.5px] text-oko-stone dark:text-oko-ondark-faint">
            Takes less than 5 minutes. We review every application within 1–2 business days.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <ContractorProgramForm />
        </div>
      </section>
    </div>
  );
}
