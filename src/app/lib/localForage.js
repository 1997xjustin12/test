import localForage from "localforage";

localForage.config({
  driver: localForage.LOCALSTORAGE,
  name: "solanaStore",
  storeName: "vairables",
  description: "Store cart items for guest users",
});

export const setItem = async (key, value) => {
  if (!key || !value) {
    console.error(`[LocalForage] setItem: key and value params required`);
  }
  try {
    await localForage.setItem(key, value);
  } catch (error) {
    console.error(`[LocalForage] Error saving [${key}]`, error);
  }
};

export const getItem = async (key) => {
  if (!key) {
    console.error(`[LocalForage] getItem: key params required`);
  }
  try {
    return (await localForage.getItem(key)) || [];
  } catch (error) {
    console.error(`[LocalForage] Error retrieving [${key}]`, error);
    return [];
  }
};
