"use client";

import { useEffect, useCallback, useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { useAutoSave } from "@/hooks/useAutoSave";
import { SectionNav } from "./SectionNav";
import { BuilderSidebar } from "./BuilderSidebar";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { SaveStatusIndicator } from "./SaveStatusIndicator";
import { ShareDialog } from "./ShareDialog";
import type { ResumeWithRelations } from "@/types";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeft, Save, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <header className="flex h-14 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
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
          <ExportButton />
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>
      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        <SectionNav className="w-48 shrink-0 border-r" />
        <BuilderSidebar className="w-[400px] shrink-0 overflow-y-auto border-r p-4" />
        <div className="flex-1 overflow-y-auto bg-muted/30 p-6">
          <ResumePreview />
        </div>
      </div>

      {/* Share dialog */}
      <ShareDialog
        resumeId={resume.id}
        slug={resume.slug}
        isPublic={resume.isPublic}
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
      className="w-64 border-none bg-transparent text-lg font-bold tracking-tight outline-none placeholder:text-muted-foreground/50 focus:ring-0"
      placeholder="Resume title"
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

function ExportButton() {
  const handleExport = useCallback(() => {
    const previewEl = document.getElementById("resume-preview");
    if (!previewEl) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow pop-ups to download your resume");
      return;
    }

    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch {
          // Cross-origin stylesheets can't be read
          return "";
        }
      })
      .join("\n");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume</title>
          <style>
            ${styles}
            @page {
              size: A4;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            #resume-content {
              width: 794px;
              min-height: 1123px;
              margin: 0 auto;
              background: white;
            }
          </style>
        </head>
        <body>
          <div id="resume-content">${previewEl.innerHTML}</div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.onafterprint = function() { window.close(); };
              }, 250);
            };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }, []);

  return (
    <Button
      variant="default"
      size="sm"
      className="gap-1.5"
      onClick={handleExport}
    >
      <Download className="h-3.5 w-3.5" />
      Export PDF
    </Button>
  );
}
