import SectionHeading from "@/app/components/new-design/sections/sp/SectionHeading";
import ProductCard from "@/app/components/new-design/sections/sp/ProductCard";

const ProductGrid = ({ title, items, action }) => (
  <section className="mb-14">
    <SectionHeading action={action}>{title}</SectionHeading>
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {items.map((p) => (
        <ProductCard key={p.name} p={p} />
      ))}
    </div>
  </section>
);

export default ProductGrid;
