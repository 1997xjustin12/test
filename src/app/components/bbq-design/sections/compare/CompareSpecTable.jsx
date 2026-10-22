"use client";
import { formatPrice } from "@/app/lib/helpers";
import { useSolanaCategories } from "@/app/context/category";
import { CompareRating } from "./CompareProductHeader";

// The overview and specification rows on /compare, BBQ's design: grate
// borders, ash label column fixed on the left, Oswald group headings, a theme
// tint on rows that differ (bbq-design-patterns.md). Rows come from
// buildCompareRows (via useComparePage); this only draws them.

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

const SpareCell = () => <td aria-hidden="true" className="border-b border-grate dark:border-white/10 bg-paper dark:bg-smoke" />;

function Row({ row, products, highlight, spare }) {
  const differs = highlight && !row.same;
  return (
    <tr>
      <th
        scope="row"
        className="sticky left-0 z-[1] w-[120px] sm:w-[190px] bg-ash dark:bg-char border-b border-r border-grate dark:border-white/10 px-3 sm:px-4 py-3 text-left font-oswald text-[11px] font-semibold uppercase tracking-wide text-char/60 dark:text-ash/50 align-top"
      >
        {row.label}
      </th>
      {products.map((product, i) => (
        <td
          key={product.handle}
          className={`border-b border-grate dark:border-white/10 px-3 sm:px-4 py-3 font-sora text-xs sm:text-sm text-char/80 dark:text-ash/80 align-top ${
            // color-mix, not bg-theme-600/10: the theme colours are CSS
            // variables, which Tailwind's opacity modifier can't apply to.
            differs
              ? "bg-[color-mix(in_oklab,var(--theme-primary-600)_7%,#fdfbf7)] dark:bg-[color-mix(in_oklab,var(--theme-primary-600)_16%,#2a241e)]"
              : "bg-paper dark:bg-smoke"
          }`}
        >
          {row.render ? row.render(product) : row.values[i] ?? <span className="text-char/25 dark:text-ash/20">{MISSING}</span>}
        </td>
      ))}
      {spare && <SpareCell />}
    </tr>
  );
}

function GroupHeading({ label, span }) {
  return (
    <tr>
      <th colSpan={span} scope="colgroup" className="sticky left-0 bg-paper dark:bg-smoke border-b border-grate dark:border-white/10 px-3 sm:px-4 pt-6 pb-2 text-left">
        <span className="font-oswald text-xs font-semibold text-theme-600 tracking-[.14em] uppercase">{label}</span>
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
          <td colSpan={span} className="px-4 py-10 text-center font-sora text-sm text-char/50 dark:text-ash/40">
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
