"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Rating } from "@smastrom/react-rating";
import { ICRoundPhone } from "@/app/components/icons/lib";
import FicDropDown from "@/app/components/atom/FicDropDown";
import Link from "next/link";

import ProductCard from "@/app/components/atom/ProductCardV2";
import Image from "next/image";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  RefinementList,
  Pagination,
  Stats,
  Snippet,
  CurrentRefinements,
  HierarchicalMenu,
  Configure,
  DynamicWidgets,
  RangeInput,
  useQueryRules,
} from "react-instantsearch";
import Client from "@searchkit/instantsearch-client";

// const es_index = "bigcommerce_products_3";
const es_index = "solana_products";

const searchClient = Client({
  url: "/api/es/searchkit",
});

const Panel = ({ header, children }) => (
  <div className="panel">
    <h5 className="my-3">{header}</h5>
    {children}
  </div>
);

const QueryRulesBanner = () => {
  const { items } = useQueryRules({});
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="query-rules">
      {items.map((item) => (
        <div key={item.objectID} className="query-rules__item">
          <a href={item.url}>
            <b className="query-rules__item-title">{item.title}</b>
            <span className="query-rules__item-description">{item.body}</span>
          </a>
        </div>
      ))}
    </div>
  );
};

const JsonViewer = ({ hit }) => {
  return (
    <pre
      style={{
        background: "#f5f5f5",
        padding: "1rem",
        borderRadius: "8px",
        overflowX: "auto",
      }}
    >
      {JSON.stringify(hit, null, 2)}
    </pre>
  );
};

const SPProductCard = ({ hit }) => {
  return (
    
    <Link
      prefetch={false}
      href={`/dev/shopify_solana_product/${hit.handle}`}
      // onClick={handleProductItemClick}
      className="flex w-full h-full bg-white overflow-hidden rounded-md border duration-500  hover:shadow-xl pb-[8px] hover:border-stone-700 group"
    >
      <div className="w-full">
        <div
          className={`w-full flex items-center justify-center h-[230px] overflow-hidden relative bg-white`}
        >
          {
            hit?.images && Array.isArray(hit?.images) && hit?.images?.length > 0 && hit.images[0]?.src && <img
              src={hit.images[0].src}
              alt={hit.images[0].alt}
              className={`object-contain h-full opacity-100`}
            />
          }
          <div
            className="absolute bottom-0 left-0 bg-theme-500 text-white text-[12px] py-[5px] md:py-[7px] md:px-[15px] flex items-center w-full justify-center gap-[5px] invisible group-hover:visible"
          >
            <div className="flex justify-center">
              <div className="font-semibold text-[0.775rem] inline-block text-center">
                <Icon
                  icon="mi:shopping-cart-add"
                  className="text-lg font-thin inline-block mr-[5px]"
                />
                {/* CUSTOMIZE TO PURCHASE */}
                QUICK VIEW
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col px-[15px] pt-[5px] border-t">
          <div
            className="text-sm line-clamp-2 font-semibold text-stone-700"
            title={hit.title}
          >
            {hit.title}
          </div>
          <div className={`flex items-center gap-[5px]`}>
            <Rating
              readOnly
              value={hit.ratings.rating_count}
              fractions={2}
              style={{ maxWidth: 100 }}
            ></Rating>
            <div className={`text-[0.75rem]`}>
              ({hit.ratings.rating_count}){/* (id:{product.id}) */}
            </div>
          </div>
          <div className="mt-3">
            {hit.brand}
          </div>
          <div className="mt-3">
            <div>
              <div>Price: {hit.variants[0].price}</div>
              <div>BasePrice: {hit.variants[0]?.compare_at_price}</div>
            </div>
          </div>
          <FicDropDown>
          <div className="text-xs my-[5px] text-blue-500 flex items-center cursor-default gap-[7px] flex-wrap">
            <div
              className="hover:underline flex items-center gap-[3px] cursor-pointer"
            >
              <ICRoundPhone width={16} height={16} /> <div>(888) 575-9720</div>
            </div>
          </div>
          </FicDropDown>

        </div>
      </div>
    </Link>
    // <div className="flex flex-col gap-[10px] border border-neutral-600 rounded-md bg-yellow-100 p-3">
    //   <div className="flex gap-[7px] flex-wrap">
    //     {hit?.images &&
    //       Array.isArray(hit.images) &&
    //       hit.images.map((img, index) => (
    //         <div
    //           key={`product-image-${index}`}
    //           className="w-[70px] h-[70px] relative overflow-hidden rounded"
    //         >
    //           <Image
    //             src={img.src}
    //             alt={img.alt}
    //             fill
    //             className="object-contain"
    //           />
    //         </div>
    //       ))}
    //   </div>
    //   <div>Handle : {hit.handle}</div>
    //   <div>Title : {hit.title}</div>
    //   <div>Ratings : {hit.ratings.rating_count}</div>
    //   <div>Tags : {hit.tags}</div>
    //   <div>
    //     <div>Price : {hit.variants[0]?.price}</div>
    //     <div>Qty : {hit.variants[0]?.qty}</div>
    //     <div>SKU : {hit.variants[0]?.sku}</div>
    //     <div>CAP(compare_at_price) : {hit.variants[0]?.compare_at_price}</div>
    //   </div>
    // </div>
  );
};

export default function Web() {
  return (
    <div className="">
      <div>
        <h1 className="uppercase text-lg font-bold">{es_index}</h1>
      </div>
      <InstantSearch indexName={es_index} searchClient={searchClient} routing>
        <Configure hitsPerPage={15} />
        <div className="container">
          <div className="search-panel flex">
            <div className="search-panel__filters  pfd-filter-section">
              <DynamicWidgets facets={["*"]}>
                <div className="my-5">
                  <Panel header="Categories">
                    <RefinementList attribute="product_category" searchable />
                  </Panel>
                </div>
                <div className="my-5">
                  <Panel header="brand">
                    <RefinementList attribute="brand" searchable />
                  </Panel>
                </div>
                <div className="my-5">
                  <Panel header="price">
                    <RangeInput attribute="price" />
                  </Panel>
                </div>
              </DynamicWidgets>
            </div>
            <div className="search-panel__results pfd-product-section">
              <div className="searchbox">
                <SearchBox />
              </div>

              <Stats />
              <CurrentRefinements />
              <QueryRulesBanner />

              <Hits hitComponent={SPProductCard} />
              <Pagination />
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}
