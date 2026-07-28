"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BASE_URL, formatPrice } from "@/app/lib/helpers";
import Image from "next/image";
import { useSearch } from "@/app/context/search";
import { useSolanaCategories } from "@/app/context/category";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function highlight(text, query) {
  if (!query) return text;
  const idx = (text || "").toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-oko-barn font-semibold">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}

function CollectionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function Tag({ type }) {
  const styles = {
    product: "bg-oko-barn/10 text-oko-barn",
    category: "bg-oko-sage/10 text-oko-sage",
    brand: "bg-oko-char/10 dark:bg-white/10 text-oko-char-soft dark:text-oko-ondark",
    collection: "bg-oko-brass/10 text-oko-brass",
  };
  const labels = {
    product: "Product",
    category: "Category",
    brand: "Brand",
    collection: "Collection",
  };
  return (
    <span
      className={`font-inter text-[10px] font-semibold uppercase tracking-[0.05em] px-2 py-0.5 rounded-[2px] flex-shrink-0 ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
}

function SectionHeader({ label, children }) {
  return (
    <div className="flex items-center justify-between px-3 sm:px-4 pt-2.5 sm:pt-3 pb-1 sm:pb-1.5">
      <span className="font-oko-mono text-[10.5px] font-medium tracking-[0.12em] uppercase text-oko-stone">
        {label}
      </span>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="mx-3 sm:mx-4 border-t border-oko-stone-line dark:border-oko-line-dark" />;
}

function SearchSpinner({ className = "" }) {
  return (
    <svg
      className={`animate-spin w-3 h-3 text-oko-stone flex-shrink-0 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function TagWithSpinner({ type, isLoading }) {
  return (
    <span className="hidden sm:inline-flex relative flex-shrink-0">
      <span className={isLoading ? "invisible" : "visible"}>
        <Tag type={type} />
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center ${isLoading ? "visible" : "invisible"}`}
      >
        <SearchSpinner />
      </span>
    </span>
  );
}

function SearchBox() {
  const {
    setSearch,
    searchQuery,
    searchResults,
    loading,
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
  const [loadingHref, setLoadingHref] = useState(null);
  const [showAllPopular, setShowAllPopular] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllCollections, setShowAllCollections] = useState(false);
  const [focused, setFocused] = useState(false);
  //  results
  const [top, setTop] = useState(null);
  const [trends, setTrends] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [collections, setCollections] = useState([]);
  // Local controlled value used only on the search page
  const [localInput, setLocalInput] = useState(searchQuery);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  // Keep localInput in sync when searchQuery changes externally
  useEffect(() => {
    if (isSearchPage) {
      setLocalInput(searchQuery);
    }
  }, [searchQuery, isSearchPage]);

  const filtered = (prop, results) => {
    const item = (results || []).find((r) => r.prop === prop);
    return item?.total > 0 ? item.data : [];
  };

  useEffect(() => {
    setTop(filtered("top-product", searchResults)?.[0] || null);
    setTrends(filtered("popular", searchResults));
    setProducts(filtered("product", searchResults));
    setCategories(filtered("category", searchResults));
    setBrands(filtered("brand", searchResults));
    setCollections(filtered("collections", searchResults));
  }, [searchResults, searchQuery]);

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
      const params = new URLSearchParams(searchParams.toString());
      params.set("query", localInput);
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

  function handleChip(e) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
    const url = e?.target?.href;
    router.push(url);
  }

  useEffect(() => {
    if (loadingHref) {
      setLoadingHref(null);
      setOpen(false);
      setFocused(false);
    }
  }, [pathname]);

  function handleItemClick(href) {
    if (!href || href.replace(BASE_URL, "") === pathname) {
      setOpen(false);
      setFocused(false);
      return;
    }
    setLoadingHref(href);
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
    <div ref={wrapRef} className="flex-1 min-w-0 relative">
      {/* Search pill */}
      <div
        className={`flex items-center gap-2.5 rounded-[2px] px-4 py-3 bg-oko-cream-dim dark:bg-oko-night-2 border transition-colors ${focused ? "border-oko-barn dark:border-oko-barn-light" : "border-oko-stone-line dark:border-oko-line-dark"}`}
      >
        <input
          ref={inputRef}
          type="text"
          value={isSearchPage ? localInput : searchQuery}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          aria-label="Search grills, brands, accessories"
          placeholder="Search grills, brands, accessories…"
          className="flex-1 bg-transparent outline-none text-[14px] font-inter text-oko-char dark:text-oko-cream placeholder-oko-stone min-w-0"
        />

        {(isSearchPage ? localInput : searchQuery) && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Search submit — trailing stroke icon */}
        <button
          type="button"
          onClick={handleSubmit}
          aria-label="Search"
          className="flex-shrink-0 flex items-center justify-center text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

      {/* ── DROPDOWN ── */}
      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] overflow-hidden z-50 flex flex-col">
          <div
            className={`h-0.5 flex-shrink-0 bg-oko-barn transition-opacity duration-300 ${loading ? "opacity-100 animate-pulse" : "opacity-0"}`}
          />
          <div
            className={`transition-opacity duration-150 ${loading ? "opacity-60 pointer-events-none select-none" : ""}`}
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >
            {/* TOP RESULT */}
            {top && (
              <>
                <SectionHeader label="Top result">
                  <span className="font-inter text-[10px] font-semibold uppercase tracking-[0.05em] px-2 py-0.5 rounded-[2px] bg-oko-barn/10 text-oko-barn">
                    Direct match
                  </span>
                </SectionHeader>
                <Link
                  prefetch={false}
                  href={getProductUrl(top)}
                  onClick={() => handleItemClick(getProductUrl(top))}
                  className="mx-2 sm:mx-3 mb-1 rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark bg-oko-cream-dim dark:bg-oko-night-3 flex items-center gap-2 sm:gap-3 p-2 sm:p-3 cursor-pointer hover:border-oko-barn dark:hover:border-oko-barn-light transition-colors group"
                >
                  <div className="rounded-[2px] min-w-14 min-h-14 sm:min-w-20 sm:min-h-20 relative overflow-hidden flex-shrink-0 border border-oko-stone-line dark:border-oko-line-dark bg-white dark:bg-oko-night">
                    {top?.images?.find(({ position }) => position == 1)?.src && (
                      <Image
                        src={top?.images?.find(({ position }) => position == 1)?.src}
                        alt={top.title || "Top search result thumbnail"}
                        fill
                        sizes="(max-width: 768px) 100vw, 64px"
                        className="object-contain"
                        priority={false}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-inter text-[10px] font-semibold uppercase tracking-[0.05em] text-oko-barn mb-0.5">
                      {top.brand}
                    </div>
                    <div className="text-[14px] font-medium text-oko-char dark:text-oko-cream leading-snug truncate">
                      {highlight(top.title, searchQuery)}
                    </div>
                    {top.tag && (
                      <span className="mt-1 inline-block font-inter text-[10px] font-semibold uppercase tracking-[0.05em] px-2 py-0.5 rounded-[2px] bg-oko-barn/10 text-oko-barn">
                        {top.tag}
                      </span>
                    )}
                    <div className="sm:hidden font-inter font-semibold text-[14px] mt-1 text-oko-char dark:text-oko-cream">
                      ${formatPrice(top.price)}
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="font-inter font-semibold text-[16px] text-oko-char dark:text-oko-cream">
                      ${formatPrice(top.price)}
                    </span>
                    <span className="relative">
                      <span
                        className={`font-inter text-[11px] font-semibold uppercase tracking-[0.04em] text-white px-2 py-1 rounded-[2px] bg-oko-barn transition ${loadingHref === getProductUrl(top) ? "invisible" : "opacity-0 group-hover:opacity-100"}`}
                      >
                        View →
                      </span>
                      <span
                        className={`absolute inset-0 flex items-center justify-center ${loadingHref === getProductUrl(top) ? "visible" : "invisible"}`}
                      >
                        <SearchSpinner />
                      </span>
                    </span>
                  </div>
                </Link>
              </>
            )}

            <Divider />
            {trends.length > 0 && (
              <>
                <SectionHeader label="Popular searches">
                  <button
                    type="button"
                    onClick={() => setShowAllPopular((v) => !v)}
                    className="font-inter text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[2px] px-2 py-0.5 text-oko-sage hover:text-oko-barn transition-colors"
                  >
                    {showAllPopular ? "See less ↑" : "See all ↓"}
                  </button>
                </SectionHeader>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 px-3 sm:px-4 pb-2 sm:pb-3">
                  {trends
                    .slice(0, showAllPopular ? trends.length : 10)
                    .map((p) => (
                      <Link
                        prefetch={false}
                        href={`${BASE_URL}/search?query=${p}`}
                        key={`popular-search-${p}`}
                        onClick={handleChip}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-[12.5px] font-inter bg-oko-cream-dim dark:bg-oko-night-3 text-oko-char-soft dark:text-oko-ondark border border-oko-stone-line dark:border-oko-line-dark hover:border-oko-barn hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
                      >
                        {p}
                      </Link>
                    ))}
                </div>
              </>
            )}
            {/* PRODUCTS */}
            {products.length > 0 && searchQuery !== "" && (
              <>
                <Divider />
                <SectionHeader label="Products">
                  <button
                    type="button"
                    onClick={() => setShowAllProducts((v) => !v)}
                    className="font-inter text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[2px] px-2 py-0.5 text-oko-sage hover:text-oko-barn transition-colors"
                  >
                    {showAllProducts ? "See less ↑" : "See all ↓"}
                  </button>
                </SectionHeader>
                <div className="px-2 sm:px-3 pb-1">
                  {products
                    .slice(0, showAllProducts ? products.length : 3)
                    .map((p, index) => (
                      <Link
                        prefetch={false}
                        href={getProductUrl(p)}
                        key={`product-${p.product_id}-${index}`}
                        onClick={() => handleItemClick(getProductUrl(p))}
                        className="flex items-center gap-2 sm:gap-3 px-2 py-1.5 sm:py-2 rounded-[2px] cursor-pointer hover:bg-oko-cream-dim dark:hover:bg-oko-night-3 transition-colors group"
                      >
                        <div className="rounded-[2px] min-w-12 min-h-12 sm:min-w-16 sm:min-h-16 bg-white dark:bg-oko-night relative overflow-hidden flex-shrink-0 border border-oko-stone-line dark:border-oko-line-dark">
                          {p?.image && (
                            <Image
                              src={p.image}
                              alt={p.title || "Search result thumbnail"}
                              fill
                              sizes="(max-width: 768px) 100vw, 64px"
                              className="object-contain"
                              priority={false}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-medium text-oko-char dark:text-oko-cream truncate">
                            {highlight(p.title, searchQuery)}
                          </div>
                          <div className="text-[12px] text-oko-stone mt-0.5">
                            {p.brand} · ${formatPrice(p.price)}
                          </div>
                        </div>
                        <TagWithSpinner
                          type="product"
                          isLoading={loadingHref === getProductUrl(p)}
                        />
                      </Link>
                    ))}
                </div>
              </>
            )}

            {/* CATEGORIES */}
            {categories.length > 0 && searchQuery !== "" && (
              <>
                <Divider />
                <SectionHeader label="Categories">
                  <button
                    type="button"
                    onClick={() => setShowAllCategories((v) => !v)}
                    className="font-inter text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[2px] px-2 py-0.5 text-oko-sage hover:text-oko-barn transition-colors"
                  >
                    {showAllCategories ? "See less ↑" : "See all ↓"}
                  </button>
                </SectionHeader>
                <div className="px-2 sm:px-3 pb-1">
                  {categories
                    .slice(0, showAllCategories ? categories.length : 3)
                    .map((c, index) => {
                      const href = `${BASE_URL}/category/${c.slug}`;
                      return (
                        <Link
                          prefetch={false}
                          href={href}
                          key={`category-${c.slug}-${index}`}
                          onClick={() => handleItemClick(href)}
                          className="flex items-center gap-2 sm:gap-3 px-2 py-1.5 sm:py-2 rounded-[2px] cursor-pointer hover:bg-oko-cream-dim dark:hover:bg-oko-night-3 transition-colors"
                        >
                          <div className="rounded-[2px] min-w-12 min-h-12 sm:min-w-16 sm:min-h-16 bg-white dark:bg-oko-night relative overflow-hidden flex-shrink-0 border border-oko-stone-line dark:border-oko-line-dark">
                            {c?.image && (
                              <Image
                                src={c.image}
                                alt={c.name || "Category search result thumbnail"}
                                fill
                                sizes="(max-width: 768px) 100vw, 64px"
                                className="object-cover"
                                priority={false}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[14px] font-medium text-oko-char dark:text-oko-cream">
                              {c.name}
                            </div>
                            <div className="text-[12px] text-oko-stone">
                              {c.count + ` item` + (!!(c.count > 1) ? "s" : "")}
                            </div>
                          </div>
                          <TagWithSpinner
                            type="category"
                            isLoading={loadingHref === href}
                          />
                        </Link>
                      );
                    })}
                </div>
              </>
            )}

            {/* BRANDS */}
            {brands.length > 0 && searchQuery !== "" && (
              <>
                <Divider />
                <SectionHeader label="Brands">
                  <button
                    type="button"
                    onClick={() => setShowAllBrands((v) => !v)}
                    className="font-inter text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[2px] px-2 py-0.5 text-oko-sage hover:text-oko-barn transition-colors"
                  >
                    {showAllBrands ? "See less ↑" : "See all ↓"}
                  </button>
                </SectionHeader>
                <div className="px-3 pb-1">
                  {brands
                    .slice(0, showAllBrands ? brands.length : 3)
                    .map((b, index) => {
                      const href = `${BASE_URL}/${b.url}`;
                      return (
                        <Link
                          prefetch={false}
                          href={href}
                          key={`brand-${b.name}-${index}`}
                          onClick={() => handleItemClick(href)}
                          className="flex items-center gap-3 px-2 py-2 rounded-[2px] cursor-pointer hover:bg-oko-cream-dim dark:hover:bg-oko-night-3 transition-colors"
                        >
                          <div className="rounded-[2px] min-w-16 min-h-16 bg-white dark:bg-oko-night relative overflow-hidden flex-shrink-0 border border-oko-stone-line dark:border-oko-line-dark">
                            {b?.image && (
                              <Image
                                src={b.image}
                                alt={b.name || "Brand search result thumbnail"}
                                fill
                                sizes="(max-width: 768px) 100vw, 64px"
                                className="object-contain"
                                priority={false}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-oko-display text-[15px] font-semibold text-oko-char dark:text-oko-cream">
                              {b.name}
                            </div>
                            <div className="text-[12px] text-oko-stone">
                              {b.count + ` item` + (!!(b.count > 1) ? "s" : "")}
                            </div>
                          </div>
                          <TagWithSpinner
                            type="brand"
                            isLoading={loadingHref === href}
                          />
                        </Link>
                      );
                    })}
                </div>
              </>
            )}

            {/* COLLECTIONS */}
            {collections.length > 0 && searchQuery !== "" && (
              <>
                <Divider />
                <SectionHeader label="Collections">
                  <button
                    type="button"
                    onClick={() => setShowAllCollections((v) => !v)}
                    className="font-inter text-[11px] font-semibold uppercase tracking-[0.04em] rounded-[2px] px-2 py-0.5 text-oko-sage hover:text-oko-barn transition-colors"
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
                        className="flex items-center gap-3 px-2 py-2 rounded-[2px] cursor-pointer hover:bg-oko-cream-dim dark:hover:bg-oko-night-3 transition-colors"
                      >
                        <div className="w-8 h-8 bg-oko-brass/10 flex items-center justify-center flex-shrink-0 text-oko-brass rounded-[2px]">
                          <CollectionIcon />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-oko-display text-[15px] font-semibold text-oko-char dark:text-oko-cream">
                            {col.name}
                          </div>
                          <div className="text-[12px] text-oko-stone">
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
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-oko-stone-line dark:border-oko-line-dark bg-oko-cream-dim dark:bg-oko-night-3">
              {loading ? (
                <span className="flex items-center gap-1.5 text-[11px] text-oko-stone font-inter">
                  <SearchSpinner />
                  Updating…
                </span>
              ) : (
                <span />
              )}
              {localInput.trim() !== "" && (
                <Link
                  prefetch={false}
                  href={searchQuery ? `${BASE_URL}/search?query=${searchQuery}` : "#"}
                  className="font-inter text-[12px] font-semibold uppercase tracking-[0.04em] flex items-center gap-1 text-oko-sage hover:text-oko-barn transition-colors"
                >
                  View all results →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBox;
