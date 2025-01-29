"use client";
import { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { MingcuteDownLine } from "@/app/components/icons/lib";
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
    setOptions((prev) => {
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
    <div className="shadow-sm flex items-center ">
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => (
          <>
            <MenuButton
              onClick={() => setIsOpen(open ? false : true)}
              className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 items-center select-none gap-[5px] px-[7px] py-[3px] border-[0.5px] rounded-md border-stone-400 hover:border-orange-200 transition-colors duration-300">
              <div>{data?.label}</div>
              <div>
                <MingcuteDownLine width={16} height={16} />
              </div>
            </MenuButton>
            {isOpen && (
              <MenuItems
                static
                className="absolute left-0 z-10 mt-2 w-[250px]  origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                <div className="py-1">
                  {data &&
                    data?.options &&
                    data.options.map((option) => (
                      <MenuItem
                        className="px-[0px]"
                        key={`menu-item-${data.prop}-${option.prop}`}>
                        <div
                          className={`${
                            (option.is_checked
                              ? "font-medium text-gray-900"
                              : "text-gray-500",
                            "block px-[0px] py-2 text-sm data-[focus]:bg-gray-100 data-[focus]:outline-none cursor-default")
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
