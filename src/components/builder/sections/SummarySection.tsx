"use client";

import { useResumeStore } from "@/store/resumeStore";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function SummarySection() {
  const summary = useResumeStore((s) => s.formState.summary);
  const updateSummary = useResumeStore((s) => s.updateSummary);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Write a compelling summary of your professional background and key achievements.
      </p>
      <div className="space-y-1">
        <Label className="text-xs">Professional Summary</Label>
        <Textarea
          value={summary}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="A brief summary of your professional background..."
          rows={6}
        />
      </div>
    </div>
  );
}
