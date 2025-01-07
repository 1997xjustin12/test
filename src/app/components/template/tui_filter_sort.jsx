"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import ProductCard from "../atom/ProductCard";
import ProductCardLoader from "../atom/ProductCardLoader";
import cat_json from "../../data/category.json";
import bccat_json from "../../data/bc_categories_20241213.json";

const sortOptions = [
  {
    name: "Most Popular",
    sort: "total_sold",
    direction: "desc",
    current: true,
  },
  // { name: 'Best Rating', sort: 'rating', direction:'desc', current: false },
  { name: "Newest", sort: "id", direction: "desc", current: false }, // using id as replacement for date_created for sorting
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
const subCategories = cat_json
  .filter((i) => i.menu.visible)
  .map((i) => ({ ...i, active: false }))
  .sort((a, b) => a.menu.order - b.menu.order);

const filters = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White", checked: false },
      { value: "beige", label: "Beige", checked: false },
      { value: "blue", label: "Blue", checked: true },
      { value: "brown", label: "Brown", checked: false },
      { value: "green", label: "Green", checked: false },
      { value: "purple", label: "Purple", checked: false },
    ],
  },
  {
    id: "category",
    name: "Category",
    options: [
      { value: "new-arrivals", label: "New Arrivals", checked: false },
      { value: "sale", label: "Sale", checked: false },
      { value: "travel", label: "Travel", checked: true },
      { value: "organization", label: "Organization", checked: false },
      { value: "accessories", label: "Accessories", checked: false },
    ],
  },
  {
    id: "size",
    name: "Size",
    options: [
      { value: "2l", label: "2L", checked: false },
      { value: "6l", label: "6L", checked: false },
      { value: "12l", label: "12L", checked: false },
      { value: "18l", label: "18L", checked: false },
      { value: "20l", label: "20L", checked: false },
      { value: "40l", label: "40L", checked: true },
    ],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TuiFilterSort({
  category,
  products,
  pagination,
  loading,
  noResult,
  onSortChange,
  onPageChange,
}) {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
  const [sort, setSort] = useState(sortOptions);
  const [displayProducts, setDisplayProducts] = useState([]);
  const activeCategory = (path) => {
    if (category === "all-products") {
      return path === "";
    } else {
      return category === path;
    }
  };
  const activeCategoryName = (category) => {
    if (category === "all-products") {
      return "All Products";
    } else {
      return subCategories.find((i) => i.menu.href === category)?.name;
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
  }, [products]);

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
    // alert(`Product ID (${id}) is Clicked`);
    setDisplayProducts((prev) => {
      return prev.map((i) => ({ ...i, isSelected: i.id === id }));
    });
  };
  return (
    <div className="bg-white">
      <div className="relative">
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400">
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                <h3 className="sr-only">Categories</h3>
                {/* <ul role="list" className="px-2 py-3 font-medium text-gray-900">
                  {subCategories.map((category) => (
                    <li key={category.name}>
                      <Link
                        href={`${BASE_URL}/${category.menu.href}`}
                        className={`block px-2 py-3 ${
                          activeCategory(category.menu.href)
                            ? "text-pallete-orange"
                            : ""
                        }`}>
                        {category.name} {activeCategory(category.menu.href)}
                      </Link>
                    </li>
                  ))}
                </ul> */}

                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-t border-gray-200 px-4 py-6">
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="size-5 group-data-[open]:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-5 group-[&:not([data-open])]:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-6">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex gap-3">
                            <div className="flex h-5 shrink-0 items-center">
                              <div className="group grid size-4 grid-cols-1">
                                <input
                                  defaultValue={option.value}
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  type="checkbox"
                                  className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                />
                                <svg
                                  fill="none"
                                  viewBox="0 0 14 14"
                                  className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25">
                                  <path
                                    d="M3 8L6 11L11 3.5"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-[:checked]:opacity-100"
                                  />
                                  <path
                                    d="M3 7H11"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-[:indeterminate]:opacity-100"
                                  />
                                </svg>
                              </div>
                            </div>
                            <label
                              htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                              className="min-w-0 flex-1 text-gray-500">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="px-2 sm:px-4 relative bg-white">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-6  sticky top-[40px] bg-white z-[5]">
            <h1 className="text-sm md:text-4xl font-bold tracking-tight text-gray-900">
              {`${activeCategoryName(category)}`}{" "}
              <span className="font-normal text-sm md:text-2xl">{`${
                pagination &&
                pagination.total !== 0 &&
                pagination.total !== undefined
                  ? `(${pagination?.total})`
                  : ""
              }`}</span>
            </h1>

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
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
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
                          onClick={() => handleSort(option)}>
                          {option.name}
                        </div>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              {/* <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                                <span className="sr-only">View grid</span>
                                <Squares2X2Icon aria-hidden="true" className="size-5" />
                            </button> */}
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 sm:pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <div className="relative">
                <form className="hidden lg:block lg:sticky top-[130px]">
                  <h3 className="sr-only">Categories</h3>

                  {filters.map((section) => (
                    <Disclosure
                      key={section.id}
                      as="div"
                      className="border-b border-gray-200 py-6">
                      <h3 className="-my-3 flow-root">
                        <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            {section.name}
                          </span>
                          <span className="ml-6 flex items-center">
                            <PlusIcon
                              aria-hidden="true"
                              className="size-5 group-data-[open]:hidden"
                            />
                            <MinusIcon
                              aria-hidden="true"
                              className="size-5 group-[&:not([data-open])]:hidden"
                            />
                          </span>
                        </DisclosureButton>
                      </h3>
                      <DisclosurePanel className="pt-6">
                        <div className="space-y-4">
                          {section.options.map((option, optionIdx) => (
                            <div key={option.value} className="flex gap-3">
                              <div className="flex h-5 shrink-0 items-center">
                                <div className="group grid size-4 grid-cols-1">
                                  <input
                                    defaultValue={option.value}
                                    defaultChecked={option.checked}
                                    id={`filter-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    type="checkbox"
                                    className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                  />
                                  <svg
                                    fill="none"
                                    viewBox="0 0 14 14"
                                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25">
                                    <path
                                      d="M3 8L6 11L11 3.5"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="opacity-0 group-has-[:checked]:opacity-100"
                                    />
                                    <path
                                      d="M3 7H11"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="opacity-0 group-has-[:indeterminate]:opacity-100"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <label
                                htmlFor={`filter-${section.id}-${optionIdx}`}
                                className="text-sm text-gray-600">
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </DisclosurePanel>
                    </Disclosure>
                  ))}
                </form>
              </div>

              {/* Product grid */}

              <div className="lg:col-span-3 overflow-hidden p-[0px] md:p-5">
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
                      <div className="grid sm:gap-3 lg:grid-cols-3 lg:gap-6 grid-cols-2 gap-2">
                        {displayProducts.map((v, i) => (
                          <div
                            key={`product-display-${v.id}`}
                            onClick={() => handleProductItemClick(v.id)}>
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
                        : `1 to ${pagination.current_page}`}{" "}
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
                      className={`order-1 bg-pallete-orange text-white px-[25px] py-[7px] rounded-md`}>
                      Show More
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
