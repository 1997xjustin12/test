"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useAuth } from "@/app/context/auth";
import { getProductsByIds, getReviewsByProductId } from "@/app/lib/api";
import { BASE_URL, createSlug, formatPrice } from "@/app/lib/helpers";
import AddToCartButtonWrap from "@/app/components/atom/AddToCartButtonWrap";
import { CartIcon } from "@/app/components/icons/lib";
import { Rating } from "@smastrom/react-rating";
import { useCart } from "@/app/context/cart";
import { STORE_CONTACT } from "@/app/lib/store_constants";

// ─── Status badge ─────────────────────────────────────────────────────────────

const statusConfig = {
  pending:   { cls: "text-oko-stone border-oko-stone-line bg-oko-cream-dim dark:bg-oko-night-3 dark:border-oko-line-dark",           label: "Pending"   },
  paid:      { cls: "text-oko-sage border-oko-sage/30 bg-oko-sage/10",                                                               label: "Paid"      },
  shipped:   { cls: "text-oko-sage border-oko-sage/30 bg-oko-sage/10",                                                               label: "Shipped"   },
  delivered: { cls: "text-oko-sage border-oko-sage/30 bg-oko-sage/10",                                                               label: "Delivered" },
  cancelled: { cls: "text-oko-barn dark:text-oko-barn-light border-oko-barn/30 bg-oko-barn/10",                                      label: "Cancelled" },
  refunded:  { cls: "text-oko-stone border-oko-stone-line bg-oko-cream-dim dark:bg-oko-night-3 dark:border-oko-line-dark",           label: "Refunded"  },
};

const VALID_STATUSES = Object.keys(statusConfig);

const OrderStatusBadge = ({ status }) => {
  const config = statusConfig[status];
  if (!config) return null;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[2px] border font-inter text-[10px] font-semibold uppercase tracking-[0.06em] ${config.cls}`}>
      {config.label}
    </span>
  );
};

// ─── Skeletons ────────────────────────────────────────────────────────────────

const OrderSkeleton = () => (
  <div className="bg-white dark:bg-oko-night-2 rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark p-5">
    <div className="flex items-center gap-3 mb-4">
      <div className="h-5 w-20 bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px]" />
      <div className="h-4 w-32 bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px]" />
    </div>
    <div className="flex gap-4 pt-4 border-t border-oko-stone-line dark:border-oko-line-dark">
      <div className="w-20 h-20 bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px] flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2.5 py-1">
        <div className="h-3.5 w-full bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px]" />
        <div className="h-3.5 w-2/3 bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px]" />
        <div className="h-3 w-24 bg-oko-cream-dim dark:bg-oko-night-3 rounded-[2px] mt-1" />
      </div>
    </div>
  </div>
);

// ─── Review form modal ────────────────────────────────────────────────────────

const inputClass =
  "w-full bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] px-4 py-3 text-[14px] font-inter text-oko-char dark:text-oko-cream placeholder-oko-stone outline-none focus:border-oko-barn dark:focus:border-oko-barn-light transition-colors";

const labelClass = "block font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-oko-stone mb-1.5";

const ReviewForm = ({ product, onClose, initForm, action }) => {
  const { user, userReviewCreate, userReviewUpdate } = useAuth();
  const [toggle, setToggle] = useState(false);
  const inputRef = useRef(null);
  const [form, setForm] = useState({
    id: null,
    product: product?.product_id,
    rating: 0,
    title: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = action === "update"
        ? await userReviewUpdate(form)
        : await userReviewCreate(form);
      const data = await response.json();
      if (!response?.ok) {
        console.warn("[ReviewForm] submission failed", data);
        return;
      }
      setToggle(false);
    } catch (err) {
      console.warn("[ReviewForm]", err);
    } finally {
      setLoading(false);
    }
  };

  const productImage = useMemo(() => {
    if (!product?.images?.length) return null;
    return product.images.find((img) => img?.position === 1)?.src ?? null;
  }, [product]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    setToggle(!!product);
    if (product?.product_id)
      setForm((prev) => ({ ...prev, product: product.product_id }));
  }, [product]);

  useEffect(() => {
    setForm(
      initForm
        ? { ...initForm }
        : { id: null, product: product?.product_id, rating: 0, title: "", comment: "" },
    );
  }, [initForm, user]);

  return (
    <Dialog open={toggle} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-oko-char/50 dark:bg-black/70 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-lg relative bg-white dark:bg-oko-night-2 rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-oko-display font-semibold text-[19px] text-oko-char dark:text-oko-cream">Write a review.</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Product preview */}
              <div className="flex items-center gap-3 p-3 bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark rounded-[2px] mb-5">
                <div className="relative w-14 h-14 flex-shrink-0 rounded-[2px] overflow-hidden bg-white dark:bg-oko-night border border-oko-stone-line dark:border-oko-line-dark">
                  {productImage && (
                    <Image
                      src={productImage}
                      alt={createSlug(product?.title || "")}
                      fill
                      className="object-contain"
                      sizes="56px"
                    />
                  )}
                </div>
                <p className="font-inter text-[13px] font-semibold text-oko-char dark:text-oko-cream line-clamp-2">
                  {product?.title}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className={labelClass}>Rating <span className="text-oko-barn dark:text-oko-barn-light">*</span></label>
                  <Rating
                    value={form?.rating || 3}
                    onChange={(val) => handleChange({ target: { name: "rating", value: val } })}
                    style={{ maxWidth: 140 }}
                  />
                </div>

                <div>
                  <label className={labelClass}>Title <span className="text-oko-barn dark:text-oko-barn-light">*</span></label>
                  <input
                    ref={inputRef}
                    name="title"
                    value={form?.title || ""}
                    onChange={handleChange}
                    required
                    placeholder="Summarise your experience"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Comment <span className="text-oko-barn dark:text-oko-barn-light">*</span></label>
                  <textarea
                    name="comment"
                    value={form?.comment || ""}
                    onChange={handleChange}
                    rows={4}
                    required
                    placeholder="Tell others what you think…"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="font-inter text-[12.5px] font-semibold text-oko-stone hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-3 bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[13.5px] rounded-[2px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Submitting…" : "Submit review"}
                  </button>
                </div>
              </form>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

// ─── Review button ────────────────────────────────────────────────────────────

const ReviewButton = ({ product, toggleForm }) => {
  const { loading, user } = useAuth();
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    const product_id = product?.product_id;
    if (!product_id || loading) return;

    const fetchReviews = async () => {
      const response = await getReviewsByProductId(product_id);
      if (!response?.ok) { setUserReview(null); return; }
      const data = await response.json();
      const found = data?.results?.find((r) => r?.user?.email === user?.email);
      if (found) {
        setUserReview({ product: found.product?.id, rating: found.rating, title: found.title, comment: found.comment, id: found.id });
      }
    };

    fetchReviews();
  }, [product, user, loading]);

  const sharedClass =
    "px-3 py-1.5 border border-oko-stone-line dark:border-oko-line-dark font-inter text-[12.5px] font-semibold text-oko-char-soft dark:text-oko-ondark hover:border-oko-barn hover:text-oko-barn dark:hover:border-oko-barn-light dark:hover:text-oko-barn-light rounded-[2px] transition-colors";

  if (!userReview)
    return (
      <button onClick={() => toggleForm({ action: "create", form: null, product })} className={sharedClass}>
        Write review
      </button>
    );

  return (
    <button onClick={() => toggleForm({ action: "update", form: userReview, product })} className={sharedClass}>
      Edit review
    </button>
  );
};

// ─── Orders page ──────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const { addToCartLoading } = useCart();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [products, setProducts] = useState([]);
  const { loading, isLoggedIn, user, userOrdersGet } = useAuth();
  const [reviewProduct, setReviewProduct] = useState(null);
  const [reviewForm, setReviewForm] = useState(null);
  const [reviewAction, setReviewAction] = useState("create");

  const handleToggleForm = ({ action, form, product }) => {
    setReviewAction(action);
    setReviewProduct(product);
    setReviewForm(form);
  };

  const handleCloseReviewForm = () => {
    setReviewAction("create");
    setReviewProduct(null);
    setReviewForm(null);
  };

  const mergedOrders = useMemo(() => {
    if (products.length === 0 || orders.length === 0) return null;
    return orders.map((order) => ({
      ...order,
      items: order.items.map((item) => {
        const product = products.find((p) => p.product_id == item.product_id) || null;
        const img = product?.images?.find(({ position }) => position == 1)?.src || null;
        const url = `${BASE_URL}/${createSlug(product?.brand)}/product/${product?.handle}`;
        const compare_at_price = product?.variants?.[0]?.compare_at_price;
        return { ...item, title: product?.title, image: img, url, compare_at_price, product };
      }),
    }));
  }, [products, orders]);

  useEffect(() => {
    if (loading || !user) return;
    const getOrders = async () => {
      const _orders = await userOrdersGet();
      if (_orders.length === 0) setLoadingOrders(false);
      setOrders(_orders);
    };
    getOrders();
  }, [loading, user]);

  useEffect(() => {
    if (!orders || orders.length === 0) return;
    const productIds = [...new Set(orders.flatMap((o) => o.items.map((i) => i.product_id)))];
    const fetchRelatedProducts = async () => {
      try {
        const response = await getProductsByIds(productIds);
        if (!response?.ok) { setProducts(null); return; }
        const { data } = await response.json();
        setProducts(data);
      } catch {
        // silent
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchRelatedProducts();
  }, [orders]);

  if (!isLoggedIn) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div className="bg-white dark:bg-oko-night-2 rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="font-oko-display font-semibold text-[19px] text-oko-char dark:text-oko-cream">My orders.</h2>
        <Link
          prefetch={false}
          href={`tel:${STORE_CONTACT}`}
          className="inline-flex items-center gap-1.5 font-inter text-[12.5px] font-semibold text-oko-sage hover:text-oko-barn dark:hover:text-oko-barn-light transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          Need help? {STORE_CONTACT}
        </Link>
      </div>

      {/* Loading */}
      {loadingOrders && (
        <div className="flex flex-col gap-3">
          <OrderSkeleton />
          <OrderSkeleton />
        </div>
      )}

      {/* Empty state */}
      {!loadingOrders && !mergedOrders && (
        <div className="bg-white dark:bg-oko-night-2 rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark py-16 flex flex-col items-center text-center px-4">
          <span className="w-14 h-14 rounded-[2px] bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark flex items-center justify-center text-oko-stone mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </span>
          <h3 className="font-oko-display font-semibold text-[24px] leading-[1.2] text-oko-char dark:text-oko-cream mb-2">No orders yet.</h3>
          <p className="font-inter text-[13.5px] text-oko-stone mb-6">
            You haven&apos;t placed any orders so far.
          </p>
          <Link
            href={BASE_URL || "/"}
            className="px-5 py-3 bg-oko-barn hover:bg-oko-barn-dark text-white font-inter font-semibold text-[13.5px] rounded-[2px] transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      )}

      {/* Order list */}
      {!loadingOrders && mergedOrders && mergedOrders.length > 0 && (
        <div className="flex flex-col gap-4">
          {mergedOrders.map((order) => (
            <div
              key={`order-${order?.order_number}`}
              className="bg-white dark:bg-oko-night-2 rounded-[2px] border border-oko-stone-line dark:border-oko-line-dark overflow-hidden"
            >
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-oko-stone-line dark:border-oko-line-dark">
                <div className="flex items-center gap-2.5">
                  <OrderStatusBadge status={order?.status} />
                  <span className="font-inter text-[13px] text-oko-char-soft dark:text-oko-ondark">
                    Order <span className="font-semibold text-oko-char dark:text-oko-cream">#{order?.order_number}</span>
                  </span>
                </div>
                <span className="font-inter text-[16px] font-semibold text-oko-char dark:text-oko-cream">
                  ${formatPrice(order?.total_price)}
                </span>
              </div>

              {/* Order items */}
              <div className="divide-y divide-oko-stone-line dark:divide-oko-line-dark">
                {order?.items?.map((item) => (
                  <div
                    key={`${order?.order_number}-item-${item.product_id}`}
                    className="flex gap-4 p-5"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-[2px] overflow-hidden bg-oko-cream-dim dark:bg-oko-night-3 border border-oko-stone-line dark:border-oko-line-dark">
                      {item?.image && (
                        <Image
                          src={item.image}
                          alt={createSlug(item?.title || "")}
                          fill
                          className="object-contain"
                          sizes="80px"
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                        <p className="font-inter text-[14px] font-medium text-oko-char dark:text-oko-cream line-clamp-2 leading-snug">
                          {item?.title}
                        </p>
                        <div className="flex flex-col items-start sm:items-end flex-shrink-0">
                          <span className="font-inter text-[16px] font-semibold text-oko-char dark:text-oko-cream">
                            ${formatPrice(parseFloat(item?.price) * item?.quantity)}
                          </span>
                          {item?.compare_at_price && item.compare_at_price !== "0" && item.compare_at_price > 0 && (
                            <span className="font-inter text-[13px] text-oko-stone line-through">
                              ${formatPrice(item.compare_at_price * item?.quantity)}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="font-inter text-[12px] text-oko-stone">Qty: {item?.quantity}</p>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-auto pt-1 flex-wrap">
                        {order?.status === "delivered" && (
                          <ReviewButton product={item?.product} toggleForm={handleToggleForm} />
                        )}
                        {["delivered", "cancelled", "refunded"].includes(order?.status) && (
                          <AddToCartButtonWrap product={item?.product}>
                            <button
                              disabled={addToCartLoading}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-oko-barn hover:bg-oko-barn-dark text-white font-inter text-[12.5px] font-semibold rounded-[2px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              <CartIcon />
                              Buy again
                            </button>
                          </AddToCartButtonWrap>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ReviewForm
        product={reviewProduct}
        onClose={handleCloseReviewForm}
        initForm={reviewForm}
        action={reviewAction}
      />
    </div>
  );
}
