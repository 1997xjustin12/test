"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { createSlug, findParentByUrl } from "@/app/lib/helpers";
import { useOutsideClick } from "@/app/lib/outsideClick";
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
import MyAccountButton from "@/app/components/atom/MyAccountButton";
// data
import { useSolanaCategories } from "@/app/context/category";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
const excludeBrandsSubLinks = [
  "Cedar Creek Fireplaces",
  "Delsol",
  "Dynaque",
  "Handles",
  "Onlyfire",
  "OutdoorKitchenOutlet",
  "Premier Design",
  "Sedona",
  "Solana Outdoor",
  "Solana Outdoor Products",
];
export default function TuiNavbar({ logo, menu }) {
  const { solana_categories: solana_menu_object } = useSolanaCategories();
  // console.log("solana_menu_object",solana_menu_object)
  const [navigation, setNavigation] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [expandedMenu, setExpandedMenu] = useState(null);

  // menu dropdown
  const closeDropdown = useCallback((e) => {
    setExpandedMenu(null);
  }, []);
  const triggerRef = useRef(null);
  const dropdownRef = useOutsideClick(closeDropdown, [triggerRef]);

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

  const category_slug = solana_menu_object.find(
    (i) => "/" + i.url === path
  )?.url;

  const ParentSlug =
    category_slug ??
    findParentByUrl(solana_menu_object, path.replace(/\//g, ""))?.url;

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

  const handleExpandMenu = (menu_item) => {
    if (menu_item?.name === "Home") {
      window.location.href = BASE_URL;
      return;
    }

    if (["New Arrivals"].includes(menu_item?.name)) {
      window.location.href = BASE_URL + `/${menu_item?.url}`;
      return;
    }

    if(menu_item?.name === "Current Deals"){
      window.location.href = `${BASE_URL}/brand/eloquence`;
      return;
    }

    setExpandedMenu((prev) => {
      if (menu_item && menu_item?.name === "Brands") {
        const groups = Array.from({ length: 5 }, () => []);
        menu_item.children
          .filter((i) => !excludeBrandsSubLinks.includes(i?.name))
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach((item, i) => groups[i % 5].push(item));
        menu_item["links2"] = groups;
        // console.log("[TEST] links2 for brands", groups);
      }

      if (!prev) return menu_item;

      if (prev?.name === menu_item?.name) return null;

      if (prev?.name !== menu_item?.name) {
        return menu_item;
      }
    });
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

  const handleLinkClick = (e) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (href) {
      window.location.href = href;
    }
  };

  useEffect(() => {
    // console.log("[TEST MENU] menu", menu);
    const injectedMenu = addLinksProperty(menu)
      .filter((i) => i?.nav_visibility === true)
      .filter((i) => i?.name !== "Brands")
      .sort((a, b) => a?.order - b?.order);
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
                            // src={"/images/logo/solana-brand-logo.webp"}
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
                    <li className="relative">
                      <MyAccountButton className="text-gray-700 hover:text-theme-500" />
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
                <div
                  ref={triggerRef}
                  className="flex sm:flex-wrap justify-center gap-y-4"
                >
                  {navigation &&
                    navigation.map((i, index) => (
                      <div
                        key={`parent-nav-${index}`}
                        className={`group py-[5px] px-[10px] rounded-tl-md rounded-tr-md flex gap-[8px] items-center ${
                          i.url === ParentSlug ? "bg-theme-600 text-white" : ""
                        }
                        ${i.url === expandedMenu?.url ? "bg-white" : ""}`}
                      >
                        <button
                          className={`flex items-center gap-[8px] ${
                            i.url === ParentSlug
                              ? "font-semibold"
                              : "font-semibold"
                          }`}
                          onClick={() => handleExpandMenu(i)}
                        >
                          {i.name.toLowerCase() === "home" && <MingcuteHome7 />}
                          {i.name.toLowerCase() !== "home" && (
                            <div
                              className={`text-xs flex items-center gap-[20px]${
                                i.url === ParentSlug
                                  ? "font-semibold  text-white"
                                  : "font-semibold text-neutral-800"
                              } 
                        ${
                          i.url === expandedMenu?.url && i.url !== ParentSlug
                            ? "text-theme-700"
                            : ""
                        }
                        `}
                            >
                              <div>{i.name}</div>
                              {i?.children?.length > 0 && (
                                <>
                                  {expandedMenu?.name !== i?.name ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="m7 10l5 5l5-5z"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="m7 15l5-5l5 5z"
                                      />
                                    </svg>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="relative z-[100] border-t">
              {expandedMenu && (
                <div
                  ref={dropdownRef}
                  className="absolute left-0 w-[100%] top-0 shadow-lg bg-white"
                >
                  <div className="container mx-auto p-2 flex flex-col gap-[10px]">
                    {expandedMenu?.url && expandedMenu?.name && (
                      <div>
                        <Link
                          prefetch={false}
                          href={`${BASE_URL}/${expandedMenu?.url}`}
                          onClick={handleLinkClick}
                          className="text-lg font-semibold text-neutral-700 underline inline-flex gap-[8px] items-center hover:text-theme-800 focus:text-theme-800"
                        >
                          <span>{expandedMenu?.name}</span>
                        </Link>
                      </div>
                    )}
                    {expandedMenu?.feat_nav &&
                      Array.isArray(expandedMenu?.feat_nav) &&
                      expandedMenu?.feat_nav.length > 0 && (
                        <div className="flex justify-evenly py-[10px]">
                          {expandedMenu.feat_nav.map((fnav, index) => (
                            <Link
                              prefetch={false}
                              href={`${BASE_URL}/${fnav?.url}`}
                              onClick={handleLinkClick}
                              key={`feat-nav-${fnav?.menu_id}`}
                              className="flex flex-col gap-[15px]"
                            >
                              <div className="w-[200px] aspect-1 bg-white relative">
                                {fnav?.feature_image && fnav.feature_image && (
                                  <Image
                                    src={fnav?.feature_image}
                                    alt={`feat-nav-image-${index}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 300px"
                                  />
                                )}
                              </div>
                              <div className="text-center px-2 text-sm font-semibold">
                                {fnav?.name}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    {expandedMenu?.links &&
                      Array.isArray(expandedMenu.links) &&
                      expandedMenu.links.length > 0 &&
                      expandedMenu?.name !== "Brands" && (
                        <>
                          <hr className="border-gray-300" />
                          <div className="flex justify-between">
                            {expandedMenu.links.map((col, index) => (
                              <div key={`sublink-col-${index}`}>
                                {col.map((sublink) => (
                                  <div
                                    className="py-3"
                                    key={`sublink-col-${index}-${sublink?.url}`}
                                  >
                                    <Link
                                      prefetch={false}
                                      href={`${BASE_URL}/${sublink?.url}`}
                                      onClick={handleLinkClick}
                                      className={`text-base font-semibold text-neutral-800 hover:underline hover:text-theme-800 ${
                                        (sublink?.nav_type === "custom_page" && !sublink?.collection_display)
                                          ? "line-through"
                                          : ""
                                      }`}
                                    >
                                      {sublink?.name}
                                    </Link>
                                    {sublink?.children &&
                                      Array.isArray(sublink?.children) &&
                                      sublink?.children.length > 0 && (
                                        <div className="flex flex-col gap-[5px]">
                                          {sublink.children.map((child) => (
                                            <Link
                                              prefetch={false}
                                              onClick={handleLinkClick}
                                              href={`${BASE_URL}/${child?.url}`}
                                              className={`text-sm font-normal  text-neutral-800 hover:underline hover:text-theme-800 ${
                                                child?.nav_type ===
                                                "custom_page"
                                                  ? "line-through"
                                                  : ""
                                              }`}
                                              key={`sublink-col-${index}-${sublink?.slug}-${child?.slug}`}
                                            >
                                              {child?.name}
                                            </Link>
                                          ))}
                                        </div>
                                      )}
                                  </div>
                                ))}
                              </div>
                            ))}

                            {expandedMenu?.links &&
                              Array.isArray(expandedMenu.links) &&
                              Array.from({
                                length: 6 - expandedMenu?.links.length,
                              }).map((_, index) => (
                                <div key={`empty-div${index}`} />
                              ))}
                          </div>
                        </>
                      )}
                    {/*  brands only */}
                    {expandedMenu?.links2 &&
                      Array.isArray(expandedMenu.links2) &&
                      expandedMenu.links2.length > 0 &&
                      expandedMenu?.name === "Brands" && (
                        <>
                          <hr className="border-gray-300" />
                          <div className="flex justify-between">
                            {expandedMenu?.links2?.map((col, index) => (
                              <div key={`sublink-col-${index}`}>
                                {col.map((sublink) => (
                                  <div
                                    className="py-3"
                                    key={`sublink-col-${index}-${sublink?.slug}`}
                                  >
                                    <Link
                                      prefetch={false}
                                      href={`${BASE_URL}/${sublink?.url}`}
                                      onClick={handleLinkClick}
                                      className="text-base font-semibold text-neutral-800 hover:underline hover:text-theme-800"
                                    >
                                      {sublink?.name}
                                    </Link>
                                    {sublink?.children &&
                                      Array.isArray(sublink?.children) &&
                                      sublink?.children.length > 0 && (
                                        <div className="flex flex-col gap-[5px]">
                                          {sublink.children.map((child) => (
                                            <Link
                                              prefetch={false}
                                              onClick={handleLinkClick}
                                              href={`${BASE_URL}/${child?.url}`}
                                              className={`text-sm font-normal  text-neutral-800 hover:underline hover:text-theme-800 ${
                                                child?.nav_type ===
                                                "custom_page"
                                                  ? "line-through"
                                                  : ""
                                              }`}
                                              key={`sublink-col-${index}-${sublink?.slug}-${child?.slug}`}
                                            >
                                              {child?.name}
                                            </Link>
                                          ))}
                                        </div>
                                      )}
                                  </div>
                                ))}
                                {index === 4 && (
                                  <div className="py-3">
                                    <Link
                                      prefetch={false}
                                      href={`${BASE_URL}/brands`}
                                      onClick={handleLinkClick}
                                      className="text-base font-semibold text-neutral-800 hover:underline hover:text-theme-800 line-through"
                                    >
                                      Shop All Brands
                                    </Link>
                                  </div>
                                )}
                              </div>
                            ))}

                            {expandedMenu?.links &&
                              Array.isArray(expandedMenu.links) &&
                              Array.from({
                                length: 6 - expandedMenu?.links.length,
                              }).map((_, index) => (
                                <div key={`empty-div${index}`} />
                              ))}
                          </div>
                        </>
                      )}
                  </div>
                </div>
              )}
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
