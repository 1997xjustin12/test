"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { exclude_brands, exclude_collections } from "@/app/lib/helpers";

const TabItem = ({ category, active_url }) => {
  const [count, setCount] = useState("");
  useEffect(() => {
    const getCollectionCount = async (collectionId) => {
      if (!collectionId) return; // Don't fetch if id is missing

      try {
        const rawQuery = {
          size: 0, // Set to 0 if you only need the total count, not the actual products
          query: {
            bool: {
              must: [
                {
                  // Comparing collection_id with the field in ES
                  term: {
                    "collections.id": collectionId,
                  },
                },
              ],
              filter: [
                {
                  term: {
                    published: true,
                  },
                },
              ],
              must_not: [
                {
                  terms: {
                    "brand.keyword": exclude_brands || [],
                  },
                },
                {
                  terms: {
                    "collections.name.keyword": exclude_collections || [],
                  },
                },
              ],
            },
          },
        };

        const response = await fetch("/api/es/shopify/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rawQuery),
          cache: "no-store",
        });

        const data = await response.json();

        // Use total.value for the actual count in Elasticsearch 7+
        const totalCount = data?.hits?.total?.value || 0;
        setCount(totalCount);
      } catch (error) {
        console.error("Failed to fetch count:", error);
      }
    };

    getCollectionCount(category?.collection_display?.id);
  }, [category, exclude_brands, exclude_collections]);

  if (!count)
    return (
      <div className="flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0">
        <div className="bg-neutral-200 w-32 min-h-[17px] rounded-sm"></div>
        <div className="bg-neutral-200 w-[17px] min-h-[17px] rounded-sm"></div>
      </div>
    );

  return (
    <Link
      href={`/${category?.url}`}
      className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${active_url === category?.url ? "border-orange-500 text-orange-600 dark:text-orange-400" : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-600"}`}
    >
      {category?.name}
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium ${active_url === category?.url ? "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400" : category?.hot ? "bg-orange-100 dark:bg-orange-950 text-orange-500" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"}`}
      >
        {count}
      </span>
    </Link>
  );
};

function SubcategoryTabs({ config }) {
  return (
    <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 sticky top-[64px] md:top-[105px] z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex overflow-x-auto scrollbar-hide gap-0 -mb-px">
          {config?.root?.children.map((t, index) => (
            <TabItem
              key={`sub-category-tab-${t?.slug}-${index}`}
              category={t}
              active_url={config?.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SubcategoryTabs;
