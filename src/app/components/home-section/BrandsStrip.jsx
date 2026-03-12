import Link from "next/link";

const BRANDS = [
  "Majestic",
  "Napoleon",
  "Regency",
  "Hearth & Home",
  "Isokern",
  "Lynx Grills",
  "Blaze",
];

// ─────────────────────────────────────────
// BRANDS STRIP
// ─────────────────────────────────────────

export default function BrandsStrip() {
  return (
    <div className="bg-[#FAF7F4] border-b border-stone-200 py-11">
      <div className="max-w-[1240px] mx-auto px-6">
        <p className="text-center text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-stone-400 mb-6">
          Trusted Brands We Carry
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {BRANDS.map((brand) => (
            <Link
              key={brand}
              href={`/brands/${brand.toLowerCase().replace(/\s+/g, "-")}`}
              className="font-serif text-base font-semibold text-stone-300 hover:text-stone-800 transition-colors duration-200"
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}