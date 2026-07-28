import React from 'react'
import Link from 'next/link';

// §9 pagination: square 34px bordered cells matching the card "+" button /
// ui/Pagination; current page is filled --char (inverts in dark mode).
const CELL =
  "h-[34px] min-w-[34px] px-2 flex items-center justify-center font-inter font-semibold text-xs border rounded-[2px] transition-colors duration-200";
const IDLE =
  "bg-white dark:bg-oko-night-2 border-oko-stone-line dark:border-oko-line-dark text-oko-char-soft dark:text-oko-ondark hover:border-oko-char dark:hover:border-oko-cream";
const ACTIVE =
  "bg-oko-char border-oko-char text-oko-cream dark:bg-oko-cream dark:border-oko-cream dark:text-oko-char pointer-events-none";
const DISABLED =
  "bg-white dark:bg-oko-night-2 border-oko-stone-line dark:border-oko-line-dark text-oko-stone opacity-40 pointer-events-none";

function Paginator({ current_page = 1, total_pages = 1 }) {
  const cur = parseInt(current_page);
  const total = parseInt(total_pages);

  // Nothing to paginate through — WP returns X-WP-TotalPages: 0 for a category
  // with no posts, which would otherwise render bare disabled arrows.
  if (!Number.isFinite(total) || total < 2) return null;
  const isFirst = cur <= 1;
  const isLast = cur >= total;

  return (
    <nav aria-label="Blog pagination" className="mt-12 flex flex-wrap items-center justify-center gap-1.5">
      {isFirst ? (
        <span className={`${CELL} ${DISABLED}`} aria-label="First page" aria-disabled="true">‹‹</span>
      ) : (
        <Link prefetch={false} href={`/blogs?page=1`} className={`${CELL} ${IDLE}`} aria-label="First page">‹‹</Link>
      )}

      {isFirst ? (
        <span className={`${CELL} ${DISABLED}`} aria-label="Previous page" aria-disabled="true">‹</span>
      ) : (
        <Link prefetch={false} href={`/blogs?page=${cur - 1}`} className={`${CELL} ${IDLE}`} aria-label="Previous page">‹</Link>
      )}

      {Array.from({ length: total }, (_, i) => i + 1).map((page) => (
        cur === page ? (
          <span key={page} className={`${CELL} ${ACTIVE}`} aria-current="page" aria-label={`Page ${page}`}>{page}</span>
        ) : (
          <Link key={page} prefetch={false} href={`/blogs?page=${page}`} className={`${CELL} ${IDLE}`} aria-label={`Page ${page}`}>{page}</Link>
        )
      ))}

      {isLast ? (
        <span className={`${CELL} ${DISABLED}`} aria-label="Next page" aria-disabled="true">›</span>
      ) : (
        <Link prefetch={false} href={`/blogs?page=${cur + 1}`} className={`${CELL} ${IDLE}`} aria-label="Next page">›</Link>
      )}

      {isLast ? (
        <span className={`${CELL} ${DISABLED}`} aria-label="Last page" aria-disabled="true">››</span>
      ) : (
        <Link prefetch={false} href={`/blogs?page=${total}`} className={`${CELL} ${IDLE}`} aria-label="Last page">››</Link>
      )}
    </nav>
  );
}

export default Paginator
