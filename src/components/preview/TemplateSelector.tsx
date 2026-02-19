"use client";

import { useResumeStore } from "@/store/resumeStore";
import { TEMPLATES } from "@/lib/constants";
import type { TemplateId } from "@/types";
import { Palette } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TemplateSelector() {
  const template = useResumeStore((s) => s.formState.template);
  const setTemplate = useResumeStore((s) => s.setTemplate);

  return (
    <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
          <Palette className="h-4 w-4 text-primary" />
        </div>
        <span className="text-sm font-semibold">Template</span>
      </div>
      <Select
        value={template}
        onValueChange={(v) => setTemplate(v as TemplateId)}
      >
        <SelectTrigger className="h-9 w-[160px] font-medium">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TEMPLATES.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
