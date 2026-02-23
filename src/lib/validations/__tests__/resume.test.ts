import { describe, it, expect } from "vitest";
import {
  personalInfoSchema,
  workExperienceSchema,
  educationSchema,
  skillSchema,
  projectSchema,
  certificationSchema,
  resumeFormSchema,
} from "../resume";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const validPersonalInfo = {
  fullName: "John Doe",
  email: "john@example.com",
  phone: "+1 555-1234",
  location: "New York, NY",
  linkedin: "https://linkedin.com/in/johndoe",
  github: "https://github.com/johndoe",
  website: "https://johndoe.dev",
};

const validWorkExperience = {
  id: "we-1",
  company: "Acme Inc.",
  title: "Software Engineer",
  location: "Remote",
  startDate: "2022-01",
  endDate: "2024-01",
  current: false,
  description: "Built cool stuff.",
};

const validEducation = {
  id: "edu-1",
  institution: "MIT",
  degree: "B.S. Computer Science",
  fieldOfStudy: "Computer Science",
  location: "Cambridge, MA",
  startDate: "2018-09",
  endDate: "2022-05",
  current: false,
  gpa: "3.8",
  description: "Dean's list.",
};

const validSkill = { id: "sk-1", name: "TypeScript" };

const validProject = {
  id: "proj-1",
  name: "Resume Builder",
  description: "A web app for building resumes.",
  url: "https://example.com",
  startDate: "2024-01",
  endDate: "2024-06",
};

const validCertification = {
  id: "cert-1",
  name: "AWS Solutions Architect",
  issuer: "Amazon",
  issueDate: "2023-06",
  expiryDate: "2026-06",
  certificateUrl: "https://aws.amazon.com/cert/123",
};

// ---------------------------------------------------------------------------
// personalInfoSchema
// ---------------------------------------------------------------------------

describe("personalInfoSchema", () => {
  it("accepts valid personal info", () => {
    const result = personalInfoSchema.safeParse(validPersonalInfo);
    expect(result.success).toBe(true);
  });

  it("rejects empty fullName", () => {
    const result = personalInfoSchema.safeParse({
      ...validPersonalInfo,
      fullName: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = personalInfoSchema.safeParse({
      ...validPersonalInfo,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty phone", () => {
    const result = personalInfoSchema.safeParse({
      ...validPersonalInfo,
      phone: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty location", () => {
    const result = personalInfoSchema.safeParse({
      ...validPersonalInfo,
      location: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts null for optional URL fields", () => {
    const result = personalInfoSchema.safeParse({
      ...validPersonalInfo,
      linkedin: null,
      github: null,
      website: null,
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty string for optional URL fields", () => {
    const result = personalInfoSchema.safeParse({
      ...validPersonalInfo,
      linkedin: "",
      github: "",
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid URL for linkedin", () => {
    const result = personalInfoSchema.safeParse({
      ...validPersonalInfo,
      linkedin: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid URL for github", () => {
    const result = personalInfoSchema.safeParse({
      ...validPersonalInfo,
      github: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid URL for website", () => {
    const result = personalInfoSchema.safeParse({
      ...validPersonalInfo,
      website: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// workExperienceSchema
// ---------------------------------------------------------------------------

describe("workExperienceSchema", () => {
  it("accepts valid work experience", () => {
    const result = workExperienceSchema.safeParse(validWorkExperience);
    expect(result.success).toBe(true);
  });

  it("rejects empty company", () => {
    const result = workExperienceSchema.safeParse({
      ...validWorkExperience,
      company: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty title", () => {
    const result = workExperienceSchema.safeParse({
      ...validWorkExperience,
      title: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty startDate", () => {
    const result = workExperienceSchema.safeParse({
      ...validWorkExperience,
      startDate: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts null endDate", () => {
    const result = workExperienceSchema.safeParse({
      ...validWorkExperience,
      endDate: null,
    });
    expect(result.success).toBe(true);
  });

  it("applies defaults for location and description", () => {
    const { id, company, title, startDate, endDate, current } =
      validWorkExperience;
    const result = workExperienceSchema.safeParse({
      id,
      company,
      title,
      startDate,
      endDate,
      current,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.location).toBe("");
      expect(result.data.description).toBe("");
    }
  });
});

// ---------------------------------------------------------------------------
// educationSchema
// ---------------------------------------------------------------------------

describe("educationSchema", () => {
  it("accepts valid education", () => {
    const result = educationSchema.safeParse(validEducation);
    expect(result.success).toBe(true);
  });

  it("rejects empty institution", () => {
    const result = educationSchema.safeParse({
      ...validEducation,
      institution: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty degree", () => {
    const result = educationSchema.safeParse({
      ...validEducation,
      degree: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty startDate", () => {
    const result = educationSchema.safeParse({
      ...validEducation,
      startDate: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts nullable gpa, description, endDate", () => {
    const result = educationSchema.safeParse({
      ...validEducation,
      gpa: null,
      description: null,
      endDate: null,
    });
    expect(result.success).toBe(true);
  });

  it("applies defaults for fieldOfStudy and location when omitted", () => {
    const result = educationSchema.safeParse({
      id: "edu-2",
      institution: "MIT",
      degree: "B.S.",
      startDate: "2018-09",
      endDate: null,
      current: false,
      gpa: null,
      description: null,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fieldOfStudy).toBe("");
      expect(result.data.location).toBe("");
    }
  });
});

// ---------------------------------------------------------------------------
// skillSchema
// ---------------------------------------------------------------------------

describe("skillSchema", () => {
  it("accepts valid skill", () => {
    const result = skillSchema.safeParse(validSkill);
    expect(result.success).toBe(true);
  });

  it("rejects empty skill name", () => {
    const result = skillSchema.safeParse({ id: "sk-1", name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing id", () => {
    const result = skillSchema.safeParse({ name: "React" });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// projectSchema
// ---------------------------------------------------------------------------

describe("projectSchema", () => {
  it("accepts valid project", () => {
    const result = projectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it("rejects empty project name", () => {
    const result = projectSchema.safeParse({ ...validProject, name: "" });
    expect(result.success).toBe(false);
  });

  it("accepts empty string for url", () => {
    const result = projectSchema.safeParse({ ...validProject, url: "" });
    expect(result.success).toBe(true);
  });

  it("accepts null for url", () => {
    const result = projectSchema.safeParse({ ...validProject, url: null });
    expect(result.success).toBe(true);
  });

  it("rejects invalid url", () => {
    const result = projectSchema.safeParse({
      ...validProject,
      url: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("accepts nullable startDate and endDate", () => {
    const result = projectSchema.safeParse({
      ...validProject,
      startDate: null,
      endDate: null,
    });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// certificationSchema
// ---------------------------------------------------------------------------

describe("certificationSchema", () => {
  it("accepts valid certification", () => {
    const result = certificationSchema.safeParse(validCertification);
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = certificationSchema.safeParse({
      ...validCertification,
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty issuer", () => {
    const result = certificationSchema.safeParse({
      ...validCertification,
      issuer: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty issueDate", () => {
    const result = certificationSchema.safeParse({
      ...validCertification,
      issueDate: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts nullable expiryDate and certificateUrl", () => {
    const result = certificationSchema.safeParse({
      ...validCertification,
      expiryDate: null,
      certificateUrl: null,
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty string for certificateUrl", () => {
    const result = certificationSchema.safeParse({
      ...validCertification,
      certificateUrl: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid certificateUrl", () => {
    const result = certificationSchema.safeParse({
      ...validCertification,
      certificateUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// resumeFormSchema
// ---------------------------------------------------------------------------

describe("resumeFormSchema", () => {
  const validResume = {
    title: "My Resume",
    template: "modern" as const,
    summary: "Experienced developer.",
    personalInfo: validPersonalInfo,
    workExperiences: [validWorkExperience],
    educations: [validEducation],
    skills: [validSkill],
    projects: [validProject],
    certifications: [validCertification],
  };

  it("accepts a full valid resume", () => {
    const result = resumeFormSchema.safeParse(validResume);
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = resumeFormSchema.safeParse({ ...validResume, title: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid template", () => {
    const result = resumeFormSchema.safeParse({
      ...validResume,
      template: "fancy",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all six valid templates", () => {
    for (const template of ["modern", "classic", "minimal", "professional", "executive", "creative"] as const) {
      const result = resumeFormSchema.safeParse({ ...validResume, template });
      expect(result.success).toBe(true);
    }
  });

  it("accepts empty arrays for all sections", () => {
    const result = resumeFormSchema.safeParse({
      ...validResume,
      workExperiences: [],
      educations: [],
      skills: [],
      projects: [],
      certifications: [],
    });
    expect(result.success).toBe(true);
  });

  it("rejects when personalInfo has invalid email", () => {
    const result = resumeFormSchema.safeParse({
      ...validResume,
      personalInfo: { ...validPersonalInfo, email: "bad" },
    });
    expect(result.success).toBe(false);
  });
});
