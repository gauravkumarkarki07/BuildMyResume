"use client";

import { useEffect, useRef, useCallback } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { useDebounce } from "./useDebounce";
import { AUTOSAVE_DELAY_MS } from "@/lib/constants";

export function useAutoSave(resumeId: string) {
  const formState = useResumeStore((s) => s.formState);
  const isDirty = useResumeStore((s) => s.isDirty);
  const setIsSaving = useResumeStore((s) => s.setIsSaving);
  const setLastSaved = useResumeStore((s) => s.setLastSaved);
  const markClean = useResumeStore((s) => s.markClean);

  const debouncedFormState = useDebounce(formState, AUTOSAVE_DELAY_MS);
  const hasMounted = useRef(false);

  const save = useCallback(async () => {
    if (!isDirty) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(debouncedFormState),
      });
      if (res.ok) {
        markClean();
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error("Autosave failed:", err);
    } finally {
      setIsSaving(false);
    }
  }, [debouncedFormState, isDirty, resumeId, setIsSaving, setLastSaved, markClean]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    save();
  }, [debouncedFormState]); // eslint-disable-line react-hooks/exhaustive-deps
}
