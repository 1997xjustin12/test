"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { Plus, X } from "lucide-react";
import { generateId } from "@/app/lib/helpers";
import { useMenuEditor } from "../MenuEditorContext";
import { DragHandle, Section, inputClass } from "../ui";

const ProductCollectionItem = ({ collection, onChange }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: collection?.mb_uid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3 transition-shadow hover:shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <DragHandle {...listeners} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
              {collection?.name}
            </p>
            <input
              type="text"
              name={`label-${collection?.slug}`}
              id={`label-${collection?.slug}`}
              placeholder={`Label for ${collection?.name}`}
              className={`${inputClass} mt-1 py-1.5`}
              value={collection?.mb_label || ""}
              onChange={(e) =>
                onChange({
                  target: {
                    name: "update-collection-label",
                    value: { ...collection, mb_label: e.target.value },
                  },
                })
              }
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            onChange({
              target: { name: "remove-collection-item", value: collection },
            })
          }
          title={`Remove ${collection?.name}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Remove {collection?.name}</span>
        </button>
      </div>
    </div>
  );
};

export default function ProductCollection() {
  const { menuItem, handleProductCollectionChange: onChange } = useMenuEditor();
  const [collectionList, setCollectionList] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Sort a copy - `menuItem.collections` comes straight from state.
  const collections = useMemo(
    () => [...(menuItem?.collections || [])].sort((a, b) => a.order - b.order),
    [menuItem],
  );

  useEffect(() => {
    let cancelled = false;

    const fetchCollectionList = async () => {
      try {
        const response = await fetch("/api/collections/collection-list");
        if (!response?.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (!cancelled) setCollectionList(data);
      } catch (error) {
        console.error("Failed to fetch collection list:", error);
      }
    };

    fetchCollectionList();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = collections.findIndex((c) => c.mb_uid === active.id);
    const newIndex = collections.findIndex((c) => c.mb_uid === over.id);
    onChange({
      target: {
        name: "reorder-collections",
        value: arrayMove(collections, oldIndex, newIndex),
      },
    });
  };

  return (
    <Section
      title="Page collections"
      description="Add collection displays to this page, then label and reorder them."
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Available */}
        <div className="flex w-full shrink-0 flex-col overflow-hidden rounded-xl border border-zinc-200 lg:w-[300px] dark:border-white/10">
          <div className="border-b border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
            Collection List
          </div>
          <div className="flex max-h-[520px] flex-col gap-1.5 overflow-y-auto p-2">
            {collectionList.map((collection) => (
              <div
                key={`collection-option-${collection?.slug}`}
                className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white p-2.5 dark:border-white/10 dark:bg-zinc-900"
              >
                <span className="min-w-0 truncate text-sm text-zinc-700 dark:text-zinc-300">
                  {collection?.name}
                </span>
                <button
                  type="button"
                  title={`Add ${collection?.name}`}
                  onClick={() =>
                    onChange({
                      target: {
                        name: "add-collection-item",
                        value: { ...collection, mb_uid: generateId() },
                      },
                    })
                  }
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:text-zinc-400 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Add {collection?.name}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Added */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-200 dark:border-white/10">
          <div className="border-b border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
            Added Page Collections
          </div>
          <div className="flex flex-col gap-2 p-2">
            {collections.length === 0 ? (
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
                  items={collections.map((i) => i?.mb_uid)}
                  strategy={verticalListSortingStrategy}
                >
                  {collections.map((collection) => (
                    <ProductCollectionItem
                      key={`page-collection-${collection?.mb_uid}`}
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
