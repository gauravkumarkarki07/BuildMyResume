"use client";

import { useResumeStore } from "@/store/resumeStore";
import { SECTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  User,
  AlignLeft,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderOpen,
  Award,
} from "lucide-react";
import type { ActiveSection } from "@/types";

const SECTION_ICONS: Record<ActiveSection, React.ElementType> = {
  personal: User,
  summary: AlignLeft,
  experience: Briefcase,
  education: GraduationCap,
  skills: Wrench,
  projects: FolderOpen,
  certifications: Award,
};

export function SectionNav({ className }: { className?: string }) {
  const activeSection = useResumeStore((s) => s.activeSection);
  const setActiveSection = useResumeStore((s) => s.setActiveSection);

  return (
    <nav
      className={cn("flex items-center gap-1 overflow-x-auto", className)}
      aria-label="Resume sections"
    >
      {SECTIONS.map((section) => {
        const Icon = SECTION_ICONS[section.id];
        const isActive = activeSection === section.id;
        return (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {section.shortLabel}
          </button>
        );
      })}
    </nav>
  );
}
