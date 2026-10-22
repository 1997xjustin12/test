"use client";
import { formatPrice } from "@/app/lib/helpers";
import { useSolanaCategories } from "@/app/context/category";
import { CompareRating } from "./CompareProductHeader";

// The overview and specification rows on /compare, OKO's design: the §9 specs
// table — bordered, stone-line row dividers, stone uppercase labels — with the
// label column fixed on the left and a barn tint on rows that differ
// (oko-design-patterns.md). Rows come from buildCompareRows (via
// useComparePage); this only draws them.

const MISSING = "—";
const comparable = (value) => (value == null ? "" : String(value).trim().toLowerCase());
const sameAcross = (values) => values.length > 1 && values.every((v) => comparable(v) === comparable(values[0]));

function useOverviewRows(products) {
  const { isPriceVisible } = useSolanaCategories();
  const rows = [
    { key: "price", label: "Price", values: products.map((p) => (isPriceVisible(p.product_category, p.brand) ? `$${formatPrice(p.price)}` : "Call for price")) },
    { key: "rating", label: "Rating", values: products.map((p) => (p.reviews ? `${p.rating} (${p.reviews})` : null)), render: (p) => <CompareRating product={p} /> },
    { key: "brand", label: "Brand", values: products.map((p) => p.brand || null) },
    { key: "availability", label: "Availability", values: products.map((p) => (p.published ? "Available" : "Unavailable")) },
    { key: "free_shipping", label: "Free shipping", values: products.map((p) => (p.freeShipping ? "Yes" : null)) },
  ];
  return rows.map((row) => ({ ...row, same: sameAcross(row.values) }));
}

const SpareCell = () => <td aria-hidden="true" className="border-b border-oko-stone-line dark:border-oko-line-dark bg-white dark:bg-oko-night-2" />;

function Row({ row, products, highlight, spare }) {
  const differs = highlight && !row.same;
  return (
    <tr>
      <th
        scope="row"
        className="sticky left-0 z-[1] w-[120px] sm:w-[190px] bg-oko-cream-dim dark:bg-oko-night-3 border-b border-r border-oko-stone-line dark:border-oko-line-dark px-3 sm:px-4 py-3 text-left font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-oko-stone align-top"
      >
        {row.label}
      </th>
      {products.map((product, i) => (
        <td
          key={product.handle}
          className={`border-b border-oko-stone-line dark:border-oko-line-dark px-3 sm:px-4 py-3 font-inter text-[13px] text-oko-char-soft dark:text-oko-ondark align-top ${
            differs ? "bg-oko-barn/[0.05] dark:bg-oko-barn/10" : "bg-white dark:bg-oko-night-2"
          }`}
        >
          {row.render ? row.render(product) : row.values[i] ?? <span className="text-oko-stone-line dark:text-oko-line-dark">{MISSING}</span>}
        </td>
      ))}
      {spare && <SpareCell />}
    </tr>
  );
}

function GroupHeading({ label, span }) {
  return (
    <tr>
      <th colSpan={span} scope="colgroup" className="sticky left-0 bg-white dark:bg-oko-night-2 border-b border-oko-stone-line dark:border-oko-line-dark px-3 sm:px-4 pt-6 pb-2 text-left">
        <span className="font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light">{label}</span>
      </th>
    </tr>
  );
}

const groupLabel = (type) => (type ? `${type} specifications` : "Specifications");

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
          <td colSpan={span} className="px-4 py-10 text-center font-inter text-[13.5px] text-oko-stone">
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
