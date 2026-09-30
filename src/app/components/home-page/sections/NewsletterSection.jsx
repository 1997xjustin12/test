import { THEME_COLOR } from "@/app/lib/home-page/sections";
import NewsletterForm from "./NewsletterForm";

/**
 * The newsletter band: a headline, a line of copy, and the sign-up.
 *
 * A server component, with only the form shipped to the browser — see
 * NewsletterForm. It posts to the same endpoint the existing newsletter uses,
 * /api/subscribers/subscribe, through the same lib/api helper.
 *
 * Colours are per scheme; see HeroSection for the mechanism. They are handed to
 * the form as variables rather than props, so the two cannot drift.
 */

const asColor = (value, fallback = "var(--theme-primary-600)") =>
  !value || value === THEME_COLOR ? fallback : value;

export default function NewsletterSection({ section }) {
  const { content, appearance, id } = section;

  const scope = `nl-${id}`;
  const vars = (scheme) => `
    --${scope}-bg:${asColor(scheme.background, "#ffffff")};
    --${scope}-heading:${asColor(scheme.headingColor, "#dfa013")};
    --${scope}-body:${asColor(scheme.bodyColor, "#1a1a1a")};
    --${scope}-input-bg:${asColor(scheme.inputBg, "#d9d9d9")};
    --${scope}-input-text:${asColor(scheme.inputText, "#17181a")};
    --${scope}-button-bg:${asColor(scheme.buttonBg)};
    --${scope}-button-text:${asColor(scheme.buttonText, "#ffffff")};`;

  const css = `
    .${scope}{${vars(appearance?.light ?? {})}}
    @media (prefers-color-scheme: dark){.${scope}:not(.light *){${vars(appearance?.dark ?? {})}}}
    .${scope}:is(.dark *){${vars(appearance?.dark ?? {})}}
    .${scope}:is(.light *){${vars(appearance?.light ?? {})}}`;

  return (
    <section className={`${scope} py-12 sm:py-14`} style={{ background: `var(--${scope}-bg)` }}>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="mx-auto max-w-[1240px] px-4 text-center sm:px-6">
        <h2
          className="text-2xl font-bold leading-tight sm:text-3xl"
          style={{ color: `var(--${scope}-heading)` }}
        >
          {content.heading}
        </h2>
        {content.subheading && (
          <p
            className="mx-auto mt-3 max-w-2xl whitespace-pre-line text-sm leading-relaxed sm:text-lg"
            style={{ color: `var(--${scope}-body)` }}
          >
            {content.subheading}
          </p>
        )}

        <NewsletterForm
          scope={scope}
          placeholder={content.placeholder}
          label={content.buttonLabel}
          successMessage={content.successMessage}
        />
      </div>
    </section>
  );
}
