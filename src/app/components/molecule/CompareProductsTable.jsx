"use client";
import { useMemo } from "react";
import Image from "next/image";
import CompareProductCard from "@/app/components/atom/CompareProductCard"

function CompareProductsTable({ similar_products, product }) {
  const compare_products = useMemo(() => {
    if (similar_products.length > 0 && product) {
      const filtered_similars = similar_products.filter((item) => item.handle !== product?.handle);
      return [
        product,
        ...filtered_similars
      ];
    }
    return [];
  }, [similar_products, product]);

  const product_accentuates = useMemo(() => {
    if (similar_products.length > 0 && product) {
      const filtered_similars = similar_products.filter((item) => item.handle !== product?.handle);
      const tmp = [
        product?.accentuate_data?.[0] || [],
        ...(filtered_similars.map(({accentuate_data})=> accentuate_data && accentuate_data?.[0]))
      ];


      const tmp_obj = tmp.map(item=>{
        if (!item || typeof item !== 'object') return {}; // skip this item
        const item_keys = Object.keys(item);
        const include_keys = item_keys.filter(item=> item.includes("seo_meta"));
        return include_keys.reduce(
          (accumulator, currentValue) => {
            accumulator[currentValue] = item[currentValue];
            return accumulator;
          },
          {},
        )
      })

      return tmp_obj;

    }
    return [];
  }, [similar_products, product]);

  const getPropLabel = (prop) => {
    const noPrefix = prop.replace("bbq.seo_meta_", "");

    const label = noPrefix
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return label;
  }

  if (compare_products.length > 0) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-stone-900 my-[20px]">Similar Products</h2>
        <div className="w-full overflow-x-auto p-5">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="min-w-[300px] max-w-[350px] border-r border-gray-400"></th>
                {compare_products.map((item, index) => (
                  <th
                    key={`thead-${index}`}
                    className="min-w-[200px] max-w-[250px] border-r border-gray-400"
                  >
                    <CompareProductCard is_active={item?.handle === product?.handle} product={item}/>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
                {
                Object.keys(product_accentuates[0]).map((prop_key, index) => <tr key={`th-${index}`} className="group">
                  <td className="p-4 border-y border-r border-gray-400 group-hover:bg-neutral-200 text-sm">{getPropLabel(prop_key)}</td>
                  {
                    product_accentuates.map((spec,index2)=> <td key={`td-${index}-${index2}`} className="text-center p-4 border-y border-r border-gray-400 group-hover:bg-neutral-200 text-sm">{spec[prop_key]}</td>)
                  }
                </tr>)
                }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default CompareProductsTable;
