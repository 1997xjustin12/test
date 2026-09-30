import { THEME_COLOR } from "@/app/lib/home-page/sections";
import { buildFaqPage, serializeJsonLd } from "@/app/lib/structured-data";

/**
 * Questions and answers, all shown at once.
 *
 * No accordion, because the design has none and because collapsing them would
 * mean shipping JavaScript to hide text that is already in the page — and
 * answers a visitor has to click to see are answers a crawler reads as hidden.
 *
 * The same questions go out as FAQPage structured data, using the builder the
 * product pages already use. That is the point of putting them in a section
 * with a schema rather than as free text: an assistant answering "does Solana
 * price match?" can read the answer rather than infer it.
 *
 * Server component, like the rest; see HeroSection for the colour mechanism.
 */

const asColor = (value, fallback = "var(--theme-primary-600)") =>
  !value || value === THEME_COLOR ? fallback : value;

export default function FaqSection({ section }) {
  const { content, appearance, id } = section;
  const items = Array.isArray(content.items)
    ? content.items.filter((item) => item?.question && item?.answer)
    : [];
  if (items.length === 0) return null;

  const scope = `fq-${id}`;
  const vars = (scheme) => `
    --${scope}-bg:${asColor(scheme.background, "#ffffff")};
    --${scope}-heading:${asColor(scheme.headingColor)};
    --${scope}-question:${asColor(scheme.questionColor, "#dfa013")};
    --${scope}-answer:${asColor(scheme.answerColor, "#1a1a1a")};`;

  const css = `
    .${scope}{${vars(appearance?.light ?? {})}}
    @media (prefers-color-scheme: dark){.${scope}:not(.light *){${vars(appearance?.dark ?? {})}}}
    .${scope}:is(.dark *){${vars(appearance?.dark ?? {})}}
    .${scope}:is(.light *){${vars(appearance?.light ?? {})}}`;

  const jsonLd = serializeJsonLd(
    buildFaqPage(items.map((item) => ({ q: item.question, a: item.answer }))),
  );

  return (
    <section className={`${scope} py-12 sm:py-16`} style={{ background: `var(--${scope}-bg)` }}>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {jsonLd && (
        // eslint-disable-next-line react/no-danger
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      )}

      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2
          className="text-2xl font-bold leading-tight sm:text-3xl"
          style={{ color: `var(--${scope}-heading)` }}
        >
          {content.heading}
        </h2>

        <dl className="mt-8 flex flex-col gap-6 sm:mt-10 sm:gap-7">
          {items.map((item) => (
            <div key={item.id || item.question}>
              <dt
                className="text-base font-bold leading-snug sm:text-lg"
                style={{ color: `var(--${scope}-question)` }}
              >
                {item.question}
              </dt>
              <dd
                className="mt-1.5 text-sm leading-relaxed"
                style={{ color: `var(--${scope}-answer)` }}
              >
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
