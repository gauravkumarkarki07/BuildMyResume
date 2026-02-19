import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  PersonalInfo,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certification,
  TemplateId,
  ActiveSection,
  ResumeWithRelations,
} from "@/types";
import { nanoid } from "nanoid";

// Client-side shape of the resume data in the builder
export interface ResumeFormState {
  id: string | null;
  title: string;
  template: TemplateId;
  summary: string;
  personalInfo: Omit<PersonalInfo, "id" | "resumeId">;
  workExperiences: WorkExperience[];
  educations: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}

const emptyPersonalInfo: Omit<PersonalInfo, "id" | "resumeId"> = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: null,
  github: null,
  website: null,
};

const defaultFormState: ResumeFormState = {
  id: null,
  title: "My Resume",
  template: "modern",
  summary: "",
  personalInfo: emptyPersonalInfo,
  workExperiences: [],
  educations: [],
  skills: [],
  projects: [],
  certifications: [],
};

interface ResumeStore {
  formState: ResumeFormState;
  activeSection: ActiveSection;
  isSaving: boolean;
  lastSaved: Date | null;
  isDirty: boolean;

  // Hydrate from server data
  loadResume: (resume: ResumeWithRelations) => void;
  resetStore: () => void;

  // Navigation
  setActiveSection: (section: ActiveSection) => void;

  // Top-level fields
  updateTitle: (title: string) => void;
  updateSummary: (summary: string) => void;
  setTemplate: (template: TemplateId) => void;

  // Personal info
  updatePersonalInfo: (data: Partial<Omit<PersonalInfo, "id" | "resumeId">>) => void;

  // Work experience
  addWorkExperience: () => void;
  updateWorkExperience: (id: string, data: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;

  // Education
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  // Skills
  addSkill: (name: string) => void;
  removeSkill: (id: string) => void;

  // Projects
  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;

  // Certifications
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;

  // Save state
  setIsSaving: (saving: boolean) => void;
  setLastSaved: (date: Date) => void;
  markClean: () => void;
}

export const useResumeStore = create<ResumeStore>()(
  devtools(
    immer((set) => ({
      formState: defaultFormState,
      activeSection: "personal" as ActiveSection,
      isSaving: false,
      lastSaved: null,
      isDirty: false,

      loadResume: (resume) =>
        set((state) => {
          state.formState = {
            id: resume.id,
            title: resume.title,
            template: resume.template as TemplateId,
            summary: resume.summary ?? "",
            personalInfo: resume.personalInfo
              ? {
                  fullName: resume.personalInfo.fullName,
                  email: resume.personalInfo.email,
                  phone: resume.personalInfo.phone,
                  location: resume.personalInfo.location,
                  linkedin: resume.personalInfo.linkedin,
                  github: resume.personalInfo.github,
                  website: resume.personalInfo.website,
                }
              : emptyPersonalInfo,
            workExperiences: resume.workExperiences,
            educations: resume.educations,
            skills: resume.skills,
            projects: resume.projects,
            certifications: resume.certifications,
          };
          state.isDirty = false;
          state.activeSection = "personal";
        }),

      resetStore: () =>
        set((state) => {
          state.formState = defaultFormState;
          state.activeSection = "personal";
          state.isDirty = false;
          state.isSaving = false;
          state.lastSaved = null;
        }),

      setActiveSection: (section) =>
        set((state) => {
          state.activeSection = section;
        }),

      updateTitle: (title) =>
        set((state) => {
          state.formState.title = title;
          state.isDirty = true;
        }),

      updateSummary: (summary) =>
        set((state) => {
          state.formState.summary = summary;
          state.isDirty = true;
        }),

      setTemplate: (template) =>
        set((state) => {
          state.formState.template = template;
          state.isDirty = true;
        }),

      updatePersonalInfo: (data) =>
        set((state) => {
          Object.assign(state.formState.personalInfo, data);
          state.isDirty = true;
        }),

      addWorkExperience: () =>
        set((state) => {
          state.formState.workExperiences.push({
            id: nanoid(),
            resumeId: state.formState.id ?? "",
            company: "",
            title: "",
            location: "",
            startDate: "",
            endDate: null,
            current: false,
            description: "",
            sortOrder: state.formState.workExperiences.length,
          });
          state.isDirty = true;
        }),

      updateWorkExperience: (id, data) =>
        set((state) => {
          const idx = state.formState.workExperiences.findIndex((e) => e.id === id);
          if (idx !== -1) {
            Object.assign(state.formState.workExperiences[idx], data);
            state.isDirty = true;
          }
        }),

      removeWorkExperience: (id) =>
        set((state) => {
          state.formState.workExperiences = state.formState.workExperiences.filter(
            (e) => e.id !== id
          );
          state.isDirty = true;
        }),

      addEducation: () =>
        set((state) => {
          state.formState.educations.push({
            id: nanoid(),
            resumeId: state.formState.id ?? "",
            institution: "",
            degree: "",
            fieldOfStudy: "",
            location: "",
            startDate: "",
            endDate: null,
            current: false,
            gpa: null,
            description: null,
            sortOrder: state.formState.educations.length,
          });
          state.isDirty = true;
        }),

      updateEducation: (id, data) =>
        set((state) => {
          const idx = state.formState.educations.findIndex((e) => e.id === id);
          if (idx !== -1) {
            Object.assign(state.formState.educations[idx], data);
            state.isDirty = true;
          }
        }),

      removeEducation: (id) =>
        set((state) => {
          state.formState.educations = state.formState.educations.filter(
            (e) => e.id !== id
          );
          state.isDirty = true;
        }),

      addSkill: (name) =>
        set((state) => {
          const trimmed = name.trim();
          if (trimmed && !state.formState.skills.some((s) => s.name === trimmed)) {
            state.formState.skills.push({
              id: nanoid(),
              resumeId: state.formState.id ?? "",
              name: trimmed,
              sortOrder: state.formState.skills.length,
            });
            state.isDirty = true;
          }
        }),

      removeSkill: (id) =>
        set((state) => {
          state.formState.skills = state.formState.skills.filter((s) => s.id !== id);
          state.isDirty = true;
        }),

      addProject: () =>
        set((state) => {
          state.formState.projects.push({
            id: nanoid(),
            resumeId: state.formState.id ?? "",
            name: "",
            description: "",
            technologies: [],
            url: null,
            githubUrl: null,
            startDate: null,
            endDate: null,
            sortOrder: state.formState.projects.length,
          });
          state.isDirty = true;
        }),

      updateProject: (id, data) =>
        set((state) => {
          const idx = state.formState.projects.findIndex((p) => p.id === id);
          if (idx !== -1) {
            Object.assign(state.formState.projects[idx], data);
            state.isDirty = true;
          }
        }),

      removeProject: (id) =>
        set((state) => {
          state.formState.projects = state.formState.projects.filter(
            (p) => p.id !== id
          );
          state.isDirty = true;
        }),

      addCertification: () =>
        set((state) => {
          state.formState.certifications.push({
            id: nanoid(),
            resumeId: state.formState.id ?? "",
            name: "",
            issuer: "",
            issueDate: "",
            expiryDate: null,
            credentialUrl: null,
            sortOrder: state.formState.certifications.length,
          });
          state.isDirty = true;
        }),

      updateCertification: (id, data) =>
        set((state) => {
          const idx = state.formState.certifications.findIndex((c) => c.id === id);
          if (idx !== -1) {
            Object.assign(state.formState.certifications[idx], data);
            state.isDirty = true;
          }
        }),

      removeCertification: (id) =>
        set((state) => {
          state.formState.certifications = state.formState.certifications.filter(
            (c) => c.id !== id
          );
          state.isDirty = true;
        }),

      setIsSaving: (saving) =>
        set((state) => {
          state.isSaving = saving;
        }),

      setLastSaved: (date) =>
        set((state) => {
          state.lastSaved = date;
        }),

      markClean: () =>
        set((state) => {
          state.isDirty = false;
        }),
    }))
  )
);
