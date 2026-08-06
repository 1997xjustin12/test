"use client";

import React from "react";
import { useMenuEditor } from "../MenuEditorContext";
import { Field, Section, inputClass } from "../ui";

export default function PageMeta() {
  const { menuItem, handleMetaChange } = useMenuEditor();

  return (
    <Section
      title="Search engine listing"
      description="How this page is titled and described in search results."
    >
      <div className="flex max-w-2xl flex-col gap-5">
        <Field
          label="Meta Title"
          htmlFor="meta-title"
          hint={`${(menuItem?.meta_title || "").length} characters — around 60 shows in full.`}
        >
          <textarea
            name="meta-title"
            id="meta-title"
            rows="2"
            value={menuItem?.meta_title || ""}
            onChange={handleMetaChange}
            className={inputClass}
          />
        </Field>

        <Field
          label="Meta Description"
          htmlFor="meta-description"
          hint={`${(menuItem?.meta_description || "").length} characters — around 155 shows in full.`}
        >
          <textarea
            name="meta-description"
            id="meta-description"
            rows="5"
            value={menuItem?.meta_description || ""}
            onChange={handleMetaChange}
            className={inputClass}
          />
        </Field>
      </div>
    </Section>
  );
}
