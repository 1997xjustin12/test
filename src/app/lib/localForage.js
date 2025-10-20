import localForage from "localforage";
if (typeof window !== "undefined") {
localForage.config({
  driver: localForage.LOCALSTORAGE,
  name: "solanaStore",
  storeName: "vairables",
  description: "variables for guest users",
});
}
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
    return (await localForage.getItem(key)) || null;
  } catch (error) {
    console.error(`[LocalForage] Error retrieving [${key}]`, error);
    return [];
  }
};

export const removeItem = async (key) => {
  if (!key) {
    console.error(`[LocalForage] removeItem: key param required`);
  }
  try {
    await localForage.removeItem(key);
  } catch (error) {
    console.error(`[LocalForage] Error removing [${key}]`, error);
  }
};
