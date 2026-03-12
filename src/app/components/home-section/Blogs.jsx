import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────

const POSTS = [
  {
    id: 1,
    tag: "Inspiration Guide",
    title: "Modern Fireplace Design Ideas for 2025",
    excerpt:
      "Explore the latest trends in fireplace design — from sleek linear gas inserts to dramatic double-sided installations that redefine any living space.",
    image: "/images/blog/fireplace-ideas.webp",
    readTime: "8 min read",
    date: "Jan 2025",
    href: "/blog/modern-fireplace-design-ideas-2025",
    featured: true,
  },
  {
    id: 2,
    tag: "Buying Guide",
    title: "How to Choose the Perfect Fireplace TV Stand",
    excerpt:
      "Not all fireplace TV stands are created equal. We break down the key factors to consider — size, heat output, style, and more.",
    image: "/images/blog/fireplace-tv-stand.webp",
    readTime: "6 min read",
    date: "Dec 2024",
    href: "/blog/how-to-choose-fireplace-tv-stand",
    featured: false,
  },
  {
    id: 3,
    tag: "Buying Guide",
    title: "Types of Fireplaces & Mantels: A Complete Guide",
    excerpt:
      "Gas, electric, wood-burning, or ethanol? We walk you through every fireplace type so you can make a confident, informed decision.",
    image: "/images/blog/types-of-fireplaces.webp",
    readTime: "10 min read",
    date: "Nov 2024",
    href: "/blog/types-of-fireplaces-and-mantels",
    featured: false,
  },
];

// Tag color map — extend as needed
const TAG_COLORS = {
  "Inspiration Guide": "bg-orange-50 text-orange-500 border-orange-100",
  "Buying Guide":      "bg-sky-50 text-sky-600 border-sky-100",
  "How-To":            "bg-green-50 text-green-600 border-green-100",
  "default":           "bg-stone-50 text-stone-500 border-stone-200",
};

function tagClass(tag) {
  return TAG_COLORS[tag] ?? TAG_COLORS["default"];
}

// ─────────────────────────────────────────
// BLOG CARD
// ─────────────────────────────────────────

function BlogCard({ tag, title, excerpt, image, readTime, date, href }) {
  return (
    <article
      className="group flex flex-col bg-white rounded-2xl overflow-hidden
                 border border-stone-100 shadow-sm
                 hover:shadow-xl hover:-translate-y-1
                 transition-all duration-300"
    >
      {/* Image */}
      <Link href={href} className="relative block h-48 sm:h-52 overflow-hidden shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">

        {/* Tag */}
        <span className={`self-start text-[0.65rem] sm:text-xs font-semibold
                          tracking-wide uppercase border rounded-full
                          px-2.5 py-1 mb-3 ${tagClass(tag)}`}>
          {tag}
        </span>

        {/* Title */}
        <Link href={href}>
          <h3 className="font-serif text-base sm:text-lg text-stone-900
                         leading-snug mb-2
                         group-hover:text-orange-500 transition-colors duration-200
                         line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed
                      line-clamp-3 mb-4 flex-1">
          {excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-auto">
          {/* Meta */}
          <div className="flex items-center gap-3 text-stone-400 text-xs">
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {readTime}
            </span>
          </div>

          {/* Read more */}
          <Link
            href={href}
            className="inline-flex items-center gap-1 text-xs font-semibold
                       text-orange-500 hover:gap-2 transition-all duration-200"
          >
            Read More
            <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

      </div>
    </article>
  );
}

// ─────────────────────────────────────────
// SECTION
// ─────────────────────────────────────────

export default function BlogSection() {
  return (
    <section id="blog" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">

        {/* ── Header row ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between
                        gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div>
            <p className="text-[0.7rem] sm:text-xs font-semibold tracking-[0.15em]
                          uppercase text-orange-500 mb-2">
              Learning Center
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl
                           text-stone-900 leading-tight">
              Guides, Tips & Inspiration
            </h2>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 self-start sm:self-auto shrink-0
                       border-2 border-orange-500 text-orange-500
                       hover:bg-orange-500 hover:text-white
                       font-semibold px-5 py-2.5 rounded-lg text-sm
                       transition-colors duration-200"
          >
            All Articles
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* ── Grid
              • Mobile  : 1 col
              • sm      : 2 cols
              • lg      : 3 cols
        ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {POSTS.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>

      </div>
    </section>
  );
}