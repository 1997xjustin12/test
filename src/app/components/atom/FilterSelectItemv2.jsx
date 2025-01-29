"use client";
import { useState, useEffect } from "react";
export default function FilterSelectItemV2({ data, labelStyle, onChange }) {
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
    // console.log(`${value}: checked(${checked})`);
    setItem((prev) => ({ ...prev, is_checked: checked }));
    onChange(e);
  };

  return (
    item && (
      <div className="flex items-center gap-[5px] pl-[2px] pr-[7px] h-[28px] border-[0.5px] border-stone-400 cursor-pointer rounded-md transition-colors duration-300">
        <div className="group grid size-5 grid-cols-1 relative">
          <input
            checked={item.is_checked}
            value={item.prop}
            onChange={handleChange}
            id={item.prop}
            name={item.prop}
            type="checkbox"
          />
          <div
            className={`absolute top-[3px] left-[3px] ${
              item.is_checked ? "visible" : "invisible"
            }`}>
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
            className={`${labelStyle ?? "font-medium text-sm text-gray-600"}`}>
            {item.label}
            {item.count > 0 && `(${item.count})`}
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
