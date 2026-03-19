"use client";

import { useReveal } from "@/app/hooks/useReveal";
import { BLOG_POSTS } from "@/app/data/new-homepage";

function BlogCard({ tag, title, readTime, date, img }) {
  const ref = useReveal();
  return (
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
      <div className="h-48 overflow-hidden bg-stone-200 dark:bg-stone-800">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => (e.currentTarget.parentElement.style.background = "#e8e2dc")}
        />
      </div>
      <div className="p-5">
        <p className="text-[10px] font-bold tracking-widest uppercase text-fire mb-2">{tag}</p>
        <h3 className="font-serif text-base sm:text-[1.05rem] text-charcoal dark:text-white mb-2 leading-snug">{title}</h3>
        <div className="flex gap-2 text-xs text-stone-400">
          <span>{readTime}</span><span>·</span><span>{date}</span>
        </div>
      </div>
    </article>
  );
}

export default function Blog() {
  const hdrRef = useReveal();
  return (
    <section id="blog" className="py-20 md:py-24 bg-white dark:bg-stone-950">
      <div className="max-w-[1240px] mx-auto px-6">

        {/* Header */}
        <div
          ref={hdrRef}
          className="
            opacity-0 translate-y-6 transition-all duration-700
            flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10
          "
        >
          <div>
            <p className="text-[11px] tracking-[.15em] uppercase font-semibold text-fire mb-2">Learning Center</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal dark:text-white leading-tight">Guides, Tips & Inspiration</h2>
          </div>
          <a href="#" className="
            inline-flex items-center gap-2 px-7 py-3 rounded-lg
            border-2 border-fire text-fire hover:bg-fire hover:text-white
            font-semibold text-sm transition-all duration-200 self-start sm:self-auto flex-shrink-0
          ">
            All Articles
          </a>
        </div>

        {/* Grid: 1 col mobile → 2 col tablet → 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map(p => <BlogCard key={p.title} {...p} />)}
        </div>
      </div>
    </section>
  );
}