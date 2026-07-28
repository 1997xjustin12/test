import Link from "next/link";
import Image from "next/image";
import { BASE_URL, formatPrice, formatProduct } from "@/app/lib/helpers";
import AddToCartButtonWrap from "@/app/components/atom/AddToCartButtonWrap";

// 8.10 Product card — white, bordered, 2px radius. Barn SALE badge top-left,
// sage FREE SHIPPING top-right (shipping moves to top-left when there's no
// sale). Brand eyebrow → name → review line → three-part price block + a 34px
// outline "+" button that inverts to char on hover.
function Stars({ rating }) {
  const rounded = Math.round(rating);
  return (
    <span className="text-oko-brass tracking-[1px]" aria-hidden="true">
      {"★".repeat(rounded)}
      {"☆".repeat(Math.max(0, 5 - rounded))}
    </span>
  );
}

function ProductCard({ product }) {
  const onSale = !!product?.was && product?.save_amt > 0;
  const hasReviews = product?.reviews > 0;
  const freeShipBadge = (
    <span className="font-inter font-medium text-[9.5px] uppercase tracking-[0.03em] px-2 py-1 bg-oko-sage text-white rounded-[2px]">
      Free shipping
    </span>
  );

  return (
    <article className="group flex flex-col bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px]">
      {/* Media */}
      <Link href={product?.url || "#"} tabIndex={-1} aria-hidden="true" className="block">
        <div className="relative aspect-square bg-oko-cream-dim dark:bg-oko-night-3 border-b border-oko-stone-line dark:border-oko-line-dark overflow-hidden">
          {/* Badges */}
          {onSale && (
            <span className="absolute top-2.5 left-2.5 z-[1] font-inter font-semibold text-[10px] uppercase tracking-[0.04em] px-2 py-1 bg-oko-barn text-white rounded-[2px]">
              Sale
            </span>
          )}
          <span className={`absolute top-2.5 z-[1] ${onSale ? "right-2.5" : "left-2.5"}`}>
            {freeShipBadge}
          </span>
          {product?.image && (
            <Image
              src={product.image}
              alt={product?.name || product?.title || "Product"}
              fill
              sizes="(max-width: 560px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-4 group-hover:scale-[1.03] transition-transform duration-300"
              loading="lazy"
            />
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.04em] text-oko-barn dark:text-oko-barn-light line-clamp-1">
          {product?.brand}
        </p>
        <Link href={product?.url || "#"} className="mt-1.5">
          <h3 className="font-inter font-medium text-[14px] leading-[1.3] text-oko-char dark:text-oko-cream hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors line-clamp-2">
            {product?.name || product?.title}
          </h3>
        </Link>

        {/* Review line */}
        <div className="mt-1.5 text-[11.5px] text-oko-stone">
          {hasReviews ? (
            <>
              <Stars rating={product?.ratings} />
              <span className="ml-1.5">{product.reviews} reviews</span>
              <span className="sr-only">
                Rated {product?.ratings} out of 5, {product.reviews} reviews
              </span>
            </>
          ) : (
            "No reviews"
          )}
        </div>

        {/* Price row */}
        <div className="mt-auto pt-3.5 flex items-end justify-between gap-3">
          <div>
            {product?.was ? (
              <span className="text-[12px] text-oko-stone line-through mr-1.5">
                ${formatPrice(product.was)}
              </span>
            ) : null}
            <span className="font-inter font-semibold text-[16px] text-oko-char dark:text-oko-cream">
              ${formatPrice(product?.price)}
            </span>
            {onSale && (
              <span className="block font-inter font-semibold text-[11px] text-oko-sage dark:text-oko-sage-light mt-0.5">
                Save ${formatPrice(product.save_amt)}
              </span>
            )}
          </div>

          <AddToCartButtonWrap product={product}>
            <button
              type="button"
              aria-label={`Add ${product?.name || product?.title} to cart`}
              className="flex-shrink-0 w-[34px] h-[34px] flex items-center justify-center border border-oko-char dark:border-oko-cream rounded-[2px] text-oko-char dark:text-oko-cream text-[18px] leading-none hover:bg-oko-char hover:text-oko-cream dark:hover:bg-oko-cream dark:hover:text-oko-char transition-colors"
            >
              +
            </button>
          </AddToCartButtonWrap>
        </div>
      </div>
    </article>
  );
}

export default function Products({ initialProducts = [] }) {
  const products = (initialProducts || []).map((i) => formatProduct(i)).filter(Boolean);

  return (
    <section id="products" className="py-16 bg-oko-cream-dim dark:bg-oko-night-2">
      <div className="max-w-[1260px] mx-auto px-5 sm:px-8">
        {/* Section header (8.7) */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <span className="block font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light mb-2">
              Today&apos;s deals
            </span>
            <h2 className="font-oko-display font-semibold text-[27px] leading-[1.2] text-oko-char dark:text-oko-cream">
              Best sellers on sale
            </h2>
          </div>
          <Link
            href={`${BASE_URL}/open-box`}
            className="font-inter font-semibold text-[13px] text-oko-sage dark:text-oko-sage-light border-b border-oko-sage dark:border-oko-sage-light pb-0.5 hover:text-oko-barn hover:border-oko-barn dark:hover:text-oko-barn-light transition-colors whitespace-nowrap"
          >
            See all deals →
          </Link>
        </div>

        <div className="grid grid-cols-1 min-[560px]:grid-cols-2 lg:grid-cols-4 gap-[22px]">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.url || p.name} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
