import Link from "next/link";

// Breadcrumb (spec §9) — 12px stone, "/" separators, current page in
// char-soft. Sits directly under the nav on cream.
const Breadcrumb = ({ crumbs }) => (
  <nav aria-label="breadcrumb" className="flex items-center gap-2 flex-wrap mb-5">
    {crumbs.map((c, i) => (
      <span key={`breadcrumb-${c.name}-${i}`} className="flex items-center gap-2">
        {i < crumbs.length - 1 ? (
          <>
            <Link
              href={c?.url}
              className="font-inter text-[12px] text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
            >
              {c?.name}
            </Link>
            <span className="font-inter text-[12px] text-oko-stone-line dark:text-oko-line-dark" aria-hidden="true">
              /
            </span>
          </>
        ) : (
          <span className="font-inter text-[12px] text-oko-char-soft dark:text-oko-ondark font-medium line-clamp-1">
            {c?.name}
          </span>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumb;
