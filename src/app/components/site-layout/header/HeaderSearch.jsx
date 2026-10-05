"use client";

import SearchBox from "@/app/components/new-design/ui/SearchBox";

/**
 * The configured header's search — the real one, restyled.
 *
 * Not a copy. SearchBox is ~780 lines of autocomplete (recent searches, popular
 * terms, categories, brands, collections and products, with the hydration care
 * that took), and a second copy of it would be a second thing to fix every time
 * search changes. It now takes its field styling as props whose defaults are
 * exactly what it used to hardcode, so the three brand navbars render the same
 * markup they always did and this one passes the header's colours instead.
 *
 * Colours come through as CSS variables rather than classes, because they are
 * whatever the admin chose rather than anything Tailwind can know at build
 * time.
 */
export default function HeaderSearch({ placeholder }) {
  return (
    <SearchBox
      theme={{
        wrapper: "relative w-full max-w-xl",
        field: "flex items-center gap-2 rounded-full py-1.5 pl-5 pr-1.5 transition-all duration-200",
        fieldFocused: "",
        fieldBlurred: "",
        fieldStyle: { background: "var(--sh-search-bg)" },
        // The design's field carries no magnifier on the left; the button says
        // what it is.
        showIcon: false,
        input: "min-w-0 flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:opacity-60",
        inputStyle: { color: "var(--sh-search-text)" },
        clear:
          "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-black/10 transition hover:bg-black/20",
        submit:
          "flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition hover:opacity-90",
        submitStyle: {
          background: "var(--sh-search-btn-bg)",
          color: "var(--sh-search-btn-text)",
        },
        placeholder,
      }}
    />
  );
}
