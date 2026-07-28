import Link from "next/link";

// 8.4 Promo strip — 46px charcoal band, centered offer + white rectangular
// "Call now" button. Stays dark in both light/dark modes (designed dark band).
const OKO_PHONE = "888-667-4986";
const OKO_PHONE_HREF = "tel:8886674986";

export default function Promo() {
  return (
    <div className="bg-oko-char text-white">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 min-h-[46px] py-2 text-center">
          <span className="text-[13.5px] font-inter">
            <strong className="font-semibold">50% off Eloquence built-in grills</strong>
            {" — "}
            {OKO_PHONE}
          </span>
          <Link
            href={OKO_PHONE_HREF}
            className="bg-white text-oko-char font-inter font-semibold text-[12px] tracking-[0.03em] px-4 py-1.5 rounded-[2px] hover:bg-oko-cream-dim transition-colors"
          >
            Call now
          </Link>
        </div>
      </div>
    </div>
  );
}
