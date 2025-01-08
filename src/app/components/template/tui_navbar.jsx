"use client";
import { useState, useEffect } from "react";
import { createSlug } from "@/app/lib/helpers";
import PageLoader from "../atom/PageLoader";
import {
  Disclosure,
  DisclosureButton,
  Dialog,
  DialogPanel,
  DialogBackdrop,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  usePathname,
  //  useSearchParams,
  useRouter,
} from "next/navigation";
// icon
import { Icon } from "@iconify/react/dist/iconify.js";
// components
import HomeSearch from "../search/HomeSearch";
// data
import { solana_categories as cat_json } from "@/app/lib/category-helpers";

const navigation = cat_json
  .filter((i) => i.menu.visible === true)
  .sort((a, b) => a.menu.order - b.menu.order);

const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
const mobile_navigation = cat_json
  .filter((i) => i.menu.visible === true)
  .sort((a, b) => a.menu.order - b.menu.order)
  .map((i) => ({
    name: i.name,
    url: i.menu.href,
    children: i.links.flatMap((i2) => i2),
  }));

export default function TuiNavbar() {
  const [mobileMenuDialog, setMobileMenuDialog] = useState(false);
  const [activeMenu, setActiveMenu] = useState(mobile_navigation);
  const [selected, setSelected] = useState([]);
  const [overviewUrl, setOverviewUrl] = useState(null);
  const router = useRouter();
  const path = usePathname();
  // const searchParams = useSearchParams();
  const category_slug = cat_json.find((i) => "/" + i.menu.href === path)?.menu
    ?.href;
  // const [prevPath, setPrevPath] = useState(`${path}?${searchParams}`);
  // useEffect(() => {
  //   const url = `${path}?${searchParams}`;
  //   setPrevPath((prev) => {
  //     if (prev !== url) {
  //       console.log("trigger loading and close menu and modal");
  //       setMobileMenuDialog((prev) => false);
  //     }
  //     return url;
  //   });
  // }, [path, searchParams]);

  const redirectToHome = (e) => {
    router.push("/");
    // setMobileMenuDialog(false);
  };

  const handleMenuLinkItemClick = (e) => {
    e.preventDefault();
    const url = e.target.closest("a").getAttribute("href");
    console.log(url);
    if (url) {
      router.push(url);
    } else {
      alert("no url");
    }
  };

  const handleExpandOptionClick = (name) => {
    setSelected((prev) => [...prev, name]);
  };

  useEffect(() => {
    if (selected.length === 0) {
      setActiveMenu(mobile_navigation);
    } else if (selected.length === 1) {
      const filtered = mobile_navigation.find((i) => i.name === selected[0]);
      setActiveMenu(filtered.children);
      setOverviewUrl(filtered.url);
    } else if (selected.length === 2) {
      const filtered = mobile_navigation
        .find((i) => i.name === selected[0])
        .children.find((i) => i.name === selected[1]);
      setActiveMenu(filtered.children);
      setOverviewUrl(filtered.url);
    }
    console.log("selected", selected);
  }, [selected]);

  const handleMobileBackClick = (e) => {
    setSelected((prev) => {
      if (prev.length > 0) {
        return prev.slice(0, -1);
      }
    });
  };
  return (
    <>
      <div className="relative">
        <Disclosure as="nav" className="bg-white z-[9999]">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <DisclosureButton
                  onClick={() => setMobileMenuDialog(true)}
                  className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:border-gray-700 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block size-6" />
                </DisclosureButton>
              </div>
              <div className="flex items-center justify-center flex-1 sm:flex-initial sm:items-stretch sm:justify-start">
                {/** flex-1 sm:items-stretch sm:justify-start */}
                <div className="flex shrink-0 items-center">
                  <img
                    alt="Bull Fireplace"
                    src="/Logo.webp"
                    className="h-[60px] w-auto"
                  />
                </div>
              </div>
              <div className="hidden sm:block sm:w-[300px] md:w-[500px]">
                <HomeSearch />
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <ul className="flex space-x-4">
                  <li className="relative">
                    <div className="absolute text-[7px] w-full text-white bg-stone-900 uppercase text-center top-[20%] z-[1]">
                      Soon
                    </div>
                    <a
                      href="#"
                      className="text-gray-700 hover:text-blue-500 relative">
                      <div className="absolute bg-pallete-orange w-[20px] h-[20px] overflow-hidden rounded-full text-pallete-dark bottom-[60%] left-[60%] flex justify-center items-center">
                        <div className="text-[10px]">26</div>
                      </div>
                      <Icon icon="bx:cart" width="24" height="24" />
                    </a>
                  </li>
                  <li className="relative">
                    <div className="absolute text-[7px] w-full text-white bg-stone-900 uppercase text-center top-[20%] z-[1]">
                      Soon
                    </div>
                    <a
                      href="#"
                      className="text-gray-700 hover:text-blue-500 relative">
                      <div className="absolute bg-pallete-orange w-[20px] h-[20px] overflow-hidden rounded-full text-pallete-dark bottom-[60%] left-[60%] flex justify-center items-center">
                        <div className="text-[10px]">739</div>
                      </div>
                      <Icon icon="bx:heart" width="24" height="24" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="hidden sm:block mx-auto container px-2 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center mt-[20px] sm:flex-wrap">
              <div className="flex sm:flex-wrap justify-center gap-y-4">
                {navigation.map((i, index) => (
                  <div
                    key={`parent-nav-${index}`}
                    className={`group py-[5px] px-[15px] rounded-tl-md rounded-tr-md flex gap-[8px] items-center border-b hover:bg-orange-400 hover:text-white ${
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
                      <div className="bg-white absolute w-full left-0 top-[100%] z-[100] invisible group-hover:visible">
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
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in md:hidden"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center md:p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className=" md:hidden w-full h-screen relative transform overflow-hidden bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 overflow-y-auto pb-[30px]">
              <div className="">
                <div className="bg-slate-800 flex justify-between p-[10px]">
                  <button
                    className="flex items-center gap-[8px] p-1 rounded bg-stone-300"
                    onClick={() => setMobileMenuDialog(false)}>
                    <Icon
                      icon="qlementine-icons:close-16"
                      width="32"
                      height="32"
                    />
                  </button>
                  <Link
                    href={`${BASE_URL}`}
                    className="flex bg-stone-300 rounded gap-[8px] items-center p-1"
                    onClick={() => redirectToHome()}>
                    <Icon icon="tabler:home-up" width="24" height="24" />
                    <div>Home</div>
                  </Link>
                </div>
                {selected && selected.length > 0 && (
                  <div className="p-[10px] bg-stone-300 flex justify-between">
                    <div
                      className="flex items-center"
                      onClick={handleMobileBackClick}>
                      <Icon icon="famicons:arrow-back" width="20" height="20" />
                      <div>
                        {selected.length === 1
                          ? "Menu"
                          : selected[selected.length - 2]}
                      </div>
                    </div>
                    <div>
                      {overviewUrl && (
                        <Link
                          href={overviewUrl}
                          onClick={handleMenuLinkItemClick}>
                          {selected[selected.length - 1]}
                        </Link>
                      )}
                    </div>
                  </div>
                )}
                <div className="">
                  {activeMenu.map((i, index) => (
                    <div
                      key={`menu-${createSlug(i.name)}`}
                      className="border-b p-[10px]">
                      {i.children && i.children.length > 0 ? (
                        <div
                          onClick={() => handleExpandOptionClick(i.name)}
                          className=" flex justify-between items-center">
                          <div>{i.name}</div>
                          <div className="">
                            <Icon
                              icon="ic:round-navigate-next"
                              width="24"
                              height="24"
                            />
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={`${BASE_URL}/${i?.url}`}
                          onClick={handleMenuLinkItemClick}
                          className=" flex justify-between items-center">
                          <div>{i.name}</div>
                          <div className="">
                            <Icon
                              icon="ion:open-outline"
                              width="24"
                              height="24"
                            />
                          </div>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex h-[120px] items-center justify-center">
                  <div className="text-stone-500 font-semibold">
                    OTHER CONTENTS
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
