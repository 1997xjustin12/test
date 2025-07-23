"use client";
import Image from "next/image";
export default function RenderBanner({ img }) {
  return (
    <Image
      src={img}
      alt={`Banner`}
      className="w-full h-full object-cover"
      fill
      loading="eager"
      priority={true}
      sizes="100vw"
    />
  );
}
