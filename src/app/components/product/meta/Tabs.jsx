"use client";
import { useState } from "react";

const ProductMetaTabs = ({ product }) => {
  const [tab, setTab] = useState("Product Descriptions");
  const tabs = [
    {
      name: "Product Descriptions",
      content: product?.description,
    },
    {
      name: "Specification",
      content: "<div style='font-weight:bold'>Specification</div>",
    },
    {
      name: "Guides & Installations",
      content: "<div style='font-weight:bold'>Guides & Installations</div>",
    },
  ];

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
                ? "bg-pallete-orange text-white font-bold"
                : "bg-stone-100 text-stone-500"
            }`}>
            {v.name}
          </button>
        ))}
      </div>
      <div className="border p-[20px] text-[14px] md:text-[16px]">
        <div
          dangerouslySetInnerHTML={{
            __html: tabs.filter((i) => i.name === tab)[0]?.content,
          }}></div>
      </div>
    </div>
  );
};

export default ProductMetaTabs;
