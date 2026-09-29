import Image from "next/image";
import Link from "next/link";
import { classifyHref, THEME_COLOR } from "@/app/lib/home-page/sections";

/**
 * The offers band: a centred pitch, a call to action, a row of images, and a
 * second button under them.
 *
 * Server component, like the other sections — see HeroSection for why, and for
 * how the per-scheme colours are emitted as CSS variables.
 *
 * With three images the middle one is shown wider, which is what the design
 * does; with one or two they share the row evenly, so removing an image does
 * not leave a hole.
 */

const asColor = (value, fallback = "var(--theme-primary-600)") =>
  !value || value === THEME_COLOR ? fallback : value;

function Button({ label, href, scope, variant }) {
  if (!label) return null;
  const link = classifyHref(href);
  if (link.kind === "none") return null;

  const className =
    "inline-flex items-center justify-center rounded-full px-8 py-3.5 text-[15px] font-semibold " +
    "transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2";
  const style = {
    background: `var(--${scope}-${variant}-bg)`,
    color: `var(--${scope}-${variant}-text)`,
  };

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

export default function OffersSection({ section, index = 0 }) {
  const { content, appearance, id } = section;
  const images = (Array.isArray(content.images) ? content.images : []).filter((i) => i?.src);

  const scope = `of-${id}`;
  const vars = (scheme) => `
    --${scope}-bg:${asColor(scheme.background, "#ffffff")};
    --${scope}-eyebrow:${asColor(scheme.eyebrowColor)};
    --${scope}-heading:${asColor(scheme.headingColor)};
    --${scope}-body:${asColor(scheme.bodyColor, "#3d4045")};
    --${scope}-primary-bg:${asColor(scheme.primaryBg)};
    --${scope}-primary-text:${asColor(scheme.primaryText, "#ffffff")};
    --${scope}-secondary-bg:${asColor(scheme.secondaryBg, "#17181a")};
    --${scope}-secondary-text:${asColor(scheme.secondaryText, "#ffffff")};`;

  const css = `
    .${scope}{${vars(appearance?.light ?? {})}}
    @media (prefers-color-scheme: dark){.${scope}:not(.light *){${vars(appearance?.dark ?? {})}}}
    .${scope}:is(.dark *){${vars(appearance?.dark ?? {})}}
    .${scope}:is(.light *){${vars(appearance?.light ?? {})}}`;

  // Three images: the middle one carries the design's emphasis. Any other
  // number shares the row evenly.
  const gridClass =
    images.length === 3
      ? "grid gap-4 sm:grid-cols-[1fr_1.55fr_1fr]"
      : `grid gap-4 ${images.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1"}`;

  return (
    <section className={scope} style={{ background: `var(--${scope}-bg)` }}>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[760px] text-center">
          {content.eyebrow && (
            <p className="text-sm font-medium sm:text-base" style={{ color: `var(--${scope}-eyebrow)` }}>
              {content.eyebrow}
            </p>
          )}

          <h2
            className="mt-2 font-serif text-[1.9rem] leading-[1.18] sm:text-[2.6rem]"
            style={{ color: `var(--${scope}-heading)` }}
          >
            {content.heading}
          </h2>

          {content.subheading && (
            <p className="mt-4 text-base leading-relaxed sm:text-lg" style={{ color: `var(--${scope}-body)` }}>
              {content.subheading}
            </p>
          )}

          {content.primaryLabel && (
            <div className="mt-7">
              <Button label={content.primaryLabel} href={content.primaryHref} scope={scope} variant="primary" />
            </div>
          )}
        </div>

        {images.length > 0 && (
          <div className={`mt-10 ${gridClass}`}>
            {images.map((image, i) => (
              // A fixed height rather than an aspect ratio: the row is meant to
              // read as one band, and a ratio would make the wider middle image
              // taller than the two beside it.
              <div
                key={image.id || image.src}
                className="relative h-[220px] overflow-hidden rounded-2xl sm:h-[300px]"
              >
                <Image
                  src={image.src}
                  alt={image.alt || ""}
                  fill
                  // Only the very first section on the page is the LCP; this one
                  // is normally below it, so these load as they are approached.
                  priority={index === 0 && i === 0}
                  sizes="(max-width: 640px) 100vw, 33vw"
                  quality={75}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {content.secondaryLabel && (
          <div className="mt-9 text-center">
            <Button label={content.secondaryLabel} href={content.secondaryHref} scope={scope} variant="secondary" />
          </div>
        )}
      </div>
    </section>
  );
}
