// app/compare-products/[product_skus]/page.jsx
import React from "react";
import ProductCard from "@/app/components/atom/ProductCard";
import { Rating } from "@smastrom/react-rating";
import { formatPrice } from "@/app/lib/helpers";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;

async function fetchProducts(product_skus) {
  const decoded = decodeURIComponent(product_skus);
  const skus = decoded.split("__");
  const query = {
    query: {
      terms: {
        "variants.sku.keyword": skus,
      },
    },
  };

  const res = await fetch(`${BASE_URL}/api/es/shopify/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
    // 👇 This makes the fetch run on the server at build or request time
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  const formatted_data = data.hits?.hits?.map(({ _source }) => _source);
  console.log("[COMPARE PAGE] data: ", formatted_data);
  return formatted_data || [];
}

export default async function ComparePage({ params }) {
  const { product_skus } = params;
  const products = await fetchProducts(product_skus);

  function parseRatingCount(value) {
    if (typeof value === "string") {
      // Remove any non-digit characters (like surrounding quotes)
      value = value.replace(/[^\d]/g, "");
    }
    const count = parseInt(value, 10);
    return isNaN(count) ? 0 : count;
  }

  const SpecsDisplay = ({ product, field }) => {
    console.log("[SpecsDisplay] product: ", product);
    console.log("[SpecsDisplay] field: ", field);
    const special_case = ["gas-type", "configuration", "model", "series"];
    const accentuate_data = product?.accentuate_data?.[0];
    const handle = product?.handle;
    if (special_case.includes(field)) {
      if (field === "gas-type") {
        if (
          !accentuate_data ||
          !accentuate_data?.["bbq.option_related_product"] ||
          !accentuate_data?.["bbq.option_type"]
        ) {
          return "NA";
        }

        const options = JSON.parse(accentuate_data["bbq.option_type"]);
        const handles = JSON.parse(
          accentuate_data["bbq.option_related_product"]
        );
        const index = handles.indexOf(handle);
        console.log("[SpecsDisplay] index: ", index);
        return options?.[index] || "NA";
      }

      if (field === "configuration") {
        if (
          !accentuate_data ||
          !accentuate_data?.["bbq.configuration_product"] ||
          !accentuate_data?.["bbq.configuration_type"]
        ) {
          return "NA";
        }

        const options = JSON.parse(accentuate_data["bbq.configuration_type"]);
        const handles = JSON.parse(
          accentuate_data["bbq.configuration_product"]
        );
        const index = handles.indexOf(handle);
        console.log("[SpecsDisplay] index: ", index);
        return options?.[index] || "NA";
      }

      if (field === "model") {
        if (
          !accentuate_data ||
          !accentuate_data?.["bbq.related_product"] ||
          !accentuate_data?.["size_title"]
        ) {
          return "NA";
        }

        const options = JSON.parse(accentuate_data["size_title"]);
        const handles = JSON.parse(
          accentuate_data["bbq.related_product"]
        );
        const index = handles.indexOf(handle);
        console.log("[SpecsDisplay] index: ", index);
        return options?.[index] || "NA";
      }

      
      if (field === "series") {
        if (
          !accentuate_data ||
          !accentuate_data?.["bbq.product_option_related_product"] ||
          !accentuate_data?.["bbq.product_option_name"]
        ) {
          return "NA";
        }

        const options = JSON.parse(accentuate_data["bbq.product_option_name"]);
        const handles = JSON.parse(
          accentuate_data["bbq.product_option_related_product"]
        );
        const index = handles.indexOf(handle);
        console.log("[SpecsDisplay] index: ", index);
        return options?.[index] || "NA";
      }
    }else{
      return "NA";
    }
  };

  return (
    <div className="container mx-auto mb-[100px]">
      <h1 className="mt-[50px] mb-[20px]">COMPARE PRODUCTS</h1>
      <div className="overflow-auto">
        <div className="flex px-4 pt-1 pb-0 w-full">
          <div className="flex gap-[2px] w-full">
            {products.map((p, i) => (
              <div
                key={`compare-product-image-${i}`}
                className="min-w-[280px] max-w-[330px] w-full border-b border-white"
              >
                <div className="aspect-1 bg-white rounded-md flex justify-center item-center overflow-hidden border border-neutral-200">
                  {p?.images &&
                    Array.isArray(p?.images) &&
                    p?.images?.length > 0 &&
                    p.images[0]?.src && (
                      <img
                        src={p.images[0].src}
                        alt={p.images[0].alt}
                        className={`object-contain h-full opacity-100`}
                      />
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Sticky Header */}
        <div className="flex p-4 pt-1 w-full">
          <div className="flex gap-[2px] w-full">
            {products.map((p, i) => (
              <div
                key={`compare-name-price-${i}`}
                className="min-w-[280px] max-w-[330px] w-full border-b border-white"
              >
                <div
                  className="text-center w-full p-4 bg-neutral-100 border-t border-b border-neutral-300"
                  title={p.title}
                >
                  <span className="line-clamp-2">{p.title}</span>
                  <div className="font-semibold text-lg">
                    ${formatPrice(p?.variants?.[0]?.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Row */}
        <div className="pl-[30px] text-lg font-bold uppercase">Brand</div>
        <div className="flex px-4 py-1 w-full">
          <div className="flex gap-[2px] w-full">
            {products.map((p, i) => (
              <div
                key={`compare-brand-${i}`}
                className="min-w-[280px] max-w-[330px] w-full bg-neutral-100 border-t border-b border-neutral-300"
              >
                <div className="text-center w-full p-4">{p.brand}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ratings Row */}
        <div className="pl-[30px] text-lg font-bold uppercase">Ratings</div>
        <div className="flex px-4 py-1 w-full">
          <div className="flex gap-[2px] w-full">
            {products.map((p, i) => (
              <div
                key={`compare-rating-${i}`}
                className="min-w-[280px] max-w-[330px] w-full bg-neutral-100 border-t border-b border-neutral-300"
              >
                <div className="text-center w-full p-4 flex items-center justify-center gap-[2px]">
                  <Rating
                    readOnly
                    value={parseRatingCount(p?.ratings?.rating_count)}
                    fractions={2}
                    style={{ maxWidth: 100 }}
                  />
                  0 reviews
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specs */}
        <div className="mt-[15px] pl-[30px] text-lg font-bold uppercase">
          Specifications
        </div>

        {/* Gas Type */}
        <div className="mt-[10px] pl-[30px] text-sm font-semibold uppercase">
          Gas Type
        </div>
        <div className="flex px-4 py-1 w-full">
          <div className="flex gap-[2px] w-full">
            {products.map((p, i) => (
              <div
                key={`compare-gas-type-${i}`}
                className="min-w-[280px] max-w-[330px] w-full bg-neutral-100 border-t border-b border-neutral-300"
              >
                <div className="text-center w-full p-4 flex items-center justify-center gap-[2px]">
                  <SpecsDisplay product={p} field={"gas-type"} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration */}
        <div className="pl-[30px] text-sm font-semibold uppercase">
          Configuration
        </div>
        <div className="flex px-4 py-1 w-full">
          <div className="flex gap-[2px] w-full">
            {products.map((p, i) => (
              <div
                key={`compare-configuration-${i}`}
                className="min-w-[280px] max-w-[330px] w-full bg-neutral-100 border-t border-b border-neutral-300 flex items-center"
              >
                <div className="text-center w-full p-4 flex items-center justify-center gap-[2px]">
                  <SpecsDisplay product={p} field={"configuration"} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model */}
        <div className="pl-[30px] text-sm font-semibold uppercase">
          Model
        </div>
        <div className="flex px-4 py-1 w-full">
          <div className="flex gap-[2px] w-full">
            {products.map((p, i) => (
              <div
                key={`compare-model-${i}`}
                className="min-w-[280px] max-w-[330px] w-full bg-neutral-100 border-t border-b border-neutral-300 flex items-center"
              >
                <div className="text-center w-full p-4 flex items-center justify-center gap-[2px]">
                  <SpecsDisplay product={p} field={"model"} />
                </div>
              </div>
            ))}
          </div>
        </div>

        
        {/* Series */}
        <div className="pl-[30px] text-sm font-semibold uppercase">
          Series
        </div>
        <div className="flex px-4 py-1 w-full">
          <div className="flex gap-[2px] w-full">
            {products.map((p, i) => (
              <div
                key={`compare-series-${i}`}                
                className="min-w-[280px] max-w-[330px] w-full bg-neutral-100 border-t border-b border-neutral-300 flex items-center"
              >
                <div className="text-center w-full p-4 flex items-center justify-center gap-[2px]">
                  <SpecsDisplay product={p} field={"series"} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
