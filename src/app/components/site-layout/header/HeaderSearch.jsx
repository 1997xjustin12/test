"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

/**
 * The configured header's search field.
 *
 * Deliberately a plain form, not a second copy of new-design/ui/SearchBox.
 * That component is 772 lines of autocomplete — recent searches, popular terms,
 * categories, brands, collections and products, with the hydration care that
 * took — and forking it to change a background colour would leave two search
 * implementations to keep in step, which is how the two quietly stop agreeing.
 *
 * So this is the design's field and nothing more: type, press, land on /search.
 * It submits to the same route with the same parameter the full search uses, so
 * the results are identical once you are there. What is missing is the
 * suggestions dropdown on the way.
 *
 * If the suggestions are wanted here, the right move is to give SearchBox its
 * styling as props with today's values as the defaults — the original keeps
 * behaving exactly as it does now — rather than to copy it.
 */
export default function HeaderSearch({ placeholder }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const term = query.trim();
    router.push(term ? `/search?query=${encodeURIComponent(term)}` : "/search");
  };

  return (
    <form onSubmit={submit} role="search" className="flex w-full max-w-xl items-center">
      <label htmlFor="sh-search" className="sr-only">
        Search products
      </label>
      <div
        className="flex w-full items-center rounded-full py-1 pl-5 pr-1"
        style={{ background: "var(--sh-search-bg)" }}
      >
        <input
          id="sh-search"
          type="search"
          value={query}
          placeholder={placeholder}
          onChange={(event) => setQuery(event.target.value)}
          className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:opacity-60"
          style={{ color: "var(--sh-search-text)" }}
        />
        <button
          type="submit"
          className="flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: "var(--sh-search-btn-bg)", color: "var(--sh-search-btn-text)" }}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Search</span>
          <span className="sr-only sm:hidden">Search</span>
        </button>
      </div>
    </form>
  );
}
