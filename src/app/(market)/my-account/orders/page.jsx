"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/context/auth";
import { getProductsByIds } from "@/app/lib/api";
import { BASE_URL, createSlug, formatPrice } from "@/app/lib/helpers";

const OrderStatusBadge = ({status}) => {
  if(!["pending", "paid", "shipped", "delivered", "cancelled", "refunded"].includes(status)) return null;
  const badges = {
    pending: {
      color:"#FACC15",
      label:"Pending",
    },
    paid: {
      color:"#4ADE80",
      label:"Paid",
    },
    shipped: {
      color:"#38BDF8",
      label:"Shipped",
    },
    delivered: {
      color:"#22C55E",
      label:"Delivered",
    },
    cancelled: {
      color:"#FB7185",
      label:"Cancelled",
    },
    refunded: {
      color:"#111827",
      label:"Refunded",
    }
  }

  const useColor = useMemo(()=>{
    return badges?.[status]?.color;
  },[status, badges])
  const useLabel = useMemo(()=>{
    return badges?.[status]?.label;
  },[status, badges])
  return (<div style={{color:useColor, border:`2px solid ${useColor}`}} className="px-1 font-bold">{useLabel}</div>);
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const { loading, isLoggedIn, user, userOrdersGet } = useAuth();

  const productIds = useMemo(() => {
    if (orders?.length === 0) return null;
    return [
      ...new Set(
        orders.flatMap((order) => order.items.map((item) => item.product_id))
      ),
    ];
  }, [orders]);

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
        };
      }),
    }));
    console.log("[merged]", merged);
    return merged;
  }, [products, orders]);

  useEffect(() => {
    const getOrders = async () => {
      const _orders = await userOrdersGet();
      setOrders(_orders);
    };

    if (!loading && user) {
      getOrders();
    }
  }, [loading, user]);

  useEffect(() => {
    console.log("productIds", productIds);
    const fetchRelatedProducts = async () => {
      try {
        const response = await getProductsByIds(productIds);
        if (!response.ok) {
          setProducts(null);
          return;
        }
        const { data } = await response.json();
        console.log("[products]", data);
        setProducts(data);
      } catch (err) {
        console.log("[fetchRelatedProducts]", err);
      }
    };

    if (!productIds || productIds.length === 0) return;
    fetchRelatedProducts();
  }, [productIds]);

  if (!isLoggedIn) return null;

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="bg-white w-full p-[20px] shadow-lg border rounded-lg flex justify-between">
        <h3>Orders Page</h3>
        <span className="font-semibold">Need Assistance? Call. <Link prefetch={false} href={'tel:(888) 575-9720'} className="underline text-theme-600 hover:text-theme-700">(888) 575-9720</Link></span>
      </div>

      {mergedOrders &&
        mergedOrders.map((order) => (
          <div
            key={`order-item-${order?.order_number}`}
            className="bg-white w-full p-[20px] shadow-lg border rounded-lg"
          >
            <div className="flex items-center gap-2">
              <OrderStatusBadge status={order?.status}/>
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
                    className="flex gap-5 border-t border-neutral-300 py-1"
                  >
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
                      <div className="flex justify-between">
                        <div>{item?.title}</div>
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
                      <div className="flex">
                        <div className="w-full text-right">
                          <button className="py-2  px-4 bg-white text-theme-600 hover:text-theme-700 rounded border-[3px] border-theme-600 hover:border-theme-700">
                            Add Review
                          </button>
                          <button className="py-2 ml-3 px-4 bg-theme-600 hover:bg-theme-700 text-white rounded border-[3px] border-theme-600 hover:border-theme-700">
                            Buy Again
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="border-t border-neutral-300 w-full flex pt-5 items-center justify-end">
                <div className="text-lg text-neutral-700 flex">
                  <div>
                    Order Total:
                  </div>
                  <div className="text-theme-600 font-bold min-w-[200px] text-right">${formatPrice(order?.total_price)}</div>
                </div>
            </div>
          </div>
        ))}
    </div>
  );
}
