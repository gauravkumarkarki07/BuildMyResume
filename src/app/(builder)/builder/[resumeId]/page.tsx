import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ensureUserInDb } from "@/lib/auth";
import { BuilderClient } from "@/components/builder/BuilderClient";

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = await params;
  const user = await ensureUserInDb();
  if (!user) redirect("/sign-in");

  const resume = await db.resume.findUnique({
    where: { id: resumeId },
    include: {
      personalInfo: true,
      workExperiences: true,
      educations: true,
      skills: true,
      projects: true,
      certifications: true,
    },
  });

  if (!resume || resume.userId !== user.id) notFound();

  return <BuilderClient resume={resume} />;
}
