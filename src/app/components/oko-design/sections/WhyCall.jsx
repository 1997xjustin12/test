import Link from "next/link";

// 8.11 Dark feature band — char-soft. Left: barn-light mono eyebrow → 29px
// white H2 (max 400px) → 14.5px paragraph → solid barn phone block. Right:
// 2x2 grid of line-on-dark bordered cells. Single column at ≤1024. Stays dark
// in both modes (designed dark band).
const OKO_PHONE = "888-667-4986";
const OKO_PHONE_HREF = "tel:8886674986";

const CELLS = [
  {
    title: "Price match, always",
    body: "Send us a competitor's listing, including Amazon, and we'll match or beat it before you order.",
  },
  {
    title: "Bundle & island pricing",
    body: "Building a full outdoor kitchen? Phone orders get package pricing not shown at checkout.",
  },
  {
    title: "Open box & closeout access",
    body: "Our reps can check floor models and scratch-and-dent stock not listed on the site yet.",
  },
  {
    title: "Free layout support",
    body: "Send your patio dimensions and get help sizing a grill, island, or vent hood before you buy.",
  },
];

export default function WhyCall() {
  return (
    <div className="bg-oko-char-soft text-white">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-center">
          {/* Left */}
          <div>
            <span className="block font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn-light mb-3.5">
              Why call instead of checkout online
            </span>
            <h2 className="font-oko-display font-semibold text-[29px] leading-[1.18] text-white max-w-[400px]">
              Listed prices aren&apos;t always our best price.
            </h2>
            <p className="font-inter text-[14.5px] leading-[1.55] text-oko-ondark max-w-[400px] mt-4">
              Our online prices already beat most competitors — but phone-only discounts, bundle pricing on islands, and open-box deals are usually reserved for direct calls.
            </p>
            <Link
              href={OKO_PHONE_HREF}
              className="inline-flex items-center gap-3 mt-6 bg-oko-barn hover:bg-oko-barn-dark px-5 py-3.5 rounded-[2px] transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span className="font-oko-display font-bold text-[20px] text-white">{OKO_PHONE}</span>
            </Link>
          </div>

          {/* Right — 2x2 cells */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CELLS.map(({ title, body }) => (
              <div
                key={title}
                className="border border-[rgba(246,242,234,0.16)] rounded-[2px] p-5"
              >
                <strong className="block font-inter font-semibold text-[14.5px] text-white mb-1.5">
                  {title}
                </strong>
                <p className="font-inter text-[13px] leading-[1.55] text-oko-ondark-muted">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
