"use client";
import { useMemo } from "react";
import Link from "next/link";
import { FluentChevronRight } from "@/app/components/icons/lib";
import { getCategoryIds } from "@/app/lib/helpers";
import { bc_categories } from "@/app/lib/category-helpers";
import { useSolanaCategories } from "@/app/context/category";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
function SingleProductBreadCrumbs({ product }) {
  const {solana_categories} = useSolanaCategories();
  const flattenCategories = (categories) => {
    let result = [];
  
    const traverse = (items, parent = null) => {
      items.forEach((item) => {
        const { children, ...categoryData } = item;
        result.push({ ...categoryData, parent });
  
        if (children && children.length > 0) {
          traverse(children, categoryData.url); // Keep track of parent URL if needed
        }
      });
    };
  
    traverse(categories);
    return result;
  };

  const findBreadcrumbs = (categories, targetIds) => {
    let breadcrumbs = [];
  
    const traverse = (items, path = []) => {
      for (let item of items) {
        const newPath = [...path, { name: item.name, url: item.url }];
  
        // Check if the category has a matching ID
        if (item.category_ids.some(id => targetIds.includes(id))) {
          breadcrumbs = newPath; // Store the deepest breadcrumb path found
        }
  
        // Recurse through children
        if (item.children.length > 0) {
          traverse(item.children, newPath);
        }
      }
    };
  
    traverse(categories);
    return breadcrumbs;
  };

  const crumbs = useMemo(()=>{
    const _mappedCategories = product.categories.map(({id})=> id);
    const tmp1 = findBreadcrumbs(solana_categories
      .filter(i=> i.name.toLowerCase() !== "brands")
      .filter(i=> i.name.toLowerCase() !== "search")
      .map(i=> ({
      name:i.name,
      url:i.url,
      category_ids: i?.url ? getCategoryIds(i.url,flattenCategories(solana_categories), bc_categories):[],
      children: i.children
      .map(i2=> ({
        name:i2.name,
        url:i2.url,
        category_ids: i2?.url ? getCategoryIds(i2.url,flattenCategories(solana_categories), bc_categories):[],
        children: i2.children
        .map(i3=> ({
          name:i3.name,
          url:i3.url,
          category_ids: i3?.url ? getCategoryIds(i3.url,flattenCategories(solana_categories), bc_categories):[],
          children: i3.children
        }))
      }))
    })), _mappedCategories);
    const tmp2 = findBreadcrumbs(solana_categories
      .filter(i=> i.name.toLowerCase() !== "search")
      .map(i=> ({
      name:i.name,
      url:i.url,
      category_ids: i?.url ? getCategoryIds(i.url,flattenCategories(solana_categories), bc_categories):[],
      children: i.children
      .map(i2=> ({
        name:i2.name,
        url:i2.url,
        category_ids: i2?.url ? getCategoryIds(i2.url,flattenCategories(solana_categories), bc_categories):[],
        children: i2.children
        .map(i3=> ({
          name:i3.name,
          url:i3.url,
          category_ids: i3?.url ? getCategoryIds(i3.url,flattenCategories(solana_categories), bc_categories):[],
          children: i3.children
        }))
      }))
    })), _mappedCategories);
    return tmp1.length > 0 ? tmp1: tmp2;
  },[product])

    return (
      <div className="flex gap-[5px] flex-wrap text-xs">
        {crumbs &&
          crumbs.length > 0 &&
          crumbs.map((i, idx) => (
            <Link
              key={`crumb-link-${idx}`}
              href={`${BASE_URL}/${i.url}`}
              className=""
            >
              <div className="flex items-center text-theme-400">
                <div className="text-theme-800 hover:underline whitespace-nowrap">{i.name}</div>
                <FluentChevronRight width={20} height={20} />
              </div>
            </Link>
          ))}
          
          
          <div className="flex items-center">
            <div className="text-theme-800 underline line-clamp-1">{product.name}</div>
          </div>
      </div>
    );
}

export default SingleProductBreadCrumbs;
