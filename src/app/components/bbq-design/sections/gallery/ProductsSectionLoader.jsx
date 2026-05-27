import React from 'react'

function ProductsSectionLoader() {
  return (
      <div className="max-w-[1240px] mx-auto px-4 py-10 flex gap-8">
        <div className="hidden lg:block w-56 shrink-0 space-y-4">
          <div className="h-5 w-24 rounded bg-stone-200" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 rounded bg-stone-100" />
          ))}
        </div>
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-5 mt-[39px]">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-stone-100">
              <div className="h-48 bg-stone-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 rounded bg-stone-200 w-4/5" />
                <div className="h-4 rounded bg-stone-100 w-1/2" />
                <div className="h-8 rounded bg-stone-200 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
  )
}

export default ProductsSectionLoader