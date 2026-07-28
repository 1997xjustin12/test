// 8.12 Testimonials — white section, 3 bordered cards. Brass star row (with an
// sr-only text equivalent), 13.5px quote, "Initial. Surname — City, ST"
// attribution in 12px/600 stone. 3 → 2 → 1.
//
// NOTE: rendered as a static server grid using the exact homepage copy rather
// than the dynamic useReviews() feed — the spec's attribution format (initial,
// surname, city, state) isn't present in the reviews API, and the design system
// forbids loading skeletons / carousels (prefers a static grid).

const TESTIMONIALS = [
  {
    quote:
      "Called before ordering and they beat the Amazon price by $400 on the same Blaze grill. Shipped free too.",
    who: "D. Ferraro — Scottsdale, AZ",
  },
  {
    quote:
      "Got a phone-only discount on our whole island package that wasn't listed anywhere on the site.",
    who: "M. Okafor — Charlotte, NC",
  },
  {
    quote:
      "Support helped me pick the right side burner for our layout before I bought the wrong size.",
    who: "J. Whitfield — Austin, TX",
  },
];

function Stars() {
  return (
    <div className="text-oko-brass text-[14px] tracking-[2px]" aria-hidden="true">
      ★★★★★
    </div>
  );
}

export default function Reviews() {
  return (
    <section className="py-16 bg-white dark:bg-oko-night">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8">
        {/* Section header (8.7) */}
        <div className="mb-7">
          <span className="block font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light mb-2">
            Customer reviews
          </span>
          <h2 className="font-oko-display font-semibold text-[27px] leading-[1.2] text-oko-char dark:text-oko-cream">
            What buyers are saying
          </h2>
        </div>

        <div className="grid grid-cols-1 min-[560px]:grid-cols-2 lg:grid-cols-3 gap-[22px]">
          {TESTIMONIALS.map(({ quote, who }) => (
            <div
              key={who}
              className="border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] bg-white dark:bg-oko-night-2 p-6"
            >
              <Stars />
              <span className="sr-only">Rated 5 out of 5</span>
              <p className="font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark mt-3">
                {quote}
              </p>
              <div className="font-inter text-[12px] font-semibold text-oko-stone mt-3.5">
                {who}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
