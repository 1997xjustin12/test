"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { BASE_URL, formatPrice } from "@/app/lib/helpers";
import Image from "next/image";
import { useSearch } from "@/app/context/search";
import { useSolanaCategories } from "@/app/context/category";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const FIRE = "#E85D26";

const POPULAR = [
  "Gas Fireplaces",
  "Napoleon Ascent",
  "Electric Insert",
  "Outdoor Fire Pit",
  "Linear Fireplace",
  "Patio Heater",
  "Open Box Deals",
  "Lynx Built-In Grill",
  "Wood Burning",
  "Fireplace Mantel",
  "Regency Gas Insert",
  "Blaze Grill",
];

const ALL_RESULTS = [
  // products
  {
    type: "product",
    id: 1,
    name: "Napoleon Ascent 60 Linear Gas Fireplace",
    brand: "Napoleon",
    price: "$3,299",
    tag: "Bestseller",
    color: "#1a0803",
    accent: "#e85d26",
  },
  {
    type: "product",
    id: 2,
    name: 'Dimplex Revillusion 36" Electric Fireplace',
    brand: "Dimplex",
    price: "$1,499",
    tag: "New",
    color: "#0d1a2e",
    accent: "#3b82f6",
  },
  {
    type: "product",
    id: 3,
    name: "Hearth & Home Outdoor Propane Fire Pit",
    brand: "Hearth & Home",
    price: "$899",
    tag: "Sale",
    color: "#1a1208",
    accent: "#e85d26",
  },
  {
    type: "product",
    id: 4,
    name: 'Lynx Professional 54" Built-In Gas Grill',
    brand: "Lynx Grills",
    price: "$5,499",
    tag: null,
    color: "#0d1520",
    accent: "#64748b",
  },
  {
    type: "product",
    id: 5,
    name: "Majestic Quartz 32 Direct-Vent Gas Fireplace",
    brand: "Majestic",
    price: "$2,199",
    tag: "Sale",
    color: "#1a0a03",
    accent: "#f97316",
  },
  {
    type: "product",
    id: 6,
    name: 'Blaze 4-Burner 32" Freestanding Gas Grill',
    brand: "Blaze",
    price: "$1,099",
    tag: null,
    color: "#181208",
    accent: "#64748b",
  },
  // categories
  { type: "category", id: 7, name: "Gas Fireplaces", count: "248 products" },
  {
    type: "category",
    id: 8,
    name: "Electric Fireplaces",
    count: "174 products",
  },
  { type: "category", id: 9, name: "Built-In Grills", count: "92 products" },
  { type: "category", id: 10, name: "Patio Heaters", count: "67 products" },
  // brands
  { type: "brand", id: 11, name: "Napoleon", count: "312 products" },
  { type: "brand", id: 12, name: "Dimplex", count: "88 products" },
  { type: "brand", id: 13, name: "Lynx Grills", count: "54 products" },
  { type: "brand", id: 14, name: "Majestic", count: "76 products" },
  // collections
  {
    type: "collection",
    id: 15,
    name: "Modern Linear Collection",
    count: "34 items",
  },
  {
    type: "collection",
    id: 16,
    name: "Outdoor Living Bundles",
    count: "18 items",
  },
  { type: "collection", id: 17, name: "Open Box Deals", count: "42 items" },
];

function highlight(text, query) {
  if (!query) return text;
  const idx = (text || "").toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: FIRE, fontWeight: 700 }}>
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}

function ProductThumb({ color, accent, size = "sm" }) {
  const w = size === "lg" ? 80 : 52;
  const h = size === "lg" ? 62 : 42;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={w} height={h} fill={color} rx="2" />
      <rect
        x={w * 0.15}
        y={h * 0.18}
        width={w * 0.7}
        height={h * 0.55}
        rx="2"
        fill="#050100"
        opacity=".9"
      />
      <ellipse
        cx={w / 2}
        cy={h * 0.74}
        rx={w * 0.27}
        ry={h * 0.14}
        fill={accent}
        opacity=".5"
      />
      <ellipse
        cx={w / 2}
        cy={h * 0.71}
        rx={w * 0.17}
        ry={h * 0.1}
        fill={accent}
        opacity=".55"
      />
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2056b0"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function BrandIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2a6b2a"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M8 21v-2a4 4 0 018 0v2" />
    </svg>
  );
}
function CollectionIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6330c4"
      strokeWidth="2"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function Tag({ type }) {
  const styles = {
    product:
      "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700",
    category:
      "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
    brand:
      "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
    collection:
      "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700",
  };
  const labels = {
    product: "Product",
    category: "Category",
    brand: "Brand",
    collection: "Collection",
  };
  return (
    <span
      className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded flex-shrink-0 ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
}

function SectionHeader({ label, children }) {
  return (
    <div className="flex items-center justify-between px-4 pt-3 pb-1.5">
      <span className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 dark:text-stone-500">
        {label}
      </span>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div className="mx-4 border-t border-stone-100 dark:border-stone-700/60" />
  );
}

function SearchBox() {
  const {
    setSearch,
    searchQuery,
    searchResults,
    loading,
    setMainIsActive,
    redirectToSearchPage,
  } = useSearch();

  const { getProductUrl } = useSolanaCategories();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  // On the /search page: typing only updates local input — no live fetch.
  // setSearch (which triggers both pipelines) is called only on explicit submit.
  const isSearchPage = pathname === "/search";

  const [open, setOpen] = useState(false);
  const [showAllPopular, setShowAllPopular] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllCollections, setShowAllCollections] = useState(false);
  const [focused, setFocused] = useState(false);
  // Local controlled value used only on the search page
  const [localInput, setLocalInput] = useState(searchQuery);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  // Keep localInput in sync when searchQuery changes externally
  // (e.g. user clicks a popular search link → URL changes → context syncs)
  useEffect(() => {
    if (isSearchPage) {
      setLocalInput(searchQuery);
    }
  }, [searchQuery, isSearchPage]);

  const filtered = useCallback(
    (prop) => {
      const item = searchResults.find((r) => r.prop === prop);
      return item?.total > 0 ? item.data : [];
    },
    [searchResults],
  );

  const trends = filtered("popular");
  const top = filtered("top-product")?.[0] || null;
  const products = filtered("product");
  const categories = filtered("category");
  const brands = filtered("brand");
  const collections = filtered("collections");

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleFocus() {
    setOpen(true);
    setFocused(true);
  }

  function handleChange(e) {
    setLocalInput(e.target.value);
    setSearch(e.target.value, false);
    setOpen(true);
  }

  function handleSubmit() {
    setOpen(false);

    if (isSearchPage) {
      // 1. Initialize with the existing string to preserve other filters
      const params = new URLSearchParams(searchParams.toString());

      // 2. Update the query key
      params.set("query", localInput);

      // 3. Construct the path (Relative path is faster for Next.js)
      const url = `/search?${params.toString()}`;

      router.push(url);
    } else {
      redirectToSearchPage();
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  function handleChip(label) {
    setSearch(label);
    if (!isSearchPage) inputRef.current?.focus();
  }

  function clearSearch() {
    if (isSearchPage) {
      setLocalInput("");
      setSearch("");
    } else {
      setSearch("");
    }
    inputRef.current?.focus();
  }
  return (
    <div ref={wrapRef} className="flex-1 relative max-w-2xl mx-auto">
      <div
        className={`flex items-center rounded-full px-4 py-2 gap-2 transition-all duration-200 ${focused ? "bg-white dark:bg-stone-800 ring-2 shadow-sm" : "bg-stone-100 dark:bg-stone-800"}`}
        style={{
          ringColor: focused ? FIRE : "transparent",
          boxShadow: focused ? `0 0 0 2px ${FIRE}33` : undefined,
        }}
      >
        {/* Search icon */}
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-stone-400 flex-shrink-0"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={isSearchPage ? localInput : searchQuery}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="Search fireplaces, brands, styles…"
          className="flex-1 bg-transparent outline-none text-sm text-stone-900 dark:text-white placeholder-stone-400 min-w-0"
        />

        {/* Category select – hidden on mobile */}
        {/* <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                  <div className="w-px h-4 bg-stone-200 dark:bg-stone-600" />
                  <select className="bg-transparent text-xs text-stone-500 dark:text-stone-400 outline-none cursor-pointer pr-1">
                    <option>All</option>
                    <option>Gas Fireplaces</option>
                    <option>Electric</option>
                    <option>Outdoor</option>
                    <option>Grills</option>
                  </select>
                </div> */}

        {/* Clear */}
        {(isSearchPage ? localInput : searchQuery) && (
          <button
            onClick={clearSearch}
            className="flex-shrink-0 w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-600 flex items-center justify-center transition hover:bg-stone-300"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Search button */}
        <button
          onClick={handleSubmit}
          className="flex-shrink-0 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition hover:opacity-90 hidden sm:flex items-center gap-1"
          style={{ background: FIRE }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          Search
        </button>
      </div>

      {/* ── DROPDOWN ── */}
      {open && (
        <div
          className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-700 rounded-2xl shadow-2xl overflow-hidden z-50"
          style={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          {/* TOP RESULT */}
          {top && (
            <>
              <SectionHeader label="Top Result">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: "#fff4ee", color: FIRE }}
                >
                  Direct Match
                </span>
              </SectionHeader>
              <Link
                prefetch={false}
                href={getProductUrl(top)}
                className="mx-3 mb-1 rounded-xl border border-orange-100 dark:border-orange-900/40 bg-orange-50/50 dark:bg-orange-950/20 flex items-center gap-3 p-3 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/40 transition group"
              >
                <div className="rounded-xl min-w-20 min-h-20 relative overflow-hidden flex-shrink-0 border border-stone-200 dark:border-stone-700">
                  {top?.images?.find(({ position }) => position == 1)?.src && (
                    <Image
                      src={
                        top?.images?.find(({ position }) => position == 1)?.src
                      } // or your specific object path
                      alt={top.title || "Top search result thumbnail"}
                      fill
                      sizes="(max-width: 768px) 100vw, 64px"
                      className="object-contain"
                      priority={false}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-stone-400 dark:text-stone-500 mb-0.5">
                    {top.brand}
                  </div>
                  <div className="text-sm font-semibold text-stone-900 dark:text-white leading-snug truncate">
                    {highlight(top.title, searchQuery)}
                  </div>
                  {top.tag && (
                    <span
                      className="mt-1 inline-block text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(232,93,38,.12)", color: FIRE }}
                    >
                      {top.tag}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-base font-bold text-stone-900 dark:text-white">
                    ${formatPrice(top.price)}
                  </span>
                  <span
                    className="text-xs text-white px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition"
                    style={{ background: FIRE }}
                  >
                    View →
                  </span>
                </div>
              </Link>
            </>
          )}

          <Divider />
          {trends.length > 0 && (
            <>
              <SectionHeader label="Popular Searches">
                <button
                  onClick={() => setShowAllPopular((v) => !v)}
                  className="text-[11px] font-semibold rounded px-2 py-0.5 transition hover:bg-orange-50 dark:hover:bg-orange-950/30"
                  style={{ color: FIRE }}
                >
                  {showAllPopular ? "See less ↑" : "See all ↓"}
                </button>
              </SectionHeader>
              <div className="flex flex-wrap gap-2 px-4 pb-3">
                {trends
                  .slice(0, showAllPopular ? trends.length : 10)
                  .map((p) => (
                    <Link
                      prefetch={false}
                      href={`${BASE_URL}/search?query=${p}`}
                      key={`popular-search-${p}`}
                      onClick={() => handleChip(p)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition"
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="opacity-40"
                      >
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                        <polyline points="17 6 23 6 23 12" />
                      </svg>
                      {p}
                    </Link>
                  ))}
              </div>
            </>
          )}
          {/* PRODUCTS */}
          {products.length > 0 && (
            <>
              <Divider />
              <SectionHeader label="Products">
                <button
                  onClick={() => setShowAllProducts((v) => !v)}
                  className="text-[11px] font-semibold rounded px-2 py-0.5 transition hover:bg-orange-50 dark:hover:bg-orange-950/30"
                  style={{ color: FIRE }}
                >
                  {showAllPopular ? "See less ↑" : "See all ↓"}
                </button>
              </SectionHeader>
              <div className="px-3 pb-1">
                {products
                  .slice(0, showAllProducts ? products.length : 3)
                  .map((p, index) => (
                    <Link
                      prefetch={false}
                      href={getProductUrl(p)}
                      key={`products-${p.product_id}-${index}`}
                      className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 transition group"
                    >
                      <div className="rounded-lg min-w-16 min-h-16 bg-white relative overflow-hidden flex-shrink-0 border border-stone-100 dark:border-stone-700">
                        {p?.image && (
                          <Image
                            src={p.image} // or your specific object path
                            alt={p.title || "Search result thumbnail"}
                            fill
                            sizes="(max-width: 768px) 100vw, 64px"
                            className="object-contain"
                            priority={false}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">
                          {highlight(p.title, searchQuery)}
                        </div>
                        <div className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                          {p.brand} · ${formatPrice(p.price)}
                        </div>
                      </div>
                      <Tag type="product" />
                    </Link>
                  ))}
              </div>
            </>
          )}

          {/* CATEGORIES */}
          {categories.length > 0 && (
            <>
              <Divider />
              <SectionHeader label="Categories">
                <button
                  onClick={() => setShowAllCategories((v) => !v)}
                  className="text-[11px] font-semibold rounded px-2 py-0.5 transition hover:bg-orange-50 dark:hover:bg-orange-950/30"
                  style={{ color: FIRE }}
                >
                  {showAllCategories ? "See less ↑" : "See all ↓"}
                </button>
              </SectionHeader>
              <div className="px-3 pb-1">
                {categories
                  .slice(0, showAllCategories ? categories.length : 3)
                  .map((c, index) => (
                    <Link
                      prefetch={false}
                      href={`${BASE_URL}/category/${c.slug}`}
                      key={`category-search-${c?.name}-${index}`}
                      className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 transition"
                    >
                      <div className="rounded-lg min-w-16 min-h-16 bg-white relative overflow-hidden flex-shrink-0 border border-stone-100 dark:border-stone-700">
                        {c?.image && (
                          <Image
                            src={c.image} // or your specific object path
                            alt={c.name || "Category search result thumbnail"}
                            fill
                            sizes="(max-width: 768px) 100vw, 64px"
                            className="object-cover"
                            priority={false}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-stone-800 dark:text-stone-200">
                          {/* {highlight(c.name, searchQuery)} */}
                          {c.name}
                        </div>
                        <div className="text-xs text-stone-400 dark:text-stone-500">
                          {c.count + ` item` + (!!(c.count > 1) ? "s" : "")}
                        </div>
                      </div>
                      <Tag type="category" />
                    </Link>
                  ))}
              </div>
            </>
          )}

          {/* BRANDS */}
          {brands.length > 0 && (
            <>
              <Divider />
              <SectionHeader label="Brands">
                <button
                  onClick={() => setShowAllBrands((v) => !v)}
                  className="text-[11px] font-semibold rounded px-2 py-0.5 transition hover:bg-orange-50 dark:hover:bg-orange-950/30"
                  style={{ color: FIRE }}
                >
                  {showAllBrands ? "See less ↑" : "See all ↓"}
                </button>
              </SectionHeader>
              <div className="px-3 pb-1">
                {brands
                  .slice(0, showAllBrands ? brands.length : 3)
                  .map((b, index) => (
                    <Link
                      prefetch={false}
                      href={`${BASE_URL}/${b.url}`}
                      key={`brand-search-${b.name}-${index}`}
                      className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 transition"
                    >
                      <div className="rounded-lg min-w-16 min-h-16 bg-white relative overflow-hidden flex-shrink-0 border border-stone-100 dark:border-stone-700">
                        {b?.image && (
                          <Image
                            src={b.image} // or your specific object path
                            alt={b.name || "Category search result thumbnail"}
                            fill
                            sizes="(max-width: 768px) 100vw, 64px"
                            className="object-contain"
                            priority={false}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-stone-800 dark:text-stone-200">
                          {/* {highlight(b.name, searchQuery)} */}
                          {b.name}
                        </div>
                        <div className="text-xs text-stone-400 dark:text-stone-500">
                          {b.count + ` item` + (!!(b.count > 1) ? "s" : "")}
                        </div>
                      </div>
                      <Tag type="brand" />
                    </Link>
                  ))}
              </div>
            </>
          )}

          {/* COLLECTIONS */}
          {collections.length > 0 && (
            <>
              <Divider />
              <SectionHeader label="Collections">
                <button
                  onClick={() => setShowAllCollections((v) => !v)}
                  className="text-[11px] font-semibold rounded px-2 py-0.5 transition hover:bg-orange-50 dark:hover:bg-orange-950/30"
                  style={{ color: FIRE }}
                >
                  {showAllCollections ? "See less ↑" : "See all ↓"}
                </button>
              </SectionHeader>
              <div className="px-3 pb-1">
                {collections
                  .slice(0, showAllCollections ? collections.length : 5)
                  .map((col, index) => (
                    <div
                      key={`collection-search-${col.name}-${index}`}
                      className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 transition"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <CollectionIcon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-stone-800 dark:text-stone-200">
                          {col.name}
                        </div>
                        <div className="text-xs text-stone-400 dark:text-stone-500">
                          {col.count}
                        </div>
                      </div>
                      <Tag type="collection" />
                    </div>
                  ))}
              </div>
            </>
          )}

          {/* FOOTER */}
          <div className="flex items-center justify-end px-4 py-2.5 border-t border-stone-100 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50">
            {/* <div className="flex items-center gap-2 text-[11px] text-stone-400 dark:text-stone-500">
              <span className="hidden sm:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded text-[10px] font-mono shadow-sm">
                  ↑↓
                </kbd>{" "}
                navigate
              </span>
              <span className="hidden sm:flex items-center gap-1 ml-2">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded text-[10px] font-mono shadow-sm">
                  ↵
                </kbd>{" "}
                select
              </span>
              <span className="flex items-center gap-1 sm:ml-2">
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded text-[10px] font-mono shadow-sm">
                  esc
                </kbd>{" "}
                close
              </span>
            </div> */}
            <Link
              prefetch={false}
              href={
                searchQuery ? `${BASE_URL}/search?query=${searchQuery}` : "#"
              }
              className="text-xs font-semibold flex items-center gap-1 transition hover:underline"
              style={{ color: FIRE }}
            >
              View all results
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBox;
