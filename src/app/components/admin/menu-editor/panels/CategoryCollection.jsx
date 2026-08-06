"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Search, X } from "lucide-react";
import { generateId } from "@/app/lib/helpers";
import { useMenuEditor } from "../MenuEditorContext";
import { DragHandle, checkboxClass, inputClass, Section } from "../ui";

const imageSlug = (img_string) =>
  img_string.replace("/images/feature/", "").replace(".", "-");

const CategoryCollectionItem = ({ collection, onChange }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: collection?.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-start gap-2 rounded-xl border border-zinc-200 bg-white p-3 dark:border-white/10 dark:bg-zinc-900">
        <div className="pt-1">
          <DragHandle {...listeners} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <input
              type="text"
              name={`label-${collection?.id}`}
              id={`label-${collection?.id}`}
              placeholder="Enter label"
              className={`${inputClass} py-1.5`}
              value={collection?.label || ""}
              onChange={(e) =>
                onChange({
                  target: {
                    name: "collection-label-change",
                    value: e.target.value,
                    id: collection?.id,
                  },
                })
              }
            />
            <button
              type="button"
              onClick={() =>
                onChange({
                  target: { name: "remove-collection", value: collection?.id },
                })
              }
              title="Remove collection"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Remove collection</span>
            </button>
          </div>

          <div className="mt-3 overflow-x-auto pb-2">
            <div className="flex w-max gap-4">
              {Array.isArray(collection?.links) &&
                collection.links.map((link) => (
                  <div
                    key={`cat-collection-item-link-${link?.menu_id}`}
                    className="w-[160px] shrink-0 text-center"
                  >
                    <div className="relative aspect-1 w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      {link?.image && (
                        <Image
                          src={link.image}
                          alt={imageSlug(link.image)}
                          fill
                          className="object-contain"
                          sizes="160px"
                        />
                      )}
                    </div>
                    <div className="mt-1.5 truncate text-xs text-zinc-600 dark:text-zinc-400">
                      {link?.name}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CategoryCollection() {
  const {
    menuItem,
    flatCategories,
    handleCategoryCollectionChange: onChange,
  } = useMenuEditor();

  const [linkOptions, setLinkOptions] = useState([]);
  const [pageQuery, setPageQuery] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    setLinkOptions(
      (flatCategories || [])
        .filter((i) => !["Home", "Search"].includes(i?.name))
        .map((i) => ({ ...i, is_selected: false })),
    );
  }, [flatCategories]);

  // Sort a copy so we don't mutate the draft in render.
  const catCollections = useMemo(
    () =>
      [...(menuItem?.cat_collections || [])].sort((a, b) => a.order - b.order),
    [menuItem],
  );

  const filteredOptions = useMemo(
    () =>
      linkOptions.filter((i) =>
        i?.name?.toLowerCase().includes(pageQuery.toLowerCase()),
      ),
    [linkOptions, pageQuery],
  );

  const selectedCount = linkOptions.filter((i) => i?.is_selected).length;

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setLinkOptions((prev) =>
      prev.map((i) => ({
        ...i,
        is_selected: i?.menu_id === name ? checked : i?.is_selected,
      })),
    );
  };

  const handleAddCategoryCollection = () => {
    const selectedOptions = linkOptions.filter((i) => i?.is_selected);
    if (selectedOptions.length === 0) return;

    onChange({
      target: {
        name: "add-category-collection",
        value: {
          id: generateId(),
          label: "",
          links: selectedOptions.map((i) => ({
            menu_id: i?.menu_id,
            url: i?.url,
            name: i?.name,
            image: i?.feature_image,
          })),
        },
      },
    });

    // Clear the picker so the next group starts from scratch.
    setLinkOptions((prev) => prev.map((i) => ({ ...i, is_selected: false })));
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = catCollections.findIndex((c) => c.id === active.id);
    const newIndex = catCollections.findIndex((c) => c.id === over.id);
    onChange({
      target: {
        name: "reorder-collections",
        value: arrayMove(catCollections, oldIndex, newIndex),
      },
    });
  };

  return (
    <Section
      title="Category collections"
      description="Group pages into category displays, then label and reorder them."
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Picker */}
        <div className="flex w-full shrink-0 flex-col overflow-hidden rounded-xl border border-zinc-200 lg:w-[300px] dark:border-white/10">
          <div className="flex items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-white/10 dark:bg-white/5">
            <span className="text-sm font-medium text-zinc-900 dark:text-white">
              Page List
            </span>
            <button
              type="button"
              title="Add category collection"
              disabled={selectedCount === 0}
              onClick={handleAddCategoryCollection}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add {selectedCount > 0 && `(${selectedCount})`}
            </button>
          </div>

          <div className="border-b border-zinc-200 p-2 dark:border-white/10">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                aria-hidden="true"
              />
              <input
                type="search"
                name="page-search"
                id="page-search"
                placeholder="Search pages…"
                className={`${inputClass} py-2 pl-9`}
                value={pageQuery}
                onChange={(e) => setPageQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex max-h-[480px] flex-col gap-1 overflow-y-auto p-2">
            {filteredOptions.map((category) => (
              <label
                key={`category-option-${category?.menu_id}`}
                htmlFor={category?.menu_id}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-zinc-200 bg-white p-2.5 transition-colors hover:border-indigo-300 dark:border-white/10 dark:bg-zinc-900 dark:hover:border-indigo-500/40"
              >
                <input
                  type="checkbox"
                  name={`${category?.menu_id}`}
                  id={`${category?.menu_id}`}
                  value={`${category?.menu_id}`}
                  checked={!!category?.is_selected}
                  onChange={handleCheckboxChange}
                  className={checkboxClass}
                />
                <span className="min-w-0 truncate text-sm text-zinc-700 dark:text-zinc-300">
                  {category?.name}
                </span>
              </label>
            ))}
            {filteredOptions.length === 0 && (
              <p className="p-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No pages match “{pageQuery}”.
              </p>
            )}
          </div>
        </div>

        {/* Added */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200 dark:border-white/10">
          <div className="border-b border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
            Added Category Collections
          </div>
          <div className="flex flex-col gap-2 p-2">
            {catCollections.length === 0 ? (
              <p className="p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                Nothing added yet.
              </p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={catCollections.map((i) => i?.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {catCollections.map((collection) => (
                    <CategoryCollectionItem
                      key={`cat-collection-item-component-${collection?.id}`}
                      collection={collection}
                      onChange={onChange}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
