"use client";
import Link from "next/link";
import { formatPrice } from "@/app/lib/helpers";
import AddToCartButtonWrap from "@/app/components/atom/AddToCartButtonWrap";

// Phone is a first-class OKO brand element — always this exact literal (spec §10).
const OKO_PHONE_HREF = "tel:8886674986";

// Floating bar on a solid char surface (spec §5) — sits above the nav's own
// mobile call bar, so it carries the price + add-to-cart action.
const MobileStickyCTA = ({ product }) => {
  const openChat = () => window.$zoho?.salesiq?.floatwindow?.visible("show");

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:hidden z-50 bg-oko-char border-t border-oko-line-dark px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-inter font-semibold text-[16px] text-oko-cream leading-none">
          ${formatPrice(product?.price)}
        </p>
        {!!product?.save_amt && (
          <p className="font-inter text-[11px] text-oko-sage-light font-semibold mt-0.5">
            Save ${formatPrice(product?.save_amt)}
            {!!product?.is_freeshipping && " · Free shipping"}
          </p>
        )}
      </div>
      <Link
        href={OKO_PHONE_HREF}
        aria-label="Call for a lower price"
        className="flex items-center gap-1.5 border border-oko-barn-light text-oko-barn-light text-[13px] font-inter font-semibold py-2.5 px-3 rounded-[2px] hover:bg-oko-barn-light/10 transition-colors whitespace-nowrap flex-shrink-0"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span className="hidden md:flex">Call</span>
      </Link>
      <button
        type="button"
        onClick={openChat}
        aria-label="Open chat"
        className="flex-shrink-0 flex items-center gap-1.5 border border-oko-sage-light text-oko-sage-light text-[13px] font-inter font-semibold py-2.5 px-3 rounded-[2px] hover:bg-oko-sage-light/10 transition-colors whitespace-nowrap"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="hidden md:flex">Chat</span>
      </button>
      <AddToCartButtonWrap product={product}>
        <button type="button" className="flex-shrink-0 flex items-center gap-2 bg-oko-barn hover:bg-oko-barn-dark text-white text-[13px] font-inter font-semibold py-2.5 px-4 rounded-[2px] transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add to cart
        </button>
      </AddToCartButtonWrap>
    </div>
  );
};

export default MobileStickyCTA;
