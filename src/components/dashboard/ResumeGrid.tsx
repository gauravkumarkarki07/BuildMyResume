"use client";

import { ResumeCard } from "./ResumeCard";
import type { Resume, PersonalInfo } from "@/types";

type ResumeWithPersonalInfo = Resume & { personalInfo: PersonalInfo | null };

export function ResumeGrid({ resumes }: { resumes: ResumeWithPersonalInfo[] }) {
  if (resumes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No resumes yet
        </p>
        <p className="text-sm text-muted-foreground">
          Create your first resume to get started
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
