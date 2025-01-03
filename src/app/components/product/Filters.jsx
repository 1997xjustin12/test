
'use client'
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import cat_json from "../section/BigcommerceCategoryList20241213.json"

const ProductsFilter = ({ categories, onChange }) => {
    const static_categories = [
        { name:"Fireplaces", key_word: "fireplace"}, 
        { name:"Fire Pits", key_word: "fire pit"}, 
        { name:"Gas Logs", key_word: "gas log"}, 
        { name:"Patio Heaters", key_word: "patio heater"}, 
        { name:"BBQ", key_word: "bbq"}, 
        { name:"Patio Furniture", key_word: "furniture"}, 
        { name:"Brands", key_word: "brands"}, 
        { name:"On Sale", key_word: "on sale"},
        ];
    const category_names = ["fireplaces", "fire pits", "gas logs", "patio heaters", "bbq", "patio furniture", "brands", "on sale"];

    const stringToSlug = (str) => {
        return str  
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-');
    }

    const getCategoryIds = (cat_name) => {
        return cat_json.filter(i=> i?.url?.path.toLowerCase().includes(stringToSlug(cat_name))).map(i=>i.category_id);
    }
    

    const new_list = static_categories.map(i => ({ name: i.name, slug: stringToSlug(i.name), checked: false, count: 0, cat_ids: getCategoryIds(i.key_word) }));

    // console.log(new_list);

    useEffect(() => {
        const cat_root = new_list;
        // console.log(cat_root);
        setCategoryFilters(cat_root);
    }, []);


    const [categoryFilters, setCategoryFilters] = useState([]);
    const createCategoryHierarchy = (categories) => {
        const categoryMap = {}; // To map category id to category object
        const rootCategories = []; // To store root categories

        // First, map all categories by their id
        categories.forEach(category => {
            categoryMap[category.id] = { ...category, children: [] };
        });

        // Then, loop through each category to add it as a child to its parent (if applicable)
        categories.forEach(category => {
            if (category.parent_id === 0) {
                // If parent_id is null, it's a root category
                rootCategories.push(categoryMap[category.id]);
            } else {
                // If parent existas, add this category to its parent's children
                if (categoryMap[category.parent_id]) {
                    categoryMap[category.parent_id].children.push(categoryMap[category.id]);
                }
            }
        });

        return rootCategories;
    }

    const handleCategoryFiltersChange = (e) => {
        const { value } = e.target;
        setCategoryFilters(prev => {
            const newValue = prev.map(i => i.name === value ? ({ ...i, checked: !i.checked }) : i)
            onChange(newValue.filter(i => i.checked === true));
            return newValue;
        });
    }



    return (
        <>
            {
                categoryFilters && categoryFilters.length > 0 && categoryFilters.map((i, index) =>
                    <div key={`categories-filter__${i.slug}`} onClick={() => handleCategoryFiltersChange({ target: { value: i.name } })} value={i.name} className="cursor-pointer border-b">
                        <div className="flex justify-between items-center h-[70px] p-[5px]">
                            <div className="font-bold">
                                {i.name}
                            </div>
                            <div className="relative w-[20px] h-[20px]">
                                <input type="checkbox" value={i.name} checked={i.checked} />
                                {
                                    i.checked && <div className="absolute top-0 left-0">
                                        <Icon icon="bx:check" width="18" height="18" className="ml-[1px] text-white" />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default ProductsFilter;