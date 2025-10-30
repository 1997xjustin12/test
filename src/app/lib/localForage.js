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
  }
  try {
    await localForage.setItem(key, value);
  } catch (error) {
  }
};

export const getItem = async (key) => {
  if (!key) {
  }
  try {
    return (await localForage.getItem(key)) || null;
  } catch (error) {
    return [];
  }
};

export const removeItem = async (key) => {
  if (!key) {
  }
  try {
    await localForage.removeItem(key);
  } catch (error) {
  }
};
