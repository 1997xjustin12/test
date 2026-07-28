"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { Eos3DotsLoading } from "@/app/components/icons/lib";
import ProductCartToCart from "./ProductCardToCart";
import { BASE_URL, formatPrice, formatProduct } from "@/app/lib/helpers";
import { STORE_NAME } from "@/app/lib/store_constants";

// "Added to cart" confirmation (OKO) — bordered, no shadow, barn primary action.
// Sage success pill (sage = logistics/savings), three-part price framing, and an
// outline-char secondary path. Matches the OKO product-card/stepper patterns.
const cartPageUrl = `${BASE_URL}/cart`;

export async function getCollectionProducts(id) {
  const res = await fetch(
    `${BASE_URL}/api/collections/collection-products/${id}`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error("Failed to fetch collection products");
  return res.json();
}

const YouMightAlsoLike = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const ymal_products = await getCollectionProducts(33);
        setProducts((ymal_products || []).map((i) => formatProduct(i)));
      } catch {
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="mb-3">
        <span className="block font-oko-mono text-[11px] font-medium uppercase tracking-[0.14em] text-oko-barn dark:text-oko-barn-light mb-1.5">
          More to consider
        </span>
        <h3 className="font-oko-display font-semibold text-[19px] leading-[1.2] text-oko-char dark:text-oko-cream">
          You might also like
        </h3>
      </div>
      {products.length === 0 ? (
        <div className="flex items-center justify-center min-h-[180px]">
          <Eos3DotsLoading width={100} height={100} />
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {products.map((item, index) => (
            <div key={`ymal-product-${index}`} className="flex-shrink-0 w-[160px]">
              <ProductCartToCart item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const GrillProtectionSection = () => {
  const planBtn =
    "px-5 py-2.5 w-full rounded-[2px] font-inter font-semibold text-[13.5px] text-oko-char dark:text-oko-cream bg-white dark:bg-oko-night-2 border border-oko-char dark:border-oko-cream hover:bg-oko-char hover:text-oko-cream dark:hover:bg-oko-cream dark:hover:text-oko-char transition-colors";

  return (
    <div className="w-full flex flex-col lg:flex-row bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark transition-colors">
      {/* Content Section */}
      <div className="w-full lg:w-[calc(100%-240px)] p-4 lg:p-6">
        <h4 className="font-oko-display font-semibold text-[19px] leading-[1.2] text-oko-char dark:text-oko-cream">
          Grill protection plan
        </h4>

        <div className="flex flex-col sm:flex-row mt-4 gap-4">
          {/* Image Container */}
          <div className="flex relative justify-center sm:justify-start">
            <div className="bg-white dark:bg-oko-night-2 w-[140px] h-[100px] lg:h-[140px] flex relative items-center justify-center rounded-[2px] overflow-hidden border border-oko-stone-line dark:border-oko-line-dark">
              <Image
                src="/images/bbq-guy-protection.webp"
                alt="Protection-Image"
                className="w-full h-full p-2"
                style={{ objectFit: "contain" }}
                fill
              />
            </div>
          </div>

          {/* List and Links */}
          <div className="w-full sm:pl-4 flex flex-col gap-6">
            <ul className="list-disc list-inside marker:text-oko-barn dark:marker:text-oko-barn-light font-inter text-[14px] text-oko-char-soft dark:text-oko-ondark">
              <li className="mb-2">Hassle-free repairs</li>
              <li className="mb-2">Mechanical and electrical failures</li>
              <li>Failures caused by power surges</li>
            </ul>

            <div>
              <Link
                href="#"
                prefetch={false}
                className="inline-flex items-center gap-2 font-inter text-[13.5px] font-semibold text-oko-sage dark:text-oko-sage-light border-b border-oko-sage dark:border-oko-sage-light pb-0.5 hover:text-oko-barn hover:border-oko-barn dark:hover:text-oko-barn-light transition-colors"
              >
                <span>See plan details →</span>
              </Link>
            </div>

            {/* Features Row */}
            <div className="flex flex-wrap gap-4 items-center font-inter text-[13px] text-oko-char-soft dark:text-oko-ondark">
              <div className="flex gap-2 items-center">
                <svg className="shrink-0 text-oko-barn dark:text-oko-barn-light" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M5.005 9.003a1 1 0 0 1 1 1a6.97 6.97 0 0 1 4.33 1.5h2.17c1.332 0 2.529.579 3.353 1.498l3.147.002a5 5 0 0 1 4.516 2.851c-2.365 3.12-6.194 5.149-10.516 5.149c-2.79 0-5.15-.604-7.061-1.658a1 1 0 0 1-.94.658h-3a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm1 3v5.02l.045.034c1.794 1.26 4.133 1.946 6.955 1.946c3.004 0 5.798-1.156 7.835-3.13l.133-.133l-.12-.1a3 3 0 0 0-1.643-.63l-.205-.007l-2.112-.001q.11.484.112 1v1h-9v-2h6.79l-.034-.079a2.5 2.5 0 0 0-2.092-1.415l-.164-.005h-2.93a5 5 0 0 0-3.57-1.5m-2-1h-1v7h1zm9.646-7.425l.354.354l.353-.354a2.5 2.5 0 0 1 3.536 3.536l-3.89 3.889l-3.888-3.89a2.5 2.5 0 1 1 3.535-3.535M11.53 4.992a.5.5 0 0 0-.059.637l.058.07l2.475 2.475l2.476-2.475a.5.5 0 0 0 .058-.637l-.058-.07a.5.5 0 0 0-.638-.057l-.07.057l-1.769 1.77l-1.767-1.77l-.068-.058a.5.5 0 0 0-.638.058" />
                </svg>
                <span>Simple claims process</span>
              </div>
              <div className="flex gap-2 items-center">
                <svg className="shrink-0 text-oko-barn dark:text-oko-barn-light" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M10.081 4.089c.53.366 1.037.607 1.454.66a5 5 0 0 0-.47 1.44c-.672-.149-1.311-.504-1.836-.866a10 10 0 0 1-.729-.557V7a.75.75 0 0 1-.47.695l-.006.003a3 3 0 0 0-.166.074c-.117.055-.287.14-.486.254A6.5 6.5 0 0 0 6.03 9.03c-.453.453-.733 1.063-.89 1.536c-.203.606-.719 1.165-1.453 1.288a.224.224 0 0 0-.187.22v1.754c0 .165.12.306.283.333c.624.104 1.115.512 1.392 1.006a8.4 8.4 0 0 0 1.355 1.802a5 5 0 0 0 1.585 1.039a5 5 0 0 0 .774.254l.005.002A.75.75 0 0 1 9.5 19v1.25c0 .138.112.25.25.25H11a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 1.5 1.5h1.25a.25.25 0 0 0 .25-.25V18c0-.283.16-.542.412-.67l.013-.007l.07-.04c.065-.039.164-.1.285-.188c.242-.176.571-.449.9-.833c.653-.761 1.32-1.968 1.32-3.762c0-1.007-.188-1.82-.509-2.488a5 5 0 0 0 .798-1.576q.15.204.282.423c.604.999.929 2.204.929 3.64c0 2.207-.833 3.75-1.68 4.739A6.7 6.7 0 0 1 19 18.42v1.829A1.75 1.75 0 0 1 17.25 22H16a1.5 1.5 0 0 1-1.5-1.5h-2A1.5 1.5 0 0 1 11 22H9.75A1.75 1.75 0 0 1 8 20.25v-.683a7 7 0 0 1-.464-.175A6.5 6.5 0 0 1 5.47 18.03a10 10 0 0 1-1.605-2.131a.49.49 0 0 0-.329-.258A1.84 1.84 0 0 1 2 13.828v-1.753c0-.843.61-1.562 1.44-1.7c.087-.015.216-.102.277-.284c.192-.577.565-1.434 1.253-2.122a8 8 0 0 1 1.658-1.246q.206-.117.372-.2V3.67c0-.938 1.13-1.323 1.74-.716c.33.329.81.767 1.341 1.134m2.989 4.759c-.49-.203-.904-.589-1.002-1.11a4.002 4.002 0 0 1 7.627-2.27a4 4 0 0 1-1.436 4.834c-.438.299-1.003.279-1.493.076zm4.394.18a2.502 2.502 0 0 0-2.42-4.338a2.5 2.5 0 0 0-1.513 2.708l.021.016a.5.5 0 0 0 .092.048l3.696 1.53a.5.5 0 0 0 .124.035M9 10a1 1 0 1 1-2 0a1 1 0 0 1 2 0" />
                </svg>
                <span>No deductibles</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="w-full lg:w-[240px] p-4 lg:p-6 bg-white dark:bg-oko-night-2 flex flex-col items-center justify-center gap-3 border-t lg:border-t-0 lg:border-l border-oko-stone-line dark:border-oko-line-dark">
        <button type="button" className={planBtn}>5 year — $159.99</button>
        <button type="button" className={planBtn}>3 year — $99.99</button>
        <button type="button" className={planBtn}>2 year — $79.99</button>
      </div>
    </div>
  );
};

const CheckIcon = ({ cls = "w-2.5 h-2.5" }) => (
  <svg className={cls} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = ({ cls = "w-3.5 h-3.5" }) => (
  <svg className={cls} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const TruckIcon = ({ cls = "w-3 h-3" }) => (
  <svg className={cls} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h4l3 3v5h-7V8zM5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm13 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
  </svg>
);

const getProductStatsByData = (data) => {
  if (!data) return null;
  return {
    total_count: data.reduce((acc, item) => acc + item.quantity, 0),
    total_price: data.reduce(
      (acc, item) =>
        acc + (item?.["variants"]?.[0]?.price || 0) * (item?.quantity || 0),
      0,
    ),
  };
};

const Header = ({ data, onClose }) => {
  const stats = getProductStatsByData(data);
  if (!stats) return null;

  return (
    <div className="px-4 py-3 flex items-center justify-between border-b border-oko-stone-line dark:border-oko-line-dark bg-white dark:bg-oko-night-2">
      {/* Success pill — sage (logistics/confirmation) */}
      <div className="inline-flex items-center gap-2 bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark border-l-4 border-l-oko-sage dark:border-l-oko-sage-light rounded-[2px] px-3 py-1.5">
        <span className="w-[18px] h-[18px] rounded-full bg-oko-sage dark:bg-oko-sage-light flex items-center justify-center text-white dark:text-oko-night flex-shrink-0">
          <CheckIcon cls="w-2.5 h-2.5" />
        </span>
        <span className="font-inter text-[12px] font-semibold text-oko-char-soft dark:text-oko-ondark">
          {stats.total_count} item{stats.total_count !== 1 ? "s" : ""} added to cart
        </span>
      </div>

      <button
        type="button"
        aria-label="Close"
        onClick={() => onClose(true)}
        className="w-8 h-8 rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark flex items-center justify-center text-oko-stone hover:border-oko-char hover:text-oko-char dark:hover:border-oko-cream dark:hover:text-oko-cream transition-colors"
      >
        <XIcon cls="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

const Savings = ({ price, was, quantity = 1, format = "number" }) => {
  const currentPrice = parseFloat(price);
  const originalPrice = parseFloat(was);
  const diff = originalPrice - currentPrice;
  const saved =
    format === "number"
      ? formatPrice(diff)
      : `${Math.round((diff / originalPrice) * 100)}%`;

  if (diff <= 0 || !originalPrice) return null;

  return (
    <>
      {quantity === 1 ? (
        <span className="font-inter text-[12px] text-oko-stone line-through">
          ${formatPrice(was)}&nbsp;
        </span>
      ) : (
        <>
          <span className="font-inter text-[12px] text-oko-stone line-through">
            ${formatPrice(diff)}&nbsp;
          </span>
          &nbsp;each&nbsp;
        </>
      )}
      <span className="font-inter text-[11px] font-semibold text-oko-sage dark:text-oko-sage-light">
        Save {format === "number" ? `$${saved}` : saved}
      </span>
    </>
  );
};

const AddedToCartProducts = ({ data }) => {
  if (!data) return null;
  return (
    <div className="w-full">
      {data.map((datum) => (
        <CartItem key={`added-to-cart-item-${datum?.product_id}`} item={datum} />
      ))}
    </div>
  );
};

function CartItem({ item }) {
  return (
    <div
      className="grid border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] overflow-hidden bg-white dark:bg-oko-night-2"
      style={{ gridTemplateColumns: "clamp(120px,34%,200px) 1fr" }}
    >
      {/* Photo — cream-dim well */}
      <div className="relative overflow-hidden min-h-[100px] bg-oko-cream-dim dark:bg-oko-night-3">
        {item?.image && (
          <Image
            src={item.image}
            title={item.title}
            alt={item.title}
            className="w-full h-full object-contain p-2"
            fill
          />
        )}
        <span className="absolute bottom-2 left-2.5 z-10 font-oko-mono text-[9px] uppercase tracking-[0.14em] text-oko-stone">
          {STORE_NAME}
        </span>
      </div>

      {/* Info */}
      <div className="border-l border-oko-stone-line dark:border-oko-line-dark p-3 flex flex-col gap-1">
        <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.04em] text-oko-barn dark:text-oko-barn-light">
          {item?.brand}
        </p>
        <p className="font-inter text-[13px] font-medium leading-[1.3] text-oko-char dark:text-oko-cream">
          {item?.title}
        </p>

        {/* Price */}
        <div className="flex flex-col mt-0.5">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-inter text-[17px] font-semibold text-oko-char dark:text-oko-cream">
              ${formatPrice(item?.price * item?.quantity)}
            </span>
            {!!item?.was && item?.quantity === 1 && (
              <Savings price={item?.price} was={item?.was} />
            )}
          </div>
          {item?.quantity > 1 && (
            <div className="font-inter text-[12px] text-oko-char-soft dark:text-oko-ondark">
              ${formatPrice(item?.price)} per item{" "}
              {!!item?.was && (
                <span>
                  &nbsp;&middot;&nbsp;
                  <Savings price={item?.price} was={item?.was} quantity={item?.quantity} format="percentage" />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Meta chips */}
        <div className="flex items-center gap-1.5 flex-wrap mt-1">
          <span className="font-inter text-[10px] font-semibold uppercase tracking-[0.06em] text-oko-stone bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] px-2 py-0.5">
            Qty: {item?.quantity}
          </span>
        </div>

        {/* Shipping */}
        <div className={`flex items-center gap-1.5 font-inter text-[11px] font-medium mt-auto pt-1 ${item?.is_freeShipping ? "text-oko-sage dark:text-oko-sage-light" : "text-oko-stone line-through"}`}>
          <TruckIcon />
          Free shipping on this item
        </div>
      </div>
    </div>
  );
}

function AddedToCartDialog({ data, onClose }) {
  const [toggle, setToggle] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (data) {
      setItems(Array.isArray(data) ? data : [data]);
      setToggle(true);
    } else {
      setToggle(false);
    }
  }, [data]);

  const handleClose = () => {
    setToggle(false);
    onClose();
  };

  const handleGoToCartClick = (e) => {
    e.preventDefault();
    handleClose();
    window.location.href = cartPageUrl;
  };

  if (!data) return null;

  return (
    <Dialog open={toggle} onClose={setToggle} className="relative z-30">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-oko-char/60 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-[350ms] data-[leave]:duration-200 data-[enter]:ease-[cubic-bezier(0.16,1,0.3,1)] data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto overflow-x-hidden">
        <div className="w-screen h-full relative">
          <div className="absolute top-10 left-0 right-0 flex items-end justify-center md:p-4 text-center sm:items-center sm:p-[10px]">
            <DialogPanel
              transition
              className="w-full relative transform overflow-hidden bg-white dark:bg-oko-night-2 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] text-left transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-[400ms] data-[leave]:duration-200 data-[enter]:ease-[cubic-bezier(0.16,1,0.3,1)] data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[800px] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 overflow-y-auto"
            >
              <Header data={items} onClose={handleClose} />

              <div className="flex flex-col bg-oko-cream-dim dark:bg-oko-night-3 border-y border-oko-stone-line dark:border-oko-line-dark px-[15px] py-[15px] gap-[10px]">
                <AddedToCartProducts data={items} />
                <div className="flex justify-between items-center gap-[10px] w-full">
                  <Link
                    onClick={handleGoToCartClick}
                    href={cartPageUrl}
                    className="flex-1 py-3 text-center rounded-[2px] bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[13.5px] transition-colors"
                  >
                    Go to cart
                  </Link>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-3 rounded-[2px] border border-oko-char dark:border-oko-cream text-oko-char dark:text-oko-cream font-inter font-semibold text-[13.5px] hover:bg-oko-char hover:text-oko-cream dark:hover:bg-oko-cream dark:hover:text-oko-char transition-colors"
                  >
                    Continue shopping
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <GrillProtectionSection />
              </div>

              <div className="flex flex-col p-3">
                <YouMightAlsoLike />
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default AddedToCartDialog;
