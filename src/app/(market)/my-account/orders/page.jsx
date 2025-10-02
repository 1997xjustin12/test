"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/auth";
export default function OrdersPage() {
  const { loading, isLoggedIn, user, getUserOrders } = useAuth();
  useEffect(() => {
    const getOrders = async () => {
      const response = await getUserOrders();
      if (!response.ok) {
        console.log("[FAILED FETCH USER ORDERS]");
      } else {
        console.log("[SUCCESS FETCH USER ORDERS]", await response.json());
      }
    };

    if (!loading && user) {
      getOrders();
    }
  }, [loading, user]);

  if (!isLoggedIn) return null;

  return (
    <div className="bg-white w-full p-[20px] shadow-lg border rounded-lg">
      <h3>Orders Page</h3>
    </div>
  );
}
