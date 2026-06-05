import {BASE_URL} from "@/app/lib/helpers";
import Link from "next/link";

const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mb-8">
    {items.map((item, i) => (
      <span key={i} className="flex items-center gap-1.5">
        {i > 0 && "/"}
        {i === items.length - 1
          ? <span className="font-semibold text-gray-700 dark:text-gray-300">{item}</span>
          : <Link prefetch={false} href={BASE_URL} className="hover:text-theme-500 transition-colors">{item}</Link>}
      </span>
    ))}
  </nav>
);


export default Breadcrumb;