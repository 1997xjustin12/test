import Link from "next/link";
import { BASE_URL, createSlug } from "@/app/lib/helpers";

// 8.13 SEO / footer content block — cream-dim, bordered top+bottom, split
// 1.15fr / 0.85fr. Left: 21px H2 + two prose paragraphs + wrapped sage brand
// links. Right: two columns of categorized links. Single column at ≤1024.

const BRAND_LINKS = ["Blaze", "Bull", "Napoleon", "Fire Magic", "Twin Eagles"];

const LINK_COLS = [
  {
    heading: "Shop by grill type",
    links: [
      { name: "Gas grills", url: "/gas-grills" },
      { name: "Pellet grills", url: "/pellet-grills" },
      { name: "Kamado grills", url: "/kamado-grills" },
      { name: "Charcoal grills", url: "/charcoal-grills" },
    ],
  },
  {
    heading: "Deals",
    links: [
      { name: "Open box", url: "/open-box" },
      { name: "Package deals", url: "/package-deals" },
      { name: "Scratch and dent", url: "/scratch-and-dent" },
      { name: "Clearance", url: "/clearance-sale" },
    ],
  },
];

export default function SeoBlock() {
  return (
    <div className="bg-oko-cream-dim dark:bg-oko-night-2 border-t border-b border-oko-stone-line dark:border-oko-line-dark">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-[52px]">
          {/* Left — prose */}
          <div>
            <h2 className="font-oko-display font-semibold text-[21px] leading-[1.3] text-oko-char dark:text-oko-cream mb-3">
              Built-in BBQ grills and outdoor kitchen equipment, direct from 30+ brands
            </h2>
            <p className="font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark mb-3">
              Outdoor Kitchen Outlet carries built-in and freestanding grills, griddles, kamados and pellet grills from Blaze, Bull, American Outdoor Grill, Napoleon, Fire Magic, Lion, Sunstone, TEC and more — alongside the storage, ventilation, refrigeration and side burners needed to finish a full outdoor kitchen build.
            </p>
            <p className="font-inter text-[13.5px] leading-[1.55] text-oko-char-soft dark:text-oko-ondark mb-3">
              Every listed price is already price-matched against major retailers, including Amazon. Call for phone-only bundle pricing on islands and package deals.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3.5">
              {BRAND_LINKS.map((name) => (
                <Link
                  key={name}
                  href={`${BASE_URL}/${createSlug(name)}`}
                  className="font-inter font-medium text-[12.5px] text-oko-sage dark:text-oko-sage-light border-b border-transparent hover:border-oko-sage dark:hover:border-oko-sage-light transition-colors"
                >
                  {name}
                </Link>
              ))}
              <Link
                href={`${BASE_URL}/brands`}
                className="font-inter font-medium text-[12.5px] text-oko-sage dark:text-oko-sage-light border-b border-transparent hover:border-oko-sage dark:hover:border-oko-sage-light transition-colors"
              >
                View all brands →
              </Link>
            </div>
          </div>

          {/* Right — categorized link columns */}
          <div className="grid grid-cols-2 gap-[22px]">
            {LINK_COLS.map(({ heading, links }) => (
              <div key={heading}>
                <h3 className="font-inter text-[11.5px] font-semibold uppercase tracking-[0.08em] text-oko-stone mb-2.5">
                  {heading}
                </h3>
                <ul>
                  {links.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={`${BASE_URL}${item.url}`}
                        className="block py-[5px] font-inter text-[12.5px] text-oko-char-soft dark:text-oko-ondark hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
