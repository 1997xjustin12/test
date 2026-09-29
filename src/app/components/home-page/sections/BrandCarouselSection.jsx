import Image from "next/image";
import Link from "next/link";
import { THEME_COLOR } from "@/app/lib/home-page/sections";
import { getCarouselBrands } from "@/app/lib/home-page/brands";

/**
 * The brand logos, scrolling endlessly.
 *
 * The loop is the one from ValuePropsSection: the row is rendered twice and the
 * pair slides left by half its width, so the second copy arrives exactly where
 * the first began and the seam never shows. Pure CSS, so this stays a server
 * component — see HeroSection for why that matters on this page. The duplicate
 * is aria-hidden, and prefers-reduced-motion stops it and wraps the logos into
 * rows instead.
 *
 * The brands are not configured here. They are the Brands menu, filtered and
 * mapped in lib/home-page/brands.js, which is the same source /brands reads —
 * a strip that had its own list would be a second list to keep in step, and it
 * would start advertising brands whose pages had been hidden.
 *
 * Every logo sits on a tile of a fixed size rather than at its natural width.
 * The files run from 1:1 to 4.2:1, and a strip that sized each logo to itself
 * has no rhythm at all: WPPO's square would take the space Eloquence's wordmark
 * needs. object-contain keeps each one whole inside its tile.
 */

const asColor = (value, fallback = "var(--theme-primary-600)") =>
  !value || value === THEME_COLOR ? fallback : value;

/** Seconds a single logo takes to cross the strip — about 55px/s. */
const SECONDS_PER_LOGO = 3.5;

function Logo({ brand, scope, eager }) {
  return (
    <li className="shrink-0 px-3">
      <Link
        href={brand.href}
        className="flex h-20 w-44 items-center justify-center rounded-xl p-2.5 transition-transform duration-200 hover:-translate-y-0.5"
        style={{ background: `var(--${scope}-tile)` }}
      >
        <Image
          src={brand.logo}
          alt={brand.name}
          width={200}
          height={90}
          // The tile is 176x80; a square logo is then 60px tall against a wide
          // one's 156px, which is as even as mixed wordmarks get. 352w at 2x.
          sizes="176px"
          loading={eager ? "eager" : "lazy"}
          className="h-full w-full object-contain"
        />
      </Link>
    </li>
  );
}

export default async function BrandCarouselSection({ section, index = 0 }) {
  const { content, appearance, id } = section;
  const brands = await getCarouselBrands();

  // Nothing to scroll: a menu with no brands, or a cold instance during a Redis
  // outage. An empty band is worse than no band.
  if (brands.length === 0) return null;

  const scope = `bc-${id}`;
  const vars = (scheme) => `
    --${scope}-bg:${asColor(scheme.background, "#ffffff")};
    --${scope}-heading:${asColor(scheme.headingColor)};
    --${scope}-tile:${asColor(scheme.tileBg, "#ffffff")};`;

  // Proportional to the number of logos, so each one drifts past at the same
  // speed whether the menu holds twelve brands or forty.
  const duration = Math.max(20, Math.round(brands.length * SECONDS_PER_LOGO));

  const css = `
    .${scope}{${vars(appearance?.light ?? {})}}
    @media (prefers-color-scheme: dark){.${scope}:not(.light *){${vars(appearance?.dark ?? {})}}}
    .${scope}:is(.dark *){${vars(appearance?.dark ?? {})}}
    .${scope}:is(.light *){${vars(appearance?.light ?? {})}}
    .${scope}-track{display:flex;width:max-content;animation:${scope}-scroll ${duration}s linear infinite}
    .${scope}:hover .${scope}-track{animation-play-state:paused}
    @keyframes ${scope}-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    @media (prefers-reduced-motion: reduce){
      .${scope}-track{animation:none;width:100%;flex-wrap:wrap;justify-content:center}
      .${scope}-copy{display:none}
    }`;

  // Both halves must measure the same, or translateX(-50%) lands off the seam.
  const row = (copy) => (
    <ul
      className={`flex items-center${copy ? ` ${scope}-copy` : ""}`}
      aria-hidden={copy ? "true" : undefined}
    >
      {brands.map((brand, i) => (
        <Logo
          key={`${copy ? "copy-" : ""}${brand.href}`}
          brand={brand}
          scope={scope}
          // Only the logos already on screen when the page lands, and only if
          // this section is the one above the fold. The rest load as the strip
          // brings them round.
          eager={!copy && index === 0 && i < 6}
        />
      ))}
    </ul>
  );

  return (
    <section className={`${scope} overflow-hidden py-10 sm:py-12`} style={{ background: `var(--${scope}-bg)` }}>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {content.heading && (
        <h2
          className="mb-6 px-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] sm:mb-7 sm:text-xs"
          style={{ color: `var(--${scope}-heading)` }}
        >
          {content.heading}
        </h2>
      )}

      <div className={`${scope}-track`}>
        {row(false)}
        {/* The second copy is what makes the loop seamless; it is decorative. */}
        {row(true)}
      </div>
    </section>
  );
}
