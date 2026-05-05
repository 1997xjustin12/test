"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BASE_URL } from "@/app/lib/helpers";
import { STORE_CONTACT } from "@/app/lib/store_constants";

const links = [
  { name: "Learning Center", url: `${BASE_URL}/blogs` },
  { name: "Professional Program", url: `${BASE_URL}/professional-program` },
  { name: "Support", url: `${BASE_URL}/contact` },
];

const Topbar = () => {
  const [galleryOnFullscreen, setGalleryOnFullscreen] = useState(false);

  useEffect(() => {
    const handleGallery = (e) => setGalleryOnFullscreen(e.detail.isFullscreen);
    window.addEventListener("galleryStatus", handleGallery);
    return () => window.removeEventListener("galleryStatus", handleGallery);
  }, []);

  return (
    <div className={`bg-charcoal hidden md:block sticky top-[64px] lg:top-[105px] ${galleryOnFullscreen ? "" : "z-10"}`}>
      <div className="max-w-[1240] py-2 px-4 sm:px-6 mx-auto flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs text-gray-400">
          🔥 Free Shipping on Selected Orders —{" "}
          <Link
            href={`tel:${STORE_CONTACT}`}
            className="text-orange-400 font-semibold hover:text-orange-300"
          >
            Call now ↗
          </Link>
        </span>
        <div className="hidden sm:flex gap-5">
          {links.map((l) => (
            <Link
              key={`links-redirect-${l?.url}`}
              href={l?.url || "#"}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              {l?.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
