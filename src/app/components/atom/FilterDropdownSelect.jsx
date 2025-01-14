"use client";
import { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import FilterSelectItem from "@/app/components/atom/FilterSelectItem";
export default function FilterDropdownSelect({
  data,
  onFilterItemChange,
  multiSelect = true,
}) {
  const [options, setOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setOptions(data?.options);
  }, [data]);
  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    console.log("triggered from dropdown");
    setOptions((prev) => {
      console.log(`${value}: ${checked}`);
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
    <div className="flex items-center gap-[5px] px-[7px] py-[3px] border-[2px] cursor-pointer rounded-md border-stone-200 hover:border-orange-200 transition-colors duration-300 group">
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => (
          <>
            <MenuButton
              onClick={() => setIsOpen(open ? false : true)}
              className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
              {data?.label}
              {/* {`${data.find(({ current }) => current === true).name}`} */}
              {/* <ChevronDownIcon
              aria-hidden="true"
              className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
            /> */}
            </MenuButton>
            {isOpen && (
              <MenuItems
                static
                className="absolute left-0 z-10 mt-2 w-[250px] origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                <div className="py-1">
                  {data &&
                    data?.options &&
                    data.options.map((option) => (
                      <MenuItem key={`menu-item-${data.prop}-${option.prop}`}>
                        <div
                          className={`${
                            (option.is_checked
                              ? "font-medium text-gray-900"
                              : "text-gray-500",
                            "block px-4 py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:outline-none cursor-default")
                          }`}>
                          <FilterSelectItem
                            data={option}
                            onChange={handleFilterChange}
                          />
                        </div>
                      </MenuItem>
                    ))}
                </div>
              </MenuItems>
            )}
          </>
        )}
      </Menu>

      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-[1]" />
      )}
    </div>
  );
}
