import { iconComponent } from "../icons";
import { THEME_COLOR } from "@/app/lib/home-page/sections";

/**
 * The value-proposition band: short promises with icons, scrolling endlessly.
 *
 * The loop is pure CSS. The list is rendered twice and the pair slides left by
 * half its width, so the second copy arrives exactly where the first began and
 * the seam never shows. That keeps this a server component with real SVG in the
 * HTML — a JavaScript carousel here would mean shipping and running code to
 * move four words sideways.
 *
 * The duplicate is aria-hidden: a screen reader should hear the promises once.
 * With prefers-reduced-motion the animation stops and the row simply centres —
 * a permanently moving strip is the classic vestibular trigger.
 *
 * Colours are per scheme; see HeroSection for the mechanism.
 */

const asColor = (value, fallback = "var(--theme-primary-600)") =>
  !value || value === THEME_COLOR ? fallback : value;

function Item({ item, scope }) {
  const Icon = iconComponent(item.icon);
  return (
    <li className="flex shrink-0 items-center gap-3 px-8">
      <Icon
        aria-hidden="true"
        strokeWidth={2}
        className="h-7 w-7 shrink-0 sm:h-8 sm:w-8"
        style={{ color: `var(--${scope}-icon)` }}
      />
      <span className="whitespace-nowrap text-[13px] font-bold uppercase tracking-wide sm:text-sm">
        {item.label}
      </span>
    </li>
  );
}

export default function ValuePropsSection({ section }) {
  const { content, appearance, id } = section;
  const items = Array.isArray(content.items) ? content.items.filter((i) => i?.label) : [];
  if (items.length === 0) return null;

  const scope = `vp-${id}`;
  const vars = (scheme) => `
    --${scope}-bg:${asColor(scheme.background, "#1a1a1a")};
    --${scope}-icon:${asColor(scheme.iconColor)};
    --${scope}-text:${asColor(scheme.textColor)};`;

  // Long enough to read comfortably, and proportional to how much there is to
  // read, so adding an item does not make the strip race.
  const duration = Math.max(18, items.length * 6);

  const css = `
    .${scope}{${vars(appearance?.light ?? {})}}
    @media (prefers-color-scheme: dark){.${scope}:not(.light *){${vars(appearance?.dark ?? {})}}}
    .${scope}:is(.dark *){${vars(appearance?.dark ?? {})}}
    .${scope}:is(.light *){${vars(appearance?.light ?? {})}}
    .${scope}-track{display:flex;width:max-content;animation:${scope}-scroll ${duration}s linear infinite}
    .${scope}:hover .${scope}-track{animation-play-state:paused}
    @keyframes ${scope}-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @media (prefers-reduced-motion: reduce){
      .${scope}-track{animation:none;width:100%;justify-content:space-around;flex-wrap:wrap}
      .${scope}-copy{display:none}
    }`;

  return (
    <section className={`${scope} overflow-hidden`} style={{ background: `var(--${scope}-bg)` }}>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className={`${scope}-track py-6 sm:py-7`} style={{ color: `var(--${scope}-text)` }}>
        <ul className="flex items-center">
          {items.map((item) => (
            <Item key={item.id || item.label} item={item} scope={scope} />
          ))}
        </ul>
        {/* The second copy is what makes the loop seamless; it is decorative. */}
        <ul className={`${scope}-copy flex items-center`} aria-hidden="true">
          {items.map((item) => (
            <Item key={`copy-${item.id || item.label}`} item={item} scope={scope} />
          ))}
        </ul>
      </div>
    </section>
  );
}
