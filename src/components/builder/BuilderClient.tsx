"use client";

import { useEffect } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { useAutoSave } from "@/hooks/useAutoSave";
import { SectionNav } from "./SectionNav";
import { BuilderSidebar } from "./BuilderSidebar";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { SaveStatusIndicator } from "./SaveStatusIndicator";
import type { ResumeWithRelations } from "@/types";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BuilderClient({ resume }: { resume: ResumeWithRelations }) {
  const loadResume = useResumeStore((s) => s.loadResume);

  useEffect(() => {
    loadResume(resume);
  }, [resume, loadResume]);

  useAutoSave(resume.id);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top bar */}
      <header className="flex h-12 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <ResumeTitle />
        </div>
        <div className="flex items-center gap-3">
          <SaveStatusIndicator />
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
      className="border-none bg-transparent text-sm font-semibold outline-none focus:ring-0"
      placeholder="Resume title"
    />
  );
}
