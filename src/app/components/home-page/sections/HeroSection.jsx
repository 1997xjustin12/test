import Image from "next/image";
import Link from "next/link";
import { classifyHref, THEME_COLOR } from "@/app/lib/home-page/sections";

/**
 * The configured hero.
 *
 * A server component on purpose. The homepage is prerendered and its first
 * paint was taken from 2.07s to 1.22s largely by keeping it that way — an
 * editable page must not become a page the browser assembles. Nothing here
 * needs state, so nothing here is a client component.
 *
 * Colours come from the saved config and can differ between light and dark,
 * while the copy does not. Tailwind cannot express a colour chosen at runtime,
 * so each instance emits its own CSS variables: the light values on the
 * section, the dark values behind a prefers-color-scheme block, matching the
 * dark-mode strategy in tailwind.config.ts (OS preference, overridable by a
 * .light/.dark class on a parent).
 *
 * `theme` as a value means "follow the brand accent", which is already exposed
 * as --theme-primary-600 by (market)/layout.jsx.
 */

const asColor = (value, fallback = "var(--theme-primary-600)") =>
  !value || value === THEME_COLOR ? fallback : value;

/** A button that routes internally, or leaves the app, or dials a number. */
function HeroButton({ label, href, bg, text, id }) {
  if (!label) return null;
  const link = classifyHref(href);
  if (link.kind === "none") return null;

  const className =
    "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[15px] font-semibold " +
    "transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2";
  const style = { background: `var(--${id}-bg)`, color: `var(--${id}-text)` };

  // next/link prefetches internal routes; tel: and external addresses must not
  // go through the router.
  return link.kind === "internal" ? (
    <Link href={link.href} className={className} style={style}>
      {label}
    </Link>
  ) : (
    <a
      href={link.href}
      className={className}
      style={style}
      {...(link.kind === "external" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
    </a>
  );
}

export default function HeroSection({ section, index = 0 }) {
  const { content, appearance, id } = section;
  const light = appearance?.light ?? {};
  const dark = appearance?.dark ?? {};

  // Scoped to this instance, so two heroes on one page cannot collide.
  const scope = `hs-${id}`;
  const vars = (scheme) => `
    --${scope}-bg:${asColor(scheme.background)};
    --${scope}-primary-bg:${asColor(scheme.primaryBg)};
    --${scope}-primary-text:${asColor(scheme.primaryText, "#ffffff")};
    --${scope}-secondary-bg:${asColor(scheme.secondaryBg, "#17181a")};
    --${scope}-secondary-text:${asColor(scheme.secondaryText, "#ffffff")};`;

  const css = `
    .${scope}{${vars(light)}}
    @media (prefers-color-scheme: dark){.${scope}:not(.light *){${vars(dark)}}}
    .${scope}:is(.dark *){${vars(dark)}}
    .${scope}:is(.light *){${vars(light)}}`;

  return (
    <section className={`${scope} relative overflow-hidden`} style={{ background: `var(--${scope}-bg)` }}>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="relative min-h-[420px] sm:min-h-[520px] lg:min-h-[560px]">
        {content.image && (
          <Image
            src={content.image}
            alt={content.imageAlt || ""}
            fill
            // The first section on the page is the largest contentful paint:
            // it loads eagerly and is preloaded. Any section below it is not.
            priority={index === 0}
            sizes="100vw"
            quality={75}
            className="object-cover object-right"
          />
        )}

        {/* Keeps the copy legible over the photograph without hiding it. */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent dark:from-black/85 dark:via-black/65" />

        <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 h-full flex items-center">
          <div className="max-w-[560px] py-14 sm:py-20">
            <h1 className="font-serif text-[2.1rem] leading-[1.12] sm:text-5xl lg:text-[3.4rem] text-charcoal dark:text-white">
              {content.heading}
            </h1>

            {content.subheading && (
              <p className="mt-5 text-base sm:text-lg leading-relaxed text-stone-600 dark:text-stone-300">
                {content.subheading}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <HeroButton
                label={content.primaryLabel}
                href={content.primaryHref}
                id={`${scope}-primary`}
              />
              <HeroButton
                label={content.secondaryLabel}
                href={content.secondaryHref}
                id={`${scope}-secondary`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
