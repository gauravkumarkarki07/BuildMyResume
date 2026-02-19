"use client";

import { useResumeStore } from "@/store/resumeStore";
import { TEMPLATES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { TemplateId } from "@/types";

export function TemplateSelector() {
  const template = useResumeStore((s) => s.formState.template);
  const setTemplate = useResumeStore((s) => s.setTemplate);

  return (
    <div className="flex flex-wrap gap-1.5">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => setTemplate(t.id as TemplateId)}
          title={t.description}
          className={cn(
            "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
            template === t.id
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground hover:bg-muted"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
