import Link from "next/link";
import { STORE_EMAIL } from "@/app/lib/store_constants";

// Phone is a first-class OKO brand element — always this exact literal (spec §10).
const OKO_PHONE = "888-667-4986";
const OKO_PHONE_HREF = "tel:8886674986";

// Support block — cream-dim "email" half beside a char "call" half. Barn stays
// a contained action block around the phone (spec §8.11), never a large fill.
const SupportCTA = () => (
  <section className="mb-12">
    <div className="grid grid-cols-1 sm:grid-cols-2 rounded-[2px] overflow-hidden border border-oko-stone-line dark:border-oko-line-dark">
      {/* Email half */}
      <div className="bg-oko-cream-dim dark:bg-oko-night-3 p-7 flex flex-col justify-between gap-5">
        <div>
          <h3 className="font-oko-display font-semibold text-[21px] text-oko-char dark:text-oko-cream mb-2">
            Still have questions?
          </h3>
          <p className="font-inter text-[13.5px] text-oko-char-soft dark:text-oko-ondark leading-[1.55]">
            Can&apos;t find the answer you&apos;re looking for? Our expert support team is here to help you make the right choice.
          </p>
        </div>
        <Link
          href={`mailto:${STORE_EMAIL}`}
          className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-[2px] bg-white dark:bg-oko-night-2 border border-oko-char dark:border-oko-cream text-oko-char dark:text-oko-cream font-inter font-semibold text-[13px] hover:bg-oko-char hover:text-oko-cream dark:hover:bg-oko-cream dark:hover:text-oko-char transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Contact support
        </Link>
      </div>

      {/* Call half */}
      <div className="bg-oko-char p-7 flex flex-col justify-between gap-5">
        <div>
          <h3 className="font-oko-display font-semibold text-[21px] text-oko-cream mb-2">
            Prefer to call?
          </h3>
          <p className="font-inter text-[13.5px] text-oko-ondark-muted leading-[1.55]">
            Our grill experts are available Mon–Sat 9am–6pm PST, ready to help you pick the perfect product.
          </p>
        </div>
        <Link
          href={OKO_PHONE_HREF}
          className="self-start inline-flex items-center gap-2.5 px-5 py-3 rounded-[2px] bg-oko-barn hover:bg-oko-barn-dark text-white transition-colors"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="font-oko-display font-bold text-[20px] leading-none">{OKO_PHONE}</span>
        </Link>
      </div>
    </div>
  </section>
);

export default SupportCTA;
