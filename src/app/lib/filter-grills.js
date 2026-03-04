import { decimalToFraction } from "../lib/helpers";

const yesNo = ["Yes", "No"]; // used for transform sort

const formatSimpleSize = (value) => {
  return value ? decimalToFraction(value) + " Inches" : "";
};

function formatSimpleSizeFilter(items) {
  return items.map((item) => ({
    ...item,
    label: decimalToFraction(item.value) + " Inches",
  }));
}

function formatValueToNumber(items) {
  return items.map((item) => ({
    ...item,
    label: Number(item.value),
  }));
}

export const grillsFilters = [
  {
    label: "Fuel Type",
    attribute: "grill_fuel_type",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: {
      grill_fuel_type: {
        type: "keyword",
        script: {
          source: `
            def data = params['_source']['accentuate_data'];
            if (data != null && data['bbq.seo_meta_fuel_type'] != null) {
              def val = data['bbq.seo_meta_fuel_type'];
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
      attribute: "grill_fuel_type",
      field: "grill_fuel_type",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.seo_meta_fuel_type",
    cluster: "grills",
  },
  {
    label: "Size",
    attribute: "grill_size",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    transformSpecs: formatSimpleSize,
    transform: formatSimpleSizeFilter,
    facet_attribute: {
      attribute: "grill_size",
      field: "accentuate_data.bbq.grill_specs_size",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.grill_specs_size",
    cluster: "grills",
  },
  {
    label: "Size Range",
    attribute: "grill_size_range",
    searchable: false,
    type: "RefinementList",
    transform: function (items) {
      const sortKeys = [
        "Small (0 - 26 Inches)",
        "Medium (26 - 33 Inches)",
        "Large (33 - 42 Inches)",
        "XL (43 Inches And Up)",
      ];
      return items.sort((a, b) => {
        return sortKeys.indexOf(a.value) - sortKeys.indexOf(b.value);
      });
    },
    runtime_mapping: {
      grill_size_range: {
        type: "keyword",
        script: {
          source: `
            // 1. Safely grab the data. Using _source is okay for nested Accentuate data, 
            // but we must check every level.
            def data = params['_source']['accentuate_data'];
            if (data == null || !(data instanceof Map)) return;
            
            def rawValue = data.get('bbq.grill_specs_size');
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
            if (size <= 26) {
              emit("Small (0 - 26 Inches)");
            } else if (size <= 33) {
              emit("Medium (26 - 33 Inches)");
            } else if (size <= 42) {
              emit("Large (33 - 42 Inches)");
            } else {
              emit("XL (43 Inches And Up)");
            }
          `,
        },
      },
    },
    facet_attribute: {
      attribute: "grill_size_range",
      field: "grill_size_range",
      type: "string",
    },
    collapse: false,
    cluster: "grills",
  },
  {
    label: "Item Type",
    attribute: "grill_item_type",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: {
      grill_item_type: {
        type: "keyword",
        script: {
          source: `
            def data = params['_source']['accentuate_data'];
            if (data != null && data['bbq.grill_specs_type'] != null) {
              def val = data['bbq.grill_specs_type'];
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
      attribute: "grill_item_type",
      field: "grill_item_type",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.grill_specs_type",
    cluster: "grills",
  },
  {
    label: "Class",
    attribute: "grill_class",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: {
      grill_class: {
        type: "keyword",
        script: {
          source: `
            def data = params['_source']['accentuate_data'];
            if (data != null && data['bbq.grill_specs_class'] != null) {
              def val = data['bbq.grill_specs_class'];
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
      attribute: "grill_class",
      field: "grill_class",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.grill_specs_class",
    cluster: "grills",
  },
  {
    label: "WIFI/Bluetooth Enabled",
    attribute: "grill_controller",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: {
      grill_controller: {
        type: "keyword",
        script: {
          source: `
            def data = params['_source']['accentuate_data'];
            if (data != null && data['bbq.grill_specs_controller'] != null) {
              def val = data['bbq.grill_specs_controller'];
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
      attribute: "grill_controller",
      field: "grill_controller",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.grill_specs_controller",
    cluster: "grills",
  },
  {
    label: "Cutout Width",
    attribute: "grill_width",
    searchable: false,
    type: "RefinementList",
    transformSpecs: formatSimpleSize,
    transform: formatSimpleSizeFilter,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_width",
      field: "accentuate_data.bbq.grill_specs_cutout_width",
      type: "string",
    },
    accentuate_prop: "bbq.grill_specs_cutout_width",
    cluster: "grills",
  },
  {
    label: "Cutout Height",
    attribute: "grill_height",
    searchable: false,
    type: "RefinementList",
    transformSpecs: formatSimpleSize,
    transform: formatSimpleSizeFilter,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_height",
      field: "accentuate_data.bbq.grill_specs_cutout_height",
      type: "string",
    },
    accentuate_prop: "bbq.grill_specs_cutout_height",
    cluster: "grills",
  },
  {
    label: "Cutout Depth",
    attribute: "grill_depth",
    searchable: false,
    type: "RefinementList",
    transformSpecs: formatSimpleSize,
    transform: formatSimpleSizeFilter,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_depth",
      field: "accentuate_data.bbq.grill_specs_cutout_depth",
      type: "string",
    },
    accentuate_prop: "bbq.grill_specs_cutout_depth",
    cluster: "grills",
  },
  // {
  //   label: "Cutout Depth",
  //   attribute: "ref_depth_group_1",
  //   searchable: false,
  //   type: "RefinementList",
  //   transform: function (items) {
  //     const sortKeys = [
  //       "Under 14 Inches",
  //       "14 Inches - 22 Inches",
  //       "22 Inches - 24 Inches",
  //       "24 Inches And Up",
  //     ];
  //     return items.sort((a, b) => {
  //       // 2. Sort based on the index in our desiredOrder array
  //       return sortKeys.indexOf(a.value) - sortKeys.indexOf(b.value);
  //     });
  //   },
  //   runtime_mapping: {
  //     ref_depth_group_1: {
  //       type: "keyword",
  //       script: {
  //         source: `
  //           // 1. Check for null at the top level
  // if (params['_source']['accentuate_data'] == null) return;
  
  // def rawValue = params['_source']['accentuate_data']['bbq.ref_specs_cutout_depth'];
  
  // // 2. Check for null or empty string
  // if (rawValue == null || rawValue.toString().trim().isEmpty()) return;
  
  // double depth;
  // try {
  //     // 3. Manual cleaning (No Regex)
  //     String str = rawValue.toString().toLowerCase()
  //                  .replace('"', '')
  //                  .replace('inches', '')
  //                  .replace('in', '')
  //                  .trim();
      
  //     // 4. Final check: if after cleaning it's empty, stop
  //     if (str.isEmpty()) return;
      
  //     depth = Double.parseDouble(str);
  // } catch (Exception e) {
  //     // This catches cases like "N/A" or "TBD"
  //     return; 
  // }
  
  // // 5. Logic mapping (Clean Waterfall)
  // if (depth < 14) {
  //     emit("Under 14 Inches");
  // } else if (depth <= 22) {
  //     emit("14 Inches - 22 Inches");
  // } else if (depth <= 24) {
  //     emit("22 Inches - 24 Inches");
  // } else {
  //     emit("24 Inches And Up");
  // }
  //         `,
  //       },
  //     },
  //   },
  //   facet_attribute: {
  //     attribute: "ref_depth_group_1",
  //     field: "ref_depth_group_1",
  //     type: "string",
  //   },
  //   collapse: false,
  //   cluster: "grills",
  // },
];

export const builtInGrillFilterType = [
  "ways_to_shop",
  "brands",
  "grill_fuel_type",
  "grill_size", // temp
  "grill_size_range",
  "grill_item_type",
  "grill_class",
  "price_groups",
  "price",
  "grill_controller",
  "grill_width",
  "grill_depth",
  "grill_height"
];
export const freestandingGrillFilterType = [
  "ways_to_shop",
  "brands",
  "price_groups",
  "price",
];
export const grillsCommonFilterType = [
  ...new Set([...builtInGrillFilterType, ...freestandingGrillFilterType]),
];

export const grillsFilterTypes = {
  "built-in-grills": builtInGrillFilterType,
};
