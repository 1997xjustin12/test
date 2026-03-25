import Link from "next/link";

function SubcategoryTabs({ config }) {
  console.log("config", config);

  return (
    <div className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex overflow-x-auto scrollbar-hide gap-0 -mb-px">
          {config?.root?.children.map((t, index) => (
            <Link
              key={`sub-category-tab-${t?.slug}-${index}`}
              href={`/${t?.url}`}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${config?.url === t?.url ? "border-orange-500 text-orange-600 dark:text-orange-400" : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-600"}`}
            >
              {t.name}
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${config?.url === t?.url ? "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400" : t.hot ? "bg-orange-100 dark:bg-orange-950 text-orange-500" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"}`}
              >
                {t.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SubcategoryTabs;
