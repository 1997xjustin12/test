import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BASE_URL } from "@/app/lib/helpers";
import CollectionCarouselWrap from "@/app/components/atom/CollectionCarouselWrap";
import CategoryCollectionCarouselWrap from "@/app/components/atom/CategoryCollectionCarouselWrap";
import ProductsSectionV2 from "@/app/components/molecule/ProductsSectionV2";

function BasePlp({ page_details }) {
  if (!page_details) return notFound();

  const children = page_details.children ?? [];

  return (
    <div className="bg-ash dark:bg-char min-h-screen font-sora">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-6">

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="flex items-center gap-1.5 mb-6">
          <Link
            prefetch={false}
            href={BASE_URL}
            className="text-xs text-char/40 dark:text-ash/40 hover:text-theme-600 dark:hover:text-theme-500 transition-colors"
          >
            Home
          </Link>
          <span className="text-xs text-grate dark:text-white/20">❯</span>
          <span className="text-xs text-char dark:text-ash font-medium">
            {page_details.name}
          </span>
        </nav>

        <h1 className="font-oswald font-bold text-2xl sm:text-3xl uppercase tracking-tight text-char dark:text-ash mb-8">
          {page_details.name}
        </h1>

        {/* Category cards — wider grid, no sidebar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {children.map((item) => (
            <Link
              key={`category-link-${item?.slug}`}
              prefetch={false}
              href={`${BASE_URL}/${item?.url}`}
              className="group flex flex-col overflow-hidden bg-paper dark:bg-smoke border border-grate dark:border-white/10 rounded-sm hover:border-theme-600 dark:hover:border-theme-600/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-char/10 dark:hover:shadow-black/30 transition-all duration-200"
            >
              <div className={`w-full p-3 ${item?.feature_image ? "bg-white dark:bg-char" : "bg-ash dark:bg-char"}`}>
                <div className="aspect-1 relative w-full overflow-hidden">
                  {item?.feature_image && (
                    <Image
                      src={item.feature_image}
                      alt={`category-${item?.slug}`}
                      fill
                      className="object-contain group-hover:scale-[1.03] transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
                    />
                  )}
                </div>
              </div>
              <div className="px-3 py-2.5 border-t border-grate dark:border-white/10">
                <p className="font-oswald text-[11px] font-semibold uppercase tracking-wide text-char dark:text-ash text-center group-hover:text-theme-600 dark:group-hover:text-theme-500 transition-colors leading-snug">
                  {item?.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Category collection carousels */}
        {page_details.cat_collections?.length > 0 && (
          <div className="flex flex-col gap-10 mt-12">
            {page_details.cat_collections.map((collection) => (
              <div key={`cat-collection-display-${collection?.id}`} className="flex flex-col gap-4">
                <h3 className="font-oswald font-bold text-lg uppercase tracking-wide text-char dark:text-ash">
                  {collection?.label}
                </h3>
                <CategoryCollectionCarouselWrap data={collection?.links} />
              </div>
            ))}
          </div>
        )}

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
        <div className="border-t border-grate dark:border-white/10 my-[30px]" />
      </div>

      {page_details?.name !== "Brands" && (
        <div className="mb-[30px]">
          <ProductsSectionV2 category={page_details?.url} />
        </div>
      )}
    </div>
  );
}

export default BasePlp;
