import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BASE_URL } from "@/app/lib/helpers";
import CollectionCarouselWrap from "@/app/components/atom/CollectionCarouselWrap";
import CategoryCollectionCarouselWrap from "@/app/components/atom/CategoryCollectionCarouselWrap";
import MobileCategoryGrid from "@/app/components/atom/MobileCategoryGrid";
import ProductsSectionV2 from "@/app/components/molecule/ProductsSectionV2";

function getNavImage(item){
  return item?.feature_image || `/images/nav-item-images/${item?.slug}.webp`; 
}

function BasePlp({ page_details }) {
  if (!page_details) return notFound();

  const children = page_details.children ?? [];

  return (
    <div className="font-inter">
      <div className="w-full max-w-[1260px] mx-auto px-5 sm:px-8 py-6">

        {/* Breadcrumb (spec §9) — 12px stone, "/" separators, current in char-soft */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 font-inter text-[12px]">
          <Link
            prefetch={false}
            href={BASE_URL}
            className="text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
          >
            Home
          </Link>
          <span className="text-oko-stone-line dark:text-oko-line-dark" aria-hidden="true">/</span>
          <span className="text-oko-char-soft dark:text-oko-ondark font-medium">
            {page_details.name}
          </span>
        </nav>

        <h1 className="font-oko-display font-semibold text-[clamp(26px,5vw,42px)] leading-[1.12] text-oko-char dark:text-oko-cream mb-8">
          {page_details.name}
        </h1>

        {/* Category cards — wider grid, no sidebar */}
        <MobileCategoryGrid gridClassName="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {children.map((item) => (
            <Link
              key={`category-link-${item?.slug}`}
              prefetch={false}
              href={`${BASE_URL}/${item?.url}`}
              className="group flex flex-col overflow-hidden h-full bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] hover:border-oko-char dark:hover:border-oko-cream transition-colors duration-200"
            >
              <div className={`w-full p-3 ${item?.slug ? "bg-oko-cream-dim dark:bg-oko-night-3" : "bg-oko-cream dark:bg-oko-night-3"}`}>
                <div className="aspect-1 relative w-full overflow-hidden">
                  {item?.slug && (
                    <Image
                      src={getNavImage(item)}
                      alt={`category-${item?.slug}`}
                      fill
                      className="object-contain group-hover:scale-[1.03] transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
                    />
                  )}
                </div>
              </div>
              <div className="px-3 py-2.5 border-t border-oko-stone-line dark:border-oko-line-dark flex items-center justify-center h-[54px]">
                <p className="line-clamp-2 font-inter text-[12px] font-medium text-oko-char dark:text-oko-cream text-center group-hover:text-oko-barn dark:group-hover:text-oko-barn-light transition-colors leading-snug">
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
                <h3 className="font-oko-display font-semibold text-[21px] leading-[1.3] text-oko-char dark:text-oko-cream">
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

      <div className="w-full max-w-[1260px] mx-auto px-5 sm:px-8">
        <div className="border-t border-oko-stone-line dark:border-oko-line-dark my-[30px]" />
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
