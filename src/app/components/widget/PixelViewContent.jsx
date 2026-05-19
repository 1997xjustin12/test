"use client";
import { useEffect } from "react";
import { pixelViewContent } from "@/app/lib/pixel";

export default function PixelViewContent({ id, name, price }) {
  useEffect(() => {
    if (!id) return;
    pixelViewContent({ id, name, price });
  }, [id]);
  return null;
}
