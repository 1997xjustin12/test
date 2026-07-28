import React from 'react'

// OKO skeleton — static placeholder blocks, NO shimmer/animation (spec §7 bans
// loading skeletons with shimmer). Separation via 1px borders + cream-dim fills.
function Block({ className = "" }) {
  return <div className={`bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px] ${className}`} />;
}

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden border border-oko-stone-line dark:border-oko-line-dark bg-white dark:bg-oko-night-2 rounded-[2px]">
      {/* Image well */}
      <div className="aspect-square bg-oko-cream-dim dark:bg-oko-night-3 border-b border-oko-stone-line dark:border-oko-line-dark" />

      {/* Body */}
      <div className="p-4">
        {/* Brand */}
        <Block className="h-2.5 w-2/5 mb-2" />

        {/* Name — 2 lines */}
        <div className="space-y-1.5 mb-3">
          <Block className="h-3.5 w-full" />
          <Block className="h-3.5 w-3/4" />
        </div>

        {/* Review row */}
        <Block className="h-3 w-24 mb-3" />

        {/* Price row */}
        <div className="pt-3.5 flex items-end justify-between gap-3">
          <div className="flex-1">
            <Block className="h-5 w-1/3 mb-1" />
            <Block className="h-3 w-1/4" />
          </div>
          <Block className="w-[34px] h-[34px] border border-oko-stone-line dark:border-oko-line-dark" />
        </div>
      </div>
    </div>
  )
}

function ProductsSectionLoader() {
  return (
    <div className="max-w-[1260px] mx-auto px-5 sm:px-8 py-10 flex gap-8">
      {/* Filter sidebar skeleton */}
      <div className="hidden lg:block w-56 shrink-0 space-y-4">
        <Block className="h-5 w-24" />
        {[...Array(6)].map((_, i) => (
          <Block key={i} className="h-4 w-full" />
        ))}
      </div>

      {/* Product grid skeleton */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-5">
        {[...Array(9)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}

export default ProductsSectionLoader
