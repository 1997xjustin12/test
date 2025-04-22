"use client";
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

const searchClient = Client({
  url: "/api/es/searchkit", // This is the backend API endpoint
});

const HitView = (props) => {
  return (
    <div>
      <div className="hit__details">
        <h2>
          <Highlight attribute="name" hit={props.hit} />
        </h2>
        <Snippet attribute="description" hit={props.hit} />
      </div>
    </div>
  );
};

const Panel = ({ header, children }) => (
  <div className="panel">
    <h5>{header}</h5>
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

export default function Web() {
  // Frontend filter you want to apply
  const filters = "categories.id:34"; // Apply filter for category with ID 34

  return (
    <div className="">
      <InstantSearch
        indexName="bigcommerce_products"
        searchClient={searchClient}
        routing
      >
        {/* Pass filters to Configure widget */}
        <Configure
          hitsPerPage={15}
          filters={filters}  // Filters passed here
        />
        <div className="container">
          <div className="search-panel">
            <div className="search-panel__filters">
              <DynamicWidgets facets={["*"]}>
                <Panel header="brand">
                  <RefinementList attribute="brand" searchable />
                </Panel>
                <Panel header="price">
                  <RangeInput attribute="price" />
                </Panel>
              </DynamicWidgets>
            </div>
            <div className="search-panel__results">
              <div className="searchbox">
                <SearchBox />
              </div>

              <Stats />
              <CurrentRefinements />
              <QueryRulesBanner />

              <Hits hitComponent={HitView} />
              <Pagination />
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}