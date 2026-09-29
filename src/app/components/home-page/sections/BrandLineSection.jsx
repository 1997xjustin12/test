import { THEME_COLOR } from "@/app/lib/home-page/sections";

/**
 * A single centred line on its own band — the sort of thing that sits between
 * two heavier sections and says one fact.
 *
 * Server component, like the rest; see HeroSection for the per-scheme colour
 * mechanism.
 */

const asColor = (value, fallback = "var(--theme-primary-600)") =>
  !value || value === THEME_COLOR ? fallback : value;

export default function BrandLineSection({ section }) {
  const { content, appearance, id } = section;
  if (!content.text) return null;

  const scope = `bl-${id}`;
  const vars = (scheme) => `
    --${scope}-bg:${asColor(scheme.background, "#1a1a1a")};
    --${scope}-text:${asColor(scheme.textColor)};`;

  const css = `
    .${scope}{${vars(appearance?.light ?? {})}}
    @media (prefers-color-scheme: dark){.${scope}:not(.light *){${vars(appearance?.dark ?? {})}}}
    .${scope}:is(.dark *){${vars(appearance?.dark ?? {})}}
    .${scope}:is(.light *){${vars(appearance?.light ?? {})}}`;

  return (
    <section className={scope} style={{ background: `var(--${scope}-bg)` }}>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <p
        className="mx-auto max-w-[1240px] px-4 py-4 text-center text-base font-bold sm:px-6 sm:py-5 sm:text-xl"
        style={{ color: `var(--${scope}-text)` }}
      >
        {content.text}
      </p>
    </section>
  );
}
