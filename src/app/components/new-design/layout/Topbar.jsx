import { PHONE, PHONE_HREF } from "@/app/data/new-homepage";

export default function Topbar() {
  return (
    <div className="
      bg-charcoal dark:bg-black
      text-gray-400 dark:text-gray-500
      text-xs py-2.5 text-center
    ">
      {/* Mobile: stack vertically; md+: single row */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-0">
        <span className="px-0 md:px-3.5">🔥 Free Shipping on Select Orders</span>
        <span className="hidden md:inline text-gray-600">|</span>
        <span className="px-0 md:px-3.5">
          Expert Support:{" "}
          <a href={PHONE_HREF} className="text-fire-light font-semibold hover:underline">
            {PHONE}
          </a>
        </span>
        <span className="hidden md:inline text-gray-600">|</span>
        <span className="px-0 md:px-3.5">
          <a href="#" className="text-fire-light font-semibold hover:underline">
            Contractor Discount Program
          </a>
        </span>
      </div>
    </div>
  );
}