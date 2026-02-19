"use client";

import { ResumeCard } from "./ResumeCard";
import { FileText } from "lucide-react";
import type { Resume, PersonalInfo } from "@/types";

type ResumeWithPersonalInfo = Resume & { personalInfo: PersonalInfo | null };

export function ResumeGrid({ resumes }: { resumes: ResumeWithPersonalInfo[] }) {
  if (resumes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/30 p-16 text-center">
        <div className="mb-4 rounded-full bg-brand-100 p-4">
          <FileText className="h-8 w-8 text-brand-500" />
        </div>
        <p className="text-lg font-semibold">No resumes yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create your first resume to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {resumes.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}
    </div>
  );
}
