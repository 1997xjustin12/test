"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import QuickView from "@/app/components/atom/ProductQuickView"
const QuickViewContext = createContext();
export const useQuickView = () => {
  return useContext(QuickViewContext);
};

export const QuickViewProvider = ({ children }) => {
  const [item, setItem] = useState(null);
  const handleOnClose = () => {
    setItem(null);
  }
  const viewItem = (product) => {
    setItem(product);
  }
  return (
    <QuickViewContext.Provider
      value={{viewItem}}
    >
      {children}
      <QuickView data={item} onClose={handleOnClose}/>
    </QuickViewContext.Provider>
  );
};
