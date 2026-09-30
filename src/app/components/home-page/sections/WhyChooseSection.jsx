import Image from "next/image";
import Link from "next/link";
import { classifyHref, THEME_COLOR } from "@/app/lib/home-page/sections";

/**
 * The "why choose us" section: two overlapping pictures beside the pitch, the
 * reasons, and one call to action.
 *
 * Server component, like the rest; see HeroSection for the per-scheme colour
 * mechanism.
 *
 * The second picture overlaps the first at the corner. It is decorative in the
 * layout sense — clearing it leaves the main one square and alone rather than
 * leaving a hole — and it carries a ring in the section's own background colour
 * so the two read as separate cards against any backdrop.
 *
 * The button follows the rule the rest of this page follows: a blank or
 * unusable link renders nothing at all rather than a button that goes nowhere.
 */

const asColor = (value, fallback = "var(--theme-primary-600)") =>
  !value || value === THEME_COLOR ? fallback : value;

export default function WhyChooseSection({ section, index = 0 }) {
  const { content, appearance, id } = section;
  const items = Array.isArray(content.items) ? content.items.filter((i) => i?.title) : [];
  const link = classifyHref(content.buttonHref);
  const showButton = Boolean(content.buttonLabel) && link.kind !== "none";

  const scope = `wc-${id}`;
  const vars = (scheme) => `
    --${scope}-bg:${asColor(scheme.background, "#ffffff")};
    --${scope}-eyebrow:${asColor(scheme.eyebrowColor, "#e0a31a")};
    --${scope}-heading:${asColor(scheme.headingColor)};
    --${scope}-body:${asColor(scheme.bodyColor, "#1a1a1a")};
    --${scope}-item-title:${asColor(scheme.itemTitleColor, "#e0a31a")};
    --${scope}-item-text:${asColor(scheme.itemTextColor, "#1a1a1a")};
    --${scope}-button-bg:${asColor(scheme.buttonBg)};
    --${scope}-button-text:${asColor(scheme.buttonText, "#ffffff")};`;

  const css = `
    .${scope}{${vars(appearance?.light ?? {})}}
    @media (prefers-color-scheme: dark){.${scope}:not(.light *){${vars(appearance?.dark ?? {})}}}
    .${scope}:is(.dark *){${vars(appearance?.dark ?? {})}}
    .${scope}:is(.light *){${vars(appearance?.light ?? {})}}`;

  const buttonClass =
    "inline-flex items-center justify-center rounded-full px-8 py-3.5 text-[15px] font-semibold " +
    "transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2";
  const buttonStyle = {
    background: `var(--${scope}-button-bg)`,
    color: `var(--${scope}-button-text)`,
  };

  return (
    <section className={`${scope} py-12 sm:py-16`} style={{ background: `var(--${scope}-bg)` }}>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-4 sm:px-6 md:grid-cols-2 md:gap-12">
        {/* The pictures. Bottom padding on the frame makes room for the second
            one to hang past the first without the row growing around it. */}
        <div className={content.secondaryImage ? "relative pb-16 sm:pb-20" : "relative"}>
          <div className="relative aspect-1 overflow-hidden rounded-3xl">
            <Image
              src={content.image}
              alt={content.imageAlt || ""}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              priority={index === 0}
              className="object-cover"
            />
          </div>

          {content.secondaryImage && (
            <div
              className="absolute bottom-0 right-0 aspect-1 w-[45%] overflow-hidden rounded-3xl ring-8 md:-right-6"
              style={{ "--tw-ring-color": `var(--${scope}-bg)` }}
            >
              <Image
                src={content.secondaryImage}
                alt={content.secondaryImageAlt || ""}
                fill
                sizes="(min-width: 768px) 22vw, 45vw"
                className="object-cover"
              />
            </div>
          )}
        </div>

        <div>
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
            <p
              className="mt-4 max-w-xl whitespace-pre-line text-sm leading-relaxed sm:text-lg"
              style={{ color: `var(--${scope}-body)` }}
            >
              {content.subheading}
            </p>
          )}

          {items.length > 0 && (
            <dl className="mt-7 flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id || item.title}>
                  <dt className="text-base font-bold sm:text-lg" style={{ color: `var(--${scope}-item-title)` }}>
                    {item.title}
                  </dt>
                  {item.description && (
                    <dd
                      className="mt-0.5 max-w-xl text-sm leading-relaxed"
                      style={{ color: `var(--${scope}-item-text)` }}
                    >
                      {item.description}
                    </dd>
                  )}
                </div>
              ))}
            </dl>
          )}

          {showButton &&
            (link.kind === "internal" ? (
              <Link href={link.href} className={`mt-8 ${buttonClass}`} style={buttonStyle}>
                {content.buttonLabel}
              </Link>
            ) : (
              <a
                href={link.href}
                className={`mt-8 ${buttonClass}`}
                style={buttonStyle}
                {...(link.kind === "external" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {content.buttonLabel}
              </a>
            ))}
        </div>
      </div>
    </section>
  );
}
