import { THEME_COLOR } from "@/app/lib/home-page/sections";
import { getHomeReviews } from "@/app/lib/home-page/reviews";

/**
 * Customer reviews on a coloured band.
 *
 * A server component, like the rest of this page, and unlike the reviews
 * section on the existing homepage — that one fetches from the browser behind a
 * hook, so the cards arrive after a round trip and a row of skeletons. Here the
 * reviews are read on the server and the cards are in the HTML; see
 * lib/home-page/reviews.js.
 *
 * Which reviews appear is not configurable, on purpose. They are the store's
 * real reviews, and a homepage that let an operator pick the flattering three
 * would be saying something it had not earned. The wording around them and the
 * colours are what this section sets.
 *
 * Colours are per scheme; see HeroSection for the mechanism.
 */

const asColor = (value, fallback = "var(--theme-primary-600)") =>
  !value || value === THEME_COLOR ? fallback : value;

/** How many fit the design's row. */
const SHOWN = 3;

const DIVISIONS = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["week", 7 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
];

/**
 * "2 weeks ago", and nothing finer.
 *
 * The page is cached, so the rendered string can be up to a revalidate window
 * behind — which is why this stops at minutes and never says "just now".
 */
function relativeDate(iso) {
  if (!iso) return null;
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return null;

  const elapsed = Date.now() - then;
  if (elapsed < 60 * 1000) return "recently";

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, ms] of DIVISIONS) {
    if (elapsed >= ms) return formatter.format(-Math.floor(elapsed / ms), unit);
  }
  return "recently";
}

function Stars({ rating, scope }) {
  return (
    <span className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="h-4 w-4"
          // The empty ones are the same star at low opacity rather than a
          // second colour to configure: they have to sit on whatever the card
          // background is, and a fixed grey does not.
          style={{ color: `var(--${scope}-star)`, opacity: i < rating ? 1 : 0.28 }}
          fill="currentColor"
        >
          <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 0 0 .95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 0 0-.37 1.12l1.07 3.29c.3.92-.75 1.69-1.54 1.12l-2.8-2.04a1 1 0 0 0-1.17 0l-2.8 2.04c-.79.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 0 0-.36-1.12l-2.8-2.03c-.79-.57-.39-1.81.58-1.81h3.46a1 1 0 0 0 .95-.69l1.07-3.29Z" />
        </svg>
      ))}
    </span>
  );
}

function ReviewCard({ review, scope }) {
  const when = relativeDate(review.createdAt);

  return (
    <li
      className="flex flex-col gap-3 rounded-2xl p-5 sm:p-6"
      style={{ background: `var(--${scope}-card)` }}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold text-white"
          style={{ background: `var(--${scope}-avatar)` }}
        >
          {review.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold" style={{ color: `var(--${scope}-name)` }}>
            {review.name}
          </p>
          <Stars rating={review.rating} scope={scope} />
          {when && (
            <p className="mt-0.5 text-xs italic" style={{ color: `var(--${scope}-date)` }}>
              {when}
            </p>
          )}
        </div>
      </div>

      {/* Clamped: reviews run from three words to three paragraphs, and the
          grid stretches every card to the tallest one. Without this a single
          long review turns the band into a wall of text. */}
      <p className="line-clamp-4 text-sm leading-relaxed" style={{ color: `var(--${scope}-text)` }}>
        {review.comment}
      </p>
    </li>
  );
}

export default async function ReviewsSection({ section }) {
  const { content, appearance, id } = section;
  const { reviews } = await getHomeReviews();
  const shown = reviews.slice(0, SHOWN);

  // No reviews, or none we could reach: the band goes rather than standing
  // empty under a headline promising reviews.
  if (shown.length === 0) return null;

  const scope = `rv-${id}`;
  const vars = (scheme) => `
    --${scope}-bg:${asColor(scheme.background)};
    --${scope}-heading:${asColor(scheme.headingColor, "#ffffff")};
    --${scope}-body:${asColor(scheme.bodyColor, "#ffffff")};
    --${scope}-card:${asColor(scheme.cardBg, "#ffffff")};
    --${scope}-avatar:${asColor(scheme.avatarBg, "#dfa013")};
    --${scope}-name:${asColor(scheme.nameColor, "#17181a")};
    --${scope}-star:${asColor(scheme.starColor, "#ffce38")};
    --${scope}-date:${asColor(scheme.dateColor, "#52525b")};
    --${scope}-text:${asColor(scheme.reviewTextColor, "#3d4045")};`;

  const css = `
    .${scope}{${vars(appearance?.light ?? {})}}
    @media (prefers-color-scheme: dark){.${scope}:not(.light *){${vars(appearance?.dark ?? {})}}}
    .${scope}:is(.dark *){${vars(appearance?.dark ?? {})}}
    .${scope}:is(.light *){${vars(appearance?.light ?? {})}}`;

  return (
    <section className={`${scope} py-12 sm:py-16`} style={{ background: `var(--${scope}-bg)` }}>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="text-center">
          <h2
            className="text-2xl font-bold leading-tight sm:text-4xl"
            style={{ color: `var(--${scope}-heading)` }}
          >
            {content.heading}
          </h2>
          {content.subheading && (
            <p
              className="mx-auto mt-3 max-w-3xl whitespace-pre-line text-sm leading-relaxed sm:text-base"
              style={{ color: `var(--${scope}-body)` }}
            >
              {content.subheading}
            </p>
          )}
        </div>

        <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((review) => (
            <ReviewCard key={review.id} review={review} scope={scope} />
          ))}
        </ul>
      </div>
    </section>
  );
}
