"use client";
import { useState, useMemo } from "react";
import CardWrap from "@/app/components/admin/CardWrap";
import Button from "@/app/components/admin/Button";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

const tabs = ["raw", "tree"];

function BigCommerceCategories() {
  const API_URL = `${BASE_URL}/api/category`; // Replace with your API
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState([]); // Store fetched data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("raw");

  const [showResults, setShowResults] = useState(true);

  async function fetchAllPages() {
    setLoading(true);
    setError(null);
    const results = [];
    let page = 1;
    const pageSize = 250; // Adjust based on API
    let totalPages = 1;

    while (page <= totalPages) {
      try {
        const response = await fetch(
          `${API_URL}?page=${page}&limit=${pageSize}`,
          {
            cache: "no-store",
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();

        results.push(...data.data); // Add fetched items to array
        const resTotalPages = data.meta.pagination.total_pages;
        if (page === 1 && resTotalPages) {
          totalPages = resTotalPages;
        }

        const _progress = (page / totalPages) * 100;
        console.log(
          `Fetched page ${page}/${totalPages}, progress: ${progress}`
        );
        setProgress((prev) => _progress);
        page++;

        // 🕒 Throttle requests (e.g., 500ms delay)
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        setError(error.message);
        console.error("Fetch error:", error);
        break;
      }
    }

    setData(results);
    setLoading(false);
  }

  const handleTabSelect = (tab) => {
    setTab(tab);
  };

  const handleCopy = async (copy_obj) => {
    try {
      const textToCopy = JSON.stringify(copy_obj, null, 2); // Convert object to pretty JSON string
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getParentName = (parent_id) => {
    if (parent_id && data.length > 0) {
      return data.find(({ category_id }) => category_id === parent_id)?.name;
    }
  };

  const categoryTree = useMemo(() => {
    if (data.length > 0) {
      const categoryMap = new Map();

      // Step 1: Initialize map with categories
      data.forEach((category) => {
        categoryMap.set(category.category_id, { ...category, children: [] });
      });

      // Step 2: Build the tree
      const tree = [];
      data.forEach((category) => {
        if (category.parent_id === 0) {
          tree.push(categoryMap.get(category.category_id));
        } else {
          const parent = categoryMap.get(category.parent_id);
          if (parent) {
            parent.children.push(categoryMap.get(category.category_id));
          }
        }
      });
      console.log("categoryTree", tree);
      return tree;
    } else {
      return [];
    }
  }, [data]); // Updates when categories change

  const CategoryList = ({ categories }) => {
    if (!categories || categories.length === 0) return null;

    return (
      <ul className="ml-4 border-l pl-2 py-2">
        {categories.map((category) => (
          <li key={category.category_id} className="mb-2 border-b  py-2">
            <div className="text-stone-800 hover:underline text-xs font-bold">
              {category.name} - {category.category_id}
            </div>
            <div className="text-[9px]">{category?.url?.path}</div>
            <div className="text-[9px] font-semibold">
              {category.parent_id !== 0 && getParentName(category.parent_id)}
            </div>
            {category.children.length > 0 && (
              <CategoryList categories={category.children} />
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <CardWrap>
      <div className="p-3 flex items-center gap-[10px] justify-between">
        <div className="flex items-center gap-[10px]">
          <Button
            disabled={loading}
            loading={loading}
            variant={`teal`}
            onClick={fetchAllPages}
          >
            GET
          </Button>
          <div>
            <div className="text-sm font-semibold">Bigcommerece Categories</div>
            <div className="text-xs">Get all bigcommerce categories.</div>
          </div>
        </div>
        <div>
          <button
            onClick={() => setShowResults((prev) => !prev)}
            className="border p-2 rounded hover:border-stone-300"
            title="Show or Hide Results"
          >
            {showResults && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
              >
                <g fill="none">
                  <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                  <path
                    fill="currentColor"
                    d="M3.05 9.31a1 1 0 1 1 1.914-.577c2.086 6.986 11.982 6.987 14.07.004a1 1 0 1 1 1.918.57a9.5 9.5 0 0 1-1.813 3.417L20.414 14A1 1 0 0 1 19 15.414l-1.311-1.311a9.1 9.1 0 0 1-2.32 1.269l.357 1.335a1 1 0 1 1-1.931.518l-.364-1.357c-.947.14-1.915.14-2.862 0l-.364 1.357a1 1 0 1 1-1.931-.518l.357-1.335a9.1 9.1 0 0 1-2.32-1.27l-1.31 1.312A1 1 0 0 1 3.585 14l1.275-1.275c-.784-.936-1.41-2.074-1.812-3.414Z"
                  />
                </g>
              </svg>
            )}

            {!showResults && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
              >
                <g fill="none">
                  <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                  <path
                    fill="currentColor"
                    d="M12 4c2.787 0 5.263 1.257 7.026 2.813c.885.781 1.614 1.658 2.128 2.531c.505.857.846 1.786.846 2.656s-.34 1.799-.846 2.656c-.514.873-1.243 1.75-2.128 2.531C17.263 18.743 14.786 20 12 20c-2.787 0-5.263-1.257-7.026-2.813c-.885-.781-1.614-1.658-2.128-2.531C2.34 13.799 2 12.87 2 12s.34-1.799.846-2.656c.514-.873 1.243-1.75 2.128-2.531C6.737 5.257 9.214 4 12 4m0 2c-2.184 0-4.208.993-5.702 2.312c-.744.656-1.332 1.373-1.729 2.047C4.163 11.049 4 11.62 4 12s.163.951.569 1.641c.397.674.985 1.39 1.729 2.047C7.792 17.007 9.816 18 12 18s4.208-.993 5.702-2.312c.744-.657 1.332-1.373 1.729-2.047c.406-.69.569-1.261.569-1.641s-.163-.951-.569-1.641c-.397-.674-.985-1.39-1.729-2.047C16.208 6.993 14.184 6 12 6m0 3q.132 0 .261.011a2 2 0 0 0 2.728 2.728A3 3 0 1 1 12 9"
                  />
                </g>
              </svg>
            )}
          </button>
        </div>
      </div>
      <div>
        <div className="w-full bg-gray-200 h-1 overflow-hidden">
          {/* Progress Fill */}
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      {showResults && (
        <div className="p-1">
          <div className="flex items-center gap-[40px] p-2">
            {tabs.map((i) => (
              <button
                key={`tab-${i}`}
                onClick={() => handleTabSelect(i)}
                className={`border-b-2 text-sm font-semibold  uppercase px-3 py-1 ${
                  tab === i ? "border-sky-600 text-sky-600" : "text-stone-700"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
          {tab === "raw" && (
            <div className="bg-neutral-100 border border-neutral-300 p-2 rounded relative">
              <button
                onClick={() => handleCopy(data)}
                className="absolute right-[20px] text-xs flex gap-[8px] text-stone-500 hover:text-stone-950"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15px"
                  height="15px"
                  viewBox="0 0 24 24"
                >
                  <g fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M14 7c0-.932 0-1.398-.152-1.765a2 2 0 0 0-1.083-1.083C12.398 4 11.932 4 11 4H8c-1.886 0-2.828 0-3.414.586S4 6.114 4 8v3c0 .932 0 1.398.152 1.765a2 2 0 0 0 1.083 1.083C5.602 14 6.068 14 7 14" />
                    <rect width="10" height="10" x="10" y="10" rx="2" />
                  </g>
                </svg>{" "}
                {copied ? "Copied" : "Copy"}
              </button>
              <pre className="text-xs text-stone-700">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}

          {tab === "tree" && (
            <div className="flex gap-[20px]">
              <div className="bg-neutral-100 border border-neutral-300 p-2 rounded relative w-[50%]">
                <button
                  onClick={() => handleCopy(categoryTree)}
                  className="absolute right-[20px] text-xs flex gap-[8px] text-stone-500 hover:text-stone-950"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15px"
                    height="15px"
                    viewBox="0 0 24 24"
                  >
                    <g fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M14 7c0-.932 0-1.398-.152-1.765a2 2 0 0 0-1.083-1.083C12.398 4 11.932 4 11 4H8c-1.886 0-2.828 0-3.414.586S4 6.114 4 8v3c0 .932 0 1.398.152 1.765a2 2 0 0 0 1.083 1.083C5.602 14 6.068 14 7 14" />
                      <rect width="10" height="10" x="10" y="10" rx="2" />
                    </g>
                  </svg>{" "}
                  {copied ? "Copied" : "Copy"}
                </button>
                <pre className="text-xs text-stone-700">
                  {JSON.stringify(categoryTree, null, 2)}
                </pre>
              </div>
              <div className="bg-neutral-100 border border-neutral-300 p-2 rounded relative w-[50%]">
                <CategoryList categories={categoryTree} />
              </div>
            </div>
          )}
        </div>
      )}
    </CardWrap>
  );
}

export default BigCommerceCategories;
