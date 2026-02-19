"use client";

import { useResumeStore } from "@/store/resumeStore";
import { formatDistanceToNow } from "date-fns";
import { Check, Loader2 } from "lucide-react";

export function SaveStatusIndicator() {
  const isSaving = useResumeStore((s) => s.isSaving);
  const lastSaved = useResumeStore((s) => s.lastSaved);
  const isDirty = useResumeStore((s) => s.isDirty);

  if (isSaving) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        Saving...
      </span>
    );
  }

  if (isDirty) {
    return (
      <span className="text-xs text-muted-foreground">Unsaved changes</span>
    );
  }

  if (lastSaved) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Check className="h-3 w-3" />
        Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
      </span>
    );
  }

  return null;
}
