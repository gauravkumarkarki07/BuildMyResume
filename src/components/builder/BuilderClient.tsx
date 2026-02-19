"use client";

import { useEffect, useCallback, useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { useAutoSave } from "@/hooks/useAutoSave";
import { SectionNav } from "./SectionNav";
import { BuilderSidebar } from "./BuilderSidebar";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { TemplateSelector } from "@/components/preview/TemplateSelector";
import { SaveStatusIndicator } from "./SaveStatusIndicator";
import { ShareDialog } from "./ShareDialog";
import { DownloadPdfButton } from "@/components/shared/DownloadPdfButton";
import type { ResumeWithRelations } from "@/types";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Save, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function BuilderClient({ resume }: { resume: ResumeWithRelations }) {
  const loadResume = useResumeStore((s) => s.loadResume);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    loadResume(resume);
  }, [resume, loadResume]);

  useAutoSave(resume.id);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Logo size="sm" />
          </Link>
          <Separator orientation="vertical" className="!h-6" />
          <ResumeTitle />
        </div>
        <div className="flex items-center gap-2">
          <SaveStatusIndicator />
          <ManualSaveButton resumeId={resume.id} />
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setShareOpen(true)}
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
          <ExportButton resumeId={resume.id} />
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main area — two panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — Form editor */}
        <div className="flex w-1/2 shrink-0 flex-col border-r">
          {/* Form panel header */}
          <div className="shrink-0 px-6 pt-5">
            <h2 className="text-xl font-bold tracking-tight">Build Your Resume</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Fill in your information below and see your resume update in real-time.
            </p>

            {/* Template selector */}
            <div className="mt-4">
              <TemplateSelector />
            </div>

            {/* Section tabs — has its own border-b */}
            <div className="mt-4">
              <SectionNav />
            </div>
          </div>

          {/* Scrollable form content */}
          <div className="flex-1 overflow-y-auto">
            <BuilderSidebar className="p-6" />
          </div>
        </div>

        {/* Right panel — Live Preview */}
        <div className="flex flex-1 flex-col bg-muted/30">
          <ResumePreview />
        </div>
      </div>

      {/* Share dialog */}
      <ShareDialog
        resumeId={resume.id}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
    </div>
  );
}

function ResumeTitle() {
  const title = useResumeStore((s) => s.formState.title);
  const updateTitle = useResumeStore((s) => s.updateTitle);

  return (
    <input
      value={title}
      onChange={(e) => updateTitle(e.target.value)}
      className="w-64 rounded border-none bg-transparent text-sm font-semibold tracking-tight placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      placeholder="Resume title"
      aria-label="Resume title"
    />
  );
}

function ManualSaveButton({ resumeId }: { resumeId: string }) {
  const formState = useResumeStore((s) => s.formState);
  const isDirty = useResumeStore((s) => s.isDirty);
  const isSaving = useResumeStore((s) => s.isSaving);
  const setIsSaving = useResumeStore((s) => s.setIsSaving);
  const setLastSaved = useResumeStore((s) => s.setLastSaved);
  const markClean = useResumeStore((s) => s.markClean);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      if (res.ok) {
        markClean();
        setLastSaved(new Date());
        toast.success("Resume saved");
      } else {
        toast.error("Failed to save resume");
      }
    } catch {
      toast.error("Failed to save resume");
    } finally {
      setIsSaving(false);
    }
  }, [formState, resumeId, isSaving, setIsSaving, setLastSaved, markClean]);

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={handleSave}
      disabled={isSaving || !isDirty}
    >
      <Save className="h-3.5 w-3.5" />
      {isSaving ? "Saving..." : "Save"}
    </Button>
  );
}

function ExportButton({ resumeId }: { resumeId: string }) {
  const title = useResumeStore((s) => s.formState.title);
  return <DownloadPdfButton resumeId={resumeId} title={title} />;
}
