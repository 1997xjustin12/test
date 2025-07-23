import React from "react";
import EditMenuItem from "@/app/components/admin/EditMenuItem";
import CardWrap from "@/app/components/admin/CardWrap";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";

export default async function EditMenuItemPage({ params }) {
  const { menu_id } = await params;
  // images from pulic START
  const imagesDir = path.join(process.cwd(), "public/images/banner");
  const files = fs.readdirSync(imagesDir);
  const images_tmp = files
    .filter((file) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file))
    .map((file) => `/images/banner/${file}`);
  const default_banner = "/images/banner/solana-home-hero.webp";
  const images = [
    default_banner,
    ...images_tmp.filter((image) => default_banner !== image),
  ];

  // feature images
  const featureDire = path.join(process.cwd(), "public/images/feature");
  const featureFiles = fs.readdirSync(featureDire);
  const featureImages = featureFiles
    .filter((file) => /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(file))
    .map((file) => `/images/feature/${file}`);

  // images from pulic END

  if (!menu_id) {
    return notFound();
  }

  return (
    <div className="px-2 flex flex-col gap-[20px] container mx-auto pb-10">
      <CardWrap>
        <div className="p-3">
          <EditMenuItem
            menu_id={menu_id}
            images={images}
            feature_images={featureImages}
          />
        </div>
      </CardWrap>
    </div>
  );
}
