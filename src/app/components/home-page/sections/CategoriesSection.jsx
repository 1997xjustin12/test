import Image from "next/image";
import Link from "next/link";
import { classifyHref, THEME_COLOR } from "@/app/lib/home-page/sections";

/**
 * The category grid: a centred pitch above tiles that each carry an image, the
 * category name over it and a line of description beneath.
 *
 * Server component, like the rest; see HeroSection for the per-scheme colour
 * mechanism.
 *
 * A tile whose link goes nowhere is left off the page entirely — not rendered
 * as dead text. The whole tile is the link here, so a blank or unusable URL
 * leaves nothing to click: an image and a name that look like a way into the
 * catalogue and are not. Same rule as the buttons elsewhere on this page, and
 * it drops the item rather than the anchor because that is all the item is.
 */

const asColor = (value, fallback = "var(--theme-primary-600)") =>
  !value || value === THEME_COLOR ? fallback : value;

function Tile({ item, scope, eager }) {
  const link = classifyHref(item.href);
  if (link.kind === "none" || !item.image || !item.name) return null;

  const inner = (
    <>
      {/* aspect-[1/1], not aspect-square: the @tailwindcss/aspect-ratio plugin
          this project loads replaces the aspect theme scale with its own
          aspect-w and aspect-h one, so the named values compile to nothing at
          all and the tile collapses to no height. Arbitrary ratios still work. */}
      <div className="relative aspect-[1/1] overflow-hidden rounded-2xl">
        <Image
          src={item.image}
          alt=""
          fill
          sizes="(min-width: 768px) 25vw, 50vw"
          loading={eager ? "eager" : "lazy"}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        {/* Carries the name: these are photographs, and a light sky behind
            white capitals is the usual way a label like this goes unreadable. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <span
          className="absolute inset-x-3 bottom-5 text-center text-sm font-semibold uppercase leading-tight tracking-wide sm:text-base"
          style={{ color: `var(--${scope}-tile-name)` }}
        >
          {item.name}
        </span>
      </div>
      {item.description && (
        <p
          className="mt-3 px-1 text-center text-xs leading-relaxed sm:text-[13px]"
          style={{ color: `var(--${scope}-tile-text)` }}
        >
          {item.description}
        </p>
      )}
    </>
  );

  const className = "group block";

  return (
    <li>
      {link.kind === "internal" ? (
        <Link href={link.href} className={className}>
          {inner}
        </Link>
      ) : (
        <a
          href={link.href}
          className={className}
          {...(link.kind === "external" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {inner}
        </a>
      )}
    </li>
  );
}

export default function CategoriesSection({ section, index = 0 }) {
  const { content, appearance, id } = section;
  const items = Array.isArray(content.items) ? content.items : [];

  // Every tile dropped for a bad link leaves nothing to show; so does an empty
  // list. Either way the section goes rather than leaving a heading over a gap.
  const shown = items.filter(
    (item) => item?.image && item?.name && classifyHref(item.href).kind !== "none",
  );
  if (shown.length === 0) return null;

  const scope = `cs-${id}`;
  const vars = (scheme) => `
    --${scope}-bg:${asColor(scheme.background, "#d9d9d9")};
    --${scope}-eyebrow:${asColor(scheme.eyebrowColor)};
    --${scope}-heading:${asColor(scheme.headingColor)};
    --${scope}-body:${asColor(scheme.bodyColor, "#1a1a1a")};
    --${scope}-tile-name:${asColor(scheme.tileNameColor, "#ffffff")};
    --${scope}-tile-text:${asColor(scheme.tileTextColor, "#3d4045")};`;

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
          {content.eyebrow && (
            <p className="text-sm font-medium sm:text-base" style={{ color: `var(--${scope}-eyebrow)` }}>
              {content.eyebrow}
            </p>
          )}
          <h2
            className="mt-1 text-2xl font-bold leading-tight sm:text-4xl"
            style={{ color: `var(--${scope}-heading)` }}
          >
            {content.heading}
          </h2>
          {content.subheading && (
            // whitespace-pre-line: the supporting copy is written as two lines
            // and is meant to stay that way.
            <p
              className="mx-auto mt-4 max-w-3xl whitespace-pre-line text-sm leading-relaxed sm:text-lg"
              style={{ color: `var(--${scope}-body)` }}
            >
              {content.subheading}
            </p>
          )}
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-6 md:grid-cols-4">
          {shown.map((item, i) => (
            <Tile
              key={item.id || item.name}
              item={item}
              scope={scope}
              // Only the first row, and only if this section opens the page.
              eager={index === 0 && i < 4}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
