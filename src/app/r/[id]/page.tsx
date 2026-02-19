import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ModernTemplate } from "@/components/preview/templates/ModernTemplate";
import { ClassicTemplate } from "@/components/preview/templates/ClassicTemplate";
import { MinimalTemplate } from "@/components/preview/templates/MinimalTemplate";
import { ProfessionalTemplate } from "@/components/preview/templates/ProfessionalTemplate";
import { ExecutiveTemplate } from "@/components/preview/templates/ExecutiveTemplate";
import { CreativeTemplate } from "@/components/preview/templates/CreativeTemplate";
import { Logo } from "@/components/brand/Logo";
import { DownloadPdfButton } from "@/components/shared/DownloadPdfButton";
import type { ResumeFormState } from "@/store/resumeStore";
import type { TemplateId } from "@/types";
import type { Metadata } from "next";
import Link from "next/link";

const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  executive: ExecutiveTemplate,
  creative: CreativeTemplate,
} as const;

async function getPublicResume(id: string) {
  const resume = await db.resume.findUnique({
    where: { id },
    include: {
      personalInfo: true,
      workExperiences: true,
      educations: true,
      skills: true,
      projects: true,
      certifications: true,
    },
  });

  if (!resume) return null;
  return resume;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const resume = await getPublicResume(id);

  if (!resume) {
    return { title: "Resume Not Found" };
  }

  const name = resume.personalInfo?.fullName ?? resume.title;
  return {
    title: `${name} — Resume | BuildMyResume`,
    description: resume.summary?.slice(0, 160) ?? `${name}'s resume`,
  };
}

export default async function PublicResumePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pdf?: string }>;
}) {
  const { id } = await params;
  const { pdf } = await searchParams;
  const resume = await getPublicResume(id);

  if (!resume) notFound();

  const isPdfMode = pdf === "1";

  const emptyPersonalInfo = {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: null,
    github: null,
    website: null,
  };

  const formState: ResumeFormState = {
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

  const Template = TEMPLATE_COMPONENTS[formState.template] ?? ModernTemplate;

  const name = resume.personalInfo?.fullName ?? resume.title;

  // PDF mode: render only the resume template on a clean white page
  if (isPdfMode) {
    return (
      <div
        style={{
          width: "794px",
          minHeight: "1123px",
          margin: 0,
          padding: 0,
          background: "white",
        }}
        id="resume-preview"
      >
        <Template data={formState} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 px-6 py-3 backdrop-blur-md print:hidden">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="text-sm font-semibold">{name}</h1>
            <p className="text-xs text-muted-foreground">Resume</p>
          </div>
        </div>
        <DownloadPdfButton resumeId={id} title={name} />
      </div>

      {/* Resume content */}
      <div className="mx-auto my-8 max-w-198.5 px-4">
        <div
          className="overflow-hidden rounded-lg bg-white shadow-xl shadow-brand-500/5"
          id="resume-preview"
        >
          <Template data={formState} />
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Built with{" "}
          <Link href="/" className="font-medium text-brand-600 hover:underline">
            BuildMyResume
          </Link>
        </p>
      </div>
    </div>
  );
}
