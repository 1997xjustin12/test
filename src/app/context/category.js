'use client'
import { createContext, useContext, useMemo } from "react";

const CategoriesContext = createContext([]);

export function CategoriesProvider({ categories, children }) {
    // console.log("from context categories", categories)

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
        return categories.map(item=> ({...item, key_words:[item.path]}));
    },[categories]);

    const flatCategories = useMemo(()=>{
      const _flatCategories =  flattenCategories(categories);
      return _flatCategories;
    }, [categories]);

    const price_hidden_categories = useMemo(()=>{
      const _flatCategories =  flattenCategories(categories);
      const hidden_cats = _flatCategories.filter(category => category.price_visibility === "hide");
      return hidden_cats.map(({category_id})=> category_id);
    },[categories])
  return (
    <CategoriesContext.Provider value={{categories, solana_categories, flatCategories, price_hidden_categories}}>
      {children}
    </CategoriesContext.Provider>
  );
}

// Custom hook for using the context
export function useSolanaCategories() {
  return useContext(CategoriesContext);
}
