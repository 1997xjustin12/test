"use client";
import Image from "next/image";
import { useBreakpointValue } from "@/app/hooks/useBreakPointValue";
export default function RenderBanner({ img }) {
  const breakPoints = [
    { minWidth: 0, value: 50 },
    { minWidth: 640, value: 980 },
  ];
  const useWidth = useBreakpointValue(breakPoints);
  return (
    <Image
      src={img}
      alt={`Banner`}
      className="w-full h-full object-cover"
      width={useWidth ?? 1200}
      height={0}
      loading="eager"
      priority={true}
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
    />
  );
}
