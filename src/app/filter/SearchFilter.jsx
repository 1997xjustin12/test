'use client'
import React from "react";
import ReactDOM from "react-dom";
import Client from "@searchkit/instantsearch-client";
import Searchkit from "searchkit";
import { InstantSearch, SearchBox, Hits, RefinementList } from "react-instantsearch";
 
// Create a Searchkit client
// This is the configuration for Searchkit, specifying the fields to attributes used for search, facets, etc.
const sk = new Searchkit({
  connection: {
    host: "https://solanafireplaces.com/es",
    // cloud_id: "my-cloud-id" // if using Elastic Cloud
    // if you're authenticating with username/password
    // https://www.searchkit.co/docs/guides/setup-elasticsearch#connecting-with-usernamepassword
    //auth: {
    //  username: "elastic",
    //  password: "changeme"
    //},
    // if you're authenticating with api key
    // https://www.searchkit.co/docs/guides/setup-elasticsearch#connecting-with-api-key
     apiKey: "eHgtQWI1VUI0Nm1Xbl9IdGNfRG46bFZqUjQtMzJRN3kzdllmVjVDemNHdw=="
  },
  search_settings: {
    search_attributes: ['name'],
    result_attributes: ['name', 'description']
  },
})
 
const searchClient = Client(sk);
 
const SearchFilter = () => (
  <>
  <label>test</label>
  <InstantSearch indexName="bigcommerce_products" searchClient={searchClient}>
    <SearchBox />
    <Hits />
  </InstantSearch>
  </>
);
 
export default SearchFilter;