"use client";
import { SearchIcon } from "../icons/lib";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import SearchSection from "@/app/components/atom/searchResultSection";
import { useSearch } from "@/app/context/search";

// ============================================================================
// CONSTANTS
// ============================================================================
const SCROLL_THRESHOLD = 200; // pixels

// ============================================================================
// COMPONENT
// ============================================================================
/**
 * HomeSearchMobile - Mobile version of search component with dropdown results
 *
 * @param {Object} props
 * @param {boolean} props.main - Whether this is the main search instance
 * @param {boolean} props.controlled_height - Whether to control dropdown height
 */
const HomeSearchMobile = ({ main = false, controlled_height = false }) => {
  // ---------------------------------------------------------------------------
  // CONTEXT & REFS
  // ---------------------------------------------------------------------------
  const {
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
  const handleOptionSelect = useCallback(() => {
    setOpenSearch(false);
  }, []);

  // ---------------------------------------------------------------------------
  // COMPUTED: Dropdown Classes
  // ---------------------------------------------------------------------------
  const dropdownContentClasses = useMemo(() => {
    const baseClasses = "p-1";
    const heightClasses = controlled_height
      ? "overflow-y-auto max-h-[calc(100vh-110px)] h-full"
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [main, openSearch]); // setMainIsActive is stable from context

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
        className="w-[calc(100%-50px)] text-sm sm:text-base px-[5px] focus:outline-none focus:ring-2 focus:ring-theme-500 transition-all"
        onClick={handleInputClick}
        onKeyDown={handleSearchEnterKey}
        value={searchQuery}
        onChange={handleSearch}
        aria-label="Search products"
        aria-expanded={openSearch}
        aria-controls="search-dropdown-mobile"
        autoComplete="off"
      />

      {/* Search Button */}
      <button
        className="w-[50px] h-[50px] flex items-center justify-center bg-theme-600 hover:bg-theme-500 transition-colors focus:outline-none focus:ring-2 focus:ring-theme-500 focus:ring-offset-2"
        aria-label="Submit search"
        onClick={handleSearchButtonClick}
        type="button"
      >
        <SearchIcon color="white" />
      </button>

      {/* Dropdown Results */}
      {openSearch && (
        <div
          id="search-dropdown-mobile"
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

export default HomeSearchMobile;
