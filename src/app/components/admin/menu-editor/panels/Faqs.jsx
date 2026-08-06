"use client";

import React, { useState } from "react";
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
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { generateId } from "@/app/lib/helpers";
import { useMenuEditor } from "../MenuEditorContext";
import { DragHandle, Field, Section, Toggle, inputClass } from "../ui";

const FaqItem = ({ faq, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [question, setQuestion] = useState(faq?.question || "");
  const [answer, setAnswer] = useState(faq?.answer || "");

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: faq.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      onDelete(faq);
    }
  };

  const handleUpdate = () => {
    onUpdate({ id: faq?.id, question, answer });
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900"
    >
      <div className="flex items-center gap-3 border-b border-zinc-200 bg-zinc-50 p-2.5 dark:border-white/10 dark:bg-white/5">
        <DragHandle {...listeners} onMouseDown={() => setIsEditing(false)} />

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <Field label="Question" htmlFor={`question-${faq?.id}`}>
              <input
                type="text"
                name={`question-${faq?.id}`}
                id={`question-${faq?.id}`}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className={inputClass}
              />
            </Field>
          ) : (
            <span className="block truncate text-sm font-medium text-zinc-900 dark:text-white">
              {faq?.question}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {isEditing ? (
            <button
              type="button"
              onClick={handleUpdate}
              title="Save item"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Save item</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              title="Edit item"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Edit item</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            title="Delete item"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Delete item</span>
          </button>
        </div>
      </div>

      <div className="p-3">
        {isEditing ? (
          <Field label="Answer" htmlFor={`answer-${faq?.id}`}>
            <textarea
              name={`answer-${faq?.id}`}
              id={`answer-${faq?.id}`}
              rows="4"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className={inputClass}
            />
          </Field>
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{faq?.answer}</p>
        )}
      </div>
    </div>
  );
};

export default function Faqs() {
  const { menuItem, handleFAQChange } = useMenuEditor();
  const faqs = menuItem?.faqs || { visible: false, data: [] };
  const items = faqs?.data || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleAdd = () =>
    handleFAQChange({
      ...faqs,
      data: [
        ...items,
        { id: `faq-item-${generateId()}`, question: "Question", answer: "Answer" },
      ],
    });

  const handleVisibilityChange = (e) =>
    handleFAQChange({ ...faqs, visible: e.target.checked });

  const handleDelete = (faq_item) =>
    handleFAQChange({
      ...faqs,
      data: items.filter((faq) => faq.id !== faq_item.id),
    });

  const handleUpdate = (faq_item) =>
    handleFAQChange({
      ...faqs,
      data: items.map((faq) =>
        faq.id === faq_item.id
          ? { ...faq, question: faq_item.question, answer: faq_item.answer }
          : faq,
      ),
    });

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((faq) => faq.id === active.id);
    const newIndex = items.findIndex((faq) => faq.id === over.id);
    handleFAQChange({ ...faqs, data: arrayMove(items, oldIndex, newIndex) });
  };

  return (
    <Section
      title="Frequently asked questions"
      description="Drag to reorder. FAQs render on the page only while visible."
    >
      <Toggle
        label="Visible"
        disabled={items.length === 0}
        checked={items.length === 0 ? false : !!faqs?.visible}
        onChange={handleVisibilityChange}
        hint={items.length === 0 ? "Add at least one FAQ to enable." : undefined}
      />

      <div className="flex flex-col gap-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((faq) => (
              <FaqItem
                key={faq?.id}
                faq={faq}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>

        {items.length === 0 && (
          <p className="rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
            No FAQs yet.
          </p>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add FAQ item
        </button>
      </div>
    </Section>
  );
}
