import localForage from "localforage";
if (typeof window !== "undefined") {
  localForage.config({
    driver: localForage.LOCALSTORAGE,
    name: "solanaStore",
    storeName: "vairables",
    description: "variables for guest users",
  });
}
export const set = async (billing_info) => {
  try {
    await localForage.setItem("billing_info", billing_info);
  } catch (error) {
  }
};

export const get = async () => {
  try {
    await localForage.ready();

    const billing_info = await localForage.getItem("billing_info");

    return billing_info;
  } catch (error) {
    return {};
  }
};
