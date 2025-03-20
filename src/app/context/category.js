'use client'
import { createContext, useContext, useMemo } from "react";

const CategoriesContext = createContext([]);

export function CategoriesProvider({ categories, children }) {
    console.log("from context categories", categories)

    const flattenCategories = (categories, flatArray = []) =>  {
      categories.forEach(category => {
        // Add the current category to the flat array
        flatArray.push(category);
    
        // If there are children, recursively process them
        if (category.children && category.children.length > 0) {
          flattenCategories(category.children, flatArray);
        }
      });
    
      return flatArray;
    }
    
    const solana_categories = useMemo(()=>{
        return categories;
    },[categories]);

    const flatCategories = useMemo(()=>{
      const _flatCategories =  flattenCategories(categories);
      return _flatCategories;
    }, [categories])
  return (
    <CategoriesContext.Provider value={{categories, solana_categories, flatCategories}}>
      {children}
    </CategoriesContext.Provider>
  );
}

// Custom hook for using the context
export function useSolanaCategories() {
  return useContext(CategoriesContext);
}
