import Link from "next/link";
import { blogImage } from "@/app/lib/blogs";

// Article body prose (rule 8): Inter 14.5px / 1.55, headings in slab. Styled via
// arbitrary variants so the OKO look + full dark mode are self-contained (the
// Tailwind typography plugin is not installed; pdp-description-wrapper hardcodes
// light-mode colors and is only imported on product pages).
const PROSE =
  "font-inter text-[14.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark " +
  "[&_p]:mb-4 " +
  "[&_h2]:font-oko-display [&_h2]:font-semibold [&_h2]:text-[21px] [&_h2]:leading-[1.3] [&_h2]:text-oko-char dark:[&_h2]:text-oko-cream [&_h2]:mt-8 [&_h2]:mb-3 " +
  "[&_h3]:font-oko-display [&_h3]:font-semibold [&_h3]:text-[19px] [&_h3]:leading-[1.3] [&_h3]:text-oko-char dark:[&_h3]:text-oko-cream [&_h3]:mt-6 [&_h3]:mb-2 " +
  "[&_h4]:font-oko-display [&_h4]:font-semibold [&_h4]:text-[16px] [&_h4]:text-oko-char dark:[&_h4]:text-oko-cream [&_h4]:mt-6 [&_h4]:mb-2 " +
  "[&_a]:text-oko-barn dark:[&_a]:text-oko-barn-light [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-oko-barn-dark " +
  "[&_strong]:font-semibold [&_strong]:text-oko-char dark:[&_strong]:text-oko-cream [&_b]:font-semibold [&_b]:text-oko-char dark:[&_b]:text-oko-cream " +
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-4 [&_ul]:space-y-1.5 " +
  "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-4 [&_ol]:space-y-1.5 " +
  "[&_li]:leading-[1.55] [&_li]:marker:text-oko-stone " +
  "[&_blockquote]:border-l-2 [&_blockquote]:border-oko-stone-line dark:[&_blockquote]:border-oko-line-dark [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-oko-char-soft dark:[&_blockquote]:text-oko-ondark-muted " +
  "[&_img]:rounded-[2px] [&_img]:my-4 [&_img]:border [&_img]:border-oko-stone-line dark:[&_img]:border-oko-line-dark";

function BlogPost({ post, featuredImage, otherPosts = [] }) {
  return (
    <section className="bg-oko-cream dark:bg-oko-night py-16 min-h-screen">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8">

        {/* Back link — navigation, so ← not → */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 font-oko-mono text-[11px] uppercase tracking-[0.14em] text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors mb-8"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to blog
        </Link>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

          {/* Main Content */}
          <article className="md:w-2/3">
            <div className="relative w-full overflow-hidden rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark bg-oko-cream-dim dark:bg-oko-night-3 mb-6">
              <img
                src={featuredImage}
                alt={post.title}
                className="w-full object-cover"
              />
            </div>

            <p className="font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light mb-3">
              {new Date(post.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <h1 className="font-oko-display font-semibold text-[27px] sm:text-[29px] leading-[1.18] text-oko-char dark:text-oko-cream mb-6">
              {post.title}
            </h1>

            <div
              className={PROSE}
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </article>

          {/* Sidebar */}
          <aside className="md:w-1/3">
            <div className="sticky top-[145px]">
              <h2 className="font-oko-display font-semibold text-[19px] text-oko-char dark:text-oko-cream mb-4 pb-2 border-b border-oko-stone-line dark:border-oko-line-dark">
                More articles
              </h2>

              {otherPosts.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {otherPosts.map((otherPost) => (
                    <article
                      key={otherPost.id}
                      className="group flex flex-col bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] overflow-hidden"
                    >
                      <Link
                        href={`/blogs/${otherPost.slug}`}
                        className="block relative h-36 overflow-hidden bg-oko-cream-dim dark:bg-oko-night-3 border-b border-oko-stone-line dark:border-oko-line-dark"
                      >
                        <img
                          src={blogImage(otherPost)}
                          alt={otherPost.title}
                          className="w-full h-full object-cover transition-[opacity,transform] duration-300 group-hover:opacity-90 group-hover:scale-[1.03]"
                        />
                      </Link>
                      <div className="flex flex-col gap-1.5 p-4">
                        <Link href={`/blogs/${otherPost.slug}`}>
                          <h3 className="font-oko-display font-semibold text-[15.5px] leading-[1.3] text-oko-char dark:text-oko-cream line-clamp-2 hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors">
                            {otherPost.title}
                          </h3>
                        </Link>
                        <p className="font-inter text-[12.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark line-clamp-2">
                          {(otherPost.excerpt || "").substring(0, 100)}...
                        </p>
                        <Link
                          href={`/blogs/${otherPost.slug}`}
                          className="mt-0.5 inline-flex items-center gap-1 self-start font-inter text-[12.5px] font-semibold text-oko-sage dark:text-oko-sage-light border-b border-transparent hover:border-oko-sage dark:hover:border-oko-sage-light hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
                        >
                          Read more →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-4 bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] text-center">
                  <p className="font-inter text-[13.5px] text-oko-stone">No other posts available.</p>
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
