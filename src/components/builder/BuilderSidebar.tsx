"use client";

import { useResumeStore } from "@/store/resumeStore";
import { cn } from "@/lib/utils";
import { PersonalInfoSection } from "./sections/PersonalInfoSection";
import { SummarySection } from "./sections/SummarySection";
import { WorkExperienceSection } from "./sections/WorkExperienceSection";
import { EducationSection } from "./sections/EducationSection";
import { SkillsSection } from "./sections/SkillsSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { CertificationsSection } from "./sections/CertificationsSection";

export function BuilderSidebar({ className }: { className?: string }) {
  const activeSection = useResumeStore((s) => s.activeSection);

  return (
    <div className={cn(className)}>
      {activeSection === "personal" && <PersonalInfoSection />}
      {activeSection === "summary" && <SummarySection />}
      {activeSection === "experience" && <WorkExperienceSection />}
      {activeSection === "education" && <EducationSection />}
      {activeSection === "skills" && <SkillsSection />}
      {activeSection === "projects" && <ProjectsSection />}
      {activeSection === "certifications" && <CertificationsSection />}
    </div>
  );
}
