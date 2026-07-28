import Link from "next/link";

function BlogPost({ post, featuredImage, otherPostsWithImages = [] }) {
  return (
    <section className="bg-ash dark:bg-char py-14 sm:py-16 font-sora">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">

        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 font-oswald text-xs uppercase tracking-wide text-char/40 dark:text-ash/40 hover:text-theme-600 dark:hover:text-theme-500 transition-colors mb-8"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Blogs
        </Link>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

          {/* Main Content */}
          <article className="md:w-2/3">
            <div className="relative w-full overflow-hidden rounded-sm mb-6">
              <img
                src={featuredImage}
                alt={post.title.rendered}
                className="w-full object-cover"
              />
            </div>

            <div className="mb-3">
              <p className="font-oswald text-xs font-semibold text-theme-600 tracking-[.14em] uppercase">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <h1 className="font-oswald font-bold text-2xl sm:text-3xl uppercase tracking-tight text-char dark:text-ash leading-snug mb-6">
              {post.title.rendered}
            </h1>

            <div
              className="prose prose-sm sm:prose max-w-none dark:prose-invert text-char/80 dark:text-ash/80 pdp-description-wrapper"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </article>

          {/* Sidebar */}
          <aside className="md:w-1/3">
            <div className="sticky top-[140px]">
              <h2 className="font-oswald font-bold text-base uppercase tracking-wide text-char dark:text-ash mb-4 pb-2 border-b-2 border-theme-600">
                More Articles
              </h2>

              {otherPostsWithImages.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {otherPostsWithImages.map((otherPost) => (
                    <article
                      key={otherPost.id}
                      className="group bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm overflow-hidden hover:border-theme-600 dark:hover:border-theme-600/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-char/10 dark:hover:shadow-black/30 transition-all duration-200"
                    >
                      <Link
                        href={`/blogs/${otherPost.slug}`}
                        className="block relative h-36 overflow-hidden bg-white dark:bg-char"
                      >
                        <img
                          src={otherPost.imageUrl}
                          alt={otherPost.title.rendered}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      <div className="p-3 flex flex-col gap-1.5">
                        <Link href={`/blogs/${otherPost.slug}`}>
                          <h3 className="font-sora text-xs font-semibold text-char dark:text-ash leading-snug line-clamp-2 hover:text-theme-600 dark:hover:text-theme-500 transition-colors">
                            {otherPost.title.rendered}
                          </h3>
                        </Link>
                        <p className="text-xs font-light text-stone-500 dark:text-stone-400 line-clamp-2">
                          {otherPost.excerpt.rendered.replace(/<[^>]*>?/gm, "").substring(0, 100)}...
                        </p>
                        <Link
                          href={`/blogs/${otherPost.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-theme-600 hover:text-theme-700 transition-colors"
                        >
                          Read more
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-4 bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm text-center">
                  <p className="text-sm font-light text-stone-500 dark:text-stone-400">No other posts available.</p>
                </div>
              )}
            </div>
          </aside>

        </div>
      </div>
    </section>
  );
}

export default BlogPost;
