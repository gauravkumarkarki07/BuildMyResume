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
import { Save, Share2, Eye, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function BuilderClient({ resume }: { resume: ResumeWithRelations }) {
  const loadResume = useResumeStore((s) => s.loadResume);
  const [shareOpen, setShareOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    loadResume(resume);
  }, [resume, loadResume]);

  useAutoSave(resume.id);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-3 shadow-sm sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/dashboard">
            <Logo size="sm" iconOnly className="sm:hidden" />
            <Logo size="sm" className="hidden sm:inline-flex" />
          </Link>
          <Separator orientation="vertical" className="!h-6 hidden sm:block" />
          <ResumeTitle />
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <SaveStatusIndicator />
          <ManualSaveButton resumeId={resume.id} />
          <Button
            variant="outline"
            size="sm"
            className="hidden gap-1.5 sm:inline-flex"
            onClick={() => setShareOpen(true)}
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 sm:hidden"
            onClick={() => setShareOpen(true)}
            aria-label="Share"
          >
            <Share2 className="h-3.5 w-3.5" />
          </Button>
          <ExportButton resumeId={resume.id} />
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Mobile panel toggle */}
      <div className="flex shrink-0 border-b bg-muted/30 md:hidden">
        <button
          onClick={() => setMobilePanel("edit")}
          aria-pressed={mobilePanel === "edit"}
          className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
            mobilePanel === "edit"
              ? "border-b-2 border-primary bg-background text-primary"
              : "text-muted-foreground"
          }`}
        >
          <PenLine className="h-4 w-4" />
          Edit
        </button>
        <button
          onClick={() => setMobilePanel("preview")}
          aria-pressed={mobilePanel === "preview"}
          className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
            mobilePanel === "preview"
              ? "border-b-2 border-primary bg-background text-primary"
              : "text-muted-foreground"
          }`}
        >
          <Eye className="h-4 w-4" />
          Preview
        </button>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — Form editor */}
        <div
          className={`flex w-full flex-col border-r md:w-1/2 md:shrink-0 ${
            mobilePanel === "edit" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Form panel header */}
          <div className="shrink-0 px-4 pt-4 sm:px-6 sm:pt-5">
            <h2 className="text-lg font-bold tracking-tight sm:text-xl">
              Build Your Resume
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Fill in your information below and see your resume update in
              real-time.
            </p>

            {/* Template selector */}
            <div className="mt-3 sm:mt-4">
              <TemplateSelector />
            </div>

            {/* Section tabs — has its own border-b */}
            <div className="mt-3 sm:mt-4">
              <SectionNav />
            </div>
          </div>

          {/* Scrollable form content */}
          <div className="flex-1 overflow-y-auto">
            <BuilderSidebar className="p-4 sm:p-6" />
          </div>
        </div>

        {/* Right panel — Live Preview */}
        <div
          className={`flex-1 flex-col bg-muted/30 ${
            mobilePanel === "preview" ? "flex" : "hidden md:flex"
          }`}
        >
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
      className="w-32 rounded border-none bg-transparent text-sm font-semibold tracking-tight placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-64"
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
      <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save"}</span>
    </Button>
  );
}

function ExportButton({ resumeId }: { resumeId: string }) {
  const title = useResumeStore((s) => s.formState.title);
  return <DownloadPdfButton resumeId={resumeId} title={title} />;
}
