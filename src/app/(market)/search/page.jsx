import {
  fetchSearchResults as SSR_fetchSearchResults,
  fetchUniqueCategories,
} from "@/app/lib/fn_server";
import { BASE_URL, ISBBQ } from "@/app/lib/helpers";

import NewSearchPage from "@/app/components/new-design/page/Search";
import BBQSearchPage from "@/app/components/bbq-design/page/Search";

const STATIC_POPULARS = [
  "Napoleon Ascent",
  "Bromic Eclipse",
  "Twin Eagles pellet grill",
  "Gas fireplace insert",
  "Outdoor kitchen",
  "Patio heater",
  "Fire pit table",
  "Built-in grill",
];

const newDesignWrapperClass = "min-h-svh bg-white dark:bg-gray-950";
const bbqWrapperClass = "min-h-svh bg-ash dark:bg-char";

export default async function SearchPage({ searchParams }) {
  const urlParams = await searchParams;
  const query = urlParams?.query || "";
  const ACTIVE_TAB = urlParams?.tab || "product";

  const ThemePage = ISBBQ ? BBQSearchPage : NewSearchPage;
  const wrapperClass = ISBBQ ? bbqWrapperClass : newDesignWrapperClass;

  if (query === "") {
    const categories = await fetchUniqueCategories();
    return (
      <div className={wrapperClass}>
        <ThemePage
          query={query}
          ACTIVE_TAB={ACTIVE_TAB}
          categories={categories}
          productTotal={0}
          productResults={[]}
          categoryResults={[]}
          brandResults={[]}
          searchResults={[]}
          urlParams={urlParams}
          populars={STATIC_POPULARS}
        />
      </div>
    );
  }

  const rawResults = await SSR_fetchSearchResults(query);
  const productTotal = rawResults?.["total_products"] || 0;

  if (productTotal === 0) {
    const categories = await fetchUniqueCategories();
    return (
      <div className={wrapperClass}>
        <ThemePage
          query={query}
          ACTIVE_TAB={ACTIVE_TAB}
          categories={categories}
          productTotal={0}
          productResults={[]}
          categoryResults={[]}
          brandResults={[]}
          searchResults={[]}
          urlParams={urlParams}
          populars={STATIC_POPULARS}
        />
      </div>
    );
  }

  const productResults = rawResults?.["products"] || [];
  const categoryResults = rawResults?.["categories"] || [];
  const brandResults = rawResults?.["brands"] || [];

  const searchResults = [
    { total: productTotal, prop: "product", label: "Product", data: productResults },
    { total: categoryResults.length, prop: "category", label: "Category", data: categoryResults },
    { total: brandResults.length, prop: "brand", label: "Brand", data: brandResults },
  ].map((item) => ({
    ...item,
    url: `${BASE_URL}/search?${new URLSearchParams({ ...urlParams, tab: item.prop }).toString()}`,
  }));

  return (
    <div className={wrapperClass}>
      <ThemePage
        query={query}
        ACTIVE_TAB={ACTIVE_TAB}
        categories={null}
        productTotal={productTotal}
        productResults={productResults}
        categoryResults={categoryResults}
        brandResults={brandResults}
        searchResults={searchResults}
        urlParams={urlParams}
        populars={STATIC_POPULARS}
      />
    </div>
  );
}
