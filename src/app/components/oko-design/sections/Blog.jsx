"use client";

import Image from "next/image";
// Namespace import, not a named one, and with a fallback.
//
// BBQ production died with `ReferenceError: BBQ_BLOG_POSTS is not defined`
// while the identical build ran fine locally. Both BLOG_POSTS and
// BBQ_BLOG_POSTS live in new-homepage.js; the one Solana uses survived and
// this one did not, which is the signature of the bundler tree-shaking the
// export away while leaving a reference to it behind. A named import then
// resolves to a binding that was never initialised - hence "not defined"
// rather than "undefined", and hence a guard like BBQ_BLOG_POSTS?.[0]
// cannot help: the ReferenceError fires on access, before optional chaining.
//
// A namespace import cannot become a dangling binding, and ?? [] means the
// worst case is an empty blog strip instead of a white screen on the whole
// homepage.
import * as HomeData from "@/app/data/new-homepage";
import { BASE_URL } from "@/app/lib/helpers";
import Link from "next/link";

const POSTS = HomeData.BBQ_BLOG_POSTS ?? [];

// OKO article card (rule 6 / 8.10): white/night-2, stone-line border, cream-dim
// image well with bottom border, no shadow, hover = image opacity/scale only.
function BlogCard({ tag, title, readTime, date, img, url }) {
  return (
    <Link href={url} className="group flex flex-col bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] overflow-hidden">
      <div className="relative h-48 overflow-hidden bg-oko-cream-dim dark:bg-oko-night-3 border-b border-oko-stone-line dark:border-oko-line-dark">
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-[opacity,transform] duration-300 group-hover:opacity-90 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-2 p-5">
        <p className="font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light">
          {tag}
        </p>
        <h3 className="font-oko-display font-semibold text-[19px] leading-[1.3] text-oko-char dark:text-oko-cream line-clamp-2">
          {title}
        </h3>
        <div className="flex gap-2 font-inter text-[11.5px] text-oko-stone">
          <span>{readTime}</span>
          <span aria-hidden="true">·</span>
          <span>{date}</span>
        </div>
      </div>
    </Link>
  );
}

export default function Blog() {
  return (
    <section id="blog" className="py-16 bg-oko-cream dark:bg-oko-night">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8">
        {/* Section header (8.7) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="block font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light mb-2">
              Learning center
            </span>
            <h2 className="font-oko-display font-semibold text-[27px] leading-[1.2] text-oko-char dark:text-oko-cream">
              Guides, tips & inspiration
            </h2>
          </div>
          <Link
            href={`${BASE_URL}/blogs`}
            className="inline-flex items-center gap-1 self-start sm:self-auto flex-shrink-0 font-inter text-[13px] font-semibold text-oko-sage dark:text-oko-sage-light border-b border-transparent hover:border-oko-sage dark:hover:border-oko-sage-light hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
          >
            All articles →
          </Link>
        </div>

        {/* Mobile: first post only as compact horizontal card */}
        {POSTS[0] && (
          <Link href={POSTS[0].url} className="group sm:hidden flex gap-4 bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] overflow-hidden">
            <div className="relative w-28 flex-shrink-0 bg-oko-cream-dim dark:bg-oko-night-3 border-r border-oko-stone-line dark:border-oko-line-dark overflow-hidden">
              <Image src={POSTS[0].img} alt={POSTS[0].title} fill sizes="112px" className="object-cover transition-[opacity,transform] duration-300 group-hover:opacity-90 group-hover:scale-[1.03]" loading="lazy" />
            </div>
            <div className="p-4 min-w-0">
              <p className="font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light mb-1">{POSTS[0].tag}</p>
              <h3 className="font-oko-display font-semibold text-[15.5px] leading-[1.3] text-oko-char dark:text-oko-cream line-clamp-3">{POSTS[0].title}</h3>
              <p className="font-inter text-[11.5px] text-oko-stone mt-2">{POSTS[0].readTime}</p>
            </div>
          </Link>
        )}

        {/* Tablet+: full grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-[22px]">
          {POSTS.map((p, index) => (
            <BlogCard key={`home-blogs-${index}`} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
