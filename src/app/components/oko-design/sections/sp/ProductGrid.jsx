import SectionHeading from "@/app/components/oko-design/sections/sp/SectionHeading";
import ProductCard from "@/app/components/oko-design/sections/sp/ProductCard";

// Static placeholder (no shimmer — spec §7 forbids loading skeletons).
const SkeletonCard = () => (
  <div className="flex flex-col bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] overflow-hidden">
    <div className="aspect-1 bg-oko-cream-dim dark:bg-oko-night-3 border-b border-oko-stone-line dark:border-oko-line-dark" />
    <div className="flex flex-col gap-2 p-4 flex-1">
      <div className="h-2 w-12 bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px]" />
      <div className="h-3 w-full bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px]" />
      <div className="h-3 w-2/3 bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px]" />
      <div className="h-4 w-14 bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px] mt-1" />
    </div>
  </div>
);

const ProductGrid = ({ title, eyebrow, items, action, loading = false, skeletonCount = 4 }) => (
  <section className="mb-12">
    <SectionHeading eyebrow={eyebrow} action={action}>{title}</SectionHeading>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-[22px]">
      {loading || !items?.length
        ? Array.from({ length: skeletonCount }, (_, i) => <SkeletonCard key={`skeleton-${title}-${i}`} />)
        : items.map((p, i) => <ProductCard key={`prod-grid-${title}-${p?.title}-${i}`} p={p} />)}
    </div>
  </section>
);

export default ProductGrid;
