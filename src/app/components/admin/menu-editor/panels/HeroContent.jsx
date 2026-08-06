"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import HeroNotice from "@/app/components/atom/HeroNotice";
import { useMenuEditor } from "../MenuEditorContext";
import { Divider, Field, Section, Toggle, inputClass } from "../ui";

const DEFAULT_BANNER = "/images/banner/solana-home-hero.webp";

export default function HeroContent() {
  const { menuItem, images, handleHeroChange } = useMenuEditor();
  const hero = menuItem?.banner;

  const [bannerImage, setBannerImage] = useState(DEFAULT_BANNER);

  useEffect(() => {
    setBannerImage(hero?.img?.src || DEFAULT_BANNER);
  }, [hero]);

  return (
    <div className="flex flex-col gap-8">
      <Section title="Hero notice" description="Optional strip above the hero.">
        <Toggle
          label="Enable hero notice"
          name="notice-visible"
          id="notice-visible"
          checked={hero?.notice_visible || false}
          onChange={handleHeroChange}
        />
        <Field label="Hero Notice HTML" htmlFor="notice-html">
          <textarea
            name="notice-html"
            id="notice-html"
            rows="8"
            value={hero?.notice_html || ""}
            onChange={handleHeroChange}
            className={`${inputClass} font-mono text-xs`}
          />
        </Field>
      </Section>

      <Divider />

      <Section title="Hero copy">
        <div className="flex max-w-2xl flex-col gap-5">
          <Field label="Main Text" htmlFor="main-text">
            <textarea
              name="main-text"
              id="main-text"
              rows="2"
              value={hero?.title || ""}
              onChange={handleHeroChange}
              className={inputClass}
            />
          </Field>
          <Field label="Sub Text" htmlFor="sub-text">
            <textarea
              name="sub-text"
              id="sub-text"
              rows="4"
              value={hero?.tag_line || ""}
              onChange={handleHeroChange}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Divider />

      <Section
        title="Preview"
        description="A conceptual representation — it may not fully reflect the final implementation."
      >
        <div className="aspect-w-3 aspect-h-1 relative w-full overflow-hidden rounded-xl bg-zinc-300 dark:bg-zinc-800">
          <div className="absolute left-0 top-0 z-10 w-full">
            <HeroNotice data={{ banner: hero }} />
          </div>
          <div className="absolute inset-0 z-20 m-auto flex items-center justify-center">
            <div className="flex w-full flex-col items-center justify-center">
              <div className="w-[90%]">
                <h1 className="text-balance text-center text-md italic tracking-wide text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] md:text-4xl">
                  {hero?.title}
                </h1>
              </div>
              <div className="flex w-full items-center justify-center">
                <h2 className="mt-1 min-w-[75%] max-w-[75%] text-balance text-center text-xs font-normal tracking-wide text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)] md:text-base">
                  {hero?.tag_line}
                </h2>
              </div>
            </div>
          </div>
          {bannerImage && (
            <Image
              src={bannerImage}
              alt="Selected banner image"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
            />
          )}
        </div>
      </Section>

      <Section
        title="Hero image"
        description="Items without a banner image fall back to the first image in this list. Need another image? Send it to the developer and it will appear here once uploaded."
      >
        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-3">
          {images?.map((image, index) => {
            const selected = bannerImage === image;
            return (
              <button
                type="button"
                key={`banner-image-${index}`}
                onClick={() =>
                  handleHeroChange({
                    target: { name: "banner-image", value: image },
                  })
                }
                aria-pressed={selected}
                className={`relative h-[110px] w-[280px] shrink-0 overflow-hidden rounded-xl border-2 bg-zinc-200 transition-colors dark:bg-zinc-800 ${
                  selected
                    ? "border-indigo-500 ring-2 ring-indigo-500/30"
                    : "border-transparent hover:border-zinc-300 dark:hover:border-white/20"
                }`}
              >
                <Image
                  src={image}
                  alt={`Banner option ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
