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

// Promo strip (spec §8.4) — charcoal band, one loud offer + the phone in barn.
const Topbar = () => {
  const [galleryOnFullscreen, setGalleryOnFullscreen] = useState(false);

  useEffect(() => {
    const handleGallery = (e) => setGalleryOnFullscreen(e.detail.isFullscreen);
    window.addEventListener("galleryStatus", handleGallery);
    return () => window.removeEventListener("galleryStatus", handleGallery);
  }, []);

  return (
    <div className={`bg-oko-char hidden md:block sticky top-[64px] lg:top-[105px] ${galleryOnFullscreen ? "" : "z-10"}`}>
      <div className="max-w-[1260px] py-2.5 px-5 sm:px-8 mx-auto flex items-center justify-between gap-3 flex-wrap">
        <span className="font-inter text-[12.5px] text-oko-ondark-muted">
          Free shipping on selected orders —{" "}
          <Link
            href={`tel:${STORE_CONTACT}`}
            className="text-oko-barn-light font-semibold hover:text-white transition-colors"
          >
            Call {STORE_CONTACT} →
          </Link>
        </span>
        <div className="hidden sm:flex gap-6">
          {links.map((l) => (
            <Link
              key={`links-redirect-${l?.url}`}
              href={l?.url || "#"}
              className="font-inter text-[12.5px] text-oko-ondark-faint hover:text-oko-cream transition-colors"
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
