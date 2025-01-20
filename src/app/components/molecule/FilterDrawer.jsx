"use client";
import { useState, useEffect } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import FilterSelectItem from "@/app/components/atom/FilterSelectItem";
export default function FilterDrawer({
  data,
  onFilterItemChange,
  multiSelect = true,
}) {
  const [options, setOptions] = useState([]);
  useEffect(() => {
    setOptions(data?.options);
  }, [data]);
  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    // console.log("triggered from drawer");
    setOptions((prev) => {
      // console.log(`${value}: ${checked}`);
      if (!multiSelect) {
        return prev.map((i) => ({
          ...i,
          is_checked: i.prop === value ? checked : false,
        }));
      } else {
        return prev.map((i) => ({
          ...i,
          is_checked: i.prop === value ? checked : i.is_checked,
        }));
      }
    });
    onFilterItemChange(e);
  };

  return (
    <Disclosure as="div" className="px-[15px]">
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
          <span className="font-medium text-gray-900">
            {data?.label}{" "}
            {["fuel type"].includes(data?.label.toLowerCase()) ? (
              <span className="text-[10px] uppercase">Soon</span>
            ) : (
              <></>
            )}
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
          {options.map((option, optionIdx) => (
            <FilterSelectItem
              key={`drawer-option-${option?.prop}-${optionIdx}`}
              data={option}
              onChange={handleFilterChange}
            />
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
