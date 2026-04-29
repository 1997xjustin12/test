import ProductsSectionLoader from "@/app/components/new-design/sections/gallery/ProductsSectionLoader";

export default function Loading() {
  return (
    <div className="min-h-svh animate-pulse">
      {/* Hero banner skeleton */}
      <div className="min-h-[256px] bg-neutral-950" />
      {/* tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto scrollbar-hide gap-0 -mb-px border-b-2 min-h-[50px]">
        {[...Array(3)].map((_, i) => (
            <div key={`page-tab-placeholder-${i}`} className="flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0">
              <div className="bg-neutral-200 w-32 min-h-[17px] rounded-sm"></div>
              <div className="bg-neutral-200 w-[17px] min-h-[17px] rounded-sm"></div>
            </div>
          ))}
      </div>
      {/* Filter + grid skeleton */}
      <ProductsSectionLoader />
    </div>
  );
}