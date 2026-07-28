"use client";
import Link from "next/link";
import { formatPrice } from "@/app/lib/helpers";
import AddToCartButtonWrap from "@/app/components/atom/AddToCartButtonWrap";

// Phone is a first-class OKO brand element — always this exact literal (spec §10).
const OKO_PHONE_HREF = "tel:8886674986";

// Floating bars use a solid char surface for contrast rather than a shadow
// (spec §5). Barn stays the primary action; sage marks the chat/secondary path.
const StickyCTA = ({ product }) => {
  const openChat = () => window.$zoho?.salesiq?.floatwindow?.visible("show");

  return (
    <div className="fixed bottom-4 right-4 z-50 hidden lg:flex items-center gap-3 bg-oko-char border border-oko-line-dark rounded-[2px] px-4 py-3">
      <div className="pr-3 border-r border-white/15">
        <p className="font-inter font-semibold text-[16px] text-oko-cream leading-none">
          ${formatPrice(product?.price)}
        </p>
        {!!product?.save_amt && (
          <p className="font-inter text-[11px] text-oko-sage-light font-semibold mt-0.5">
            Save ${formatPrice(product?.save_amt)}{!!product?.is_freeshipping && " · Free ship"}
          </p>
        )}
      </div>
      <Link
        href={OKO_PHONE_HREF}
        className="flex items-center gap-1.5 border border-oko-barn-light text-oko-barn-light text-[13px] font-inter font-semibold py-2 px-3 rounded-[2px] hover:bg-oko-barn-light/10 transition-colors whitespace-nowrap"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Call
      </Link>
      <button
        type="button"
        onClick={openChat}
        className="flex items-center gap-1.5 border border-oko-sage-light text-oko-sage-light text-[13px] font-inter font-semibold py-2 px-3 rounded-[2px] hover:bg-oko-sage-light/10 transition-colors whitespace-nowrap"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Chat
      </button>
      <AddToCartButtonWrap product={product}>
        <button type="button" className="flex items-center gap-1.5 text-[13px] font-inter font-semibold py-2 px-4 rounded-[2px] text-white bg-oko-barn hover:bg-oko-barn-dark transition-colors">
          Add to cart
        </button>
      </AddToCartButtonWrap>
    </div>
  );
};

export default StickyCTA;
