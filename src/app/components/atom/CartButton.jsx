"use client";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_BASE_URL;
import Link from "next/link";
import { CartIcon } from "@/app/components/icons/lib";
import { useCart } from '@/app/context/cart';

export default function CartButton({className}) {
  const { cartItemsCount } = useCart();
  return (
    <Link
      href={`${BASE_URL}/cart`}
      prefetch={false}
      className={`relative ${className}`}>
      {cartItemsCount > 0 && (
        <div className="absolute bg-theme-500 w-[20px] h-[20px] overflow-hidden rounded-full text-pallete-dark bottom-[60%] left-[60%] flex justify-center items-center">
          <div className="text-[10px] text-white">{cartItemsCount}</div>
        </div>
      )}
      <CartIcon width="24" height="24" />
    </Link>
  );
}
