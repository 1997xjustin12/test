import { unstable_cache } from "next/cache";
import { ISBBQ, ISOKO } from "@/app/lib/helpers";
import { fetchBrands, fetchUniqueCategories } from "@/app/lib/fn_server";
import {
  buildBreadcrumbs,
  buildItemList,
  serializeJsonLd,
} from "@/app/lib/structured-data";
import NewCategories from "@/app/components/new-design/page/Categories";
import BBQCategories from "@/app/components/bbq-design/page/Categories";
import OKOCategories from "@/app/components/oko-design/page/Categories";
import { pageMetadata } from "@/app/lib/page-seo";

export const generateMetadata = () => pageMetadata("/categories");

/**
 * fetchUniqueCategories() fetches with `cache: "no-store"` and swallows its own
 * errors, which makes it unsafe to call directly from a route that wants to be
 * statically rendered — the DYNAMIC_SERVER_USAGE signal Next throws gets caught
 * and the route silently ships an empty list. Wrapping it gives the read its
 * own cache scope. Same pattern as the market layout and /llms.txt.
 */
const getCachedCategories = unstable_cache(
  () => fetchUniqueCategories(),
  ["categories-index"],
  { revalidate: 86400, tags: ["layout-data"] },
);

async function CategoriesPage() {
  const [BRANDS, categories] = await Promise.all([
    fetchBrands(),
    getCachedCategories().catch(() => []),
  ]);

  // This page indexes categories, not products, so the ItemList describes the
  // categories themselves. It is the last listing surface that carried no
  // structured data — see docs/agentic-ai-readiness.md (Tier 2.1d).
  const jsonLd = serializeJsonLd(
    buildBreadcrumbs([{ name: "Categories", url: "/categories" }]),
    buildItemList({
      name: "Product categories",
      url: "/categories",
      products: (categories || [])
        .filter((c) => c?.name && c?.url)
        .map((c) => ({ title: c.name, url: c.url, image: c.image })),
    }),
  );

  return (
    <>
      {jsonLd && (
        // eslint-disable-next-line react/no-danger
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      {ISOKO ? (
        <OKOCategories brands={BRANDS} />
      ) : ISBBQ ? (
        <BBQCategories brands={BRANDS} />
      ) : (
        <NewCategories brands={BRANDS} />
      )}
    </>
  );
}

export default CategoriesPage;
