import React from 'react'
import Link from 'next/link';

function Paginator({ current_page = 1, total_pages = 1 }) {
  const cur = parseInt(current_page);
  const total = parseInt(total_pages);
  const isFirst = cur <= 1;
  const isLast = cur >= total;

  return (
    <div className="ais-Pagination">
      <ul className="ais-Pagination-list">
        <li className={`ais-Pagination-item ais-Pagination-item--firstPage${isFirst ? " ais-Pagination-item--disabled" : ""}`}>
          {isFirst ? (
            <span className="ais-Pagination-link" aria-label="First Page">‹‹</span>
          ) : (
            <Link prefetch={false} href={`/blogs?page=1`} className="ais-Pagination-link" aria-label="First Page">‹‹</Link>
          )}
        </li>
        <li className={`ais-Pagination-item ais-Pagination-item--previousPage${isFirst ? " ais-Pagination-item--disabled" : ""}`}>
          {isFirst ? (
            <span className="ais-Pagination-link" aria-label="Previous Page">‹</span>
          ) : (
            <Link prefetch={false} href={`/blogs?page=${cur - 1}`} className="ais-Pagination-link" aria-label="Previous Page">‹</Link>
          )}
        </li>
        {Array.from({ length: total }, (_, i) => i + 1).map((page) => (
          <li key={page} className={`ais-Pagination-item ais-Pagination-item--page${cur === page ? " ais-Pagination-item--selected" : ""}`}>
            <Link prefetch={false} href={`/blogs?page=${page}`} className="ais-Pagination-link" aria-label={`Page ${page}`}>{page}</Link>
          </li>
        ))}
        <li className={`ais-Pagination-item ais-Pagination-item--nextPage${isLast ? " ais-Pagination-item--disabled" : ""}`}>
          {isLast ? (
            <span className="ais-Pagination-link" aria-label="Next Page">›</span>
          ) : (
            <Link prefetch={false} href={`/blogs?page=${cur + 1}`} className="ais-Pagination-link" aria-label="Next Page">›</Link>
          )}
        </li>
        <li className={`ais-Pagination-item ais-Pagination-item--lastPage${isLast ? " ais-Pagination-item--disabled" : ""}`}>
          {isLast ? (
            <span className="ais-Pagination-link" aria-label="Last Page">››</span>
          ) : (
            <Link prefetch={false} href={`/blogs?page=${total}`} className="ais-Pagination-link" aria-label="Last Page">››</Link>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Paginator