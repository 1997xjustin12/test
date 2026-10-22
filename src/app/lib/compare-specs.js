import { accentuateSpecLabels } from "@/app/lib/filter-helper";

/**
 * Product comparison: the spec rows. Server code only — accentuateSpecLabels
 * is built from the whole filter config, which has no place in a browser
 * bundle. Used by the /compare page and by the product page's "compare with
 * similar items" table in each brand.
 */

/** Spec order: the order accentuateSpecLabels lists them in. */
const SPEC_ORDER = new Map(accentuateSpecLabels.map((spec, index) => [spec.key, index]));

/**
 * A product's specs as labelled rows, `[{ key, label, type, value }]`, with
 * each spec's own formatting applied (dimensions, weights…). Empty values are
 * left out. Null when the product has no spec data at all.
 *
 * Moved here unchanged from the three brand CompareTable.jsx files, which each
 * kept a copy.
 */
export function extractProductSpecs(product) {
  const accentuate = product?.accentuate_data || null;
  if (!accentuate) return null;
  const accentuateKeys = Object.keys(accentuate);
  const specsConfig = accentuateSpecLabels
    .filter((asl) => accentuateKeys.includes(asl?.key))
    .map((asl) => ({ ...asl, value: accentuate[asl?.key] }));
  const specs = specsConfig
    .filter((sc) => sc?.value)
    .map((sc) => {
      const transform = sc?.transform || null;
      const rawValue = accentuate[sc?.key];
      const renderValue = typeof transform === "function" ? transform(rawValue) : rawValue;
      return { ...sc, value: renderValue };
    });

  return specs;
}

const comparable = (value) => (value == null ? "" : String(value).trim().toLowerCase());

/**
 * The comparison table for these products, grouped by product type:
 *
 *   [{ type: "grills", rows: [{ key, label, type, values: [v1, v2, …], same }] }]
 *
 * A row exists for every spec at least one product has; a product without it
 * gets null in its column. `same` is true when every product has the same
 * value, so the page can highlight or hide it. Groups and rows follow the
 * accentuateSpecLabels order.
 */
export function buildCompareRows(products = []) {
  const count = products.length;
  const byKey = new Map();

  products.forEach((product, column) => {
    for (const spec of extractProductSpecs(product) || []) {
      // A formatter can turn an unusable raw value into "": treat as missing.
      if (spec.value == null || spec.value === "") continue;
      if (!byKey.has(spec.key)) {
        byKey.set(spec.key, { key: spec.key, label: spec.label, type: spec.type || "other", values: Array(count).fill(null) });
      }
      byKey.get(spec.key).values[column] = spec.value;
    }
  });

  const rows = [...byKey.values()]
    .sort((a, b) => (SPEC_ORDER.get(a.key) ?? Infinity) - (SPEC_ORDER.get(b.key) ?? Infinity))
    .map((row) => ({
      ...row,
      same: count > 1 && row.values.every((value) => comparable(value) === comparable(row.values[0])),
    }));

  const groups = new Map();
  for (const row of rows) {
    if (!groups.has(row.type)) groups.set(row.type, []);
    groups.get(row.type).push(row);
  }
  return [...groups.entries()].map(([type, groupRows]) => ({ type, rows: groupRows }));
}
