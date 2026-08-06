"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { flattenNavTree } from "@/app/lib/helpers";
import { useMenuEditor } from "../MenuEditorContext";
import { Pill, Section } from "../ui";

const MAX_FEAT_NAV = 5;

export default function FeatNav() {
  const { menuItem, handleFeatNavChange } = useMenuEditor();

  const linkOptions = useMemo(
    () => (menuItem?.children ? flattenNavTree(menuItem.children) : []),
    [menuItem],
  );

  const selected = useMemo(
    () => menuItem?.feat_nav ?? [],
    [menuItem],
  );

  const selectedIds = useMemo(
    () => selected.map((i) => i?.menu_id),
    [selected],
  );

  const handleOptionClick = (nav_item) => {
    if (selectedIds.includes(nav_item?.menu_id)) {
      handleFeatNavChange({
        target: {
          name: "feat-nav",
          value: selected.filter((i) => i?.menu_id !== nav_item?.menu_id),
        },
      });
      return;
    }

    if (selected.length < MAX_FEAT_NAV) {
      handleFeatNavChange({
        target: { name: "feat-nav", value: [...selected, nav_item] },
      });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Section
        title="Featured nav links"
        description={`Select up to ${MAX_FEAT_NAV} links — ${selected.length}/${MAX_FEAT_NAV} selected.`}
      >
        <div className="flex flex-wrap gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/5">
          {linkOptions.length === 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              This menu item has no child links to feature.
            </p>
          )}
          {linkOptions.map((link, index) => {
            const active =
              link?.menu_id && selectedIds.includes(link?.menu_id);
            return (
              <Pill
                key={`feat-nav-option-${link?.slug}-${index}`}
                active={active}
                disabled={!active && selected.length >= MAX_FEAT_NAV}
                onClick={() => handleOptionClick(link)}
              >
                {link?.name}
              </Pill>
            );
          })}
        </div>
      </Section>

      <Section title="Preview">
        {selected.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
            Nothing selected yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-zinc-200 bg-white p-5 sm:grid-cols-3 lg:grid-cols-5 dark:border-white/10 dark:bg-zinc-900">
            {selected.map((nav_item, index) => (
              <div
                key={`feat-nav-rep-${nav_item?.slug}-${index}`}
                className="flex flex-col gap-2"
              >
                <div className="relative aspect-1 w-full overflow-hidden rounded-lg bg-zinc-50 dark:bg-zinc-800">
                  {nav_item?.feature_image && (
                    <Image
                      src={nav_item.feature_image}
                      alt={nav_item?.name || `Featured nav ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 50vw, 200px"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => handleOptionClick(nav_item)}
                    title={`Remove ${nav_item?.name}`}
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900/70 text-white transition-colors hover:bg-zinc-900"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Remove {nav_item?.name}</span>
                  </button>
                </div>
                <div className="text-center text-sm font-medium text-zinc-900 dark:text-white">
                  {nav_item?.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
