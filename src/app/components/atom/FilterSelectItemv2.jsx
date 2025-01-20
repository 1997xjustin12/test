"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
export default function FilterSelectItemV2({ data, labelStyle, onChange }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [item, setItem] = useState({
    prop: "",
    label: "",
    count: 0,
    is_checked: false,
  });
  useEffect(() => {
    setItem(data);
  }, [data]);
  const handleChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      // console.log("value", value);
      const [key, val] = value.split(":");
      updateUrlParams({ [key]: val });
    }
    onChange(e);
  };

  const updateUrlParams = (params = {}) => {
    const urlParams = Object.fromEntries(searchParams.entries());
    const updatedQuery = new URLSearchParams({ ...urlParams, ...params });
    const updatedUrl = `${BASE_URL}${pathname}?${updatedQuery.toString()}`;
    router.replace(updatedUrl, undefined, { shallow: true });
  };
  return (
    item && (
      <div className="flex items-center gap-[5px] px-[7px] py-[3px] border-[2px] border-stone-200 cursor-pointer rounded-md hover:border-orange-200 transition-colors duration-300">
        <div className="flex">
          <input
            checked={item.is_checked}
            value={item.prop}
            onChange={handleChange}
            id={item.prop}
            name={item.prop}
            type="checkbox"
          />
          <div className="absolute  top-[3px] left-[3px]">
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
        <div>
          <label
            htmlFor={item.prop}
            className={labelStyle ?? "text-sm text-gray-600"}>
            {item.label}{" "}
            {["on sale", "quick ship"].includes(item.label.toLowerCase()) ? (
              <span className="text-[10px]">Soon</span>
            ) : (
              <></>
            )}
          </label>
        </div>
      </div>
    )
  );
}
