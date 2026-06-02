import React from 'react'

function SkeletonCard() {
  return (
    <div className="overflow-hidden border border-grate bg-paper animate-pulse">
      {/* Image */}
      <div className="h-40 bg-ash" />

      {/* Body */}
      <div className="p-2.5 sm:p-4">
        {/* Brand */}
        <div className="h-2.5 bg-stone-200 w-2/5 mb-1" />

        {/* Name — 2 lines */}
        <div className="space-y-1.5 mb-2">
          <div className="h-3.5 bg-stone-200 w-full" />
          <div className="h-3.5 bg-stone-200 w-3/4" />
        </div>

        {/* Star rating row */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="h-3 bg-stone-200 w-20" />
          <div className="h-3 bg-stone-100 w-10" />
        </div>

        {/* Price section with top border */}
        <div className="pt-2 border-t border-grate">
          <div className="h-5 bg-stone-200 w-1/3 mb-1" />
          <div className="h-3 bg-stone-100 w-1/4" />
        </div>

        {/* Button row: quick-view square + full-width ATC */}
        <div className="flex mt-2 gap-0">
          <div className="w-9 h-9 min-w-9 bg-ash" />
          <div className="flex-1 h-9 bg-stone-300" />
        </div>
      </div>
    </div>
  )
}

function ProductsSectionLoader() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 py-10 flex gap-8">
      {/* Filter sidebar skeleton */}
      <div className="hidden lg:block w-56 shrink-0 space-y-4">
        <div className="h-5 w-24 bg-stone-200" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-4 bg-stone-100" />
        ))}
      </div>

      {/* Product grid skeleton */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-5 mt-[39px]">
        {[...Array(9)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}

export default ProductsSectionLoader
