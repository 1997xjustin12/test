import React from 'react'
import he from "he";
import Link from "next/link";
import Paginator from '@/app/components/bbq-design/sections/blog/Paginator';

function Blogs({ postsWithImages = [], totalPages = 1, page = 1 }) {
  return (
    <section className="bg-ash dark:bg-char py-14 sm:py-16 font-sora">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">

        <div className="mb-8 md:mb-10">
          <p className="font-oswald text-xs font-semibold text-theme-600 tracking-[.14em] uppercase">
            Our Blog
          </p>
          <h2 className="font-oswald font-bold text-3xl sm:text-4xl uppercase mt-1 text-stone-900 dark:text-ash">
            Latest Articles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsWithImages.length > 0 ? (
            postsWithImages.map((post) => (
              <article
                key={post.id}
                className="group bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm overflow-hidden hover:border-theme-600 dark:hover:border-theme-600/60 hover:-translate-y-1 hover:shadow-lg hover:shadow-char/10 dark:hover:shadow-black/30 transition-all duration-200 flex flex-col"
              >
                <Link
                  href={`/blogs/${post.slug}`}
                  className="block relative h-48 overflow-hidden bg-white dark:bg-char"
                >
                  <img
                    src={post.featuredImage}
                    alt={he.decode(post.title.rendered)}
                    title={he.decode(post.title.rendered)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="p-4 flex flex-col flex-1 gap-1.5">
                  <Link href={`/blogs/${post.slug}`} title={he.decode(post.title.rendered)}>
                    <h3 className="font-sora text-sm font-semibold text-char dark:text-ash leading-snug line-clamp-2 hover:text-theme-600 dark:hover:text-theme-500 transition-colors">
                      {he.decode(post.title.rendered)}
                    </h3>
                  </Link>

                  <p className="text-sm font-light leading-relaxed text-stone-600 dark:text-stone-400 line-clamp-3 flex-1">
                    {he.decode(post.excerpt.rendered.replace(/<[^>]*>?/gm, ""))}
                  </p>

                  <Link
                    href={`/blogs/${post.slug}`}
                    title={he.decode(post.title.rendered)}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-theme-600 hover:text-theme-700 transition-colors"
                  >
                    Read more
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm text-center">
              <p className="text-sm font-light text-stone-500 dark:text-stone-400">No blog posts available.</p>
            </div>
          )}
        </div>

        <Paginator total_pages={totalPages} current_page={page} />
      </div>
    </section>
  );
}

export default Blogs
