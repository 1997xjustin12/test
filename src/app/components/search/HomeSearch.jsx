"use client";
import { SearchIcon } from "../icons/lib";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import SearchSection from "@/app/components/atom/searchResultSection";
import { useSearch } from "@/app/context/search";

// ============================================================================
// CONSTANTS
// ============================================================================
const SCROLL_THRESHOLD = 200; // pixels
const MIN_QUERY_LENGTH_FOR_RECENT = 3;

// ============================================================================
// COMPONENT
// ============================================================================
/**
 * HomeSearch - Main search component with dropdown results
 *
 * @param {Object} props
 * @param {boolean} props.main - Whether this is the main search instance
 * @param {boolean} props.controlled_height - Whether to control dropdown height
 */
const HomeSearch = ({ main = false, controlled_height = false }) => {
  // ---------------------------------------------------------------------------
  // CONTEXT & REFS
  // ---------------------------------------------------------------------------
  const {
    getRecentSearch,
    setRecentSearch,
    searchQuery,
    setSearch,
    searchResults,
    loading,
    setMainIsActive,
    redirectToSearchPage,
  } = useSearch();

  const searchRef = useRef(null);

  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  const [openSearch, setOpenSearch] = useState(false);

  // ---------------------------------------------------------------------------
  // HANDLERS: Search Input
  // ---------------------------------------------------------------------------
  const handleSearch = useCallback(
    (e) => {
      const { value } = e.target;
      setSearch(value);
    },
    [setSearch]
  );

  const handleInputClick = useCallback(() => {
    setOpenSearch(true);
  }, []);

  const handleSearchEnterKey = useCallback(
    (e) => {
      if (e.key === "Enter" && searchQuery !== "") {
        setOpenSearch(false);
        redirectToSearchPage();
      }
    },
    [searchQuery, redirectToSearchPage]
  );

  // ---------------------------------------------------------------------------
  // HANDLERS: Search Button
  // ---------------------------------------------------------------------------
  const handleSearchButtonClick = useCallback(() => {
    if (searchQuery !== "") {
      setOpenSearch(false);
      redirectToSearchPage();
    }
  }, [searchQuery, redirectToSearchPage]);

  // ---------------------------------------------------------------------------
  // HANDLERS: Option Selection
  // ---------------------------------------------------------------------------
  const handleOptionSelect = useCallback(async () => {
    if (searchQuery.length > MIN_QUERY_LENGTH_FOR_RECENT) {
      const recents = (await getRecentSearch()) || [];
      const newRecent = { term: searchQuery, timestamp: Date.now() };
      const filteredRecents = recents.filter(
        (item) => item.term !== searchQuery
      );
      await setRecentSearch([newRecent, ...filteredRecents]);
    }
    setOpenSearch(false);
  }, [searchQuery, getRecentSearch, setRecentSearch]);

  // ---------------------------------------------------------------------------
  // COMPUTED: Dropdown Classes
  // ---------------------------------------------------------------------------
  const dropdownContentClasses = useMemo(() => {
    const baseClasses = "p-1";
    const heightClasses = controlled_height
      ? "overflow-y-auto max-h-[calc(100vh-200px)] h-full"
      : "";
    const loadingClasses = loading
      ? "pointer-events-none opacity-50"
      : "pointer-events-auto opacity-100";

    return `${baseClasses} ${heightClasses} ${loadingClasses}`.trim();
  }, [controlled_height, loading]);

  // ---------------------------------------------------------------------------
  // EFFECT: Click Outside to Close Dropdown
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setOpenSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // EFFECT: Sync Main Active State
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const mainActive = main && openSearch;
    setMainIsActive(mainActive);
  }, [main, openSearch, setMainIsActive]);

  // ---------------------------------------------------------------------------
  // EFFECT: Close on Scroll (non-main instances)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (main) return; // Don't attach scroll listener for main search

    const handleScroll = () => {
      if (window.scrollY < SCROLL_THRESHOLD) {
        setOpenSearch(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [main]);

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="flex w-full relative z-10" ref={searchRef}>
      {/* Search Input */}
      <input
        type="search"
        placeholder="Search..."
        className="w-full text-sm font-normal px-[20px] py-[10px] border border-theme-400 rounded-tl-full rounded-bl-full focus:outline-none focus:ring-2 focus:ring-theme-500 focus:border-transparent transition-all"
        onClick={handleInputClick}
        onKeyDown={handleSearchEnterKey}
        value={searchQuery}
        onChange={handleSearch}
        aria-label="Search products"
        aria-expanded={openSearch}
        aria-controls="search-dropdown"
        autoComplete="off"
      />

      {/* Search Button */}
      <button
        className="rounded-tr-full rounded-br-full bg-theme-500 hover:bg-theme-600 text-white font-normal text-sm px-[20px] py-[10px] transition-colors focus:outline-none focus:ring-2 focus:ring-theme-500 focus:ring-offset-2"
        aria-label="Submit search"
        onClick={handleSearchButtonClick}
        type="button"
      >
        <SearchIcon color="white" />
      </button>

      {/* Dropdown Results */}
      {openSearch && (
        <div
          id="search-dropdown"
          className="absolute left-0 top-full w-full z-50"
          role="listbox"
          aria-label="Search results"
        >
          <div className="w-full bg-white shadow-lg rounded overflow-hidden mt-1">
            <div className={dropdownContentClasses}>
              {searchResults.length > 0 ? (
                searchResults.map((section) => (
                  <SearchSection
                    key={`search-section-${section.prop}`}
                    section={section}
                    onOptionSelect={handleOptionSelect}
                  />
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  {loading ? "Loading..." : "No results found"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeSearch;
