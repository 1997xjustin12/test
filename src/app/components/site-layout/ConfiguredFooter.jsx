import Image from "next/image";
import Link from "next/link";
import { classifyHref, THEME_COLOR } from "@/app/lib/home-page/sections";
import { STORE_NAME } from "@/app/lib/store_constants";
import { socialIcon, SOCIAL_LABELS } from "./social-icons";

/**
 * The configured footer.
 *
 * A server component, like the sections on the configured homepage, and for the
 * same reason: this is on every page in the site, so anything shipped here is
 * shipped everywhere.
 *
 * Links follow the rule the homepage follows — a blank or unusable address
 * renders nothing rather than a link that goes nowhere. Here that cascades: a
 * column whose links have all gone renders no column, and a heading with no
 * links under it is not a column, it is a word. The same goes for the social
 * row, where a link with no address would otherwise be an icon that does
 * nothing when pressed.
 */

const asColor = (value, fallback = "var(--theme-primary-600)") =>
  !value || value === THEME_COLOR ? fallback : value;

/** A link, or null if it has nowhere to go. */
function FooterLink({ link, className, style }) {
  if (!link?.label) return null;
  const target = classifyHref(link.url);
  if (target.kind === "none") return null;

  return target.kind === "internal" ? (
    <Link href={target.href} className={className} style={style}>
      {link.label}
    </Link>
  ) : (
    <a
      href={target.href}
      className={className}
      style={style}
      {...(target.kind === "external" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {link.label}
    </a>
  );
}

const usable = (link) => Boolean(link?.label) && classifyHref(link?.url).kind !== "none";

export default function ConfiguredFooter({ footer, logo }) {
  const content = footer?.content;
  if (!content) return null;

  const appearance = footer.appearance ?? {};
  const scope = "sf";
  const vars = (scheme) => `
    --${scope}-bg:${asColor(scheme.background, "#0c0a09")};
    --${scope}-heading:${asColor(scheme.headingColor)};
    --${scope}-link:${asColor(scheme.linkColor, "#ffffff")};
    --${scope}-text:${asColor(scheme.textColor, "#ffffff")};
    --${scope}-social:${asColor(scheme.socialColor, "#ffffff")};
    --${scope}-copyright:${asColor(scheme.copyrightColor, "#d4d4d8")};`;

  const css = `
    .${scope}{${vars(appearance.light ?? {})}}
    @media (prefers-color-scheme: dark){.${scope}:not(.light *){${vars(appearance.dark ?? {})}}}
    .${scope}:is(.dark *){${vars(appearance.dark ?? {})}}
    .${scope}:is(.light *){${vars(appearance.light ?? {})}}`;

  // A column with nothing left to point at is not shown at all.
  const columns = (content.columns ?? [])
    .map((group) => ({ ...group, links: (group.links ?? []).filter(usable) }))
    .filter((group) => group.links.length > 0);

  const socials = (content.socials ?? []).filter(
    (social) => classifyHref(social.url).kind !== "none",
  );

  const phoneLink = classifyHref(content.phone ? `tel:${content.phone}` : "");
  const mark = content.logo || logo;
  const copyright = (content.copyright || "")
    .replace(/\{year\}/g, String(new Date().getFullYear()))
    .replace(/\{store\}/g, STORE_NAME || "");

  return (
    <footer className={`${scope} pb-8 pt-14`} style={{ background: `var(--${scope}-bg)` }}>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          {/* The brand: mark, phone, address. */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left lg:items-center lg:text-center">
            <Link href="/" className="block">
              {mark ? (
                <span className="relative block h-[140px] w-[170px]">
                  <Image
                    src={mark}
                    alt={`${STORE_NAME} logo`}
                    fill
                    sizes="170px"
                    className="object-contain"
                  />
                </span>
              ) : (
                <span className="text-xl font-bold" style={{ color: `var(--${scope}-text)` }}>
                  {STORE_NAME}
                </span>
              )}
            </Link>

            {content.phone && (
              <a
                href={phoneLink.kind === "none" ? undefined : phoneLink.href}
                className="mt-3 text-base font-bold"
                style={{ color: `var(--${scope}-text)` }}
              >
                {content.phone}
              </a>
            )}
            {content.address && (
              <p
                className="mt-2 whitespace-pre-line text-sm leading-relaxed"
                style={{ color: `var(--${scope}-text)` }}
              >
                {content.address}
              </p>
            )}
          </div>

          {columns.map((group) => (
            <div key={group.id} className="text-center">
              {group.heading && (
                <h3 className="text-base font-bold" style={{ color: `var(--${scope}-heading)` }}>
                  {group.heading}
                </h3>
              )}
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.id}>
                    <FooterLink
                      link={link}
                      className="text-sm transition-opacity hover:opacity-70"
                      style={{ color: `var(--${scope}-link)` }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {socials.length > 0 && (
          <ul className="mt-12 flex items-center justify-center gap-5">
            {socials.map((social) => {
              const Icon = socialIcon(social.platform);
              const target = classifyHref(social.url);
              return (
                <li key={social.id}>
                  <a
                    href={target.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_LABELS[social.platform] ?? social.platform}
                    className="block transition-opacity hover:opacity-70"
                    style={{ color: `var(--${scope}-social)` }}
                  >
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        {copyright && (
          <p className="mt-8 text-center text-sm" style={{ color: `var(--${scope}-copyright)` }}>
            {copyright}
          </p>
        )}
      </div>
    </footer>
  );
}
