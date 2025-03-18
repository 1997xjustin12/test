"use client";
import { useState, useEffect } from "react";
import { createSlug, findParentByUrl } from "@/app/lib/helpers";
import {
  Disclosure,
  DisclosureButton,
  Dialog,
  DialogPanel,
  DialogBackdrop,
} from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
// icon
import { Icon } from "@iconify/react/dist/iconify.js";
import { HeartIcon, MingcuteHome7 } from "@/app/components/icons/lib";
// components
import HomeSearch from "@/app/components/search/HomeSearch";
import HomeSearchMobile from "@/app/components/search/HomeSearchMobile";
import CartButton from "@/app/components/atom/CartButton";
// data
import { solana_categories as cat_json } from "@/app/lib/category-helpers";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

export default function TuiNavbar({ logo, menu }) {
  const [navigation, setNavigation] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  // const [navigation, setMobileNavigation] = useState(null);

  const groupChildren = (children, size = 2) => {
    const grouped = [];
    for (let i = 0; i < children.length; i += size) {
      grouped.push(children.slice(i, i + size));
    }
    return grouped;
  };

  const addLinksProperty = (menu) => {
    return menu.map((item) => ({
      ...item,
      links: groupChildren(
        item.children || [],
        item.origin_name === "Brands" ? 8 : 2
      ), // Group children into pairs
      children: item.children ? addLinksProperty(item.children) : [], // Recursively process children
    }));
  };

  const [mobileMenuDialog, setMobileMenuDialog] = useState(false);
  const [selected, setSelected] = useState([]);
  const [overviewUrl, setOverviewUrl] = useState(null);
  const router = useRouter();
  const path = usePathname();

  const category_slug = cat_json.find((i) => "/" + i.menu.href === path)?.menu
    ?.href;

  const ParentSlug =
    category_slug ?? findParentByUrl(cat_json, path.replace(/\//g, ""))?.url;

  const redirectToHome = (e) => {
    router.push("/");
    setMobileMenuDialog(false);
  };

  const handleMenuLinkItemClick = (e) => {
    e.preventDefault();
    const url = e.target.closest("a").getAttribute("href");
    if (url) {
      router.push(url);
      setMobileMenuDialog(false);
    } else {
      alert("no url");
    }
  };

  const handleExpandOptionClick = (name) => {
    setSelected((prev) => [...prev, name]);
  };

  useEffect(() => {
    if (selected.length === 0) {
      setActiveMenu(navigation);
    } else if (selected.length === 1) {
      const filtered = navigation.find((i) => i.name === selected[0]);
      setActiveMenu(filtered.children);
      setOverviewUrl(filtered.url);
    } else if (selected.length === 2) {
      const filtered = navigation
        .find((i) => i.name === selected[0])
        .children.find((i) => i.name === selected[1]);
      setActiveMenu(filtered.children);
      setOverviewUrl(filtered.url);
    }
  }, [selected]);

  const handleMobileBackClick = (e) => {
    setSelected((prev) => {
      if (prev.length > 0) {
        return prev.slice(0, -1);
      }
    });
  };
  useEffect(() => {
    const injectedMenu = addLinksProperty(menu)
      .filter((i) => i.menu.visible === true)
      .sort((a, b) => a.menu.order - b.menu.order);
    setNavigation(injectedMenu);
    setActiveMenu(injectedMenu);
  }, [menu]);

  return (
    <>
      <div className="relative shadow">
        <Disclosure as="nav" className="bg-white z-[9999]">
          <div className="shadow border-b ">
            <div className="mx-auto container px-2 pt-[10px]">
              <div className="relative flex h-16 items-center justify-between">
                <div className="flex items-center lg:hidden">
                  {/* Mobile menu button*/}
                  <DisclosureButton
                    onClick={() => setMobileMenuDialog(true)}
                    className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:border-gray-700 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white "
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    <Bars3Icon aria-hidden="true" className="block size-6" />
                  </DisclosureButton>
                </div>
                <div className="flex items-center justify-center flex-1 sm:flex-initial sm:items-stretch sm:justify-start">
                  {/** flex-1 sm:items-stretch sm:justify-start */}
                  <div className="flex items-center relative w-[88px] aspect-2">
                    <div className="absolute top-0 left-0 md:left-[5px] w-[100px] xl:w-[200px]">
                      {
                        <Link href={BASE_URL}>
                          <Image
                            alt="Logo"
                            src={logo ?? "/Logo.webp"}
                            className="w-full h-full object-cover"
                            width={500}
                            height={500}
                            // loading="eager"
                            // priority={false}
                          />
                        </Link>
                      }
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block lg:w-[500px]">
                  <HomeSearch controlled_height={false} main={true} />
                </div>
                <div className="flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <ul className="flex space-x-4">
                    <li className="relative">
                      <CartButton className="text-gray-700 hover:text-theme-500" />
                    </li>
                    {/* <li className="relative">
                    <div className="absolute text-[7px] w-full text-white bg-stone-900 uppercase text-center top-[20%] z-[1]">
                      Soon
                    </div>
                    <a
                      href="#"
                      className="text-gray-700 hover:text-blue-500 relative">
                      <div className="absolute bg-theme-500 w-[20px] h-[20px] overflow-hidden rounded-full text-pallete-dark bottom-[60%] left-[60%] flex justify-center items-center">
                        <div className="text-[10px]">739</div>
                      </div>
                      <HeartIcon color="black" width="24" height="24" />
                    </a>
                  </li> */}
                  </ul>
                </div>
              </div>
            </div>
            <div className="hidden lg:block mx-auto container px-2 sm:px-6 lg:px-8 min-h-[35px]">
              <div className="flex items-center justify-center mt-[20px] sm:flex-wrap">
                <div className="flex sm:flex-wrap justify-center gap-y-4">
                  {navigation &&
                    navigation.map((i, index) => (
                      <div
                        key={`parent-nav-${index}`}
                        className={`group py-[5px] px-[10px] rounded-tl-md rounded-tr-md flex gap-[8px] items-center border-b hover:bg-theme-500 hover:text-white ${
                          i.menu.href === ParentSlug
                            ? "text-white bg-theme-400"
                            : "text-pallete-dark"
                        }`}
                      >
                        {/* <div className="text-white"><Icon icon={i.icon.name} /></div> */}
                        <Link
                          href={`${BASE_URL}/${i.menu.href}`}
                          prefetch={false}
                          className={`flex items-center gap-[8px] ${
                            i.menu.href === ParentSlug
                              ? "font-semibold"
                              : "font-normal"
                          }`}
                        >
                          {i.name.toLowerCase() === "home" && <MingcuteHome7 />}
                          {i.name.toLowerCase() !== "home" && (
                            <div
                              className={`text-xs ${
                                i.menu.href === ParentSlug
                                  ? "font-semibold"
                                  : "font-normal"
                              }`}
                            >
                              {i.name}
                            </div>
                          )}
                        </Link>
                        {i.links && i.links.length > 0 && (
                          <div className="bg-white absolute w-full left-0 top-[100%] z-[100] invisible group-hover:visible shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
                            <div className="container mx-auto py-5 px-[20px]">
                              <div className="flex justify-between">
                                <div className="w-full flex gap-[70px]">
                                  {i.links.map((i1, index1) => (
                                    <div
                                      key={`${i.menu.href}-col-${index1}`}
                                      className="flex flex-col gap-[20px] text-xs"
                                    >
                                      {i1.map((i2, index2) => (
                                        <div
                                          key={`${i.menu.href}-col-${index1}-content-${index2}`}
                                        >
                                          <Link
                                            prefetch={false}
                                            href={`${
                                              i2?.url
                                                ? BASE_URL + "/" + i2.url
                                                : "#"
                                            }`}
                                          >
                                            <div className="text-black font-bold mb-[10px] hover-text-theme-500 cursor-pointer">
                                              {i2.name}
                                            </div>
                                          </Link>
                                          <div className="flex flex-col gap-[5px]">
                                            {i.name.toLowerCase() == "brands"
                                              ? i2.children &&
                                                i2.children.length > 0 &&
                                                i2.children
                                                  .slice(0, 3)
                                                  .map((i3, index3) => (
                                                    <Link
                                                      prefetch={false}
                                                      href={`${
                                                        i3?.url
                                                          ? BASE_URL +
                                                            "/" +
                                                            i3.url
                                                          : "#"
                                                      }`}
                                                      key={`${i.menu.href}-col-${index}-content-${index2}-child-${index3}`}
                                                    >
                                                      <div className="text-black hover-text-theme-500 cursor-pointer">
                                                        {i3.name}
                                                      </div>
                                                    </Link>
                                                  ))
                                              : i2.children &&
                                                i2.children.length > 0 &&
                                                i2.children.map(
                                                  (i3, index3) => (
                                                    <Link
                                                      prefetch={false}
                                                      href={`${
                                                        i3?.url
                                                          ? BASE_URL +
                                                            "/" +
                                                            i3.url
                                                          : "#"
                                                      }`}
                                                      key={`${i.menu.href}-col-${index}-content-${index2}-child-${index3}`}
                                                    >
                                                      <div className="text-black hover-text-theme-500 cursor-pointer">
                                                        {i3.name}
                                                      </div>
                                                    </Link>
                                                  )
                                                )}
                                            <Link
                                              prefetch={false}
                                              href={`${
                                                i2?.url
                                                  ? BASE_URL + "/" + i2.url
                                                  : "#"
                                              }`}
                                            >
                                              <div className="text-black hover-text-theme-500 cursor-pointer flex gap-[10px] items-center">
                                                <Icon
                                                  icon="teenyicons:arrow-solid"
                                                  width="12"
                                                  height="12"
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
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:hidden">
            <HomeSearchMobile controlled_height={false} main={true} />
          </div>
        </Disclosure>
      </div>

      <Dialog
        open={mobileMenuDialog}
        onClose={setMobileMenuDialog}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in lg:hidden"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center text-center lg:items-center lg:p-0">
            <DialogPanel
              transition
              className="lg:hidden w-full h-screen relative transform overflow-hidden bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in lg:my-8 lg:w-full lg:max-w-lg data-[closed]:lg:translate-y-0 data-[closed]:lg:scale-95 overflow-y-auto pb-[30px]"
            >
              <div className="">
                <div className="bg-slate-800 flex justify-between p-[10px]">
                  <button
                    className="flex items-center gap-[8px] p-1 rounded bg-stone-300"
                    onClick={() => setMobileMenuDialog(false)}
                  >
                    <Icon
                      icon="qlementine-icons:close-16"
                      width="32"
                      height="32"
                    />
                  </button>
                  <Link
                    prefetch={false}
                    href={`${BASE_URL}`}
                    className="flex bg-stone-300 rounded gap-[8px] items-center p-1"
                    onClick={() => redirectToHome()}
                  >
                    <Icon icon="tabler:home-up" width="24" height="24" />
                    <div>Home</div>
                  </Link>
                </div>
                {selected && selected.length > 0 && (
                  <div className="p-[10px] bg-stone-300 flex justify-between">
                    <div
                      className="flex items-center"
                      onClick={handleMobileBackClick}
                    >
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
                          prefetch={false}
                          href={overviewUrl}
                          onClick={handleMenuLinkItemClick}
                        >
                          {selected[selected.length - 1]}
                        </Link>
                      )}
                    </div>
                  </div>
                )}
                <div className="">
                  {activeMenu &&
                    activeMenu.map((i, index) => (
                      <div
                        key={`menu-${createSlug(i.name)}`}
                        className="border-b p-[10px]"
                      >
                        {i.children && i.children.length > 0 ? (
                          <div
                            onClick={() => handleExpandOptionClick(i.name)}
                            className=" flex justify-between items-center"
                          >
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
                            prefetch={false}
                            href={`${BASE_URL}/${i?.url}`}
                            onClick={handleMenuLinkItemClick}
                            className=" flex justify-between items-center"
                          >
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
