import Link from "next/link";
import { getHomePage, listPickableImages } from "@/app/lib/home-page/store";
import { SECTION_TYPES } from "@/app/lib/home-page/sections";
import { listBlogChoices } from "@/app/lib/home-page/blog-posts";
import SectionEditor from "@/app/components/admin/home-page/SectionEditor";

/**
 * One section's configuration.
 *
 * The record is read here and handed down whole: the editor changes one section
 * and saves the set, so the running order and the other sections survive a save
 * from this screen.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { sectionId } = await params;
  const { sections } = await getHomePage();
  const section = sections.find((s) => s.id === sectionId);
  return { title: section ? `${SECTION_TYPES[section.type]?.label ?? "Section"} — homepage` : "Homepage section" };
}

export default async function AdminHomePageSection({ params }) {
  const { sectionId } = await params;
  const [homePage, images, posts] = await Promise.all([
    getHomePage(),
    Promise.resolve(listPickableImages()),
    // Only the blog section uses these, but the read is cached and shared with
    // the storefront, so fetching it here costs nothing the page did not
    // already pay for.
    listBlogChoices().catch(() => []),
  ]);

  const section = homePage.sections.find((s) => s.id === sectionId);

  // A section that has been removed, or an address typed by hand. Saying so is
  // more use here than a 404 page: the operator followed a link that was valid
  // a moment ago and needs to know why it is not any more.
  if (!section || !SECTION_TYPES[section.type]) {
    return (
      <div className="container mx-auto flex flex-col gap-4 px-2 pb-16 pt-2">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Section not found</h1>
        <p className="max-w-xl text-sm text-zinc-500 dark:text-zinc-400">
          This section is no longer part of the homepage — it may have been removed, or the address may be
          mistyped.
        </p>
        <Link
          href="/admin/home-page"
          className="w-fit rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-indigo-400 dark:border-white/10 dark:text-zinc-300"
        >
          Back to sections
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col gap-5 px-2 pb-16">
      <header className="pt-2">
        <Link
          href="/admin/home-page"
          className="text-sm text-zinc-500 underline hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← Homepage sections
        </Link>
        <h1 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-white">
          {SECTION_TYPES[section.type].label}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
          Text, links, images and colours are editable; the layout is fixed to the section&apos;s design.
        </p>
      </header>

      <SectionEditor
        section={section}
        siblings={homePage.sections}
        enabled={homePage.enabled}
        images={images}
        posts={posts}
      />
    </div>
  );
}
