"use client";

import dynamic from "next/dynamic";
const BreadCrumbs = dynamic(() => import("@/app/components/atom/BreadCrumbs"), {
  ssr: false,
});
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/20/solid";
import ProductCard from "../atom/ProductCard";
import ProductCardLoader from "../atom/ProductCardLoader";
import { getPageData } from "@/app/lib/helpers";
import { useSolanaCategories } from "@/app/context/category";
import FilterSelectItem from "@/app/components/atom/FilterSelectItem";
import FilterDrawer from "@/app/components/molecule/FilterDrawer";

import { useSearchParams } from "next/navigation";

import FilterChipsWrapper from "@/app/components/section/FilterChipsWrapper";

const sortOptions = [
  {
    name: "Most Popular",
    sort: "total_sold",
    direction: "desc",
    current: true,
  },
  { name: "Newest", sort: "id", direction: "desc", current: false },
  {
    name: "Price: Low to High",
    sort: "price",
    direction: "asc",
    current: false,
  },
  {
    name: "Price: High to Low",
    sort: "price",
    direction: "desc",
    current: false,
  },
];

const loaderArray = [1, 2, 3, 4, 5, 6, 7, 8];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

export default function TuiFilterSort({
  category,
  products,
  pagination,
  filters: productFilters,
  loading,
  noResult,
  onSortChange,
  onPageChange,
  onFilterChange,
}) {
  const {flatCategories} = useSolanaCategories();
  const [sort, setSort] = useState(sortOptions);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [filters, setFilters] = useState({});
  // HANDLE PARAMS FILTER
  useEffect(() => {
    if (productFilters && Object.keys(productFilters).length > 0) {
      setFilters(productFilters);
    }
  }, [productFilters]);

  const activeCategoryName = (category) => {
    if (category === "all-products") {
      return "All Products";
    } else if (category === "search") {
      return "Search";
    } else {
      return getPageData(category, flatCategories)?.name;
    }
  };
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (products && products.length > 0) {
      if (pagination.current_page !== 1) {
        setDisplayProducts((prev) => [
          ...prev,
          ...products.map((i) => ({ ...i, isSelected: false })),
        ]);
      } else {
        setDisplayProducts(products.map((i) => ({ ...i, isSelected: false })));
      }
    }
  }, [products, pagination]);

  const handleSort = (option) => {
    onSortChange(option);
    setSort((prev) =>
      prev.map((i) => {
        return { ...i, current: i.name === option.name };
      })
    );
  };

  const handleShowMorePagination = (page) => {
    onPageChange(page);
  };

  const handleProductItemClick = (id) => {
    setDisplayProducts((prev) => {
      return prev.map((i) => ({ ...i, isSelected: i.id === id }));
    });
  };

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    const tmp = value.split(":");
    let filterValue = null;

    if (tmp.length > 1) {
      setFilters((prev) => {
        const property = tmp[0];
        prev[property]["options"] = prev[property]["options"].map((i) => {
          const checkValue = prev[property].multi
            ? i.prop == value
              ? checked
              : i.is_checked
            : i.prop == value
            ? checked
            : false;
          return {
            ...i,
            is_checked: checkValue,
          };
        });
        filterValue = prev;
        return prev;
      });
    } else {
      setFilters((prev) => {
        prev[value]["is_checked"] = checked;
        filterValue = prev;
        return prev;
      });
    }

    onFilterChange(filterValue);
    return filterValue;
  };

  const handleFilterChipClose = (e) => {
    const tmp = {
      target: {
        value: e.prop,
        is_checked: false,
      },
    };
    handleFilterChange(tmp);
  };

  return (
    <div className="bg-white">
      <div className="relative">
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
              {/* Filters */}
              <div className="relative">
                <h3 className="sr-only">Categories</h3>
                {filters?.free_shipping && (
                  <div className="py-5">
                    <FilterSelectItem
                      freeze={filters.free_shipping.freeze}
                      multiSelect={filters.free_shipping.multi}
                      data={filters.free_shipping}
                      labelStyle="font-semibold uppercase text-stone-600"
                      onChange={handleFilterChange}
                    />
                  </div>
                )}
                {filters?.brand && (
                  <div className="border-t py-5">
                    <FilterDrawer
                      freeze={filters.brand.freeze}
                      data={filters.brand}
                      multiSelect={filters.brand.multi}
                      onFilterItemChange={handleFilterChange}
                    />
                  </div>
                )}
                {filters?.price && (
                  <div className="border-t py-5">
                    <FilterDrawer
                      freeze={filters.price.freeze}
                      data={filters.price}
                      multiSelect={filters.price.multi}
                      onFilterItemChange={handleFilterChange}
                    />
                  </div>
                )}
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="px-2 sm:px-4 relative bg-white">
          <div className="border-b border-gray-200 pb-2 pt-6 sticky top-[40px] bg-white z-[5]">
            <div className="flex items-baseline justify-between ">
              <div>
                <div className="text-sm md:text-4xl font-bold tracking-tight text-gray-900">
                  {`${activeCategoryName(category)}`}{" "}
                  {category !== "search" && (
                    <span className="font-normal text-sm md:text-2xl">{`${
                      pagination &&
                      pagination.total !== 0 &&
                      pagination.total !== undefined
                        ? `(${pagination?.total})`
                        : ""
                    }`}</span>
                  )}
                </div>
                <BreadCrumbs category={category} />
              </div>
              <div className="flex items-center">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                      {`${sort.find(({ current }) => current === true).name}`}
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                      />
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <div className="py-1">
                      {sort.map((option) => (
                        <MenuItem key={option.name}>
                          <div
                            className={classNames(
                              option.current
                                ? "font-medium text-gray-900"
                                : "text-gray-500",
                              "block px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:outline-none cursor-default"
                            )}
                            onClick={() => handleSort(option)}
                          >
                            {option.name}
                          </div>
                        </MenuItem>
                      ))}
                    </div>
                  </MenuItems>
                </Menu>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                >
                  <span className="sr-only">Filters</span>
                  <FunnelIcon aria-hidden="true" className="size-5" />
                </button>
              </div>
            </div>
          </div>

          <section
            aria-labelledby="products-heading"
            className="pb-24 flex"
          >
            <div className="w-[255px] border-r hidden lg:block">
              <div className="relative">
                <h3 className="sr-only">Categories</h3>
                {filters?.free_shipping && (
                  <div className="py-5">
                    <FilterSelectItem
                      freeze={filters.free_shipping.freeze}
                      multiSelect={filters.free_shipping.multi}
                      data={filters.free_shipping}
                      labelStyle="font-semibold uppercase text-stone-600"
                      onChange={handleFilterChange}
                    />
                  </div>
                )}
                {filters?.brand && (
                  <div className="border-t py-5">
                    <FilterDrawer
                      freeze={filters.brand.freeze}
                      data={filters.brand}
                      multiSelect={filters.brand.multi}
                      onFilterItemChange={handleFilterChange}
                    />
                  </div>
                )}
                {filters?.price && (
                  <div className="border-t py-5">
                    <FilterDrawer
                      freeze={filters.price.freeze}
                      data={filters.price}
                      multiSelect={filters.price.multi}
                      onFilterItemChange={handleFilterChange}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="w-full lg:w-[calc(100%-255px)]">
              <h2 id="products-heading" className="sr-only">
                Products
              </h2>
              <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:gap-y-10 lg:grid-cols-4">
                {/* Product grid */}
                <div className="lg:col-span-4 overflow-hidden p-[0px] md:p-1">
                  {loading ? (
                    <div className="grid sm:gap-3 lg:grid-cols-3 lg:gap-5 grid-cols-2 gap-2">
                      {loaderArray.map((v, i) => (
                        <div key={`product-loader-${i}`}>
                          <ProductCardLoader />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {noResult ? (
                        <div className="flex justify-center">
                          <div className="text-stone-500 text-3xl py-10 font-bold">
                            Nothing to display
                          </div>
                        </div>
                      ) : (
                        <div className="grid lg:grid-cols-3 xl:grid-cols-4 grid-cols-2 gap-2">
                          {displayProducts.map((v, i) => (
                            <div
                              key={`product-display-${i}-${v.id}`}
                              onClick={() => handleProductItemClick(v.id)}
                            >
                              <ProductCard product={v} />
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  {pagination && pagination.total_pages !== 0 && (
                    <div className="w-full flex justify-between items-center mt-10 flex-col">
                      <div className="text-center order-2">
                        Showing{" "}
                        {pagination.current_page === 1
                          ? "1"
                          : `1 to ${
                              pagination?.current_page
                                ? pagination?.current_page
                                : "0"
                            }`}{" "}
                        of {pagination.total_pages} Pages ({pagination.total}{" "}
                        total items)
                      </div>
                      <button
                        disabled={
                          pagination.current_page === pagination.total_pages
                        }
                        onClick={() =>
                          handleShowMorePagination(pagination.current_page + 1)
                        }
                        className={`order-1 bg-theme-500 text-white px-[25px] py-[7px] rounded-md`}
                      >
                        Show More
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
