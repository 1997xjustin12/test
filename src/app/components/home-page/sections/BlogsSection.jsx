import Image from "next/image";
import Link from "next/link";
import { classifyHref, THEME_COLOR } from "@/app/lib/home-page/sections";
import { getSectionBlogs } from "@/app/lib/home-page/blog-posts";

/**
 * A row of posts from this brand's blog.
 *
 * Server component, like the rest; see HeroSection for the per-scheme colour
 * mechanism. The posts come from lib/blogs.js by way of
 * lib/home-page/blog-posts.js, which is what keeps them this brand's — the
 * existing homepage section renders a hardcoded array instead, so its three
 * cards are the same three on all three storefronts.
 *
 * Which posts appear is the operator's choice, and leaving it empty is a real
 * answer: the section then shows the latest and keeps itself current.
 */

const asColor = (value, fallback = "var(--theme-primary-600)") =>
  !value || value === THEME_COLOR ? fallback : value;

/** The design's row. Also the cap on how many can be chosen. */
const SHOWN = 3;

export default async function BlogsSection({ section, index = 0 }) {
  const { content, appearance, id } = section;
  const posts = await getSectionBlogs(content.posts, SHOWN, content.fallbackTag);

  // Nothing to show: an empty blog, chosen posts that have all been
  // unpublished, or a backend we could not reach. Better no section than a
  // headline about the blog over a gap.
  if (posts.length === 0) return null;

  const link = classifyHref(content.buttonHref);
  const showButton = Boolean(content.buttonLabel) && link.kind !== "none";

  const scope = `bg-${id}`;
  const vars = (scheme) => `
    --${scope}-bg:${asColor(scheme.background, "#d9d9d9")};
    --${scope}-heading:${asColor(scheme.headingColor)};
    --${scope}-body:${asColor(scheme.bodyColor, "#1a1a1a")};
    --${scope}-tag:${asColor(scheme.tagColor, "#dfa013")};
    --${scope}-title:${asColor(scheme.titleColor, "#17181a")};
    --${scope}-button-bg:${asColor(scheme.buttonBg)};
    --${scope}-button-text:${asColor(scheme.buttonText, "#ffffff")};`;

  const css = `
    .${scope}{${vars(appearance?.light ?? {})}}
    @media (prefers-color-scheme: dark){.${scope}:not(.light *){${vars(appearance?.dark ?? {})}}}
    .${scope}:is(.dark *){${vars(appearance?.dark ?? {})}}
    .${scope}:is(.light *){${vars(appearance?.light ?? {})}}`;

  const buttonClass =
    "inline-flex items-center justify-center rounded-full px-8 py-3 text-[15px] font-semibold " +
    "transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2";
  const buttonStyle = {
    background: `var(--${scope}-button-bg)`,
    color: `var(--${scope}-button-text)`,
  };

  return (
    <section className={`${scope} py-12 sm:py-16`} style={{ background: `var(--${scope}-bg)` }}>
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="text-center">
          <h2
            className="text-2xl font-bold leading-tight sm:text-3xl"
            style={{ color: `var(--${scope}-heading)` }}
          >
            {content.heading}
          </h2>
          {content.subheading && (
            <p
              className="mx-auto mt-3 max-w-3xl whitespace-pre-line text-sm leading-relaxed sm:text-base"
              style={{ color: `var(--${scope}-body)` }}
            >
              {content.subheading}
            </p>
          )}
        </div>

        <ul className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <li key={post.slug}>
              <Link href={`/blogs/${post.slug}`} className="group block">
                <div className="relative aspect-[16/11] overflow-hidden rounded-2xl">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    loading={index === 0 && i === 0 ? "eager" : "lazy"}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                {post.tag && (
                  <p className="mt-3 text-xs font-medium" style={{ color: `var(--${scope}-tag)` }}>
                    {post.tag}
                  </p>
                )}
                <h3
                  className="mt-1 text-sm font-bold leading-snug sm:text-[15px]"
                  style={{ color: `var(--${scope}-title)` }}
                >
                  {post.title}
                </h3>
              </Link>
            </li>
          ))}
        </ul>

        {showButton && (
          <div className="mt-9 text-center">
            {link.kind === "internal" ? (
              <Link href={link.href} className={buttonClass} style={buttonStyle}>
                {content.buttonLabel}
              </Link>
            ) : (
              <a
                href={link.href}
                className={buttonClass}
                style={buttonStyle}
                {...(link.kind === "external" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {content.buttonLabel}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
