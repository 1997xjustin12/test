"use client";
import { SearchIcon } from "../icons/lib";
import { useState, useEffect, useRef } from "react";
import SearchSection from "@/app/components/atom/searchResultSection";
import { useSearch } from "@/app/context/search";


const HomeSearch = ({ main, controlled_height }) => {
  const {
    searchQuery,
    setSearch,
    searchResults,
    loading,
    mainIsActive,
    setMainIsActive } =
    useSearch();
  const searchRef = useRef(null);
  const [openSearch, setOpenSearch] = useState(false);
  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setOpenSearch(false); // Close dropdown when clicking outside
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const mainActive = main && openSearch;
    setMainIsActive(mainActive);
  }, [openSearch]);

  return (
    <div className="flex w-full relative z-10" ref={searchRef}>
      <input
        type="search"
        placeholder="Search..."
        className="w-full text-sm font-normal px-[20px] py-[10px] border border-orange-400 rounded-tl-full rounded-bl-full"
        onClick={() => setOpenSearch(true)}
        value={searchQuery}
        onChange={handleSearch}
      />
      <button
        className="rounded-tr-full rounded-br-full bg-pallete-orange text-white font-normal text-sm px-[20px] py-[10px]"
        aria-label="search-button"
        // onClick={() => setOpenSearch(true)}
      >
        <SearchIcon color="white" />
      </button>
      {/* dropdown */}
      {openSearch && (
        <div className="absolute left-0 top-full w-full">
          {/* menu wrapper */}
          <div
            className={`w-full bg-white shadow-lg rounded overflow-hidden mt-1`}
          >
            <div
              className={`p-1 ${
                controlled_height
                  ? "overflow-y-auto max-h-[calc(100vh-200px)] h-full"
                  : ""
              }  ${
                loading
                  ? "pointer-events-none opacity-50"
                  : "pointer-events-auto opacity-100"
              }`}
            >
              {searchResults.map((i) => (
                <SearchSection key={`search-section-${i.prop}`} section={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeSearch;
