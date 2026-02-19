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
      className={cn("flex items-end gap-0 overflow-x-auto border-b", className)}
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
              "relative inline-flex shrink-0 items-center gap-1.5 px-3 pb-2.5 pt-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive
                ? "text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {section.shortLabel}
          </button>
        );
      })}
    </nav>
  );
}
