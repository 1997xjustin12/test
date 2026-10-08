// 8.12 Testimonials — white section, 3 bordered cards. Brass star row (with an
// sr-only text equivalent), 13.5px quote, attribution in 12px/600 stone.
// 3 → 2 → 1.
//
// Real reviews, read on the server. This used to be three hand-written quotes
// in a const, which is the one thing a testimonials band must not be: the
// attribution read "D. Ferraro — Scottsdale, AZ" and no such customer exists.
//
// A server component rather than the useReviews() hook the other brands use,
// which suits the design system rather than fighting it: the spec forbids
// loading skeletons and carousels, and a server read has neither — the cards
// are in the HTML when it arrives. getHomeReviews() is the same reader the
// configured homepage uses, so there is one place where this request lives.
//
// Two things the API cannot give, and so are not claimed. The spec's
// "initial. Surname — City, ST" needs a city and a state, which no review
// carries; the username and the month it was written are what is real, so that
// is what the line says. And the star row is the review's own rating rather
// than a five every time.
import { getHomeReviews } from "@/app/lib/home-page/reviews";

/** The grid is three across at its widest, so three is what it reads. */
const MAX_REVIEWS = 3;

const MONTH = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" });

const writtenOn = (iso) => {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : MONTH.format(date);
};

function Stars({ rating }) {
  return (
    <>
      <div className="text-oko-brass text-[14px] tracking-[2px]" aria-hidden="true">
        {"★".repeat(rating)}
        <span className="text-oko-stone-line dark:text-oko-line-dark">
          {"★".repeat(5 - rating)}
        </span>
      </div>
      <span className="sr-only">{`Rated ${rating} out of 5`}</span>
    </>
  );
}

export default async function Reviews() {
  const { reviews } = await getHomeReviews();
  const shown = reviews.slice(0, MAX_REVIEWS);

  // Nothing to show renders nothing. A reviews band with no reviews in it is
  // worse than a homepage that goes from one section to the next, and the
  // alternative — falling back to the quotes this replaced — would be putting
  // invented customers back on the page whenever the backend has a bad moment.
  if (shown.length === 0) return null;

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
          {shown.map(({ id, name, rating, comment, createdAt }) => {
            const when = writtenOn(createdAt);
            return (
              <div
                key={id}
                className="border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] bg-white dark:bg-oko-night-2 p-6"
              >
                <Stars rating={rating} />
                <p className="font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark mt-3">
                  {comment}
                </p>
                <div className="font-inter text-[12px] font-semibold text-oko-stone mt-3.5">
                  {when ? `${name} — ${when}` : name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
