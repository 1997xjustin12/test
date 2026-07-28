import Link from "next/link";
import { BASE_URL, createSlug } from "@/app/lib/helpers";

// 8.9 Brand strip — white, bordered top+bottom, brand names as display-font
// wordmarks in stone (not logos), space-between, barn on hover. Ends with an
// "All 30+ brands →" link in barn.
const STRIP_BRANDS = ["Blaze", "Bull", "AOG", "Napoleon", "Fire Magic", "Lion", "Sunstone"];

export default function Brands() {
  return (
    <div className="bg-white dark:bg-oko-night border-t border-b border-oko-stone-line dark:border-oko-line-dark">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8 py-9">
        <div className="flex items-center justify-center lg:justify-between flex-wrap gap-x-9 gap-y-5">
          {STRIP_BRANDS.map((name) => (
            <Link
              key={name}
              href={`${BASE_URL}/${createSlug(name)}`}
              className="font-oko-display font-semibold text-[18px] tracking-[0.02em] text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
            >
              {name}
            </Link>
          ))}
          <Link
            href={`${BASE_URL}/brands`}
            className="font-oko-display font-semibold text-[18px] tracking-[0.02em] text-oko-barn dark:text-oko-barn-light hover:text-oko-barn-dark transition-colors"
          >
            All 30+ brands →
          </Link>
        </div>
      </div>
    </div>
  );
}
