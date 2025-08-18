// this menu updater is used to make menu using es shopify structure products

"use client";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import CardWrap from "@/app/components/admin/CardWrap";
import Button from "@/app/components/admin/Button";
import MenuItem from "@/app/components/admin/MenuUpdaterBuilderItemV3";
import MenuCreate from "@/app/components/admin/MenuUpdaterCreateV2";
import { generateId, createSlug } from "@/app/lib/helpers";
import { keys, redisGet, redisSet } from "@/app/lib/redis";
import dynamic from "next/dynamic";

// Import SortableTree and other components only on the client
const SortableTree = dynamic(
  () => import("dnd-kit-sortable-tree").then((mod) => mod.SortableTree),
  { ssr: false }
);

const SimpleTreeItemWrapper = dynamic(
  () =>
    import("dnd-kit-sortable-tree").then((mod) => mod.SimpleTreeItemWrapper),
  { ssr: false }
);

const menuListKey = keys.menu_list_shopify.value;
const activeMenuKey = keys.active_shopify_menu.value;
// const defaultMenuKey = keys.default_shopify_menu.value;
const defaultMenuKey = keys.dev_shopify_menu.value;

const HomeNavItem = {
  menu_id: "kw5dsac1q",
  parent_id: "",
  url: "",
  key: "Home",
  name: "Home",
  slug: "home",
  origin_name: "Home",
  children: [],
  price_visibility: "hide",
  meta_title: "",
  meta_description: "",
  banner: {
    img: {
      src: "",
      alt: "Home-Banner",
    },
    title: "Modern Fireplaces and Outdoor Living",
    tag_line:
      "Transform Your Spaces with Elegant Designs Built for Comfort and Durability",
  },
  page_contact_number: null,
  searchable: true,
  nav_visibility: true,
  order: 1,
  nav_type: "custom_page",
};

const SearchNavItem = {
  searchable: false,
  name: "Search",
  key: "Search",
  url: "search",
  slug: "search",
  nav_visibility: false,
  price_visibility: "show",
  nav_type: "custom_page",
};

const DnDToggleButton = ({ enabled, onToggle }) => {
  const handleToggle = () => {
    onToggle(!enabled);
  };

  return (
    <button
      onClick={handleToggle}
      title="drag and drop sort toggle"
      // className="flex items-center gap-[7px] text-base"\
      className={`w-[115px] flex items-center justify-between rounded-full border-[2px] py-1 px-3 shadow ${
        enabled
          ? "bg-blue-700 text-white border-blue-700"
          : "bg-blue-200 text-blue-700 border-blue-200"
      }`}
    >
      <span className="text-xs font-bold">
        {enabled ? "Enable" : "Disabled"}
      </span>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m16 13l6.964 4.062l-2.973.85l2.125 3.681l-1.732 1l-2.125-3.68l-2.223 2.15zm-2-7h2v2h5a1 1 0 0 1 1 1v4h-2v-3H10v10h4v2H9a1 1 0 0 1-1-1v-5H6v-2h2V9a1 1 0 0 1 1-1h5zM4 14v2H2v-2zm0-4v2H2v-2zm0-4v2H2V6zm0-4v2H2V2zm4 0v2H6V2zm4 0v2h-2V2zm4 0v2h-2V2z"
          />
        </svg>
      </div>
    </button>
  );
};

const TreeItemWithEditLink = React.forwardRef(
  ({ item, onDelete, ...props }, ref) => {
    const handleEditItemClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const href = event?.target?.href;
      if (href) {
        window.open(href, "_blank", "noopener,noreferrer");
      }
    };

    const handleDeleteItemClick = (e, menu_id) => {
      // const confirm = window.confirm("Data stored in this item will also get deleted. Do you want to continue?");
      // if(confirm){
      // }
      e.preventDefault();
      e.stopPropagation();
      if (onDelete) {
        onDelete(menu_id); // call parent handler with the item to delete
      }
    };

    const handlePreviewItemClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const href = event?.target?.href;
      console.log("[TEST href", event);
      if (href) {
        window.open(href, "_blank", "noopener,noreferrer");
      }
    };

    return (
      <SimpleTreeItemWrapper {...props} ref={ref}>
        <div className="font-semibold text-xs p-2 flex items-center justify-between w-full">
          <div>{item?.name}</div>
          <div className="flex gap-[40px] items-center">
            {item?.name !== "Home" && (
              <button
                className="text-red-900"
                onClick={(e) => handleDeleteItemClick(e, item?.menu_id)}
                title={"Remove: Please make sure to save to apply changes."}
              >
                Remove
              </button>
            )}
            <Link
              prefetch={false}
              href={`${BASE_URL}/admin/menu-builder/edit/${item?.menu_id}`}
              className="text-blue-600"
              onClick={handleEditItemClick}
              title={`Edit Page New Tab`}
            >
              Edit
            </Link>
            <Link
              prefetch={false}
              href={`${BASE_URL}/${item?.url}`}
              className="text-neutral-700"
              onClick={handlePreviewItemClick}
              title={`Preview Page New Tab`}
            >
              <svg
                className="pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <g className="open-in-new-tab-outline">
                  <g
                    fill="currentColor"
                    fillRule="evenodd"
                    className="Vector"
                    clipRule="evenodd"
                  >
                    <path d="M5 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5.263a1 1 0 1 1 2 0V19a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h5.017a1 1 0 1 1 0 2z" />
                    <path d="M21.411 2.572a.963.963 0 0 1 0 1.36l-8.772 8.786a.96.96 0 0 1-1.358 0a.963.963 0 0 1 0-1.36l8.773-8.786a.96.96 0 0 1 1.357 0" />
                    <path d="M21.04 2c.53 0 .96.43.96.962V8c0 .531-.47 1-1 1s-1-.469-1-1V4h-4c-.53 0-1-.469-1-1s.43-1 .96-1z" />
                  </g>
                </g>
              </svg>
            </Link>
          </div>
        </div>
      </SimpleTreeItemWrapper>
    );
  }
);

TreeItemWithEditLink.displayName = "TreeItemWithEditLink";

function MenuUpdaterV3() {
  const [menu, setMenu] = useState([]);
  const [originMenu, setOriginMenu] = useState([]);
  const [originMenuSearch, setOriginMenuSearch] = useState("");
  const [toggleCreateMenu, setToggleCreateMenu] = useState(false);
  const [menuList, setMenuList] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("");

  const [scrollToSearch, setScrollToSearch] = useState("");
  const [searchList, setSearchList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [alertToggle, setAlertToggle] = useState(false);
  const [alertType, setAlertType] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const [sortableIsActive, setSortableIsActive] = useState(true);
  const [dndToggle, setDndToggle] = useState(true);

  const recalibrateOrder = (treeArray) => {
    function updateNodeOrder(nodes, depth = 0) {
      nodes.forEach((node, index) => {
        node.order = index;
        node.depth = depth;
        if (Array.isArray(node.children)) {
          updateNodeOrder(node.children, depth + 1);
        }
      });
    }

    updateNodeOrder(treeArray);
    return treeArray;
  };

  const handleSortableTreeChange = (new_value) => {
    const reorderedMenu = recalibrateOrder(new_value);
    setMenu(reorderedMenu);
  };

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
      // const selected_menu = active_menu ?? menu_list?.[0]?.key;
      // console.log("[TEST] selected_menu", selected_menu);
      const selected_menu = defaultMenuKey;
      setSelectedMenu(selected_menu);
    });
  };

  const handleInputChange = (element, event) => {
    const { value } = event.target;
    if (element === "originMenuSearch") {
      setOriginMenuSearch(value);
    }

    if (element === "scrollToSearch") {
      setScrollToSearch(value);
    }
  };

  const handleCreateCustomPage = () => {
    const flatMenu = flattenMenu(menu);
    const restrictedNames = [
      ...flatMenu.map((item) => item?.key?.toLowerCase()),
      "search",
    ];
    const custom_page = prompt("Custom Page Name");
    if (custom_page) {
      if (restrictedNames.includes(custom_page.toLowerCase())) {
        alert(
          `You set "${custom_page}", But it is already taken please choose another.`
        );
      } else {
        const generated_id = generateId();
        const custom_menu_item = {
          id: generated_id,
          menu_id: generated_id,
          parent_id: "",
          key: custom_page,
          name: custom_page,
          url: createSlug(custom_page),
          slug: createSlug(custom_page),
          origin_name: custom_page,
          children: [],
          price_visibility: "hide",
          meta_title: "",
          meta_description: "",
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
          nav_visibility: true,
          nav_type: "custom_page",
        };
        setMenu((prev) => {
          const newValue = [...prev, custom_menu_item];
          newValue.forEach((item, index) => {
            item.order = index + 1; // Assign order starting from 1
          });
          return newValue;
        });
      }
    }
  };

  const handleOriginMenuCheckbox = (e) => {
    const { value, checked } = e.target;
    setOriginMenu((prev) => {
      return prev.map((i) => ({
        ...i,
        selected: value === i.slug ? checked : i.selected,
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

  function transformUrl(url) {
    return url.replace(/^\/|\/$/g, "").replace(/\//g, "-");
  }

  const generateUniqueSlug = (key) => {
    const existingSlugs = flattenMenu(menu).map((item) => item.slug);
    const baseSlug = createSlug(key);
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (existingSlugs.includes(uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  };

  const handleAddMenuItem = () => {
    const selected = originMenu.filter((i) => i.selected);
    // need to format object from here
    const generated_id = generateId();
    const mapped = selected.map((i) => {
      const uniqueSlug = generateUniqueSlug(i.key);
      return {
        id: generated_id,
        menu_id: generated_id,
        parent_id: "",
        key: i.key,
        name: i.key,
        url: uniqueSlug,
        slug: uniqueSlug,
        origin_name: i.key,
        children: [],
        price_visibility: "hide",
        meta_title: "",
        meta_description: "",
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
        nav_visibility: true,
        nav_type: i.nav_type,
        faqs: {
          visible: false,
          data: [],
        },
      };
    }); // inject properties
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
      // updateOrder(items, menuId, newOrder)
      // get the parent first to use in menu params u
      if (item.parent_id !== "") {
        const siblings = flattenMenu(menu).filter(
          (i) => i.parent_id === item.parent_id
        );
        const newOrder = updateOrder(siblings, item.menu_id, order);
        // console.log("newOrderSiblings", newOrder);
        setMenu((prev) => updateChildren(prev, item.parent_id, newOrder));
      } else {
        setMenu((prev) => updateOrder(prev, item.menu_id, order));
      }
    }

    if (action === "updateItem") {
      const { menu_id, item } = target;
      setMenu((prev) => {
        const updatedMenu = replaceMenuItem(prev, menu_id, item);
        return [...updatedMenu];
      });
    }
  };

  const handleNewMenuCreateSuccess = () => {
    // refetch menu list
    updateMenuList();
  };

  const handleSetActiveMenu = () => {
    redisSet(activeMenuKey, selectedMenu).then((response) => {
      if (response.success) {
        const active = menuList.find(({ key }) => key === selectedMenu);
        updateMenuList();
        alert(`${active.name} is now set as active menu.`);
      }
    });
  };

  const handleDeleteItem = (menu_id) => {
    setMenu((prev) => {
      const updated = removeMenuItem(prev, menu_id);
      return [...updated];
    });
  };

  const handleSelectMenuChange = (e) => {
    const { value } = e.target;
    // console.log("[TEST] selected menu", value);
    getSelectedMenuData(value);
    setSelectedMenu(value);
  };

  const handleSaveMenuChanges = () => {
    setIsLoading(true);
    const merged = [...menu, SearchNavItem];

    redisSet(selectedMenu, merged)
      .then((response) => {
        if (response.success) {
          showAlertMessage("success", "Menu object updated successful.");
        } else {
          showAlertMessage("error", "Failed to update. Please try again.");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  // useEffect(() => {
  //   console.log("[TEST] check generateUniqueSlug effect");
  //   console.log("[TEST] menu", menu);
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

  function hidePriceVisibility(items) {
    return items.map((item) => ({
      ...item,
      price_visibility: "hide",
      children: item.children ? hidePriceVisibility(item.children) : [],
    }));
  }

  // insert id in the menu tree
  const mapTreeWithId = (items) => {
    return items.map((item) => {
      const mappedItem = {
        ...item,
        id: item.menu_id, // 👈 Add id property
      };

      if (item.children && item.children.length > 0) {
        mappedItem.children = mapTreeWithId(item.children); // Recursively map children
      }

      return mappedItem;
    });
  };

  const getSelectedMenuData = (menuKey) => {
    redisGet(menuKey).then((data) => {
      // setMenu(hidePriceVisibility(data.filter(({ name }) => name !== "Search")));

      if(!data) return;
       
      const nav_data = mapTreeWithId([
        HomeNavItem,
        ...data.filter(({ name }) => !["Home", "Search"].includes(name)),
      ]);

      // console.log("[TEST] nav_data", nav_data);

      setMenu(nav_data);
      setSearchList(flattenMenu(nav_data));
    });
  }

  useEffect(() => {
    updateMenuList();
    // setMenu(aira_cat.filter(({ name }) => name !== "Search").map(item=> ({...item, meta_title:"", meta_description:"", price_visibility:"show"})))
    // redisGet(defaultMenuKey).then((data) => {
    redisGet(defaultMenuKey).then((data) => {
      // setMenu(hidePriceVisibility(data.filter(({ name }) => name !== "Search")));

      const nav_data = mapTreeWithId([
        HomeNavItem,
        ...data.filter(({ name }) => !["Home", "Search"].includes(name)),
      ]);

      // console.log("[TEST] nav_data", nav_data);

      setMenu(nav_data);
      setSearchList(flattenMenu(nav_data));
    });
    Promise.all([
      fetch("/api/es/shopify/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),

      fetch("/api/es/shopify/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
    ])
      .then(([categories, brands]) => {
        const merged = [...categories, ...brands].map((item) => ({
          ...item,
          slug: createSlug(item.key),
          selected: false,
        }));
        setOriginMenu(merged);
      })
      .catch((err) => {
        console.error("Error fetching categories or brands:", err);
      });
  }, []);

  const searchListObj = useMemo(() => {
    if (!scrollToSearch.trim()) return searchList;

    const _searchListObj = searchList.filter(({ name }) =>
      name.toLowerCase().includes(scrollToSearch.toLowerCase())
    );

    // console.log("_searchListObj", _searchListObj);

    return _searchListObj;
  }, [scrollToSearch, searchList]);

  const originMenuSearchResults = useMemo(() => {
    if (!originMenuSearch.trim()) {
      return [...originMenu].sort((a, b) => a.key.localeCompare(b.key));
    }

    const _originMenuObj = originMenu
      .filter(({ key }) =>
        key.toLowerCase().includes(originMenuSearch.toLowerCase())
      )
      .sort((a, b) => a.key.localeCompare(b.key));

    return _originMenuObj;
  }, [originMenuSearch, originMenu]);

  return (
    <section>
      <CardWrap>
        <div className="p-3">
          <div className="font-bold text-lg">
            Menu Builder - Shopify Product Structure
          </div>
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
          <div className="text-sm mb-2">
            Select a menu to edit or{" "}
            <button
              onClick={handleCreateNewMenu}
              className="cursor-pointer text-blue-600 hover:text-blue-700"
              disabled={true}
            >
              create a new menu
            </button>
            . <b>Don't forget to save changes.</b>
          </div>
          <div className="flex gap-[10px]">
            <select
              disabled
              onChange={handleSelectMenuChange}
              value={selectedMenu}
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
          </div>
          <hr className="border-t border-gray-300 my-4"></hr>
          <div className="flex gap-[20px] overflow-hidden">
            <div className="border rounded w-[350px] h-[calc(100vh-100px)]">
              <div className="w-full border bg-stone-300 text-xs p-2 flex items-center justify-between">
                <div className="font-semibold">Categories/Brands</div>
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
                {originMenuSearchResults.map((item, index) => (
                  <label
                    key={`${item.slug}-${index}`}
                    htmlFor={`origin-menu-${item.slug}`}
                  >
                    <div className=" p-2 border-t cursor-pointer">
                      <div className="flex items-center gap-[8px]">
                        <input
                          id={`origin-menu-${item.slug}`}
                          type="checkbox"
                          value={item.slug}
                          checked={item.selected}
                          onChange={handleOriginMenuCheckbox}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <div className="w-[calc(100%-30px)]">
                          <div className=" text-xs">
                            <div
                              className="font-medium line-clamp-1"
                              title={item.key}
                            >
                              {highlightText(item.key, originMenuSearch)}{" "}
                            </div>
                            <div
                              className={`${
                                item.nav_type === "category" &&
                                "text-orange-700"
                              } ${
                                item.nav_type === "brand" && "text-blue-700"
                              }`}
                            >
                              {item.nav_type}
                            </div>
                            <div>({item.doc_count})</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <div></div>
            </div>
            {/* w-[calc(100%-270px)] */}
            <div className="border rounded w-full">
              <div className="w-full border bg-stone-300 text-sm p-2 flex items-center justify-between">
                <div className="font-semibold">Menu</div>
                <div className="flex items-center">
                  <button
                    onClick={handleCreateCustomPage}
                    className="text-blue-600 hover:text-blue-700 underline cursor-pointer text-xs"
                  >
                    Custom Page
                  </button>
                </div>
              </div>

              {/* <div className="px-5 py-1  flex justify-end">
                <DnDToggleButton enabled={dndToggle} onToggle={setDndToggle} />
              </div> */}

              {/* <div className="p-1">
                <input
                  type="text"
                  placeholder="Search"
                  className="block w-full p-2 text-gray-900 border border-gray-300 bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={scrollToSearch}
                  onChange={(e) => handleInputChange("scrollToSearch", e)}
                />
              </div> */}

              {dndToggle ? (
                <div className="p-1">
                  <div>
                    {scrollToSearch === "" ? (
                      <SortableTree
                        items={menu.map((item) => ({
                          ...item,
                          id: item?.menu_id,
                        }))}
                        onItemsChanged={handleSortableTreeChange}
                        TreeItemComponent={(props) => (
                          <TreeItemWithEditLink
                            {...props}
                            onDelete={handleDeleteItem}
                          />
                        )}
                      />
                    ) : (
                      searchListObj.map((item, index) => (
                        <div key={`menu-item-${item.menu_id}`}>
                          <MenuItem
                            item={item}
                            itemList={searchList}
                            onChange={handleMenuItemChanges}
                            search={scrollToSearch}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-1">
                  <div>
                    {scrollToSearch === ""
                      ? menu
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
                      : searchListObj.map((item, index) => (
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
              )}
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

export default MenuUpdaterV3;
