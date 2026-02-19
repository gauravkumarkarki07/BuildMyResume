import type {
  Resume,
  PersonalInfo,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certification,
} from "@prisma/client";

// Re-export Prisma types for use throughout the app
export type {
  Resume,
  PersonalInfo,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certification,
};

// Template options matching the Resume.template field
export type TemplateId = "modern" | "classic" | "minimal";

// Resume with all relations loaded (what the builder works with)
export type ResumeWithRelations = Resume & {
  personalInfo: PersonalInfo | null;
  workExperiences: WorkExperience[];
  educations: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
};

// Section navigation in the builder
export type ActiveSection =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications";
