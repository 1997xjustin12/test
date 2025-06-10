'use client'
import { createContext, useContext, useState } from "react";

const CompareProducts = createContext([]);

export function CompareProductsProvider({children }) {
    const [products, setProducts] = useState([]);

    const addProduct = () => {

    }

    const removeProduct = () =>{

    }

    const removeProducts = () => {

    }
    
  return (
    <CompareProducts.Provider value={{products, addProduct, removeProduct, removeProducts}}>
      {children}
    </CompareProducts.Provider>
  );
}

export function useCompareProducts() {
  return useContext(CompareProducts);
}
