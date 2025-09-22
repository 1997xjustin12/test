"use client";
import { useAuth } from "@/app/context/auth";
export default function OrdersPage() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return null;

  return (
    <div className="bg-white w-full p-[20px] shadow-lg border rounded-lg">
      <h3>Orders Page</h3>
    </div>
  );
}
