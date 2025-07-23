'use client';
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-[calc(100vh-210px)] flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-stone-500">404</h1>
        <h2 className="font-extrabold text-stone-600 text-2xl uppercase">
          Not Found
        </h2>
        <p className="text-stone-500">Could not find requested resource</p>
        <Link href="/" className="text-theme-500">
          Return Home
        </Link>
      </div>
    </div>
  );
}
