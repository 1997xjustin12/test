import Link from "next/link";

const Breadcrumb = ({ crumbs }) => (
  <nav aria-label="breadcrumb" className="flex items-center gap-1.5 flex-wrap mb-5">
    {crumbs.map((c, i) => (
      <span key={`breadcrumb-${c.name}-${i}`} className="flex items-center gap-1.5">
        {i < crumbs.length - 1 ? (
          <>
            <Link
              href={c?.url}
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-orange-500 transition-colors"
            >
              {c?.name}
            </Link>
            <span className="text-xs text-gray-200 dark:text-gray-700">/</span>
          </>
        ) : (
          <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
            {c?.name}
          </span>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumb;
