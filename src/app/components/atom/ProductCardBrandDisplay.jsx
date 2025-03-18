'use client'
import {useState, useEffect} from "react";
import { brands } from "@/app/lib/category-helpers"; 

function ProductCardBrandDisplay({ product }) {
  const [brand, setBrand] = useState(null);
  

  useEffect(()=>{
    if(product){
        setBrand(prev=>{
            // console.log("brand_id", product.brand_id);
            // console.log("brands", brands);
            // console.log("brand", _brand);
            const _brand = brands.find(({id})=>product.brand_id===id);
            return _brand;
        })
    }
  },[product])
  

  return <div className="text-xs text-stone-500">{brand?.name}</div>;
}

export default ProductCardBrandDisplay;
