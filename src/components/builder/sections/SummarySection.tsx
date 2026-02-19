"use client";

import { useResumeStore } from "@/store/resumeStore";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function SummarySection() {
  const summary = useResumeStore((s) => s.formState.summary);
  const updateSummary = useResumeStore((s) => s.updateSummary);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Summary</h2>
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
