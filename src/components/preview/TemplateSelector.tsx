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
    <div className="flex items-center gap-2">
      <Palette className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium text-muted-foreground">Template</span>
      <Select value={template} onValueChange={(v) => setTemplate(v as TemplateId)}>
        <SelectTrigger className="h-8 w-[180px]">
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
