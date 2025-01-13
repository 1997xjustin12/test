// import cat_json from "../data/category.json";
// import cat_json from "../data/categoryv2.json"; // solana cherry picked in menu
import cat_json from "../data/categoryv3.json"; // bigcommerce categories in menu
// import bccat_json from "../data/bc_categories_20241213.json";
import bccat_json from "../data/bc_categories_20250108.json";

export const solana_categories = cat_json.map((i) => ({
  ...i,
  children: i.links.flatMap((i2) => i2),
}));
export const bc_categories = bccat_json;

export const main_categories = cat_json
  .filter((i) => i.menu.visible)
  .map((i) => ({
    ...i,
    url: i.menu.href,
    children: i.links.flatMap((i) => i),
  }));

export const main_cat_array = main_categories.map((i) => i.menu.href);

export const sub_categories = cat_json
  .flatMap((i) => i.links)
  .flatMap((i) => i);
export const child_categories = sub_categories.flatMap((i) => i.children);

export const flatCategories = [
  ...main_categories,
  ...sub_categories,
  ...child_categories,
];
//------------------------------------------------------------------------------
// UNCOMMENT CODE BELOW TO EVEALUATE BC CATEGORIES TO MENU - START

console.log("filterBCCatByKeyword('/sale')", filterBCCatByKeyword("/sale"));
console.log(
  "filterBCCatByKeyword('/sale') filtered",
  buildHierarchy(
    filterBCCatByKeyword("/sale")
      .sort((a, b) => a.url.path.localeCompare(b.url.path))
      .filter((i) => !i?.url?.path.includes("/shop-all"))
      // .sort((a, b) => a.name.localeCompare(b.name))
      .map((i) => ({
        category_id: i.category_id,
        parent_id: i.parent_id,
        id: i.category_id,
        name: i.name,
        url: i.url.path.split("/").filter(Boolean).pop(),
        key_words: [i.url.path],
        children: [],
      }))
  )
  // .map((i) => i.key_words[0])
);

function filterBCCatById(id) {
  return bc_categories.find(({ category_id }) => category_id === id);
}

function filterBCCatByKeyword(keyword) {
  return bc_categories.filter((i) =>
    i?.url?.path.toLowerCase().includes(keyword.toLowerCase())
  );
  // .map((i) => i.name);
}
// UNCOMMENT CODE BELOW TO EVEALUATE BC CATEGORIES TO MENU - START
//------------------------------------------------------------------------------
// UNCOMMENT CODE BELOW TO CONSOLE LOG BC CATEGORIES HIERARCHY -- START
// createAutoMenuFromBCCategories();

function buildHierarchy(categories) {
  const categoryMap = new Map();

  // Add all categories to a map with their category_id as the key
  categories.forEach((category) => {
    category.children = []; // Initialize the children property
    categoryMap.set(category.category_id, category);
  });

  const result = [];

  // Loop through the categories and attach each child to its parent
  categories.forEach((category) => {
    if (category.parent_id === null || category.parent_id === 0) {
      // If no parent, it's a root category
      result.push(category);
    } else {
      // Attach the category to its parent's children array
      const parent = categoryMap.get(category.parent_id);
      if (parent) {
        parent.children.push(category);
      }
    }
  });

  return result;
}

function createAutoMenuFromBCCategories() {
  const formatCategories = bc_categories
    .filter((i) => !i?.url?.path.includes("shop-all"))
    .map((i) => ({
      ...i,
      url: i?.url?.path.split("/").filter(Boolean).pop(),
      path: i?.url?.path,
      menu: {
        href: i?.url?.path.split("/").filter(Boolean).pop(),
        visible: true,
      },
      key_words: [i?.url?.path],
    }));
  // console.log(
  //   "bc_categories hierarchy",
  //   buildHierarchy(formatCategories)
  //     .map((i) => ({ ...i, links: i.children }))
  //     .map((i) => ({ ...i, links: groupInPairs(i.links) }))
  // );
}
// UNCOMMENT CODE BELOW TO CONSOLE LOG BC CATEGORIES HIERARCHY -- END
//------------------------------------------------------------------------------

function groupInPairs(array) {
  const result = [];
  for (let i = 0; i < array.length; i += 2) {
    // Take the current element and the next one (if it exists)
    const pair = [array[i]];
    if (i + 1 < array.length) {
      pair.push(array[i + 1]);
    }
    result.push(pair);
  }
  return result;
}
