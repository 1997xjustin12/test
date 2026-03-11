import {
  transformNumber,
  transformFilterNumber,
  transformNumberDoors,
  transformFilterNumberDoors,
  transformNumberSize,
  transformFilterNumberSize,
  transformNumberDrawers,
  transformFilterNumberDrawers,
  transformNumberRacks,
  transformFilterNumberRacks,
  transformDimension,
  transformFilterDimensions,
} from "../lib/helpers";

const yesNo = ["Yes", "No"]; // used for transform sort

export const storageFilters = [
  // "Type",
  // "bbq.brand_storage_specs_type"
  {
    label: "Type",
    attribute: "storage_type",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "storage_type",
      field: "accentuate_data.bbq.brand_storage_specs_type",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.brand_storage_specs_type",
    cluster: "storage",
  },
  // "Number Of Doors",
  // "bbq.storage_specs_number_of_doors"
  {
    label: "Number Of Doors",
    attribute: "storage_no_of_doors",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    transform: transformFilterNumberDoors,
    transformSpecs: transformNumberDoors,
    facet_attribute: {
      attribute: "storage_no_of_doors",
      field: "accentuate_data.bbq.storage_specs_number_of_doors",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.storage_specs_number_of_doors",
    cluster: "storage",
  },
  // "Number Of Drawers",
  // "bbq.storage_specs_number_of_drawers"
  {
    label: "Number Of Drawers",
    attribute: "storage_no_of_drawers",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    transform: transformFilterNumberDrawers,
    transformSpecs: transformNumberDrawers,
    facet_attribute: {
      attribute: "storage_no_of_drawers",
      field: "accentuate_data.bbq.storage_specs_number_of_drawers",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.storage_specs_number_of_drawers",
    cluster: "storage",
  },
  // "Mounting Type",
  // "bbq.storage_specs_mounting_type"
  {
    label: "Mounting Type",
    attribute: "storage_mounting_type",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "storage_mounting_type",
      field: "accentuate_data.bbq.storage_specs_mounting_type",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.storage_specs_mounting_type",
    cluster: "storage",
  },
  // "Orientation",
  // "bbq.storage_specs_orientation"
  {
    label: "Orientation",
    attribute: "storage_orientation",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "storage_orientation",
      field: "accentuate_data.bbq.storage_specs_orientation",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.storage_specs_orientation",
    cluster: "storage",
  },
  // "Material",
  // "bbq.seo_meta_material"
  {
    label: "Material",
    attribute: "storage_material",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "storage_material",
      field: "accentuate_data.bbq.seo_meta_material",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.seo_meta_material",
    cluster: "storage",
  },

  // ADDITIONALS NOT FOUND IN OKO
  // Series
  // "bbq.seo_meta_series": capitalizeWords(item?.["bbq.seo_meta_series"]),
  {
    label: "Series",
    attribute: "storage_series",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "storage_series",
      field: "accentuate_data.bbq.seo_meta_series",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.seo_meta_series",
    cluster: "storage",
  },
  // Sink Bar Center Type
  // "bbq.sink_bars_center_type"
  {
    label: "Sink Bar Center Type",
    attribute: "storage_sink_center_type",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "storage_sink_center_type",
      field: "accentuate_data.bbq.sink_bars_center_type",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.sink_bars_center_type",
    cluster: "storage",
  },
  // Sink Bar Center Configuration
  // "bbq.sink_bars_center_configuration": capitalizeWords(item?.["bbq.sink_bars_center_configuration"]),
  {
    label: "Sink Bar Center Configuration",
    attribute: "storage_sink_center_configuration",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "storage_sink_center_configuration",
      field: "accentuate_data.bbq.sink_bars_center_configuration",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.sink_bars_center_configuration",
    cluster: "storage",
  },
  // Storage Cutout Width
  // "bbq.storage_specs_cutout_width"
  {
    label: "Storage Cutout Width",
    attribute: "storage_cutout_width",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    transform: transformFilterNumberSize,
    transformSpecs: transformNumberSize,
    facet_attribute: {
      attribute: "storage_cutout_width",
      field: "accentuate_data.bbq.storage_specs_cutout_width",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.storage_specs_cutout_width",
    cluster: "storage",
  },
  // Storage Cutout Height
  // "bbq.storage_specs_cutout_height"
  {
    label: "Storage Cutout Height",
    attribute: "storage_cutout_height",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    transform: transformFilterNumberSize,
    transformSpecs: transformNumberSize,
    facet_attribute: {
      attribute: "storage_cutout_height",
      field: "accentuate_data.bbq.storage_specs_cutout_height",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.storage_specs_cutout_height",
    cluster: "storage",
  },
  // Storage Cutout Depth
  // "bbq.storage_specs_cutout_depth"
  {
    label: "Storage Cutout Depth",
    attribute: "storage_cutout_depth",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    transform: transformFilterNumberSize,
    transformSpecs: transformNumberSize,
    facet_attribute: {
      attribute: "storage_cutout_depth",
      field: "accentuate_data.bbq.storage_specs_cutout_depth",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.storage_specs_cutout_depth",
    cluster: "storage",
  },
  
  // "bbq.sink_bars_center_cutout_width": stringToFloat(item?.["bbq.sink_bars_center_cutout_width"]),
  // "bbq.sink_bars_center_cutout_height": stringToFloat(item?.["bbq.sink_bars_center_cutout_height"]),
  // "bbq.sink_bars_center_cutout_depth": stringToFloat(item?.["bbq.sink_bars_center_cutout_depth"]),


  // "bbq.ref_specs_cutout_width": stringToFloat(item?.["bbq.ref_specs_cutout_width"]),
  // "bbq.ref_specs_cutout_height": stringToFloat(item?.["bbq.ref_specs_cutout_height"]),
  // "bbq.ref_specs_cutout_depth": stringToFloat(item?.["bbq.ref_specs_cutout_depth"]),
  
  // "Class", NOT ACTUALLY STATED
  // "Hinge Type", NOT ACTUALLY STATED
  // "Option", ??
];

const allFilterAttributes = [
  ...new Set(storageFilters.map(({ attribute }) => attribute)),
];
console.log("allStorageFilters", allFilterAttributes);

const storageFilterStructure = [
  "ways_to_shop",
  "brands",
  "storage_type",
  "price_groups",
  "price",
  "storage_no_of_doors",
  "storage_no_of_drawers",
  "storage_mounting_type",
  "storage_orientation",
  "storage_material",
  "storage_series",
];

export const storageFilterTypes = {
  storage: allFilterAttributes,
};


