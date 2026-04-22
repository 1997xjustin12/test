export default function Loading() {
  return (
    <div className="min-h-svh animate-pulse">
      <div className="max-w-[1240px] mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex gap-2 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-3 w-20 rounded bg-stone-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-2xl bg-stone-200" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-16 rounded-lg bg-stone-200" />
              ))}
            </div>
          </div>
          {/* Info */}
          <div className="space-y-4">
            <div className="h-4 w-24 rounded bg-stone-200" />
            <div className="h-8 w-full rounded bg-stone-200" />
            <div className="h-8 w-3/4 rounded bg-stone-200" />
            <div className="h-6 w-32 rounded bg-stone-200" />
            <div className="space-y-2 pt-4">
              <div className="h-4 w-full rounded bg-stone-100" />
              <div className="h-4 w-5/6 rounded bg-stone-100" />
              <div className="h-4 w-4/6 rounded bg-stone-100" />
            </div>
            <div className="h-12 w-full rounded-lg bg-stone-200 mt-4" />
            <div className="h-12 w-full rounded-lg bg-stone-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
