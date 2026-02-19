import { describe, it, expect, beforeEach } from "vitest";
import { useResumeStore } from "../resumeStore";
import type { ResumeWithRelations } from "@/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Reset the store to its default state between tests */
function resetStore() {
  useResumeStore.getState().resetStore();
}

function getState() {
  return useResumeStore.getState();
}

/** Minimal mock of a server-loaded resume */
const mockServerResume: ResumeWithRelations = {
  id: "resume-1",
  userId: "user-1",
  title: "Senior Dev Resume",
  template: "classic",
  summary: "10 years of experience.",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-06-01"),
  personalInfo: {
    id: "pi-1",
    resumeId: "resume-1",
    fullName: "Jane Smith",
    email: "jane@example.com",
    phone: "555-9999",
    location: "San Francisco, CA",
    linkedin: "https://linkedin.com/in/janesmith",
    github: "https://github.com/janesmith",
    website: null,
  },
  workExperiences: [
    {
      id: "we-1",
      resumeId: "resume-1",
      company: "BigCo",
      title: "Lead Engineer",
      location: "Remote",
      startDate: "2020-01",
      endDate: null,
      current: true,
      description: "Leading a team of 8.",
    },
  ],
  educations: [
    {
      id: "edu-1",
      resumeId: "resume-1",
      institution: "Stanford",
      degree: "M.S.",
      fieldOfStudy: "CS",
      location: "Stanford, CA",
      startDate: "2014-09",
      endDate: "2016-06",
      current: false,
      gpa: "3.9",
      description: null,
    },
  ],
  skills: [
    { id: "sk-1", resumeId: "resume-1", name: "React" },
    { id: "sk-2", resumeId: "resume-1", name: "Node.js" },
  ],
  projects: [
    {
      id: "proj-1",
      resumeId: "resume-1",
      name: "Open Source CLI",
      description: "A CLI tool.",
      url: "https://github.com/janesmith/cli",
      startDate: "2023-01",
      endDate: "2023-06",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      resumeId: "resume-1",
      name: "AWS SA",
      issuer: "Amazon",
      issueDate: "2023-01",
      expiryDate: null,
      certificateUrl: null,
    },
  ],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("resumeStore", () => {
  beforeEach(() => {
    resetStore();
  });

  // -------------------------------------------------------------------------
  // Initialization
  // -------------------------------------------------------------------------

  describe("initialization", () => {
    it("starts with default state", () => {
      const { formState, isDirty, isSaving, lastSaved, activeSection } =
        getState();
      expect(formState.id).toBeNull();
      expect(formState.title).toBe("My Resume");
      expect(formState.template).toBe("modern");
      expect(formState.summary).toBe("");
      expect(formState.workExperiences).toEqual([]);
      expect(formState.educations).toEqual([]);
      expect(formState.skills).toEqual([]);
      expect(formState.projects).toEqual([]);
      expect(formState.certifications).toEqual([]);
      expect(isDirty).toBe(false);
      expect(isSaving).toBe(false);
      expect(lastSaved).toBeNull();
      expect(activeSection).toBe("personal");
    });

    it("starts with empty personalInfo", () => {
      const { personalInfo } = getState().formState;
      expect(personalInfo.fullName).toBe("");
      expect(personalInfo.email).toBe("");
      expect(personalInfo.phone).toBe("");
      expect(personalInfo.location).toBe("");
      expect(personalInfo.linkedin).toBeNull();
      expect(personalInfo.github).toBeNull();
      expect(personalInfo.website).toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  // loadResume / resetStore
  // -------------------------------------------------------------------------

  describe("loadResume", () => {
    it("hydrates all fields from server data", () => {
      getState().loadResume(mockServerResume);
      const { formState } = getState();

      expect(formState.id).toBe("resume-1");
      expect(formState.title).toBe("Senior Dev Resume");
      expect(formState.template).toBe("classic");
      expect(formState.summary).toBe("10 years of experience.");
      expect(formState.personalInfo.fullName).toBe("Jane Smith");
      expect(formState.workExperiences).toHaveLength(1);
      expect(formState.educations).toHaveLength(1);
      expect(formState.skills).toHaveLength(2);
      expect(formState.projects).toHaveLength(1);
      expect(formState.certifications).toHaveLength(1);
    });

    it("uses empty personalInfo when server data has null", () => {
      getState().loadResume({ ...mockServerResume, personalInfo: null });
      const { personalInfo } = getState().formState;

      expect(personalInfo.fullName).toBe("");
      expect(personalInfo.email).toBe("");
    });

    it("sets isDirty to false", () => {
      getState().updateTitle("Dirty title");
      expect(getState().isDirty).toBe(true);

      getState().loadResume(mockServerResume);
      expect(getState().isDirty).toBe(false);
    });

    it("resets activeSection to personal", () => {
      getState().setActiveSection("skills");
      getState().loadResume(mockServerResume);
      expect(getState().activeSection).toBe("personal");
    });

    it("handles null summary from server", () => {
      getState().loadResume({ ...mockServerResume, summary: null });
      expect(getState().formState.summary).toBe("");
    });
  });

  describe("resetStore", () => {
    it("returns to default state after modifications", () => {
      getState().loadResume(mockServerResume);
      getState().updateTitle("Changed");
      resetStore();

      const { formState, isDirty, isSaving, lastSaved } = getState();
      expect(formState.id).toBeNull();
      expect(formState.title).toBe("My Resume");
      expect(isDirty).toBe(false);
      expect(isSaving).toBe(false);
      expect(lastSaved).toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------

  describe("setActiveSection", () => {
    it("updates the active section", () => {
      getState().setActiveSection("education");
      expect(getState().activeSection).toBe("education");
    });
  });

  // -------------------------------------------------------------------------
  // Top-level fields
  // -------------------------------------------------------------------------

  describe("updateTitle", () => {
    it("sets the title and marks dirty", () => {
      getState().updateTitle("New Title");
      expect(getState().formState.title).toBe("New Title");
      expect(getState().isDirty).toBe(true);
    });
  });

  describe("updateSummary", () => {
    it("sets the summary and marks dirty", () => {
      getState().updateSummary("A great summary.");
      expect(getState().formState.summary).toBe("A great summary.");
      expect(getState().isDirty).toBe(true);
    });
  });

  describe("setTemplate", () => {
    it("sets the template and marks dirty", () => {
      getState().setTemplate("minimal");
      expect(getState().formState.template).toBe("minimal");
      expect(getState().isDirty).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // Personal info
  // -------------------------------------------------------------------------

  describe("updatePersonalInfo", () => {
    it("merges partial data into personalInfo", () => {
      getState().updatePersonalInfo({ fullName: "Alice", email: "alice@test.com" });
      const { personalInfo } = getState().formState;
      expect(personalInfo.fullName).toBe("Alice");
      expect(personalInfo.email).toBe("alice@test.com");
      // Other fields remain empty defaults
      expect(personalInfo.phone).toBe("");
    });

    it("marks dirty", () => {
      getState().updatePersonalInfo({ fullName: "Bob" });
      expect(getState().isDirty).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // Work experience CRUD
  // -------------------------------------------------------------------------

  describe("work experience", () => {
    it("addWorkExperience pushes a new empty entry", () => {
      getState().addWorkExperience();
      const experiences = getState().formState.workExperiences;
      expect(experiences).toHaveLength(1);
      expect(experiences[0].company).toBe("");
      expect(experiences[0].title).toBe("");
      expect(experiences[0].id).toBe("test-id-1");
      expect(getState().isDirty).toBe(true);
    });

    it("updateWorkExperience updates the correct entry", () => {
      getState().addWorkExperience();
      const id = getState().formState.workExperiences[0].id;
      getState().updateWorkExperience(id, { company: "Acme" });
      expect(getState().formState.workExperiences[0].company).toBe("Acme");
    });

    it("updateWorkExperience no-ops for non-existent ID", () => {
      getState().addWorkExperience();
      getState().updateWorkExperience("nonexistent", { company: "Acme" });
      expect(getState().formState.workExperiences[0].company).toBe("");
    });

    it("removeWorkExperience removes the entry", () => {
      getState().addWorkExperience();
      const id = getState().formState.workExperiences[0].id;
      getState().removeWorkExperience(id);
      expect(getState().formState.workExperiences).toHaveLength(0);
      expect(getState().isDirty).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // Education CRUD
  // -------------------------------------------------------------------------

  describe("education", () => {
    it("addEducation pushes a new empty entry", () => {
      getState().addEducation();
      const educations = getState().formState.educations;
      expect(educations).toHaveLength(1);
      expect(educations[0].institution).toBe("");
      expect(educations[0].degree).toBe("");
      expect(educations[0].id).toBe("test-id-1");
      expect(getState().isDirty).toBe(true);
    });

    it("updateEducation updates the correct entry", () => {
      getState().addEducation();
      const id = getState().formState.educations[0].id;
      getState().updateEducation(id, { institution: "MIT" });
      expect(getState().formState.educations[0].institution).toBe("MIT");
    });

    it("updateEducation no-ops for non-existent ID", () => {
      getState().addEducation();
      getState().updateEducation("nonexistent", { institution: "MIT" });
      expect(getState().formState.educations[0].institution).toBe("");
    });

    it("removeEducation removes the entry", () => {
      getState().addEducation();
      const id = getState().formState.educations[0].id;
      getState().removeEducation(id);
      expect(getState().formState.educations).toHaveLength(0);
    });
  });

  // -------------------------------------------------------------------------
  // Skills
  // -------------------------------------------------------------------------

  describe("skills", () => {
    it("addSkill adds a trimmed skill", () => {
      getState().addSkill("  React  ");
      const skills = getState().formState.skills;
      expect(skills).toHaveLength(1);
      expect(skills[0].name).toBe("React");
      expect(getState().isDirty).toBe(true);
    });

    it("addSkill prevents duplicate names", () => {
      getState().addSkill("React");
      getState().addSkill("React");
      expect(getState().formState.skills).toHaveLength(1);
    });

    it("addSkill ignores empty/whitespace-only names", () => {
      getState().addSkill("");
      getState().addSkill("   ");
      expect(getState().formState.skills).toHaveLength(0);
    });

    it("removeSkill removes by ID", () => {
      getState().addSkill("TypeScript");
      const id = getState().formState.skills[0].id;
      getState().removeSkill(id);
      expect(getState().formState.skills).toHaveLength(0);
    });
  });

  // -------------------------------------------------------------------------
  // Projects CRUD
  // -------------------------------------------------------------------------

  describe("projects", () => {
    it("addProject pushes a new empty entry", () => {
      getState().addProject();
      const projects = getState().formState.projects;
      expect(projects).toHaveLength(1);
      expect(projects[0].name).toBe("");
      expect(projects[0].url).toBeNull();
      expect(getState().isDirty).toBe(true);
    });

    it("updateProject updates the correct entry", () => {
      getState().addProject();
      const id = getState().formState.projects[0].id;
      getState().updateProject(id, { name: "My App" });
      expect(getState().formState.projects[0].name).toBe("My App");
    });

    it("updateProject no-ops for non-existent ID", () => {
      getState().addProject();
      getState().updateProject("nonexistent", { name: "My App" });
      expect(getState().formState.projects[0].name).toBe("");
    });

    it("removeProject removes the entry", () => {
      getState().addProject();
      const id = getState().formState.projects[0].id;
      getState().removeProject(id);
      expect(getState().formState.projects).toHaveLength(0);
    });
  });

  // -------------------------------------------------------------------------
  // Certifications CRUD
  // -------------------------------------------------------------------------

  describe("certifications", () => {
    it("addCertification pushes a new empty entry", () => {
      getState().addCertification();
      const certs = getState().formState.certifications;
      expect(certs).toHaveLength(1);
      expect(certs[0].name).toBe("");
      expect(certs[0].issuer).toBe("");
      expect(certs[0].certificateUrl).toBeNull();
      expect(getState().isDirty).toBe(true);
    });

    it("updateCertification updates the correct entry", () => {
      getState().addCertification();
      const id = getState().formState.certifications[0].id;
      getState().updateCertification(id, { name: "AWS SA" });
      expect(getState().formState.certifications[0].name).toBe("AWS SA");
    });

    it("updateCertification no-ops for non-existent ID", () => {
      getState().addCertification();
      getState().updateCertification("nonexistent", { name: "AWS SA" });
      expect(getState().formState.certifications[0].name).toBe("");
    });

    it("removeCertification removes the entry", () => {
      getState().addCertification();
      const id = getState().formState.certifications[0].id;
      getState().removeCertification(id);
      expect(getState().formState.certifications).toHaveLength(0);
    });
  });

  // -------------------------------------------------------------------------
  // Save state
  // -------------------------------------------------------------------------

  describe("save state", () => {
    it("setIsSaving toggles the saving flag", () => {
      getState().setIsSaving(true);
      expect(getState().isSaving).toBe(true);
      getState().setIsSaving(false);
      expect(getState().isSaving).toBe(false);
    });

    it("setLastSaved sets the date", () => {
      const now = new Date("2024-06-15T12:00:00Z");
      getState().setLastSaved(now);
      expect(getState().lastSaved).toEqual(now);
    });

    it("markClean sets isDirty to false", () => {
      getState().updateTitle("Dirty");
      expect(getState().isDirty).toBe(true);
      getState().markClean();
      expect(getState().isDirty).toBe(false);
    });
  });
});
