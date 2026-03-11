import { 
  decimalToFraction,
  transformNumber,
  transformFilterNumber,
  transformNumberBurners,
  transformFilterNumberBurners,
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
  transformWeight,
  transformFilterWeight,
  transformGrillArea,
  transformFilterGrillArea
} from "../lib/helpers";

const yesNo = ["Yes", "No"]; // used for transform sort

export const grillsFilters = [
  {
    label: "Overall Dimensions",
    attribute: "grill_overall_dimensions",
    searchable: false,
    type: "RefinementList",
    transformSpecs: transformDimension,
    transform: transformFilterDimensions,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_overall_dimensions",
      field: "accentuate_data.bbq.overall_dimensions",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.overall_dimensions",
    cluster: "grills",
  },
  {
    label: "Cutout Dimensions",
    attribute: "grill_cutout_dimensions",
    searchable: false,
    type: "RefinementList",
    transformSpecs: transformDimension,
    transform: transformFilterDimensions,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_cutout_dimensions",
      field: "accentuate_data.bbq.cutout_dimensions",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.cutout_dimensions",
    cluster: "grills",
  },
  {
    label: "Cooking Grill Dimensions",
    attribute: "grill_cooking_grid_dimensions",
    searchable: false,
    type: "RefinementList",
    transformSpecs: transformDimension,
    transform: transformFilterDimensions,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_cooking_grid_dimensions",
      field: "accentuate_data.bbq.seo_meta_cooking_grid_dimensions",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.seo_meta_cooking_grid_dimensions",
    cluster: "grills",
  },
  {
    label: "Shipping Dimensions",
    attribute: "grill_shipping_dimensions",
    searchable: false,
    type: "RefinementList",
    transformSpecs: transformDimension,
    transform: transformFilterDimensions,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_shipping_dimensions",
      field: "accentuate_data.bbq.shipping_dimensions",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.shipping_dimensions",
    cluster: "grills",
  },
  {
    label: "Shipping Weight",
    attribute: "grill_shipping_weight",
    searchable: false,
    type: "RefinementList",
    transformSpecs: transformWeight,
    transform: transformFilterWeight,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_shipping_weight",
      field: "accentuate_data.bbq.shipping_weight",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.shipping_weight",
    cluster: "grills",
  },
  {
    label: "Product Weight",
    attribute: "grill_product_weight",
    searchable: false,
    type: "RefinementList",
    transformSpecs: transformWeight,
    transform: transformFilterWeight,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_product_weight",
      field: "accentuate_data.bbq.product_weight",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.product_weight",
    cluster: "grills",
  },
  {
    label: "Main Grill Area",
    attribute: "grill_main_grill_area",
    searchable: false,
    type: "RefinementList",
    transformSpecs: transformGrillArea,
    transform: transformFilterGrillArea,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_main_grill_area",
      field: "accentuate_data.bbq.seo_meta_main_grilling_area",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.seo_meta_main_grilling_area",
    cluster: "grills",
  },
  {
    label: "Secondary Grill Area",
    attribute: "grill_second_grill_area",
    searchable: false,
    type: "RefinementList",
    transformSpecs: transformGrillArea,
    transform: transformFilterGrillArea,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_second_grill_area",
      field: "accentuate_data.bbq.seo_meta_secondary_grilling_area",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.seo_meta_secondary_grilling_area",
    cluster: "grills",
  },
  {
    label: "Total Grill Area",
    attribute: "grill_total_grill_area",
    searchable: false,
    type: "RefinementList",
    transformSpecs: transformGrillArea,
    transform: transformFilterGrillArea,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_total_grill_area",
      field: "accentuate_data.bbq.seo_meta_total_grill_area",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.seo_meta_total_grill_area",
    cluster: "grills",
  },
  {
    label: "Number of Main Burners",
    attribute: "grill_main_burner",
    searchable: false,
    type: "RefinementList",
    transformSpecs: transformNumberBurners,
    transform: transformFilterNumberBurners,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_main_burner",
      field: "accentuate_data.bbq.number_of_main_burners",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.number_of_main_burners",
    cluster: "grills",
  },
  {
    label: "Total Surface BTU",
    attribute: "grill_total_surface_btu",
    searchable: false,
    type: "RefinementList",
    transformSpecs: transformNumber,
    transform: transformFilterNumber,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_total_surface_btu",
      field: "accentuate_data.bbq.total_surface_btu",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.total_surface_btu",
    cluster: "grills",
  },
  {
    label: "Single Burner BTU",
    attribute: "grill_single_burner_btus",
    searchable: false,
    type: "RefinementList",
    transformSpecs: transformNumber,
    transform: transformFilterNumber,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_single_burner_btus",
      field: "accentuate_data.bbq.single_burner_btus",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.single_burner_btus",
    cluster: "grills",
  },
  {
    label: "Storage Number of Doors",
    attribute: "grill_storage_no_of_doors",
    searchable: false,
    type: "RefinementList",
    transformSpecs: transformNumberDoors,
    transform: transformFilterNumberDoors,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_storage_no_of_doors",
      field: "accentuate_data.bbq.storage_specs_number_of_doors",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.storage_specs_number_of_doors",
    cluster: "grills",
  },
  {
    label: "Storage Cutout Width",
    attribute: "grill_storage_cutout_width",
    searchable: false,
    type: "RefinementList",
    transformSpecs: transformNumberSize,
    transform: transformFilterNumberSize,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_storage_cutout_width",
      field: "accentuate_data.bbq.storage_specs_cutout_width",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.storage_specs_cutout_width",
    cluster: "grills",
  },
  {
    label: "Storage Cutout Depth",
    attribute: "grill_storage_cutout_depth",
    searchable: false,
    type: "RefinementList",
    transformSpecs: transformNumberSize,
    transform: transformFilterNumberSize,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_storage_cutout_depth",
      field: "accentuate_data.bbq.storage_specs_cutout_depth",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.storage_specs_cutout_depth",
    cluster: "grills",
  },
  {
    label: "Storage Cutout Height",
    attribute: "grill_storage_cutout_height",
    searchable: false,
    type: "RefinementList",
    transformSpecs: transformNumberSize,
    transform: transformFilterNumberSize,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_storage_cutout_height",
      field: "accentuate_data.bbq.storage_specs_cutout_height",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.storage_specs_cutout_height",
    cluster: "grills",
  },
  {
    label: "Side Burners",
    attribute: "grill_sideburner_burners",
    searchable: false,
    type: "RefinementList",
    transformSpecs: transformNumberBurners,
    transform: transformFilterNumberBurners,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_sideburner_burners",
      field: "accentuate_data.bbq.side_burner_specs_number_of_burners",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.side_burner_specs_number_of_burners",
    cluster: "grills",
  },
  {
    label: "Storage Drawers",
    attribute: "grill_storage_drawers",
    searchable: false,
    type: "RefinementList",
    transformSpecs: transformNumberDrawers,
    transform: transformFilterNumberDrawers,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_storage_drawers",
      field: "accentuate_data.bbq.storage_specs_number_of_drawers",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.storage_specs_number_of_drawers",
    cluster: "grills",
  },
  {
    label: "External Material",
    attribute: "grill_material",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: {
      grill_material: {
        type: "keyword",
        script: {
          source: `
            def data = params['_source']['accentuate_data'];
            if (data != null && data['bbq.seo_meta_material'] != null) {
              def val = data['bbq.seo_meta_material'];
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
      attribute: "grill_material",
      field: "grill_material",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.seo_meta_material",
    cluster: "grills",
  },
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
    collapse: true,
    accentuate_prop: "bbq.seo_meta_fuel_type",
    cluster: "grills",
  },
  {
    label: "Series",
    attribute: "grill_series",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: {
      grill_series: {
        type: "keyword",
        script: {
          source: `
            def data = params['_source']['accentuate_data'];
            if (data != null && data['bbq.seo_meta_series'] != null) {
              def val = data['bbq.seo_meta_series'];
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
      attribute: "grill_series",
      field: "grill_series",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.seo_meta_series",
    cluster: "grills",
  },
  {
    label: "Storage Cofiguration",
    attribute: "grill_storage_config",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_storage_config",
      field: "accentuate_data.bbq.storage_specs_mounting_type",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.storage_specs_mounting_type",
    cluster: "grills",
  },
  {
    label: "Grill Light",
    attribute: "grill_lights",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_lights",
      field: "accentuate_data.bbq.grill_lights",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.grill_lights",
    cluster: "grills",
  },
  {
    label: "Rear Infrared Burner",
    attribute: "grill_rear_infra_burner",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_rear_infra_burner",
      field: "accentuate_data.bbq.rear_infrared_burner",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.rear_infrared_burner",
    cluster: "grills",
  },
  {
    label: "Rear Infrared Burner BTU",
    attribute: "grill_rear_infra_burner_btu",
    searchable: false,
    type: "RefinementList",
    transform:transformFilterNumber,
    transformSpecs: transformNumber,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_rear_infra_burner_btu",
      field: "accentuate_data.bbq.rear_infrared_burner_btu",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.rear_infrared_burner_btu",
    cluster: "grills",
  },
  {
    label: "Rotisserie Kit",
    attribute: "grill_rotisserie_kit",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_rotisserie_kit",
      field: "accentuate_data.bbq.rotisserie_kit",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.rotisserie_kit",
    cluster: "grills",
  }, 
  {
    label: "Thermometer",
    attribute: "grill_thermometer",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_thermometer",
      field: "accentuate_data.bbq.thermometer",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.thermometer",
    cluster: "grills",
  },
  {
    label: "Storage Type",
    attribute: "grill_storage_type",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_storage_type",
      field: "accentuate_data.bbq.brand_storage_specs_type",
      type: "string",
    },
    collapse: true,
    accentuate_prop: "bbq.brand_storage_specs_type",
    cluster: "grills",
  },
  {
    label: "Storage Orientation",
    attribute: "grill_storage_orientation",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_storage_orientation",
      field: "accentuate_data.bbq.storage_specs_orientation",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.storage_specs_orientation",
    cluster: "grills",
  },
  {
    label: "Side Burner Type",
    attribute: "grill_sideburner_type",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_sideburner_type",
      field: "accentuate_data.bbq.side_burner_specification_type",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.side_burner_specification_type",
    cluster: "grills",
  },
  {
    label: "Side Burner Configuration",
    attribute: "grill_sideburner_config",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_sideburner_config",
      field: "accentuate_data.bbq.side_burner_specs_configuration",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.side_burner_specs_configuration",
    cluster: "grills",
  },
  {
    label: "Side Burner Fuel Type",
    attribute: "grill_sideburner_fuel_type",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_sideburner_fuel_type",
      field: "accentuate_data.bbq.side_burner_specification_gas_type",
      type: "string",
    },
    collapse: false,
    accentuate_prop: "bbq.side_burner_specification_gas_type",
    cluster: "grills",
  },
  {
    label: "Size",
    attribute: "grill_size",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    transformSpecs: transformNumberSize,
    transform: transformFilterNumberSize,
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
    transformSpecs: transformNumberSize,
    transform: transformFilterNumberSize,
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
    transformSpecs: transformNumberSize,
    transform: transformFilterNumberSize,
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
    transformSpecs: transformNumberSize,
    transform: transformFilterNumberSize,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_depth",
      field: "accentuate_data.bbq.grill_specs_cutout_depth",
      type: "string",
    },
    accentuate_prop: "bbq.grill_specs_cutout_depth",
    cluster: "grills",
  },
  // bbq.grill_specs_kamado_width
  {
    label: "Kamado Width",
    attribute: "grill_kamado_width",
    searchable: false,
    type: "RefinementList",
    transformSpecs: transformNumberSize,
    transform: transformFilterNumberSize,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_kamado_width",
      field: "accentuate_data.bbq.grill_specs_kamado_width",
      type: "string",
    },
    accentuate_prop: "bbq.grill_specs_kamado_width ",
    cluster: "grills",
  },
  // bbq.grill_specs_side_shelves
  {
    label: "Side Shelves",
    attribute: "grill_side_shelve",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_side_shelve",
      field: "accentuate_data.bbq.grill_specs_side_shelves",
      type: "string",
    },
    accentuate_prop: "bbq.grill_specs_side_shelves ",
    cluster: "grills",
  },
  // bbq.grill_specs_mount_type
  {
    label: "Configuration",
    attribute: "grill_configuration",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: {
      grill_configuration: {
        type: "keyword",
        script: {
          source: `
            def data = params['_source']['accentuate_data'];
            if (data != null && data['bbq.grill_specs_mount_type'] != null) {
              def val = data['bbq.grill_specs_mount_type'];
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
      attribute: "grill_configuration",
      field: "grill_configuration",
      type: "string",
    },
    accentuate_prop: "bbq.grill_specs_mount_type",
    cluster: "grills",
  },
  // bbq.grill_specs_color
  {
    label: "Primary Color",
    attribute: "grill_primary_color",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_primary_color",
      field: "accentuate_data.bbq.grill_specs_color",
      type: "string",
    },
    accentuate_prop: "bbq.grill_specs_color",
    cluster: "grills",
  },
  // bbq.grill_specs_on_wheels
  {
    label: "On Wheels",
    attribute: "grill_on_wheel",
    searchable: false,
    type: "RefinementList",
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_on_wheel",
      field: "accentuate_data.bbq.grill_specs_on_wheels",
      type: "string",
    },
    accentuate_prop: "bbq.grill_specs_on_wheels",
    cluster: "grills",
  },
  // bbq.grill_specs_no_of_racks
  {
    label: "Number Of Racks",
    attribute: "grill_no_of_racks",
    searchable: false,
    type: "RefinementList",
    transform: transformFilterNumberRacks,
    transformSpec: transformNumberRacks,
    runtime_mapping: null,
    facet_attribute: {
      attribute: "grill_no_of_racks",
      field: "accentuate_data.bbq.grill_specs_no_of_racks",
      type: "string",
    },
    accentuate_prop: "bbq.grill_specs_no_of_racks",
    collapse: false,
    cluster: "grills",
  },
];

const allGrillFilters = [
  "grill_overall_dimensions",
  "grill_cutout_dimensions",
  "grill_cooking_grid_dimensions",
  "grill_shipping_dimensions",
  "grill_shipping_weight",
  "grill_product_weight",
  "grill_main_grill_area",
  "grill_second_grill_area",
  "grill_total_grill_area",
  "grill_main_burner",
  "grill_total_surface_btu",
  "grill_single_burner_btus",
  "grill_storage_no_of_doors",
  "grill_storage_cutout_width",
  "grill_storage_cutout_depth",
  "grill_storage_cutout_height",
  "grill_sideburner_burners",
  "grill_storage_drawers",
  "grill_material",
  "grill_series",
  "grill_storage_config",
  "grill_lights",
  "grill_rear_infra_burner",
  "grill_rear_infra_burner_btu",
  "grill_rotisserie_kit",
  "grill_thermometer",
  "grill_storage_type",
  "grill_storage_orientation",
  "grill_sideburner_type",
  "grill_sideburner_config",
  "grill_sideburner_fuel_type",
  "grill_fuel_type",
  "grill_size",
  "grill_size_range",
  "grill_item_type",
  "grill_class",
  "price_groups",
  "price",
  "grill_controller",
  "grill_width",
  "grill_depth",
  "grill_height",
  "grill_kamado_width",
  "grill_configuration",
  "grill_primary_color",
  "grill_on_wheel",
  "grill_no_of_racks",
];

export const builtInGrillFilterType = [
  "ways_to_shop",
  "brands",
  "grill_fuel_type",
  "grill_item_type",
  "grill_class",
  "grill_size_range", // pellet
  "grill_kamado_width", // kamado
  "grill_material", // kamado
  "grill_configuration",
  "price_groups",
  "price",
  "grill_controller",
  "grill_width",
  "grill_depth",
  "grill_height",
  "grill_main_burner",
  "grill_lights",
  "grill_no_of_racks", // smokers
];

export const freestandingGrillFilterType = [
  "ways_to_shop",
  "brands",
  "grill_configuration",
  "grill_fuel_type",
  "grill_size_range",
  "grill_item_type",
  "grill_class",
  "grill_kamado_width", // kamado
  "grill_material", // kamado
  "grill_side_shelve",
  "price_groups",
  "price",
  "grill_main_burner",
  "grill_controller",
  "grill_sideburner_type",
  "grill_primary_color",
  "grill_on_wheel",
];

export const grillsCommonFilterType = [
  ...new Set([...builtInGrillFilterType, ...freestandingGrillFilterType]),
];

export const grillsFilterTypes = {
  "built-in-grills": builtInGrillFilterType,
  "built-in-grills-x-brands": builtInGrillFilterType.filter(item=> item !== "brands"),
  "freestanding-grills": freestandingGrillFilterType,
  "freestanding-grills-x-brands": freestandingGrillFilterType.filter(item=> item !== "brands")
};

