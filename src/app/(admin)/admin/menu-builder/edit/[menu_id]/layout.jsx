import React from "react";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { MenuEditorProvider } from "@/app/components/admin/menu-editor/MenuEditorContext";
import MenuEditorShell from "@/app/components/admin/menu-editor/MenuEditorShell";

const readImages = (dir, pattern) => {
  const target = path.join(process.cwd(), dir);
  return fs
    .readdirSync(target)
    .filter((file) => pattern.test(file))
    .map((file) => `/${dir.replace(/^public\//, "")}/${file}`);
};

/**
 * The editor's draft state lives in this layout, not in the tab pages.
 * App Router keeps layouts mounted while child segments change, so moving
 * between tab URLs preserves unsaved edits.
 */
export default async function EditMenuItemLayout({ params, children }) {
  const { menu_id } = await params;

  if (!menu_id) {
    return notFound();
  }

  const default_banner = "/images/banner/solana-home-hero.webp";
  const banners = readImages(
    "public/images/banner",
    /\.(jpg|jpeg|png|gif|webp|svg)$/i,
  );
  const images = [
    default_banner,
    ...banners.filter((image) => image !== default_banner),
  ];

  const featureImages = readImages(
    "public/images/feature",
    /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i,
  );

  return (
    <MenuEditorProvider
      menu_id={menu_id}
      images={images}
      feature_images={featureImages}
    >
      <MenuEditorShell>{children}</MenuEditorShell>
    </MenuEditorProvider>
  );
}
