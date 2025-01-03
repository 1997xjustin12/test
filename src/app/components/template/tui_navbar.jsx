"use client";
import { useState, useEffect } from "react";
import { getFirstPathSegment } from "@/app/lib/helpers";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Dialog,
  DialogPanel,
  DialogBackdrop,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

// icon
import { Icon } from "@iconify/react/dist/iconify.js";
// components
import HomeSearch from "../search/HomeSearch";
// data
import cat_json from "../../data/category.json";

const navigation = cat_json
  .filter((i) => i.menu.visible === true)
  .sort((a, b) => a.menu.order - b.menu.order);

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

export default function TuiNavbar() {
  const [mobileMenuDialog, setMobileMenuDialog] = useState(false);
  const path = usePathname();
  const category_slug = cat_json.find((i) => "/" + i.menu.href === path)?.menu
    ?.href;
  return (
    <>
      <div className="relative">
        <Disclosure as="nav" className="bg-white z-[9999]">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:border-gray-700 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon
                    aria-hidden="true"
                    className="block size-6 group-data-[open]:hidden"
                  />
                  <XMarkIcon
                    aria-hidden="true"
                    className="hidden size-6 group-data-[open]:block"
                  />
                </DisclosureButton>
              </div>
              <div className="flex items-center justify-center flex-1 sm:flex-initial sm:items-stretch sm:justify-start">
                {" "}
                {/** flex-1 sm:items-stretch sm:justify-start */}
                <div className="flex shrink-0 items-center">
                  <img
                    alt="Bull Fireplace"
                    src="/Logo.webp"
                    className="h-8 w-auto"
                  />
                </div>
              </div>
              <div className="hidden sm:block sm:w-[300px] md:w-[500px]">
                <HomeSearch />
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <ul className="flex space-x-4">
                  <li>
                    <a
                      href="#home"
                      className="text-gray-700 hover:text-blue-500 relative">
                      <div className="absolute bg-pallete-orange w-[20px] h-[20px] overflow-hidden rounded-full text-pallete-dark bottom-[60%] left-[60%] flex justify-center items-center">
                        <div className="text-[10px]">26</div>
                      </div>
                      <Icon icon="bx:cart" width="24" height="24" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#about"
                      className="text-gray-700 hover:text-blue-500 relative">
                      <div className="absolute bg-pallete-orange w-[20px] h-[20px] overflow-hidden rounded-full text-pallete-dark bottom-[60%] left-[60%] flex justify-center items-center">
                        <div className="text-[10px]">739</div>
                      </div>
                      <Icon icon="bx:heart" width="24" height="24" />
                    </a>
                  </li>
                </ul>
                {/* <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>

            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  >
                    Your Profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  >
                    Settings
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  >
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu> */}
              </div>
            </div>
          </div>
          <div className="hidden sm:block mx-auto container px-2 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center mt-[20px] sm:flex-wrap">
              <div className="flex sm:flex-wrap justify-center gap-y-4">
                {navigation.map((i, index) => (
                  <div
                    key={`parent-nav-${index}`}
                    className={`group py-[5px] px-[15px] rounded-tl-md rounded-tr-md flex gap-[8px] items-center border-b ${
                      i.menu.href === category_slug
                        ? "text-white bg-pallete-orange"
                        : "text-pallete-dark"
                    }`}>
                    {/* <div className="text-white"><Icon icon={i.icon.name} /></div> */}
                    <Link
                      href={`${BASE_URL}/${i.menu.href}`}
                      className={`${
                        i.menu.href === category_slug
                          ? "font-semibold"
                          : "font-normal"
                      }`}>
                      {i.name}
                    </Link>
                    {i.links && i.links.length > 0 && (
                      <div className="bg-white absolute w-full left-0 top-[100%] z-[999] invisible group-hover:visible">
                        <div className="container mx-auto py-5">
                          <div className="flex justify-between">
                            <div className="w-full flex gap-[70px]">
                              {i.links.map((i1, index1) => (
                                <div
                                  key={`${i.menu.href}-col-${index1}`}
                                  className="flex flex-col gap-[20px]">
                                  {i1.map((i2, index2) => (
                                    <div
                                      key={`${i.menu.href}-col-${index1}-content-${index2}`}>
                                      <Link
                                        href={`${
                                          i2?.url
                                            ? BASE_URL + "/" + i2.url
                                            : "#"
                                        }`}>
                                        <div className="text-black font-bold mb-[10px] hover-text-pallete-orange cursor-pointer">
                                          {i2.name}
                                        </div>
                                      </Link>
                                      <div className="flex flex-col gap-[5px]">
                                        {i2.children &&
                                          i2.children.length > 0 &&
                                          i2.children.map((i3, index3) => (
                                            <Link
                                              href={`${
                                                i3?.url
                                                  ? BASE_URL + "/" + i3.url
                                                  : "#"
                                              }`}
                                              key={`${i.menu.href}-col-${index}-content-${index2}-child-${index3}`}>
                                              <div className="text-black hover-text-pallete-orange cursor-pointer">
                                                {i3.name}
                                              </div>
                                            </Link>
                                          ))}
                                        <Link
                                          href={`${
                                            i2?.url
                                              ? BASE_URL + "/" + i2.url
                                              : "#"
                                          }`}>
                                          <div className="text-black hover-text-pallete-orange cursor-pointer flex gap-[10px] items-center">
                                            <Icon
                                              icon="teenyicons:arrow-solid"
                                              width="16"
                                              height="16"
                                            />
                                            <div>Shop All</div>
                                          </div>
                                        </Link>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                            <div className="">extras</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* <div className="sm:flex sm:justify-center sm:w-full xl:w-auto sm:mt-4 xl:mt-0">
              <div className="cursor-pointer font-semibold  flex">
                <div>
                  <Link href="/auth/signin">SignIn</Link>
                </div>
                <div className="border-l pl-[10px] ml-[10px] border-stone-900">
                  <Link href="/auth/signup">SignUp</Link>
                </div>
              </div>
            </div> */}
            </div>
          </div>
          {/* <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={`${BASE_URL}/${item.menu.href}`}
                aria-current={
                  item.menu.href === category_slug ? "page" : undefined
                }
                className={classNames(
                  item.menu.href === category_slug
                    ? "bg-pallete-orange text-white"
                    : "text-gray-800 hover:bg-gray-600 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}>
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel> */}
        </Disclosure>
      </div>

      <Dialog
        open={mobileMenuDialog}
        onClose={setMobileMenuDialog}
        className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center md:p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="w-full h-screen relative transform overflow-hidden bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
              <div className="">
                <div className="flex justify-between p-[10px]">
                  <button>
                    <Icon
                      icon="qlementine-icons:close-16"
                      width="16"
                      height="16"
                    />
                    <div>CLOSE</div>
                  </button>
                  <Link href={`${BASE_URL}`}>HOME</Link>
                </div>
                <div>move up button label and link</div>
                <div>Navigation section</div>
                <div>other contents</div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
