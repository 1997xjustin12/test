"use client";
import { useState } from "react";

const normalizeSpecValue = (key, value) => {
  let result = value;
  switch (key) {
    case "bbq.number_of_main_burners":
      result = `${value
        ?.toLowerCase()
        ?.replace("burners", "")
        .replace("burner", "")} burner/s`;
      break;
    case "bbq.product_weight":
      const unit = " lbs";

      let formattedWeight;

      if (value % 1 !== 0) {
        // If the number has a fractional part (e.g., 490.5)
        formattedWeight = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2, // Force two decimal places
          maximumFractionDigits: 2,
        }).format(value);
      } else {
        // If the number is an integer (e.g., 490.0)
        formattedWeight = new Intl.NumberFormat("en-US", {
          maximumFractionDigits: 0, // No decimal places
        }).format(value);
      }
      result = formattedWeight + unit;
      break;
    default:
      result = value;
      break;
  }
  return result;
};

const Specifications = ({ specs }) => {
  if (!specs) return;
  console.log("specs", specs);
  return (
    <div className="grid grid-cols-[1fr_1fr] sm:grid-cols-[1fr_3fr] gap-y-1 text-sm">
      {specs &&
        Array.isArray(specs) &&
        specs.map((item, index) => (
          <div
            key={`spec-item-${index}`}
            className="contents border-b py-2 transition duration-150 group"
          >
            <div className="font-semibold text-neutral-800 group-hover:bg-theme-100 group-hover:border-theme-100 border-[transparent] py-1 border-b">
              {item?.label}
            </div>
            <div className="pl-5 text-theme-700 group-hover:underline group-hover:bg-theme-100 group-hover:border-theme-100 border-[transparent] py-1 border-b">
              {normalizeSpecValue(item?.key, item?.value)}
            </div>
          </div>
        ))}
    </div>
  );
};

const Guides = ({ guide }) => {};

const ProductMetaTabs = ({ product }) => {
  const allTabs = [
    {
      name: "Product Descriptions",
      content: product?.description || product?.body_html,
      hasData: !!(product?.description || product?.body_html),
    },
    {
      name: "Specification",
      content: "",
      hasData: !!(
        product?.product_specs &&
        Array.isArray(product.product_specs) &&
        product.product_specs.length > 0
      ),
    },
    {
      name: "Guides & Installations",
      content: "<div style='font-weight:bold'>Guides & Installations</div>",
      hasData: true, // Always show this tab
    },
  ];

  const tabs = allTabs.filter((tab) => tab.hasData);

  const [tab, setTab] = useState(tabs[0]?.name || "Product Descriptions");

  const handleTabChange = (tab) => {
    setTab((prev) => tab);
  };

  return (
    <div>
      <div className="flex">
        {tabs.map((v, i) => (
          <button
            onClick={() => handleTabChange(v.name)}
            key={`meta-tab-${i}`}
            className={`py-[3px] px-[7px] md:py-[7px] md:px-[15px] text-[14px] md:text-[16px] rounded-tl-lg rounded-tr-lg ${
              tab === v.name
                ? "bg-theme-500 text-white font-bold"
                : "bg-stone-100 text-stone-500"
            }`}
          >
            {v.name}
          </button>
        ))}
      </div>
      <div className="border p-[20px] text-[14px] md:text-[16px]">
        {tab !== "Specification" && (
          <div
            dangerouslySetInnerHTML={{
              __html: tabs.filter((i) => i.name === tab)[0]?.content,
            }}
          ></div>
        )}
        {/* specifications display */}
        {tab === "Specification" && (
          <Specifications specs={product?.product_specs} />
        )}
      </div>
    </div>
  );
};

export default ProductMetaTabs;
