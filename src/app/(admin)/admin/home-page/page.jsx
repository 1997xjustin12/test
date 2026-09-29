import { STORE_NAME } from "@/app/lib/store_constants";
import { getHomePage } from "@/app/lib/home-page/store";
import HomePageList from "@/app/components/admin/home-page/HomePageList";

/**
 * Homepage editor.
 *
 * The saved record and the image library are read here, on the server, and
 * handed to the editor as its starting state — the same shape the storefront
 * renders from, so what is edited here is exactly what is published.
 *
 * Store-scoped: this screen edits the homepage of whichever brand the admin is
 * running as, and cannot see or change the other two.
 */
export const dynamic = "force-dynamic";

export const metadata = { title: "Homepage editor" };

export default async function AdminHomePage() {
  const homePage = await getHomePage();

  return (
    <div className="container mx-auto flex flex-col gap-5 px-2 pb-16">
      <header className="pt-2">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Homepage</h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
          Build {STORE_NAME}&apos;s homepage from sections. Drag to reorder, open a section to edit its
          text, links, images and colours. Changes apply to this brand only.
        </p>
        {homePage.updatedAt && (
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            Last saved {new Date(homePage.updatedAt).toLocaleString()}
          </p>
        )}
      </header>

      <HomePageList initial={homePage} />
    </div>
  );
}
