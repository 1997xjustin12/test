import Link from "next/link";

const Breadcrumb = ({ crumbs }) => (
  <nav aria-label="breadcrumb" className="flex items-center gap-1.5 flex-wrap mb-5">
    {crumbs.map((c, i) => (
      <span key={`breadcrumb-${c.name}-${i}`} className="flex items-center gap-1.5">
        {i < crumbs.length - 1 ? (
          <>
            <Link
              href={c?.url}
              className="text-xs text-char/40 dark:text-ash/40 hover:text-theme-600 dark:hover:text-theme-500 transition-colors"
            >
              {c?.name}
            </Link>
            <span className="text-xs text-grate dark:text-white/20">❯</span>
          </>
        ) : (
          <span className="text-xs text-char dark:text-ash font-medium line-clamp-1">
            {c?.name}
          </span>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumb;
