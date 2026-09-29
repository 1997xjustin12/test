import { iconComponent } from "../icons";
import { THEME_COLOR } from "@/app/lib/home-page/sections";

/**
 * The value-proposition band: a row of short promises, each with an icon.
 *
 * A server component, like the rest of these sections — the icons are real SVG
 * in the HTML rather than something the browser fetches and draws afterwards.
 *
 * Colours are per scheme and come from the saved config, so they emit as CSS
 * variables; see HeroSection for why that is the mechanism rather than Tailwind
 * classes, and how the dark block matches the app's dark-mode strategy.
 */

const asColor = (value, fallback = "var(--theme-primary-600)") =>
  !value || value === THEME_COLOR ? fallback : value;

export default function ValuePropsSection({ section }) {
  const { content, appearance, id } = section;
  const items = Array.isArray(content.items) ? content.items.filter((i) => i?.label) : [];
  if (items.length === 0) return null;

  const scope = `vp-${id}`;
  const vars = (scheme) => `
    --${scope}-bg:${asColor(scheme.background, "#1a1a1a")};
    --${scope}-icon:${asColor(scheme.iconColor)};
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

      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <ul
          className="grid grid-cols-2 gap-y-6 py-6 sm:py-7 md:grid-cols-4"
          style={{ color: `var(--${scope}-text)` }}
        >
          {items.map((item) => {
            const Icon = iconComponent(item.icon);
            return (
              <li key={item.id || item.label} className="flex items-center justify-center gap-3 px-2">
                <Icon
                  aria-hidden="true"
                  strokeWidth={2}
                  className="h-7 w-7 shrink-0 sm:h-8 sm:w-8"
                  style={{ color: `var(--${scope}-icon)` }}
                />
                <span className="text-[13px] font-bold uppercase tracking-wide sm:text-sm">
                  {item.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
