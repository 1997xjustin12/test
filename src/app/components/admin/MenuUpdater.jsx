"use client";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import CardWrap from "@/app/components/admin/CardWrap";
import Button from "@/app/components/admin/Button";
import { bc_categories, solana_categories } from "@/app/lib/category-helpers";
import MenuItem from "@/app/components/admin/MenuUpdaterBuilderItem";
import MenuCreate from "@/app/components/admin/MenuUpdaterCreate";
import { generateId } from "@/app/lib/helpers";
import { keys, redisGet, redisSet } from "@/app/lib/redis";

const menuListKey = keys.menu_lists.value;
const activeMenuKey = keys.active_menu.value;
const defaultMenuKey = keys.default_menu.value;
const origin_menu = bc_categories
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((i) => ({ ...i, selected: false }));
// console.log("origin_menu", origin_menu);

function MenuUpdater() {
  const [menu, setMenu] = useState([]);
  const [originMenu, setOriginMenu] = useState(origin_menu);
  const [originMenuSearch, setOriginMenuSearch] = useState("");
  const [toggleCreateMenu, setToggleCreateMenu] = useState(false);
  const [menuList, setMenuList] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const [scrollToSearch, setScrollToSearch] = useState("");
  const [searchList, setSearchList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [alertToggle, setAlertToggle] = useState(false);
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const showAlertMessage = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertToggle(true);
    setTimeout(() => {
      setAlertToggle(false);
      setAlertType(null);
      setAlertMessage("");
    }, 5000);
  };

  const updateMenuList = () => {
    const queryKeys = [menuListKey, activeMenuKey];
    redisGet(queryKeys).then((data) => {
      const [menu_list, active_menu] = data;
      setMenuList(menu_list);
      setActiveMenu(active_menu);
      const selected_menu = active_menu ?? menu_list?.[0]?.key;
      setSelectedMenu(selected_menu);
    });
  };

  const handleInputChange = (element, event) => {
    const { value } = event.target;
    if (element === "originMenuSearch") {
      setOriginMenuSearch(value);
      // filter origin menu
      setOriginMenu(
        origin_menu.filter(
          (i) =>
            i.name.toLowerCase().includes(value) || i?.url?.path.includes(value)
        )
      );
    }

    if (element === "scrollToSearch") {
      setScrollToSearch(value);
    }
  };

  const handleOriginMenuCheckbox = (e) => {
    const { value, checked } = e.target;
    setOriginMenu((prev) => {
      return prev.map((i) => ({
        ...i,
        selected:
          parseInt(value) === parseInt(i.category_id) ? checked : i.selected,
      }));
    });
  };

  const highlightText = (text, query) => {
    if (!text) return;
    if (!query) return text;
    // Escape special characters in query
    const safeQuery = query.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`(${safeQuery})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === safeQuery.toLowerCase() ? (
        <span key={index} className="bg-yellow-300 text-black px-1">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleAddMenuItem = () => {
    const selected = originMenu.filter((i) => i.selected);
    // need to format object from here
    const mapped = selected.map((i) => ({
      category_id: i.category_id,
      menu_id: generateId(),
      parent_id: "",
      name: i.name,
      url: i.url.path,
      origin_name: i.name,
      origin_url: i.url.path,
      children: [],
      path: i.url.path,
      key_words: [i.url.path],
      // content
      banner: {
        img: {
          src: null,
          alt: "",
        },
        title: "",
        tag_line: "",
      },
      page_contact_number: null,
      searchable: true,
    })); // inject properties
    setMenu((prev) => {
      const newValue = [...prev, ...mapped];
      newValue.forEach((item, index) => {
        item.order = index + 1; // Assign order starting from 1
      });
      return newValue;
    });
    setOriginMenu((prev) => prev.map((i) => ({ ...i, selected: false })));
  };

  const removeMenuItem = (menu, menu_id) => {
    return menu
      .map((parent) => {
        // Recursively filter children
        if (parent.children && parent.children.length) {
          parent.children = removeMenuItem(parent.children, menu_id);
        }
        // Remove if parent itself is the target
        return parent.menu_id !== menu_id ? parent : null;
      })
      .filter(Boolean); // Remove null values (deleted parents)
  };

  const flattenMenu = (menu) => {
    let result = [];

    const flatten = (items) => {
      for (const item of items) {
        result.push({ ...item }); // Store root & children
        if (item.children && item.children.length) {
          flatten(item.children); // Recursively flatten children
        }
      }
    };

    flatten(menu);
    return result;
  };

  const buildMenuTree = (menu) => {
    const menuMap = new Map();
    const tree = [];

    // Initialize map with each menu item and empty children array
    menu.forEach((item) => {
      menuMap.set(item.menu_id, { ...item, children: [] });
    });

    // Establish parent-child relationships
    menu.forEach((item) => {
      if (item.parent_id !== "") {
        const parent = menuMap.get(item.parent_id);
        if (parent) {
          parent.children.push(menuMap.get(item.menu_id));
        }
      } else {
        tree.push(menuMap.get(item.menu_id)); // Root-level items
      }
    });

    // Recursive function to assign order
    const assignOrder = (items) => {
      items.forEach((item, index) => {
        item.order = index + 1; // Assign order starting from 1
        if (item.children.length > 0) {
          assignOrder(item.children); // Recursively assign order to children
        }
      });
    };

    assignOrder(tree); // Start assigning order from the root level

    return tree;
  };

  const updateOrder = (items, menuId, newOrder) => {
    // Clone the array to avoid modifying the original
    let updatedItems = [...items];

    // Find the item being updated
    let updatedItem = updatedItems.find((item) => item.menu_id === menuId);
    if (!updatedItem) return items; // If not found, return unchanged array

    // Remove the updated item from the array
    updatedItems = updatedItems.filter((item) => item.menu_id !== menuId);

    // Insert the updated item at its new order position
    updatedItems.splice(newOrder - 1, 0, { ...updatedItem, order: newOrder });

    // Reassign order values sequentially
    return updatedItems.map((item, index) => ({ ...item, order: index + 1 }));
  };

  const updateChildren = (navTree, menuId, newChildren) => {
    return navTree.map((item) => {
      // If this item matches the menu_id, update its children
      if (item.menu_id === menuId) {
        return { ...item, children: newChildren };
      }

      // If the item has children, recursively update them
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: updateChildren(item.children, menuId, newChildren),
        };
      }

      return item;
    });
  };

  const handleCreateNewMenu = () => {
    if (menu.length === 0) {
      setToggleCreateMenu(true);
    } else {
      if (
        confirm(
          "This action will clear the menu builder together with any unsaved changes. Do you want to continue?"
        )
      ) {
        setToggleCreateMenu(true);
        setMenu([]);
      }
    }
  };

  const replaceMenuItem = (menuTree, menuId, newItem) => {
    return menuTree.map((item) => {
      if (item.menu_id === menuId) {
        return newItem;
      }

      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: replaceMenuItem(item.children, menuId, newItem),
        };
      }

      return item;
    });
  };

  const handleMenuItemChanges = (e) => {
    const { action, target } = e;
    // console.log("action:", action);
    // console.log("target:", target);

    if (action === "remove") {
      setMenu((prev) => removeMenuItem(prev, target));
    }

    if (action === "parentChange") {
      const { parent_id, item } = target;
      setMenu((prev) => {
        const flatMenu = flattenMenu(prev);
        const result = buildMenuTree(
          flatMenu.map((i) =>
            i.menu_id === item.menu_id
              ? { ...i, parent_id: parent_id }
              : { ...i }
          )
        );
        // console.log("buildMenuTree", result);
        return result;
      });
    }

    if (action === "orderChange") {
      const { order, item } = target;
      // console.log("triggerOrderChange");
      // updateOrder(items, menuId, newOrder)
      // get the parent first to use in menu params u
      if (item.parent_id !== "") {
        const siblings = flattenMenu(menu).filter(
          (i) => i.parent_id === item.parent_id
        );
        const newOrder = updateOrder(siblings, item.menu_id, order);
        // console.log("newOrderSiblings", newOrder);
        setMenu((prev) =>
          updateChildren(
            prev,
            item.parent_id,
            updateOrder(siblings, item.menu_id, order)
          )
        );
      } else {
        setMenu((prev) => updateOrder(prev, item.menu_id, order));
      }
    }

    if (action === "updateItem") {
      const { menu_id, item } = target;
      console.log("updateItemmenu_id", menu_id);
      console.log("updateItemitem", item);

      setMenu((prev) => {
        const updatedMenu = replaceMenuItem(prev, menu_id, item);
        console.log("newMenu", updatedMenu);
        return [...updatedMenu];
      });
    }
  };

  const handleNewMenuCreateSuccess = () => {
    // refetch menu list
    updateMenuList();
  };

  const handleSetActiveMenu = () => {
    // console.log("handleSetActiveMenu:selectedMenu:", selectedMenu);
    redisSet(activeMenuKey, selectedMenu).then((response) => {
      // console.log(`redisSetResponse`, response);
      if (response.success) {
        const active = menuList.find(({ key }) => key === selectedMenu);
        updateMenuList();
        alert(`${active.name} is now set as active menu.`);
      }
    });
  };

  const handleSelectMenuChange = (e) => {
    const { value } = e.target;
    // console.log("handleSelectMenuChange", value);
    setSelectedMenu(value);
  };

  const handleSaveMenuChanges = () => {
    // console.log("selectedMenu", selectedMenu)
    // console.log("SaveMenu", menu)
    setIsLoading(true);
    const search = solana_categories.find(({ name }) => name === "Search");
    // console.log("Append this search", search);
    const merged = [...menu, search];
    // console.log("merged", merged);
    redisSet(selectedMenu, merged)
      .then((response) => {
        // console.log("redisSet", response);
        if (response.success) {
          showAlertMessage("success", "Menu object updated successful.")
          // console.log("handleSaveMenuChangesFNSuccess", response);
        } else {
          showAlertMessage("error", "Failed to update. Please try again.")
          // console.log("handleSaveMenuChangesFNError", response);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        // console.log("error", "CATCH:Failed to update. Please try again.")
      });
  };

  // useEffect(() => {
  //   console.log("menu", menu);
  // }, [menu]);

  const tmpFnSetCatId = (i) => {
    const name = i?.name;
    switch (name) {
      case "Home":
      case "Search":
        return -1;
      default:
        return i.category_id;
    }
  };
  useEffect(() => {
    updateMenuList();

    redisGet(defaultMenuKey).then((data) => {
      setMenu(data.filter(({ name }) => name !== "Search"));
      setSearchList(flattenMenu(data.filter(({ name }) => name !== "Search")));
    });

    // this commented code displays menu from json file
    // const mappedSolanaCategories = solana_categories
    //   .filter((i) => i.name !== "Search")
    //   .map((i) => {
    //     const parent_menu_id = i.name === "Home" ? "home_page" : generateId();
    //     return {
    //       banner: i?.banner ?? {
    //         title: null,
    //         tag_line: null,
    //         description: null,
    //         contact: null,
    //         img: {
    //           src: null,
    //           alt: null,
    //         },
    //       },

    //       category_id: tmpFnSetCatId(i),
    //       menu_id: parent_menu_id,
    //       name: i.name,
    //       // order:
    //       origin_name: i?.name === "Home" ? "Home" : i?.name,
    //       origin_url: "",
    //       page_contact_number: null,
    //       parent_cat_id: i?.parent_id ?? "",
    //       parent_id: "",
    //       path: i?.path ?? "",
    //       url: i?.url,
    //       menu: i?.menu,
    //       children: i.children.map((i1) => {
    //         const child_menu_id = generateId();
    //         return {
    //           banner: i1?.banner ?? {
    //             title: null,
    //             tag_line: null,
    //             description: null,
    //             contact: null,
    //             img: {
    //               src: null,
    //               alt: null,
    //             },
    //           },

    //           category_id: tmpFnSetCatId(i1),
    //           menu_id: child_menu_id,
    //           name: i1.name,
    //           // order:
    //           origin_name: i1?.name === "Home" ? "Home" : i1?.name,
    //           origin_url: "",
    //           page_contact_number: null,
    //           parent_cat_id: i1?.parent_id ?? "",
    //           parent_id: parent_menu_id,
    //           path: i1?.path ?? "",
    //           url: i1?.url,
    //           menu: i1?.menu,
    //           children: i1.children.map((i2) => {
    //             const grand_child_menu_id = generateId();
    //             return {
    //               banner: i2?.banner ?? {
    //                 title: null,
    //                 tag_line: null,
    //                 description: null,
    //                 contact: null,
    //                 img: {
    //                   src: null,
    //                   alt: null,
    //                 },
    //               },

    //               category_id: tmpFnSetCatId(i2),
    //               menu_id: grand_child_menu_id,
    //               name: i2.name,
    //               // order:
    //               origin_name: i2?.name === "Home" ? "Home" : i2?.name,
    //               origin_url: "",
    //               page_contact_number: null,
    //               parent_cat_id: i2?.parent_id ?? "",
    //               parent_id: child_menu_id,
    //               path: i2?.path ?? "",
    //               url: i2?.url,
    //               menu: i2?.menu,
    //               children: i2.children,
    //             };
    //           }),
    //         };
    //       }),
    //     };
    //   });
    // setMenu(mappedSolanaCategories);
    // setSearchList(flattenMenu(mappedSolanaCategories));

    // console.log("solana_categoriesFlat", mappedSolanaCategories);
  }, []);

  const searchListObj = useMemo(() => {
    if (!scrollToSearch.trim()) return searchList;

    const _searchListObj = searchList.filter(({ name }) =>
      name.toLowerCase().includes(scrollToSearch.toLowerCase())
    );

    // console.log("_searchListObj", _searchListObj);

    return _searchListObj;
  }, [scrollToSearch, searchList]);

  return (
    <section>
      <CardWrap>
        <div className="p-3">
          <div className="font-bold text-lg">Menu Builder</div>
          <div className="text-sm">Don't forget to save your changes.</div>
          <div className="flex flex-col md:flex-row gap-[10px] my-[10px] items-center justify-between">
            <Button onClick={handleSaveMenuChanges} loading={isLoading}>
              Save
            </Button>
            <div
              className={`text-sm py-1 px-2 rounded border flex items-center ${
                alertType === "success"
                  ? "bg-green-200 text-green-800  border-green-400"
                  : "bg-red-200 text-red-800  border-red-400"
              } ${alertToggle ? "opacity-100" : "opacity-0"}`}
            >
              {alertMessage}
            </div>
          </div>
          {/* <div className="text-sm mb-2">
            Select a menu to edit or{" "}
            <button
              disabled
              onClick={handleCreateNewMenu}
              className="cursor-pointer text-blue-600 hover:text-blue-700"
            >
              create a new menu
            </button>
            . <b>Don't forget to save changes.</b>
          </div>
          <div className="flex gap-[10px]">
            <select
              disabled
              onChange={handleSelectMenuChange}
              className="w-[calc(100%-121px)] bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {menuList &&
                menuList.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.name}
                    {` ${
                      activeMenu && activeMenu === item.key ? "(active)" : ""
                    }`}
                  </option>
                ))}
            </select>

            <button
              disabled
              onClick={handleSetActiveMenu}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Set Active
            </button>
          </div> */}
          {/* <hr className="border-t border-gray-300 my-4"></hr> */}
          <div className="flex gap-[20px] overflow-hidden">
            {/* <div className="border rounded w-[250px] h-[calc(100vh-100px)]">
              <div className="w-full border bg-stone-300 text-xs p-2 flex items-center justify-between">
                <div className="font-semibold">Pages</div>
                <button
                  onClick={handleAddMenuItem}
                  className="text-blue-600 hover:text-blue-700 underline cursor-pointer"
                >
                  Add
                </button>
              </div>
              <div className="p-1">
                <input
                  type="text"
                  id="small-input"
                  className="block w-full p-2 text-gray-900 border border-gray-300 bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={originMenuSearch}
                  onChange={(e) => handleInputChange("originMenuSearch", e)}
                />
              </div>
              <div className="overflow-y-auto h-[calc(100%-74px)]">
                {originMenu.map((item, index) => (
                  <label
                    key={`${item.category_id}-${index}`}
                    htmlFor={`origin-menu-${item.category_id}`}
                  >
                    <div className=" p-2 border-t cursor-pointer">
                      <div className="flex items-center gap-[8px]">
                        <input
                          id={`origin-menu-${item.category_id}`}
                          type="checkbox"
                          value={item.category_id}
                          checked={item.selected}
                          onChange={handleOriginMenuCheckbox}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <div className="w-[calc(100%-30px)]">
                          <div className="font-semibold text-xs">
                            {highlightText(item.name, originMenuSearch)}
                          </div>
                          <div className="text-[10px]">
                            {highlightText(item?.url?.path, originMenuSearch)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <div></div>
            </div> */}
            {/* w-[calc(100%-270px)] */}
            <div className="border rounded w-full">
              <div className="w-full border bg-stone-300 text-sm p-2 flex items-center justify-between">
                <div className="font-semibold">Menu</div>
                {/* <button
                  onClick={handleSaveMenuChanges}
                  className="font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer px-2 rounded py-1 shadow"
                >
                  Save
                </button> */}
              </div>

              <div className="p-1">
                <input
                  type="text"
                  placeholder="Search"
                  className="block w-full p-2 text-gray-900 border border-gray-300 bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={scrollToSearch}
                  onChange={(e) => handleInputChange("scrollToSearch", e)}
                />
              </div>

              <div className="p-1">
                <div>
                  {/* {
                  menu
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => (
                      <div key={`menu-item-${item.menu_id}`}>
                        <MenuItem
                          item={item}
                          itemList={menu}
                          onChange={handleMenuItemChanges}
                          search={scrollToSearch}
                        />
                        {item.children &&
                          item.children.length > 0 &&
                          item.children
                            .sort((a, b) => a.order - b.order)
                            .map((item1, index1) => (
                              <div
                                className="ml-8"
                                key={`menu-item-${item1.menu_id}`}
                              >
                                <MenuItem
                                  item={item1}
                                  itemList={menu}
                                  onChange={handleMenuItemChanges}
                                  search={scrollToSearch}
                                />

                                {item1.children &&
                                  item1.children.length > 0 &&
                                  item1.children
                                    .sort((a, b) => a.order - b.order)
                                    .map((item2, index2) => (
                                      <div
                                        className="ml-8"
                                        key={`menu-item-${item2.menu_id}`}
                                      >
                                        <MenuItem
                                          item={item2}
                                          itemList={menu}
                                          onChange={handleMenuItemChanges}
                                          search={scrollToSearch}
                                        />
                                      </div>
                                    ))}
                              </div>
                            ))}
                      </div>
                    ))
                    } */}

                  {searchListObj.map((item, index) => (
                    <div key={`menu-item-${item.menu_id}`}>
                      <MenuItem
                        item={item}
                        itemList={searchList}
                        onChange={handleMenuItemChanges}
                        search={scrollToSearch}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardWrap>
      <MenuCreate
        open={toggleCreateMenu}
        close={setToggleCreateMenu}
        onUpdate={handleNewMenuCreateSuccess}
      />
    </section>
  );
}

export default MenuUpdater;
