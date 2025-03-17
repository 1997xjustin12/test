export default async function Blogs() {
    const CATEGORY_ID = 2; // Replace with the actual "Solana" category ID
    const DEFAULT_BLOG_IMAGE = "https://bbq-blog.onsitestorage.com/wp-content/uploads/2025/03/blog-default.png"; // Default image

    // Fetch blog posts
    const res = await fetch(`https://bbq-blog.onsitestorage.com/index.php?rest_route=/wp/v2/posts&categories=${CATEGORY_ID}`, {
        cache: "no-store", // Ensures fresh data
    });

    if (!res.ok) {
        return <p className="text-red-500">Error fetching blog posts.</p>;
    }

    const posts = await res.json();

    // Fetch featured images for all posts
    const postsWithImages = await Promise.all(
        posts.map(async (post) => {
            let featuredImage = DEFAULT_BLOG_IMAGE; // Set default first
            if (post.featured_media !== 0) {
                try {
                    const mediaRes = await fetch(`https://bbq-blog.onsitestorage.com/wp-json/wp/v2/media/${post.featured_media}`);
                    if (mediaRes.ok) {
                        const media = await mediaRes.json();
                        featuredImage = media.source_url || DEFAULT_BLOG_IMAGE;
                    }
                } catch (error) {
                    console.error("Error fetching media:", error);
                }
            }
            return { ...post, featuredImage };
        })
    );

    return (
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-8">
            <div className="mx-auto max-w-screen-lg px-4 2xl:px-0">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl md:mb-6">
                    Latest Blog Posts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {postsWithImages.length > 0 ? (
                        postsWithImages.map((post) => (
                            <div key={post.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
                                {/* Featured Image */}
                                <a href={`/blogs/${post.slug}`} className="block">
                                    <img
                                        src={post.featuredImage}
                                        alt={post.title.rendered}
                                        className="w-full h-48 object-cover rounded-t-lg"
                                    />
                                </a>
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        <a href={`/blogs/${post.slug}`} className="hover:underline">{post.title.rendered}</a>
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-300 text-sm mt-2">
                                        {post.excerpt.rendered.replace(/<[^>]*>?/gm, "").substring(0, 100)}...
                                    </p>
                                    <a href={`/blogs/${post.slug}`} className="text-blue-600 dark:text-blue-400 font-semibold mt-2 inline-block">
                                        Read more →
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No blog posts available.</p>
                    )}
                </div>
            </div>
        </section>
    );
}
