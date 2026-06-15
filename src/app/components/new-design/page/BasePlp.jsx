import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BASE_URL } from "@/app/lib/helpers";
import CollectionCarouselWrap from "@/app/components/atom/CollectionCarouselWrap";
import CategoryCollectionCarouselWrap from "@/app/components/atom/CategoryCollectionCarouselWrap";
import MobileCategoryGrid from "@/app/components/atom/MobileCategoryGrid";
import ProductsSectionV2 from "@/app/components/molecule/ProductsSectionV2";

function getNavImage(slug){
  return `/images/nav-item-images/${slug}.webp`;
}

function BasePlp({ page_details }) {
  if (!page_details) return notFound();

  const children = page_details.children ?? [];

  return (
    <>
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-6">

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="flex items-center gap-1.5 mb-6">
          <Link
            prefetch={false}
            href={BASE_URL}
            className="text-xs text-gray-400 hover:text-theme-600 transition-colors"
          >
            Home
          </Link>
          <span className="text-xs text-gray-300">/</span>
          <span className="text-xs text-gray-600 font-medium">
            {page_details.name}
          </span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-8">
          {page_details.name}
        </h1>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-[210px] shrink-0 hidden md:block">
            <div className="sticky top-[140px] flex flex-col gap-5">
              {children.map((item) => (
                <div
                  key={`sidebar-category-link-${item?.slug}`}
                  className="flex flex-col gap-1.5"
                >
                  <Link
                    prefetch={false}
                    href={`${BASE_URL}/${item?.url}`}
                    className="text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-theme-600 transition-colors"
                  >
                    {item?.name}
                  </Link>
                  {item?.children?.map((sub, i) => (
                    <Link
                      key={`sidebar-sub-${item?.slug}-${i}`}
                      prefetch={false}
                      href={`${BASE_URL}/${sub?.url}`}
                      className="text-xs text-gray-400 dark:text-gray-500 hover:text-theme-600 transition-colors pl-3 border-l border-gray-200 dark:border-gray-700"
                    >
                      {sub?.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Category cards */}
            <MobileCategoryGrid gridClassName="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {children.map((item) => (
                <Link
                  key={`category-link-${item?.slug}`}
                  prefetch={false}
                  href={`${BASE_URL}/${item?.url}`}
                  className="group flex flex-col overflow-hidden border rounded-2xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-slate-400 dark:hover:border-gray-500 hover:shadow-md transition-all duration-200"
                >
                  <div className={`w-full p-4 ${item?.slug ? "bg-white dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-800"}`}>
                    <div className="aspect-1 relative w-full overflow-hidden">
                      {item?.slug && (
                        <Image
                          src={getNavImage(item?.slug)}
                          alt={`category-${item?.slug}`}
                          fill
                          className="object-contain group-hover:scale-[1.03] transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      )}
                    </div>
                  </div>
                  <div className="px-3 py-2.5 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-theme-600 transition-colors leading-snug">
                      {item?.name}
                    </p>
                  </div>
                </Link>
              ))}
            </MobileCategoryGrid>

            {/* Category collection carousels */}
            {page_details.cat_collections?.length > 0 && (
              <div className="flex flex-col gap-10 mt-12">
                {page_details.cat_collections.map((collection) => (
                  <div key={`cat-collection-display-${collection?.id}`} className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {collection?.label}
                    </h3>
                    <CategoryCollectionCarouselWrap data={collection?.links} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Collection carousels */}
        {page_details.collections?.length > 0 && (
          <div className="mt-16 flex flex-col gap-8">
            {page_details.collections.map((collection) => (
              <CollectionCarouselWrap
                key={`collection-carousel-${collection?.mb_uid}`}
                data={collection}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6">
        <hr className="border-neutral-200 dark:border-neutral-700 my-[30px]" />
      </div>

      {page_details?.name !== "Brands" && (
        <div className="mb-[30px]">
          <ProductsSectionV2 category={page_details?.url} />
        </div>
      )}
    </>
  );
}

export default BasePlp;
