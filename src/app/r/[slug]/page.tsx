import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ModernTemplate } from "@/components/preview/templates/ModernTemplate";
import { ClassicTemplate } from "@/components/preview/templates/ClassicTemplate";
import { MinimalTemplate } from "@/components/preview/templates/MinimalTemplate";
import type { ResumeFormState } from "@/store/resumeStore";
import type { TemplateId } from "@/types";
import type { Metadata } from "next";

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
    title: `${name} — Resume`,
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
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm print:hidden">
        <div>
          <h1 className="text-sm font-semibold text-gray-900">
            {resume.personalInfo?.fullName ?? resume.title}
          </h1>
          <p className="text-xs text-gray-500">Resume</p>
        </div>
        <button
          onClick={undefined}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          id="print-btn"
        >
          Download PDF
        </button>
      </div>

      {/* Resume content */}
      <div className="mx-auto my-8 max-w-[794px]">
        <div className="bg-white shadow-lg" id="resume-preview">
          <Template data={formState} />
        </div>
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
