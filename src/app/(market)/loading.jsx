export default function Loading() {
  return (
    <div className="flex flex-col min-h-svh animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-stone-900 flex-1 min-h-[92vh] flex items-center px-6">
        <div className="max-w-[1240px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-14 py-20">
          <div className="space-y-5">
            <div className="h-3 w-36 rounded bg-stone-700" />
            <div className="space-y-3">
              <div className="h-10 w-4/5 rounded bg-stone-700" />
              <div className="h-10 w-3/5 rounded bg-stone-700" />
              <div className="h-10 w-2/5 rounded bg-stone-700" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full max-w-md rounded bg-stone-800" />
              <div className="h-4 w-3/4 max-w-md rounded bg-stone-800" />
            </div>
            <div className="flex gap-3 pt-2">
              <div className="h-12 w-40 rounded-lg bg-stone-700" />
              <div className="h-12 w-40 rounded-lg bg-stone-800" />
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-3">
            <div className="h-56 rounded-2xl bg-stone-800" />
            <div className="h-56 rounded-2xl bg-stone-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
