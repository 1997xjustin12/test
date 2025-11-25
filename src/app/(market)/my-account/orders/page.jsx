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
import { Eos3DotsLoading } from "@/app/components/icons/lib";
import { useCart } from "@/app/context/cart";
import { STORE_CONTACT } from "@/app/lib/store_constants";

const OrderStatusBadge = ({ status }) => {
  const badges = {
    pending: {
      color: "#FACC15",
      label: "Pending",
    },
    paid: {
      color: "#4ADE80",
      label: "Paid",
    },
    shipped: {
      color: "#38BDF8",
      label: "Shipped",
    },
    delivered: {
      color: "#22C55E",
      label: "Delivered",
    },
    cancelled: {
      color: "#FB7185",
      label: "Cancelled",
    },
    refunded: {
      color: "#111827",
      label: "Refunded",
    },
  };

  const useColor = useMemo(() => {
    return badges?.[status]?.color;
  }, [status, badges]);
  const useLabel = useMemo(() => {
    return badges?.[status]?.label;
  }, [status, badges]);

  if (
    ![
      "pending",
      "paid",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ].includes(status)
  )
    return null;

  return (
    <div
      style={{ color: useColor, border: `2px solid ${useColor}` }}
      className="px-1 font-bold"
    >
      {useLabel}
    </div>
  );
};

const ReviewForm = ({ product, onClose, initForm, action }) => {
  const { user, userReviewCreate, userReviewUpdate } = useAuth();
  const [toggle, setToggle] = useState(false);
  const inputRef = useRef(null);
  const [form, setForm] = useState({
    id: null,
    product: product?.product_id,
    rating: 4,
    title: "Good value for the price",
    comment:
      "A few scratches on the exterior but nothing major. Still a great deal for the price.",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let response;
      if (action === "update") {
        response = await userReviewUpdate(form);
      } else {
        response = await userReviewCreate(form);
      }
      const data = await response.json();
      if (!response.ok) {
        console.warn("[handleSubmit]", err);
        return;
      }
      setToggle(false);
    } catch (err) {
      console.warn("[handleSubmit]", err);
    } finally {
      setLoading(false);
    }
  };

  const productImage = useMemo(() => {
    if (!product?.images?.length) return null;
    return product.images.find((image) => image?.position === 1)?.src ?? null;
  }, [product]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setToggle(!!product);
    if (product?.product_id)
      setForm((prev) => ({ ...prev, product: product?.product_id }));
  }, [product]);

  useEffect(() => {
    setForm((prev) => {
      return (
        { ...initForm } || {
          ...form,
          rating: 3,
          title: "",
          comment: "",
          id: null,
        }
      );
    });
  }, [initForm, user]);

  return (
    <Dialog open={toggle} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto overflow-x-hidden">
        <div className="w-screen h-full relative">
          <div className="absolute p-1  top-10 left-0 right-0 flex items-end justify-center md:p-4 text-center sm:items-center sm:p-[10px]">
            <DialogPanel
              transition
              className="w-full relative transform overflow-hidden bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-[800px] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 overflow-y-auto rounded-lg"
            >
              <div className="rounded shadow-lg p-5 border border-neutral-300">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3>Write a review</h3>
                  <div className="flex items-center gap-5">
                    <div className="h-[100px] w-[100px] relative">
                      {productImage && (
                        <Image
                          src={productImage}
                          title={`${product?.title}`}
                          alt={`${createSlug(product?.title)}-image`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 300px"
                        />
                      )}
                    </div>
                    <div className="w-[calc(100%-100px)]">
                      <p className="text-sm font-medium text-neutral-800">
                        {product?.title}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="username" className="text-xs font-bold">
                      <span className="text-red-600">*</span> Rating
                    </label>
                    {/* <div>Let us know your rating for this product</div> */}
                    <Rating
                      value={form?.rating || 3}
                      onChange={(e) =>
                        handleChange({ target: { name: "rating", value: e } })
                      }
                      style={{ maxWidth: 150 }}
                    ></Rating>
                  </div>
                  <div>
                    <label htmlFor="username" className="text-xs font-bold">
                      <span className="text-red-600">*</span> Title
                    </label>
                    <input
                      ref={inputRef}
                      placeholder="Title"
                      name="title"
                      value={form?.title || ""}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="username" className="text-xs font-bold">
                      <span className="text-red-600">*</span> Comment
                    </label>
                    <textarea
                      name="comment"
                      value={form?.comment || ""}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Enter your comment..."
                      required
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-5 items-center flex-col-reverse sm:flex-row">
                    <button
                      onClick={onClose}
                      disabled={loading}
                      type="button"
                      className=" py-1 font-medium text-stone-700"
                    >
                      Cancel Review
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-10 py-2 border-2 font-bold bg-stone-600 hover:bg-stone-700 border-stone-600 hover:border-stone-700 text-white rounded  hover:shadow h-[44px] relative"
                    >
                      <div
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                          loading === true ? "visible" : "invisible"
                        }`}
                      >
                        <Eos3DotsLoading width={70} height={70} />
                      </div>
                      <span
                        className={loading === true ? "invisible" : "visible"}
                      >
                        Submit Review
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

const ReviewButton = ({ product, toggleForm }) => {
  const { loading, user } = useAuth();
  const [userReview, setUserReview] = useState(null);
  useEffect(() => {
    const product_id = product?.product_id;
    const fetchReviews = async () => {
      const response = await getReviewsByProductId(product_id);
      if (!response.ok) {
        setUserReview(null);
        return;
      }
      const data = await response.json();
      const user_review = data?.results?.find(
        (item) => item?.user?.email === user?.email
      );
      if (user_review) {
        setUserReview({
          product: user_review?.product?.id,
          rating: user_review?.rating,
          title: user_review?.title,
          comment: user_review?.comment,
          id: user_review?.id,
        });
      }
    };
    if (!product_id) return;
    if (loading) return;
    fetchReviews();
  }, [product, user, loading]);

  if (!userReview)
    return (
      <button
        onClick={() =>
          toggleForm({ action: "create", form: null, product: product })
        }
        className="border-[3px] py-2 px-4 rounded border-theme-600 hover:border-theme-700 text-theme-600 hover:text-theme-700"
      >
        Create Review
      </button>
    );

  return (
    <button
      onClick={() =>
        toggleForm({ action: "update", form: userReview, product: product })
      }
      className="border-[3px] py-2 px-4 rounded border-theme-600 hover:border-theme-700 text-theme-600 hover:text-theme-700"
    >
      Update Review
    </button>
  );
};

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
    const merged = orders.map((order) => ({
      ...order,
      items: order.items.map((item) => {
        const product =
          products.find((p) => p.product_id == item.product_id) || null;
        const img =
          product?.images?.find(({ position }) => position == 1)?.src || null;
        const url = `${BASE_URL}/${createSlug(product?.brand)}/product/${
          product?.handle
        }`;
        const compare_at_price = product?.variants?.[0]?.compare_at_price;
        return {
          ...item,
          title: product?.title,
          image: img,
          url,
          compare_at_price,
          product,
        };
      }),
    }));
    console.log("[merged]", merged);
    return merged;
  }, [products, orders]);

  // const productIds = useMemo(() => {
  //   if (orders?.length === 0) return null;
  //   return [
  //     ...new Set(
  //       orders.flatMap((order) => order.items.map((item) => item.product_id))
  //     ),
  //   ];
  // }, [orders]);

  useEffect(() => {
    const getOrders = async () => {
      const _orders = await userOrdersGet();
      if (_orders.length === 0) {
        setLoadingOrders(false);
      }
      setOrders(_orders);
    };

    if (!loading && user) {
      getOrders();
    }
  }, [loading, user]);

  useEffect(() => {
    const fetchRelatedProducts = async (productIds) => {
      try {
        // if (productIds?.length === 0) {
        //   setLoadingOrders(false);
        //   return;
        // }

        const response = await getProductsByIds(productIds);
        if (!response.ok) {
          setProducts(null);
          return;
        }
        const { data } = await response.json();
        setProducts(data);
      } catch (err) {
        console.log("[fetchRelatedProducts]", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (!orders || orders?.length === 0) return;

    const productIds = [
      ...new Set(
        orders.flatMap((order) => order.items.map((item) => item.product_id))
      ),
    ];

    fetchRelatedProducts(productIds);
  }, [orders]);

  if (!isLoggedIn) return null;

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="bg-white w-full p-[20px] shadow-lg border rounded-lg flex flex-col md:flex-row justify-between">
        <h3>Orders Page</h3>
        <span className="font-semibold">
          Need Assistance? Call.{" "}
          <Link
            prefetch={false}
            href={`tel:${STORE_CONTACT}`}
            className="underline text-theme-600 hover:text-theme-700"
          >
            {STORE_CONTACT}
          </Link>
        </span>
      </div>

      {!loadingOrders && !mergedOrders && (
        <div className="py-1 px-2 flex flex-col justify-center items-center">
          <h4 className="text-neutral-800 font-bold">
            No orders yet
            {/* <span className="font-light italic">{"<Displays only if app failed to fetch reviews>"}</span> */}
          </h4>
          <p className="text-neutral-700">
            You haven’t placed any orders so far.
          </p>
        </div>
      )}

      {loadingOrders ? (
        <div className="h-[100px] flex items-center justify-center text-neutral-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="2" r="0" fill="currentColor">
              <animate
                attributeName="r"
                begin="0"
                calcMode="spline"
                dur="1s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
            <circle
              cx="12"
              cy="2"
              r="0"
              fill="currentColor"
              transform="rotate(45 12 12)"
            >
              <animate
                attributeName="r"
                begin="0.125s"
                calcMode="spline"
                dur="1s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
            <circle
              cx="12"
              cy="2"
              r="0"
              fill="currentColor"
              transform="rotate(90 12 12)"
            >
              <animate
                attributeName="r"
                begin="0.25s"
                calcMode="spline"
                dur="1s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
            <circle
              cx="12"
              cy="2"
              r="0"
              fill="currentColor"
              transform="rotate(135 12 12)"
            >
              <animate
                attributeName="r"
                begin="0.375s"
                calcMode="spline"
                dur="1s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
            <circle
              cx="12"
              cy="2"
              r="0"
              fill="currentColor"
              transform="rotate(180 12 12)"
            >
              <animate
                attributeName="r"
                begin="0.5s"
                calcMode="spline"
                dur="1s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
            <circle
              cx="12"
              cy="2"
              r="0"
              fill="currentColor"
              transform="rotate(225 12 12)"
            >
              <animate
                attributeName="r"
                begin="0.625s"
                calcMode="spline"
                dur="1s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
            <circle
              cx="12"
              cy="2"
              r="0"
              fill="currentColor"
              transform="rotate(270 12 12)"
            >
              <animate
                attributeName="r"
                begin="0.75s"
                calcMode="spline"
                dur="1s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
            <circle
              cx="12"
              cy="2"
              r="0"
              fill="currentColor"
              transform="rotate(315 12 12)"
            >
              <animate
                attributeName="r"
                begin="0.875s"
                calcMode="spline"
                dur="1s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                repeatCount="indefinite"
                values="0;2;0;0"
              />
            </circle>
          </svg>
        </div>
      ) : (
        <>
          {mergedOrders &&
            mergedOrders?.length > 0 &&
            mergedOrders.map((order) => (
              <div
                key={`order-item-${order?.order_number}`}
                className="bg-white w-full p-[20px] shadow-lg border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <OrderStatusBadge status={order?.status} />
                  <div>
                    Order Number:{" "}
                    <span className="font-bold">{order?.order_number}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-5 py-2">
                  {order?.items &&
                    order.items.map((item) => (
                      <div
                        key={`${order?.order_number}-item-${item.product_id}`}
                        className="flex flex-col  border-t border-neutral-300 py-1"
                      >
                        <div className="flex gap-5">
                          <div className="relative w-[100px] h-[100px]">
                            {item?.image && (
                              <Image
                                src={item.image}
                                title={`${item?.title}`}
                                alt={`${createSlug(item?.title)}-image`}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 300px"
                              />
                            )}
                          </div>
                          <div className="flex flex-col gap-5 w-full">
                            <div className="flex flex-col md:flex-row justify-between gap-5">
                              <div>
                                <div>{item?.title}</div>
                                <div className="text-neutral-700">
                                  x{item?.quantity}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-theme-600">
                                  $
                                  {formatPrice(
                                    parseFloat(item?.price) * item?.quantity
                                  )}
                                </div>
                                {item?.compare_at_price &&
                                item?.compare_at_price !== "0" &&
                                item?.compare_at_price > 0 ? (
                                  <div className="text-neutral-400 line-through">
                                    $
                                    {formatPrice(
                                      item.compare_at_price * item?.quantity
                                    )}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="w-full flex justify-end">
                            {order?.status === "delivered" && (
                              <>
                                <ReviewButton
                                  product={item?.product}
                                  toggleForm={handleToggleForm}
                                />
                              </>
                            )}
                            {["delivered", "cancelled", "refunded"].includes(
                              order?.status
                            ) && (
                              <AddToCartButtonWrap product={item?.product}>
                                <button
                                  disabled={addToCartLoading}
                                  className="py-2 ml-3 px-4 bg-theme-600 hover:bg-theme-700 text-white rounded border-[3px] border-theme-600 hover:border-theme-700 flex items-center gap-2 relative"
                                >
                                  <div
                                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                                      addToCartLoading === true
                                        ? "visible"
                                        : "invisible"
                                    }`}
                                  >
                                    <Eos3DotsLoading width={70} height={70} />
                                  </div>
                                  <div
                                    className={`flex items-center gap-3 ${
                                      addToCartLoading === true
                                        ? "invisible"
                                        : "visible"
                                    }`}
                                  >
                                    <CartIcon />
                                    Buy Again
                                  </div>
                                </button>
                              </AddToCartButtonWrap>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="border-t border-neutral-300 w-full flex pt-5 items-center justify-end">
                  <div className="text-lg text-neutral-700 flex">
                    <div>Order Total:</div>
                    <div className="text-theme-600 font-bold min-w-[130px] text-right">
                      ${formatPrice(order?.total_price)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </>
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
