"use client";

import { useResumeStore } from "@/store/resumeStore";
import { TemplateSelector } from "./TemplateSelector";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import type { ResumeFormState } from "@/store/resumeStore";

const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
} as const;

export function ResumePreview() {
  const formState = useResumeStore((s) => s.formState);
  const Template = TEMPLATE_COMPONENTS[formState.template] ?? ModernTemplate;

  return (
    <div className="flex flex-col items-center gap-4">
      <TemplateSelector />
      <div
        className="origin-top bg-white shadow-lg"
        style={{ width: "794px", minHeight: "1123px" }}
        id="resume-preview"
      >
        <Template data={formState} />
      </div>
    </div>
  );
}

// Shared type for template components
export type TemplateProps = {
  data: ResumeFormState;
};
