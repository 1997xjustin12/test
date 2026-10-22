"use client";
import { formatPrice } from "@/app/lib/helpers";
import { useSolanaCategories } from "@/app/context/category";
import { CompareRating } from "./CompareProductHeader";

// The overview and specification rows on /compare, Solana's design: soft
// bordered table, gray label column fixed on the left, theme tint on rows that
// differ (new-design-patterns.md). The rows come from buildCompareRows (via
// useComparePage); this only draws them.

const MISSING = "—";
const comparable = (value) => (value == null ? "" : String(value).trim().toLowerCase());
const sameAcross = (values) => values.length > 1 && values.every((v) => comparable(v) === comparable(values[0]));

/** Overview rows: what every product has, whatever its category. */
function useOverviewRows(products) {
  const { isPriceVisible } = useSolanaCategories();
  const rows = [
    {
      key: "price",
      label: "Price",
      values: products.map((p) => (isPriceVisible(p.product_category, p.brand) ? `$${formatPrice(p.price)}` : "Call for price")),
    },
    {
      key: "rating",
      label: "Rating",
      values: products.map((p) => (p.reviews ? `${p.rating} (${p.reviews})` : null)),
      render: (p) => <CompareRating product={p} />,
    },
    { key: "brand", label: "Brand", values: products.map((p) => p.brand || null) },
    { key: "availability", label: "Availability", values: products.map((p) => (p.published ? "Available" : "Unavailable")) },
    { key: "free_shipping", label: "Free shipping", values: products.map((p) => (p.freeShipping ? "Yes" : null)) },
  ];
  return rows.map((row) => ({ ...row, same: sameAcross(row.values) }));
}

// An empty cell under the "Add another product" column, so every row spans the
// same columns as the header.
const SpareCell = () => <td aria-hidden="true" className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900" />;

function Row({ row, products, highlight, spare }) {
  const differs = highlight && !row.same;
  return (
    <tr className="group">
      <th
        scope="row"
        className="sticky left-0 z-[1] w-[120px] sm:w-[190px] bg-neutral-50 dark:bg-neutral-900 border-b border-r border-neutral-200 dark:border-neutral-800 px-3 sm:px-4 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400 align-top"
      >
        {row.label}
      </th>
      {products.map((product, i) => (
        <td
          key={product.handle}
          className={`border-b border-neutral-200 dark:border-neutral-800 px-3 sm:px-4 py-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 align-top ${
            differs ? "bg-theme-50/60 dark:bg-theme-900/10" : "bg-white dark:bg-neutral-900"
          }`}
        >
          {row.render ? row.render(product) : row.values[i] ?? <span className="text-neutral-300 dark:text-neutral-600">{MISSING}</span>}
        </td>
      ))}
      {spare && <SpareCell />}
    </tr>
  );
}

function GroupHeading({ label, span }) {
  return (
    <tr>
      <th
        colSpan={span}
        scope="colgroup"
        className="sticky left-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-3 sm:px-4 pt-6 pb-2 text-left"
      >
        <span className="text-[11px] tracking-[.15em] uppercase font-semibold text-theme-600 dark:text-theme-500">{label}</span>
      </th>
    </tr>
  );
}

const groupLabel = (type) => (type ? `${type.charAt(0).toUpperCase()}${type.slice(1)} specifications` : "Specifications");

export default function CompareSpecTable({ products, groups, onlyDifferences, highlightDifferences, spareColumn = false }) {
  const overview = useOverviewRows(products).filter((row) => !onlyDifferences || !row.same);
  const span = products.length + 1 + (spareColumn ? 1 : 0);

  return (
    <tbody>
      {overview.length > 0 && <GroupHeading label="Overview" span={span} />}
      {overview.map((row) => (
        <Row key={row.key} row={row} products={products} highlight={highlightDifferences} spare={spareColumn} />
      ))}
      {groups.map((group) => (
        <GroupRows key={group.type} group={group} products={products} span={span} highlight={highlightDifferences} spare={spareColumn} />
      ))}
      {onlyDifferences && overview.length === 0 && groups.length === 0 && (
        <tr>
          <td colSpan={span} className="px-4 py-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
            These products have the same values for everything listed.
          </td>
        </tr>
      )}
    </tbody>
  );
}

function GroupRows({ group, products, span, highlight, spare }) {
  return (
    <>
      <GroupHeading label={groupLabel(group.type)} span={span} />
      {group.rows.map((row) => (
        <Row key={row.key} row={row} products={products} highlight={highlight} spare={spare} />
      ))}
    </>
  );
}
