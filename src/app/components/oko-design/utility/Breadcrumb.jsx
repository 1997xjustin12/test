import { BASE_URL } from "@/app/lib/helpers";
import Link from "next/link";

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 mb-8">
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-1.5">
        {i > 0 && (
          <span className="text-xs text-grate dark:text-white/20">❯</span>
        )}
        {i === items.length - 1
          ? <span className="text-xs font-medium text-char dark:text-ash">{item}</span>
          : <Link prefetch={false} href={BASE_URL} className="text-xs text-char/40 dark:text-ash/40 hover:text-theme-600 dark:hover:text-theme-500 transition-colors">{item}</Link>
        }
      </span>
    ))}
  </nav>
);

export default Breadcrumb;
