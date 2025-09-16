// lib/localForage.js
import localForage from "localforage";

// Configure localForage (optional, but can specify a store name)
localForage.config({
  driver: localForage.LOCALSTORAGE, 
  name: "solanaStore",
  storeName: "vairables",
  description: "variables for guest users",
});

// Function to save cart items
export const saveCart = async (cart) => {
  try {
    await localForage.setItem("cart", cart);
  } catch (error) {
    console.error("Error saving cart items:", error);
  }
};

// Function to get cart items
export const getCart = async () => {
  try {
    await localForage.ready();

    const cart = await localForage.getItem("cart");

    return cart;
  } catch (error) {
    console.error("Error retrieving cart items:", error);
    // return [];
    return null;
  }
};



