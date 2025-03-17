export default async function BlogPost({ params }) {
    const { slug } = params;
    const CATEGORY_ID = 2; // Replace with the actual "Solana" category ID
    const PER_PAGE = 5; // Number of other blog posts to display
    const DEFAULT_BLOG_IMAGE = "https://bbq-blog.onsitestorage.com/wp-content/uploads/2025/03/blog-default.png"; // Default image

    // Fetch current blog post
    const res = await fetch(`https://bbq-blog.onsitestorage.com/index.php?rest_route=/wp/v2/posts&slug=${slug}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        return <p className="text-red-500">Post not found.</p>;
    }

    const posts = await res.json();
    const post = posts[0];

    if (!post) {
        return <p className="text-gray-500">No content available.</p>;
    }

    // Fetch featured image for the current post
    let featuredImage = DEFAULT_BLOG_IMAGE; // Set default first
    if (post.featured_media !== 0) {
        const mediaRes = await fetch(`https://bbq-blog.onsitestorage.com/wp-json/wp/v2/media/${post.featured_media}`);
        if (mediaRes.ok) {
            const media = await mediaRes.json();
            featuredImage = media.source_url || DEFAULT_BLOG_IMAGE;
        }
    }

    // Fetch other blog posts (excluding the current one)
    const otherPostsRes = await fetch(`https://bbq-blog.onsitestorage.com/index.php?rest_route=/wp/v2/posts&categories=${CATEGORY_ID}&per_page=${PER_PAGE}`, {
        cache: "no-store",
    });

    let otherPosts = await otherPostsRes.json();
    otherPosts = otherPosts.filter((p) => p.id !== post.id); // Remove the current post

    // Fetch featured images for other posts
    const otherPostsWithImages = await Promise.all(
        otherPosts.map(async (otherPost) => {
            let imageUrl = DEFAULT_BLOG_IMAGE; // Fallback image
            if (otherPost.featured_media !== 0) {
                const mediaRes = await fetch(`https://bbq-blog.onsitestorage.com/wp-json/wp/v2/media/${otherPost.featured_media}`);
                if (mediaRes.ok) {
                    const media = await mediaRes.json();
                    imageUrl = media.source_url || DEFAULT_BLOG_IMAGE;
                }
            }
            return { ...otherPost, imageUrl };
        })
    );

    return (
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-8">
            <div className="mx-auto max-w-screen-lg px-4 2xl:px-0 flex flex-col md:flex-row gap-8">
                {/* Main Blog Content */}
                <div className="md:w-2/3">
                    <img src={featuredImage} alt={post.title.rendered} className="w-full rounded-lg mb-6 shadow-md" />
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{post.title.rendered}</h1>
                    <p className="text-gray-500 mt-2">Published on: {new Date(post.date).toLocaleDateString()}</p>
                    <div className="mt-6 text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: post.content.rendered }}></div>
                    <a href="/blogs" className="mt-4 inline-block text-blue-600 dark:text-blue-400">← Back to Blogs</a>
                </div>

                {/* Sidebar: Other Blog Posts */}
                <aside className="md:w-1/3">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Other Blog Posts</h2>
                    {otherPostsWithImages.length > 0 ? (
                        <div className="space-y-4">
                            {otherPostsWithImages.map((otherPost) => (
                                <div key={otherPost.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
                                    <a href={`/blogs/${otherPost.slug}`} className="block">
                                        <img
                                            src={otherPost.imageUrl}
                                            alt={otherPost.title.rendered}
                                            className="w-full h-40 object-cover rounded-t-lg"
                                        />
                                    </a>
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            <a href={`/blogs/${otherPost.slug}`} className="hover:underline">{otherPost.title.rendered}</a>
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-300 text-sm mt-2">
                                            {otherPost.excerpt.rendered.replace(/<[^>]*>?/gm, "").substring(0, 100)}...
                                        </p>
                                        <a href={`/blogs/${otherPost.slug}`} className="text-blue-600 dark:text-blue-400 font-semibold mt-2 inline-block">
                                            Read more →
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No other blog posts available.</p>
                    )}
                </aside>
            </div>
        </section>
    );
}
