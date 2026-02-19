import type { ActiveSection, TemplateId } from "@/types";

export const SECTIONS: { id: ActiveSection; label: string }[] = [
  { id: "personal", label: "Personal Info" },
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Work Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "certifications", label: "Certifications" },
];

export const TEMPLATES: { id: TemplateId; label: string; description: string }[] = [
  { id: "modern", label: "Modern", description: "Bold header, colored accents" },
  { id: "classic", label: "Classic", description: "Traditional single-column" },
  { id: "minimal", label: "Minimal", description: "Clean whitespace, subtle style" },
];

export const AUTOSAVE_DELAY_MS = 1500;
