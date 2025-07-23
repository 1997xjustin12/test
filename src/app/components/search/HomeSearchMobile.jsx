"use client";
import { SearchIcon } from "../icons/lib";
import { useState, useEffect, useRef } from "react";
import SearchSection from "@/app/components/atom/searchResultSection";
import { useSearch } from "@/app/context/search";

const HomeSearchMobile = ({ main, controlled_height }) => {
  const {
    searchQuery,
    setSearch,
    searchResults,
    loading,
    mainIsActive,
    setMainIsActive,
    redirectToSearchPage,
  } = useSearch();
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

  const handleRedirectToSearchPage = () => {
    setOpenSearch(false);
    redirectToSearchPage();
  };

  const handleSearchEnterKey = (e) => {
    if (e.key === "Enter" && searchQuery !== "") {
      handleRedirectToSearchPage();
    }
  };

  const handleSearchButtonClick = () => {
    if (searchQuery !== "") {
      handleRedirectToSearchPage();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = 200; // Change this value as needed
      if ((window.scrollY < scrollHeight)) {
        if(!main) setOpenSearch(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOptionSelect = () => {
    setOpenSearch(false);
  }

  return (
    <div className="flex w-full relative z-10" ref={searchRef}>
      <input
        type="search"
        placeholder="Search..."
        className="w-[calc(100%-50px)] text-sm sm:text-base px-[5px]"
        onClick={() => setOpenSearch(true)}
        onKeyDown={handleSearchEnterKey}
        value={searchQuery}
        onChange={handleSearch}
      />
      <button
        className="w-[50px] h-[50px] flex items-center justify-center bg-theme-600 hover:bg-theme-500"
        aria-label="search-button"
        onClick={handleSearchButtonClick}
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
                  ? "overflow-y-auto max-h-[calc(100vh-110px)] h-full"
                  : ""
              }  ${
                loading
                  ? "pointer-events-none opacity-50"
                  : "pointer-events-auto opacity-100"
              }`}
            >
              {searchResults.map((i) => (
                <SearchSection key={`search-section-${i.prop}`} section={i} onOptionSelect={handleOptionSelect}/>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeSearchMobile;
