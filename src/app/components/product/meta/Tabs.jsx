"use client";
import { useState } from "react";
import Link from "next/link";

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
    case "bbq.shipping_weight":
      const unit = " lbs.";

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

const ListDisplay = ({ data }) => {
  if (!data) return;
  return (
    <div className="grid grid-cols-[1fr_1fr] sm:grid-cols-[1fr_3fr] gap-y-1 text-sm">
      {data &&
        Array.isArray(data) &&
        data
          .filter(({ value }) => value !== "")
          .map((item, index) => (
            <div
              key={`spec-item-${index}`}
              className="contents border-b py-2 transition duration-150 group"
            >
              <div className="text-xs sm:text-base font-bold text-neutral-800 group-hover:bg-theme-100 group-hover:border-theme-100 border-[transparent] py-1 border-b">
                {item?.label}:
              </div>
              <div className="text-xs sm:text-base  sm:pl-5 font-semibold text-theme-700 group-hover:underline group-hover:bg-theme-100 group-hover:border-theme-100 border-[transparent] py-1 border-b">
                {normalizeSpecValue(item?.key, item?.value)}
              </div>
            </div>
          ))}
    </div>
  );
};

const Guides = ({ guides }) => {
  if (!guides) return;
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-stone-800">Manufacturer's Manual</h3>
      <div className="flex flex-wrap gap-3">
        {guides &&
          guides.map((item, index) => (
            <Link
              key={`manual-item-${index}`}
              prefetch={false}
              href={item?.value || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md text-center hover:shadow-md p-3 bg-theme-800 text-white text-xs font-semibold break-words max-w-[250px] line-clamp-2"
              title={item?.label}
            >
              {item?.label}
            </Link>
          ))}
      </div>
    </div>
  );
};

const AccordionSection = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="border-b border-stone-200">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center py-4 px-4 text-left bg-stone-50 hover:bg-stone-100 transition-colors"
      >
        <span className="font-semibold text-stone-800 text-sm">{title}</span>
        <svg
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && <div className="p-4 bg-white text-sm">{children}</div>}
    </div>
  );
};

const ProductMetaTabs = ({ product }) => {
  const allTabs = [
    {
      name: "Product Descriptions",
      content: product?.description || product?.body_html,
      hasData: !!(product?.description || product?.body_html),
    },
    {
      name: "Specifications",
      content: "",
      hasData: !!(
        product?.product_specs &&
        Array.isArray(product.product_specs) &&
        product.product_specs.length > 0
      ),
    },
    {
      name: "Guides & Installations",
      content: "",
      hasData: !!(
        product?.product_manuals &&
        Array.isArray(product.product_manuals) &&
        product.product_manuals.length > 0
      ),
    },
    {
      name: "Shipping Information",
      content: "",
      hasData: !!(
        product?.product_shipping_info &&
        Array.isArray(product.product_shipping_info) &&
        product.product_shipping_info.length > 0
      ),
    },
  ];

  const tabs = allTabs.filter((tab) => tab.hasData);

  const [tab, setTab] = useState(tabs[0]?.name || "Product Descriptions");
  const [openAccordions, setOpenAccordions] = useState({
    "Product Descriptions": true,
    Specifications: false,
    "Guides & Installations": false,
  });

  const handleTabChange = (tab) => {
    setTab((prev) => tab);
  };

  const toggleAccordion = (name) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div>
      {/* Mobile Accordion Layout */}
      <div className="block md:hidden">
        {tabs.map((v, i) => (
          <AccordionSection
            key={`accordion-${i}`}
            title={v.name}
            isOpen={openAccordions[v.name]}
            onToggle={() => toggleAccordion(v.name)}
          >
            {v.name === "Product Descriptions" && (
              <div
                className="product_description_content"
                dangerouslySetInnerHTML={{
                  __html: v.content,
                }}
              ></div>
            )}
            {v.name === "Specifications" && (
              <ListDisplay data={product?.product_specs} />
            )}
            {v.name === "Guides & Installations" && (
              <Guides guides={product?.product_manuals} />
            )}
            {v.name === "Shipping Information" && (
              <ListDisplay data={product?.product_shipping_info} />
            )}
          </AccordionSection>
        ))}
      </div>

      {/* Desktop Tabs Layout */}
      <div className="hidden md:block">
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
          {tab === "Product Descriptions" && (
            <div
              className="product_description_content"
              dangerouslySetInnerHTML={{
                __html: tabs.filter((i) => i.name === tab)[0]?.content,
              }}
            ></div>
          )}
          {/* ListDisplay display */}
          {tab === "Specifications" && (
            <ListDisplay data={product?.product_specs} />
          )}
          {/* guides display */}
          {tab === "Guides & Installations" && (
            <Guides guides={product?.product_manuals} />
          )}
          {/* shipping info display */}
          {tab === "Shipping Information" && (
            <ListDisplay data={product?.product_shipping_info} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductMetaTabs;
