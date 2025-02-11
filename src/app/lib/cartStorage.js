// lib/localForage.js
import localForage from "localforage";

// Configure localForage (optional, but can specify a store name)
localForage.config({
  driver: localForage.LOCALSTORAGE, // You can choose IndexedDB, WebSQL, or LocalStorage
  name: "cartStore",
  storeName: "cartItems", // You can change the name of the store
  description: "Store cart items for guest users",
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
    return (await localForage.getItem("cart")) || [];
  } catch (error) {
    console.error("Error retrieving cart items:", error);
    return [];
  }
};

