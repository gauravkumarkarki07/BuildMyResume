import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ModernTemplate } from "@/components/preview/templates/ModernTemplate";
import { ClassicTemplate } from "@/components/preview/templates/ClassicTemplate";
import { MinimalTemplate } from "@/components/preview/templates/MinimalTemplate";
import { Logo } from "@/components/brand/Logo";
import type { ResumeFormState } from "@/store/resumeStore";
import type { TemplateId } from "@/types";
import type { Metadata } from "next";
import { Download } from "lucide-react";

const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
} as const;

async function getPublicResume(slug: string) {
  const resume = await db.resume.findUnique({
    where: { slug },
    include: {
      personalInfo: true,
      workExperiences: true,
      educations: true,
      skills: true,
      projects: true,
      certifications: true,
    },
  });

  if (!resume || !resume.isPublic) return null;
  return resume;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resume = await getPublicResume(slug);

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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resume = await getPublicResume(slug);

  if (!resume) notFound();

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

  const Template =
    TEMPLATE_COMPONENTS[formState.template] ?? ModernTemplate;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 px-6 py-3 backdrop-blur-md print:hidden">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="text-sm font-semibold">
              {resume.personalInfo?.fullName ?? resume.title}
            </h1>
            <p className="text-xs text-muted-foreground">Resume</p>
          </div>
        </div>
        <button
          id="print-btn"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>
      </div>

      {/* Resume content */}
      <div className="mx-auto my-8 max-w-[794px] px-4">
        <div className="overflow-hidden rounded-lg bg-white shadow-xl shadow-brand-500/5" id="resume-preview">
          <Template data={formState} />
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Built with{" "}
          <a href="/" className="font-medium text-brand-600 hover:underline">
            BuildMyResume
          </a>
        </p>
      </div>

      {/* Print script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('print-btn')?.addEventListener('click', function() {
              window.print();
            });
          `,
        }}
      />
    </div>
  );
}
