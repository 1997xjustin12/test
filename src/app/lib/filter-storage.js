import {
  transformNumberDoors,
  transformFilterNumberDoors,
  transformNumberSize,
  transformFilterNumberSize,
  transformNumberDrawers,
  transformFilterNumberDrawers,
  transformYesNo,
} from "../lib/helpers";

export const storageFilters = [
  {
    label: "Item Type",
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
    collapse: true,
    accentuate_prop: "bbq.storage_specs_number_of_doors",
    cluster: "storage",
  },
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
    collapse: true,
    accentuate_prop: "bbq.storage_specs_number_of_drawers",
    cluster: "storage",
  },
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
    collapse: true,
    accentuate_prop: "bbq.storage_specs_mounting_type",
    cluster: "storage",
  },
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
    collapse: true,
    accentuate_prop: "bbq.storage_specs_orientation",
    cluster: "storage",
  },
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
    collapse: true,
    accentuate_prop: "bbq.seo_meta_material",
    cluster: "storage",
  },
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
    collapse: true,
    accentuate_prop: "bbq.seo_meta_series",
    cluster: "storage",
  },
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
    collapse: true,
    accentuate_prop: "bbq.sink_bars_center_type",
    cluster: "storage",
  },
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
    collapse: true,
    accentuate_prop: "bbq.sink_bars_center_configuration",
    cluster: "storage",
  },
  {
    label: "Cutout Width",
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
    collapse: true,
    accentuate_prop: "bbq.storage_specs_cutout_width",
    cluster: "storage",
  },
  {
    label: "Cutout Width Range",
    attribute: "storage_cutout_width_range",
    searchable: false,
    type: "RefinementList",
    transform: function (items) {
      const sortKeys = [
        "1 - 15 Inches",
        "15 - 23 Inches",
        "23 - 30 Inches",
        "30 Inches And Up",
      ];
      return items.sort((a, b) => {
        return sortKeys.indexOf(a.value) - sortKeys.indexOf(b.value);
      });
    },
    runtime_mapping: {
      storage_cutout_width_range: {
        type: "keyword",
        script: {
          source: `
            // 1. Safely grab the data. Using _source is okay for nested Accentuate data, 
            // but we must check every level.
            def data = params['_source']['accentuate_data'];
            if (data == null || !(data instanceof Map)) return;
            
            def rawValue = data.get('bbq.storage_specs_cutout_width');
            if (rawValue == null) return;
            
            double size = 0;
            try {
              // 2. Force to string first to handle both Numbers and Strings safely
              String strValue = rawValue.toString().toLowerCase();
              String cleanValue = strValue.replace('"', "").replace("inches", "").trim();
              size = Double.parseDouble(cleanValue);
            } catch (Exception e) {
              return; // Skip documents with unparseable values
            }
      
            // 3. Logic mapping (ensure no gaps)
            if (size <= 15) {
              emit("1 - 15 Inches");
            } else if (size <= 23) {
              emit("15 - 23 Inches");
            } else if (size <= 30) {
              emit("23 - 30 Inches");
            } else {
              emit("30 Inches And Up");
            }
          `,
        },
      },
    },
    facet_attribute: {
      attribute: "storage_cutout_width_range",
      field: "storage_cutout_width_range",
      type: "string",
    },
    collapse: true,
    cluster: "storage",
  },
  {
    label: "Cutout Height",
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
    collapse: true,
    accentuate_prop: "bbq.storage_specs_cutout_height",
    cluster: "storage",
  },
  {
    label: "Cutout Height Range",
    attribute: "storage_cutout_height_range",
    searchable: false,
    type: "RefinementList",
    transform: function (items) {
      const sortKeys = [
        "1 - 9 Inches",
        "9 - 18 Inches",
        "18 - 24 Inches",
        "24 Inches And Up",
      ];
      return items.sort((a, b) => {
        return sortKeys.indexOf(a.value) - sortKeys.indexOf(b.value);
      });
    },
    runtime_mapping: {
      storage_cutout_height_range: {
        type: "keyword",
        script: {
          source: `
            // but we must check every level.
            def data = params['_source']['accentuate_data'];
            if (data == null || !(data instanceof Map)) return;
            
            def rawValue = data.get('bbq.storage_specs_cutout_height');
            if (rawValue == null) return;
            
            double size = 0;
            try {
              // 2. Force to string first to handle both Numbers and Strings safely
              String strValue = rawValue.toString().toLowerCase();
              String cleanValue = strValue.replace('"', "").replace("inches", "").trim();
              size = Double.parseDouble(cleanValue);
            } catch (Exception e) {
              return; // Skip documents with unparseable values
            }
            
            // 3. Logic mapping (ensure no gaps)
            if (size <= 15) {
              emit("1 - 9 Inches");
            } else if (size <= 20) {
              emit("9 - 18 Inches");
            } else if (size <= 24) {
              emit("18 - 24 Inches");
            } else {
              emit("24 Inches And Up");
            }
          `,
        },
      },
    },
    facet_attribute: {
      attribute: "storage_cutout_height_range",
      field: "storage_cutout_height_range",
      type: "string",
    },
    collapse: true,
    cluster: "storage",
  },
  {
    label: "Cutout Depth",
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
    collapse: true,
    accentuate_prop: "bbq.storage_specs_cutout_depth",
    cluster: "storage",
  },
  {
    label: "Cutout Depth Range",
    attribute: "storage_cutout_depth_range",
    searchable: false,
    type: "RefinementList",
    transform: function (items) {
      const sortKeys = [
        "1 - 15 Inches",
        "15 - 20 Inches",
        "20 - 24 Inches",
        "24 Inches And Up",
      ];
      return items.sort((a, b) => {
        return sortKeys.indexOf(a.value) - sortKeys.indexOf(b.value);
      });
    },
    runtime_mapping: {
      storage_cutout_depth_range: {
        type: "keyword",
        script: {
          source: `
            // but we must check every level.
            def data = params['_source']['accentuate_data'];
            if (data == null || !(data instanceof Map)) return;
            
            def rawValue = data.get('bbq.storage_specs_cutout_depth');
            if (rawValue == null) return;
            
            double size = 0;
            try {
              // 2. Force to string first to handle both Numbers and Strings safely
              String strValue = rawValue.toString().toLowerCase();
              String cleanValue = strValue.replace('"', "").replace("inches", "").trim();
              size = Double.parseDouble(cleanValue);
            } catch (Exception e) {
              return; // Skip documents with unparseable values
            }
            
            // 3. Logic mapping (ensure no gaps)
            if (size <= 15) {
              emit("1 - 15 Inches");
            } else if (size <= 20) {
              emit("15 - 20 Inches");
            } else if (size <= 24) {
              emit("20 - 24 Inches");
            } else {
              emit("24 Inches And Up");
            }
          `,
        },
      },
    },
    facet_attribute: {
      attribute: "storage_cutout_depth_range",
      field: "storage_cutout_depth_range",
      type: "string",
    },
    collapse: true,
    cluster: "storage",
  },
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
    collapse: true,
    accentuate_prop: "bbq.storage_specs_class",
    cluster: "storage",
  },
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
    collapse: true,
    accentuate_prop: "bbq.storage_specs_hinge_type",
    cluster: "storage",
  },
  // "bbq.storage_specs_width"
  {
    label: "Width",
    attribute: "storage_width",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    transform: transformFilterNumberSize,
    transformSpecs: transformNumberSize,
    facet_attribute: {
      attribute: "storage_width",
      field: "accentuate_data.bbq.storage_specs_width",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.storage_specs_width",
    cluster: "storage",
  },
  // "bbq.storage_specs_height"
  // "bbq.storage_specs_depth"
  // "bbq.storage_specs_configuration"
  {
    label: "Configuration",
    attribute: "storage_configuration",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "storage_configuration",
      field: "accentuate_data.bbq.storage_specs_configuration",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.storage_specs_configuration",
    cluster: "storage",
  },
  // "bbq.storage_specs_collection"
  {
    label: "Collection",
    attribute: "storage_collection",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "storage_collection",
      field: "accentuate_data.bbq.storage_specs_collection",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.storage_specs_collection",
    cluster: "storage",
  },
  // "bbq.storage_specs_door_and_drawer_combo"
  {
    label: "Door and Drawer Combo",
    attribute: "storage_door_drawer_combo",
    searchable: false,
    type: "RefinementList",
    transform: transformYesNo,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "storage_door_drawer_combo",
      field: "accentuate_data.bbq.storage_specs_door_and_drawer_combo",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.storage_specs_door_and_drawer_combo",
    cluster: "storage",
  },
  // "bbq.storage_specs_includes_paper_towel_holder"
  {
    label: "Includes Paper Towel Holder",
    attribute: "storage_includes_paper_towel_holder",
    searchable: false,
    type: "RefinementList",
    transform: transformYesNo,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "storage_includes_paper_towel_holder",
      field: "accentuate_data.bbq.storage_specs_includes_paper_towel_holder",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.storage_specs_includes_paper_towel_holder",
    cluster: "storage",
  },
  // "bbq.storage_specs_includes_tank_holder"
  {
    label: "Includes Tank Holder",
    attribute: "storage_includes_tank_holder",
    searchable: false,
    type: "RefinementList",
    transform: transformYesNo,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "storage_includes_tank_holder",
      field: "accentuate_data.bbq.storage_specs_includes_tank_holder",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.storage_specs_includes_tank_holder",
    cluster: "storage",
  },
  // "bbq.storage_specs_includes_trash_bin"
  {
    label: "Includes Trash Bin",
    attribute: "storage_includes_trash_bin",
    searchable: false,
    type: "RefinementList",
    transform: transformYesNo,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "storage_includes_trash_bin",
      field: "accentuate_data.bbq.storage_specs_includes_trash_bin",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.storage_specs_includes_trash_bin",
    cluster: "storage",
  },
  // "bbq.storage_specs_color"
  {
    label: "Primary Color",
    attribute: "storage_color",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "storage_color",
      field: "accentuate_data.bbq.storage_specs_color",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.storage_specs_color",
    cluster: "storage",
  },
  // "bbq.storage_specs_style"
  {
    label: "Style",
    attribute: "storage_style",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "storage_style",
      field: "accentuate_data.bbq.storage_specs_style",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.storage_specs_style",
    cluster: "storage",
  },
  // "bbq.storage_specs_extra_features"
  {
    label: "Extra Features",
    attribute: "storage_extra_features",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: {
      storage_extra_features: {
        type: "keyword",
        script: {
          source: `
            def data = params['_source']['accentuate_data'];
            if (data != null && data['bbq.storage_specs_extra_features'] != null) {
              def val = data['bbq.storage_specs_extra_features'];
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
      attribute: "storage_extra_features",
      field: "storage_extra_features",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.storage_specs_extra_features",
    cluster: "storage",
  },
];

const allFilterAttributes = [
  ...new Set(storageFilters.map(({ attribute }) => attribute)),
];

// DONE
const storageFilterStructure = [
  "ways_to_shop",
  "brands",
  "storage_type",
  "storage_configuration",
  "storage_class",
  "price_groups",
  "price",
  "storage_material",
  "storage_mounting_type",
  "storage_color",
];
// DONE
const accessDoorsFilterStructure = [
  "ways_to_shop",
  "brands",
  "storage_collection",
  "storage_width",
  "storage_no_of_drawers",
  "storage_no_of_doors",
  "price_groups",
  "price",
  "storage_cutout_width_range",
  "storage_cutout_height",
  "storage_cutout_depth_range",
  "storage_includes_trash_bin",
  "storage_extra_features",
  "storage_class",
  "storage_door_drawer_combo",
  "storage_includes_tank_holder",
  "storage_includes_paper_towel_holder",
  "storage_material",
  "storage_mounting_type",
  "storage_color",
  "storage_orientation",
  "storage_cutout_width",
  "storage_cutout_depth",
];
// DONE
const storageDrawersFilterStructure = [
  "ways_to_shop",
  "brands",
  "storage_width",
  "storage_no_of_drawers",
  "storage_configuration",
  "price_groups",
  "price",
  "storage_cutout_width_range",
  "storage_cutout_height_range",
  "storage_cutout_depth",
  "storage_includes_trash_bin",
  "storage_extra_features",
  "storage_class",
  "storage_includes_tank_holder",
  "storage_includes_paper_towel_holder",
  "storage_material",
  "storage_mounting_type",
  "storage_color",
  "storage_cutout_width",
  "storage_cutout_height",
];
// DONE
const iceBinsStorageFilterStructure = storageFilterStructure;
// DONE
const doorDrawerCombosFilterStructure = [
  "ways_to_shop",
  "brands",
  "storage_collection",
  "storage_width",
  "storage_no_of_drawers",
  "storage_no_of_doors",
  "price_groups",
  "price",
  "storage_style",
  "storage_cutout_width_range", 
  "storage_cutout_height_range", 
  "storage_cutout_depth_range", 
  "storage_includes_trash_bin", 
  "storage_extra_features",
  "storage_class",
  "storage_includes_tank_holder", 
  "storage_includes_paper_towel_holder", 
  "storage_material",
  "storage_mounting_type",
  "storage_color",
  "storage_orientation",
  "storage_cutout_width",
  "storage_cutout_height",
];
// DONE
const trashBinsFilterStructure = [
  "ways_to_shop",
  "brands",
  "storage_collection",
  "storage_width",
  "storage_no_of_drawers",
  "storage_configuration",
  "price_groups",
  "price",
  "storage_type",
  "storage_cutout_width_range",
  "storage_cutout_height_range",
  "storage_cutout_depth_range",
  "storage_includes_trash_bin",
  "storage_extra_features",
  "storage_class",
  "storage_includes_tank_holder",
  "storage_includes_paper_towel_holder",
  "storage_material",
  "storage_mounting_type",
  "storage_color",
  "storage_cutout_width",
  "storage_cutout_depth",
  "storage_cutout_height",
];

const storagePantriesFilterStructure = storageFilterStructure;
const propaneTankBinsFilterStructure = storageFilterStructure;
const warmingDrawersFilterStructure = storageFilterStructure;

export const storageFilterTypes = {
  storage: storageFilterStructure,
  "access-doors": accessDoorsFilterStructure,
  "storage-drawers": storageDrawersFilterStructure,
  "door-and-drawer-combos": doorDrawerCombosFilterStructure,
  "storage-pantries": storagePantriesFilterStructure,
  "trash-bins": trashBinsFilterStructure,
  "ice-bins-and-storage": iceBinsStorageFilterStructure,
  "propane-tank-bins": propaneTankBinsFilterStructure,
  "spice-racks": [], // no filters display (2 items only)
  "warming-drawers": warmingDrawersFilterStructure,
};
