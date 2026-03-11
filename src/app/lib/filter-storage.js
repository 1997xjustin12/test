import {
  transformNumberDoors,
  transformFilterNumberDoors,
  transformNumberSize,
  transformFilterNumberSize,
  transformNumberDrawers,
  transformFilterNumberDrawers,
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
    runtime_mapping: {
      storage_type: {
        type: "keyword",
        script: {
          source: `
            def data = params['_source']['accentuate_data'];
            if (data != null && data['bbq.brand_storage_specs_type'] != null) {
              def val = data['bbq.brand_storage_specs_type'];
              if (val != null) {
                if (val instanceof String && val.contains('/')) {
                  // Split the string and emit each piece as an individual token
                  String[] parts = /\\//.split(val);
                  for (String part : parts) {
                    emit(part.trim());
                  }
                } else {
                  // It's already a single value or an array, just emit it
                  emit(val.toString());
                }
              }
            }
          `,
        },
      },
    },
    facet_attribute: {
      attribute: "storage_type",
      field: "storage_type",
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
    runtime_mapping: {
      storage_mounting_type: {
        type: "keyword",
        script: {
          source: `
            def data = params['_source']['accentuate_data'];
            if (data != null && data['bbq.storage_specs_mounting_type'] != null) {
              def val = data['bbq.storage_specs_mounting_type'];
              if (val != null) {
                if (val instanceof String && val.contains('/')) {
                  // Split the string and emit each piece as an individual token
                  String[] parts = /\\//.split(val);
                  for (String part : parts) {
                    emit(part.trim());
                  }
                } else {
                  // It's already a single value or an array, just emit it
                  emit(val.toString());
                }
              }
            }
          `,
        },
      },
    },
    facet_attribute: {
      attribute: "storage_mounting_type",
      field: "storage_mounting_type",
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
  // "Class", NOT ACTUALLY STATED
  {
    label: "Class",
    attribute: "storage_class",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "storage_class",
      field: "accentuate_data.bbq.storage_specs_class",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.storage_specs_class",
    cluster: "storage",
  },
  // "Hinge Type", NOT ACTUALLY STATED
  {
    label: "Hinge Type",
    attribute: "storage_hinge_type",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "storage_hinge_type",
      field: "accentuate_data.bbq.storage_specs_hinge_type",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.storage_specs_hinge_type",
    cluster: "storage",
  },
];

const allFilterAttributes = [
  ...new Set(storageFilters.map(({ attribute }) => attribute)),
];

const storageFilterStructure = [
  "ways_to_shop",
  "brands",
  "price_groups",
  "price",
  "storage_type",
  "storage_no_of_doors",
  "storage_no_of_drawers",
  "storage_mounting_type",
  "storage_orientation",
];

const accessDoorsFilterStructure = [
  "ways_to_shop",
  "brands",
  "price_groups",
  "price",
  "storage_no_of_doors",
  "storage_mounting_type",
  "storage_orientation",
  "storage_class",
  "storage_material",
  "storage_hinge_type", 
];

const storageDrawersFilterStructure = [
  "ways_to_shop",
  "brands",
  "price_groups",
  "price",
  "storage_no_of_drawers",
  "storage_mounting_type",
  "storage_orientation",
];

const doorDrawerCombosFilterStructure = [
  "ways_to_shop",
  "brands",
  "price_groups",
  "price",
  "storage_no_of_doors",
  "storage_no_of_drawers",
  "storage_mounting_type",
  "storage_orientation",
];

const storagePantriesFilterStructure = [
  "ways_to_shop",
  "brands",
  "price_groups",
  "price",
  "storage_no_of_doors",
  "storage_mounting_type",
  "storage_orientation",
];

const trashBinsFilterStructure = [
  "ways_to_shop",
  "brands",
  "price_groups",
  "price",
  "storage_no_of_doors",
  "storage_no_of_drawers",
  "storage_mounting_type",
  "storage_orientation",
];

const iceBinsStorageFilterStructure = [
  "ways_to_shop",
  "brands",
  "price_groups",
  "price",
  "storage_mounting_type",
];

const propaneTankBinsFilterStructure = [
  "ways_to_shop",
  "brands",
  "price_groups",
  "price",
  "storage_no_of_doors",
  "storage_mounting_type",
  "storage_orientation",
];

const warmingDrawersFilterStructure = [
  "ways_to_shop",
  "brands",
  "price_groups",
  "price",
  "storage_no_of_doors",
  "storage_mounting_type",
  "storage_orientation",
];

export const storageFilterTypes = {
  storage: storageFilterStructure,
  "access-doors":  accessDoorsFilterStructure,
  "storage-drawers": storageDrawersFilterStructure,
  "door-and-drawer-combos": doorDrawerCombosFilterStructure,
  "storage-pantries": storagePantriesFilterStructure,
  "trash-bins": trashBinsFilterStructure,
  "ice-bins-and-storage": iceBinsStorageFilterStructure,
  "propane-tank-bins": propaneTankBinsFilterStructure,
  "spice-racks":[],
  "warming-drawers":warmingDrawersFilterStructure
};