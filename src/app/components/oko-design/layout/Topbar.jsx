import Link from "next/link";
import { STORE_CONTACT } from "@/app/lib/store_constants";

// 8.1 Announcement bar — cream-dim, bottom border, ~38px, centered 13px.
// One promise + the phone in barn. Competitor name in display italic.
export default function Topbar() {
  return (
    <div className="bg-oko-cream-dim dark:bg-oko-night-2 border-b border-oko-stone-line dark:border-oko-line-dark">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-center gap-1.5 min-h-[38px] py-1.5 text-center text-[13px] leading-snug text-oko-char-soft dark:text-oko-ondark">
          <span>
            Price match guaranteed on all competitor pricing, including{" "}
            <span className="font-oko-display italic font-bold text-oko-char dark:text-oko-cream">
              amazon
            </span>{" "}
            — call{" "}
            <Link
              href={`tel:${STORE_CONTACT}`}
              className="font-semibold text-oko-barn dark:text-oko-barn-light hover:text-oko-barn-dark dark:hover:text-oko-barn-light transition-colors"
            >
              {STORE_CONTACT}
            </Link>{" "}
            for current promotions
          </span>
        </div>
      </div>
    </div>
  );
}
