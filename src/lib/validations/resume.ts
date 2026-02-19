import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  location: z.string().min(1, "Location is required"),
  linkedin: z.string().url("Invalid URL").nullable().or(z.literal("")),
  github: z.string().url("Invalid URL").nullable().or(z.literal("")),
  website: z.string().url("Invalid URL").nullable().or(z.literal("")),
});

export const workExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company is required"),
  title: z.string().min(1, "Title is required"),
  location: z.string().default(""),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().nullable(),
  current: z.boolean(),
  description: z.string().default(""),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().default(""),
  location: z.string().default(""),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().nullable(),
  current: z.boolean(),
  gpa: z.string().nullable(),
  description: z.string().nullable(),
});

export const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Skill name is required"),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().default(""),
  url: z.string().url("Invalid URL").nullable().or(z.literal("")),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
});

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string().nullable(),
  certificateUrl: z.string().url("Invalid URL").nullable().or(z.literal("")),
});

export const resumeFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  template: z.enum(["modern", "classic", "minimal"]),
  summary: z.string(),
  personalInfo: personalInfoSchema,
  workExperiences: z.array(workExperienceSchema),
  educations: z.array(educationSchema),
  skills: z.array(skillSchema),
  projects: z.array(projectSchema),
  certifications: z.array(certificationSchema),
});

export type ResumeFormInput = z.infer<typeof resumeFormSchema>;
