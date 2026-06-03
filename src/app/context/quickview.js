"use client";
import React, { createContext, useState, useContext } from "react";
import { ISBBQ } from "@/app/lib/helpers";
import BBQQuickView from "@/app/components/bbq-design/ui/ProductQuickView";
import NewDesignQuickView from "@/app/components/new-design/ui/ProductQuickView";

const QuickViewContext = createContext();

export const useQuickView = () => useContext(QuickViewContext);

export const QuickViewProvider = ({ children }) => {
  const [item, setItem] = useState(null);

  const handleOnClose = () => setItem(null);
  const viewItem = (product) => setItem(product);

  const QuickView = ISBBQ ? BBQQuickView : NewDesignQuickView;

  return (
    <QuickViewContext.Provider value={{ viewItem }}>
      {children}
      <QuickView data={item} onClose={handleOnClose} />
    </QuickViewContext.Provider>
  );
};
