import Link from "next/link";

// OKO phone number is a first-class brand element and, per the design system,
// always renders as this exact literal — never abbreviated (see spec §10, rule 5).
const OKO_PHONE = "888-667-4986";
const OKO_PHONE_HREF = "tel:8886674986";

// 8.1 Announcement bar — cream-dim, bottom border, ~38px, centered 13px.
// One promise + the phone in barn. Competitor name in display italic.
export default function Topbar() {
  return (
    <div className="bg-oko-cream-dim dark:bg-oko-night-2 border-b border-oko-stone-line dark:border-oko-line-dark">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-center gap-1.5 min-h-[38px] py-1.5 text-center text-[13px] leading-snug text-oko-char-soft dark:text-oko-ondark">
          <span>
            Price match guaranteed on all competitor pricing, including{" "}
            <span className="font-oko-display italic font-bold text-oko-char dark:text-oko-cream">
              amazon
            </span>{" "}
            — call{" "}
            <Link
              href={OKO_PHONE_HREF}
              className="font-semibold text-oko-barn dark:text-oko-barn-light hover:text-oko-barn-dark dark:hover:text-oko-barn-light transition-colors"
            >
              {OKO_PHONE}
            </Link>{" "}
            for current promotions
          </span>
        </div>
      </div>
    </div>
  );
}
