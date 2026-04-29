"use client";

import Image from "next/image";
import { useReveal } from "@/app/hooks/useReveal";
import { BLOG_POSTS } from "@/app/data/new-homepage";
import Link from "next/link";

function BlogCard({ tag, title, readTime, date, img, url }) {
  const ref = useReveal();
  return (
    <Link href={url}>
      <article
        ref={ref}
        className="
        opacity-0 translate-y-6 transition-all duration-700
        rounded-2xl overflow-hidden bg-white dark:bg-stone-900
        border border-stone-100 dark:border-stone-800
        hover:shadow-[0_12px_48px_rgba(0,0,0,.15)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,.5)]
        hover:-translate-y-1 group
      "
      >
        <div className="relative h-48 overflow-hidden bg-stone-200 dark:bg-stone-800">
          <Image
            src={img}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="p-5">
          <p className="text-[10px] font-bold tracking-widest uppercase text-fire mb-2">
            {tag}
          </p>
          <h3 className="font-serif text-base sm:text-[1.05rem] text-charcoal dark:text-white mb-2 leading-snug">
            {title}
          </h3>
          <div className="flex gap-2 text-xs text-stone-400">
            <span>{readTime}</span>
            <span>·</span>
            <span>{date}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function Blog() {
  const hdrRef = useReveal();
  return (
    <section id="blog" className="py-20 md:py-24 bg-white dark:bg-stone-950">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div
          ref={hdrRef}
          className="
            opacity-0 translate-y-6 transition-all duration-700
            flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10
          "
        >
          <div>
            <p className="text-[11px] tracking-[.15em] uppercase font-semibold text-fire mb-2">
              Learning Center
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal dark:text-white leading-tight">
              Guides, Tips & Inspiration
            </h2>
          </div>
          <a
            href="#"
            className="
            inline-flex items-center gap-2 px-7 py-3 rounded-lg
            border-2 border-fire text-fire hover:bg-fire hover:text-white
            font-semibold text-sm transition-all duration-200 self-start sm:self-auto flex-shrink-0
          "
          >
            All Articles
          </a>
        </div>

        {/* Mobile: first post only as compact horizontal card */}
        {BLOG_POSTS[0] && (
          <Link href={BLOG_POSTS[0].url} className="sm:hidden flex gap-4 rounded-2xl overflow-hidden bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 hover:shadow-lg transition-shadow">
            <div className="relative w-28 flex-shrink-0">
              <Image src={BLOG_POSTS[0].img} alt={BLOG_POSTS[0].title} fill sizes="112px" className="object-cover" loading="lazy" />
            </div>
            <div className="p-4 min-w-0">
              <p className="text-[10px] font-bold tracking-widest uppercase text-fire mb-1">{BLOG_POSTS[0].tag}</p>
              <h3 className="font-serif text-sm text-charcoal dark:text-white leading-snug line-clamp-3">{BLOG_POSTS[0].title}</h3>
              <p className="text-xs text-stone-400 mt-2">{BLOG_POSTS[0].readTime}</p>
            </div>
          </Link>
        )}

        {/* Tablet+: full grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map((p,index) => (
            <BlogCard key={`home-blogs-${index}`} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
