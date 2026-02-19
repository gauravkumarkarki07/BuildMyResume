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
      <span
        className="flex items-center gap-1.5 text-sm text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        Saving…
      </span>
    );
  }

  if (isDirty) {
    return (
      <span
        className="text-sm text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        Unsaved changes
      </span>
    );
  }

  if (lastSaved) {
    return (
      <span
        className="flex items-center gap-1.5 text-sm text-muted-foreground"
        role="status"
        aria-live="polite"
      >
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
        Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
      </span>
    );
  }

  return null;
}
