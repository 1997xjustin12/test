import React from 'react'
import Link from "next/link";
import Paginator from '@/app/components/oko-design/sections/blog/Paginator';
import { blogImage } from "@/app/lib/blogs";

function Blogs({ posts = [], totalPages = 1, page = 1 }) {
  return (
    <section className="bg-oko-cream dark:bg-oko-night py-16">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8">

        {/* Section header (8.7) */}
        <div className="mb-8">
          <span className="block font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light mb-2">
            Our blog
          </span>
          <h2 className="font-oko-display font-semibold text-[27px] leading-[1.2] text-oko-char dark:text-oko-cream">
            Latest articles
          </h2>
        </div>

        {/* Article card grid (8.10 / rule 6) */}
        <div className="grid grid-cols-1 min-[560px]:grid-cols-2 lg:grid-cols-3 gap-[22px]">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] overflow-hidden"
              >
                <Link
                  href={`/blogs/${post.slug}`}
                  className="block relative h-48 overflow-hidden bg-oko-cream-dim dark:bg-oko-night-3 border-b border-oko-stone-line dark:border-oko-line-dark"
                >
                  <img
                    src={blogImage(post)}
                    alt={post.title}
                    title={post.title}
                    className="w-full h-full object-cover transition-[opacity,transform] duration-300 group-hover:opacity-90 group-hover:scale-[1.03]"
                  />
                </Link>

                <div className="flex flex-1 flex-col gap-2 p-5">
                  <Link href={`/blogs/${post.slug}`} title={post.title}>
                    <h3 className="font-oko-display font-semibold text-[19px] leading-[1.3] text-oko-char dark:text-oko-cream line-clamp-2 hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blogs/${post.slug}`}
                    title={post.title}
                    className="mt-1 inline-flex items-center gap-1 self-start font-inter text-[13px] font-semibold text-oko-sage dark:text-oko-sage-light border-b border-transparent hover:border-oko-sage dark:hover:border-oko-sage-light hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center gap-2 py-20 px-4 bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] text-center">
              <p className="font-oko-display font-semibold text-[21px] text-oko-char dark:text-oko-cream">
                No articles yet
              </p>
              <p className="font-inter text-[13.5px] text-oko-stone">
                Check back soon for guides, tips and inspiration.
              </p>
            </div>
          )}
        </div>

        <Paginator total_pages={totalPages} current_page={page} />
      </div>
    </section>
  );
}

export default Blogs
