import { PHONE, PHONE_HREF } from "@/app/data/new-homepage";
import Link from "next/link";

export default function Topbar() {
  return (
    <div className="bg-charcoal dark:bg-black text-gray-400 dark:text-gray-500 text-xs py-2">
      {/* Mobile: single compact row — phone + shipping only */}
      <div className="flex md:hidden items-center justify-center gap-2 px-4">
        <span>🔥 Free Shipping on Select Orders</span>
        <span className="text-gray-600">·</span>
        <a href={PHONE_HREF} className="text-fire-light font-semibold whitespace-nowrap">
          {PHONE}
        </a>
      </div>

      {/* Desktop: full 3-item row */}
      <div className="hidden md:flex items-center justify-center">
        <span className="px-3.5">🔥 Free Shipping on Select Orders</span>
        <span className="text-gray-600">|</span>
        <span className="px-3.5">
          Expert Support:{" "}
          <a href={PHONE_HREF} className="text-fire-light font-semibold hover:underline">
            {PHONE}
          </a>
        </span>
        <span className="text-gray-600">|</span>
        <span className="px-3.5">
          <Link href="/professional-program" className="text-fire-light font-semibold hover:underline">
            Contractor Discount Program
          </Link>
        </span>
      </div>
    </div>
  );
}