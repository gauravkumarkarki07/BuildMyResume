import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUserInDb } from "@/lib/auth";
import type { ResumeFormState } from "@/store/resumeStore";

async function getOwnedResume(resumeId: string, userId: string) {
  const resume = await db.resume.findUnique({
    where: { id: resumeId },
    include: {
      personalInfo: true,
      workExperiences: { orderBy: { sortOrder: "asc" } },
      educations: { orderBy: { sortOrder: "asc" } },
      skills: { orderBy: { sortOrder: "asc" } },
      projects: { orderBy: { sortOrder: "asc" } },
      certifications: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!resume || resume.userId !== userId) return null;
  return resume;
}

// GET /api/resumes/[resumeId]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  const { resumeId } = await params;
  const user = await ensureUserInDb();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resume = await getOwnedResume(resumeId, user.id);
  if (!resume) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(resume);
}

// PUT /api/resumes/[resumeId] — full update (autosave)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  const { resumeId } = await params;
  const user = await ensureUserInDb();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resume = await getOwnedResume(resumeId, user.id);
  if (!resume) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body: ResumeFormState = await req.json();

  // Update resume + all relations in a transaction
  const updated = await db.$transaction(async (tx) => {
    // Update resume top-level fields
    await tx.resume.update({
      where: { id: resumeId },
      data: {
        title: body.title,
        template: body.template,
        summary: body.summary,
      },
    });

    // Upsert personal info
    if (body.personalInfo) {
      await tx.personalInfo.upsert({
        where: { resumeId },
        update: {
          fullName: body.personalInfo.fullName,
          email: body.personalInfo.email,
          phone: body.personalInfo.phone,
          location: body.personalInfo.location,
          linkedin: body.personalInfo.linkedin || null,
          github: body.personalInfo.github || null,
          website: body.personalInfo.website || null,
        },
        create: {
          resumeId,
          fullName: body.personalInfo.fullName,
          email: body.personalInfo.email,
          phone: body.personalInfo.phone,
          location: body.personalInfo.location,
          linkedin: body.personalInfo.linkedin || null,
          github: body.personalInfo.github || null,
          website: body.personalInfo.website || null,
        },
      });
    }

    // Replace work experiences
    await tx.workExperience.deleteMany({ where: { resumeId } });
    if (body.workExperiences.length > 0) {
      await tx.workExperience.createMany({
        data: body.workExperiences.map((w, i) => ({
          resumeId,
          company: w.company,
          title: w.title,
          location: w.location ?? "",
          startDate: w.startDate,
          endDate: w.endDate || null,
          current: w.current,
          description: w.description,
          sortOrder: i,
        })),
      });
    }

    // Replace educations
    await tx.education.deleteMany({ where: { resumeId } });
    if (body.educations.length > 0) {
      await tx.education.createMany({
        data: body.educations.map((e, i) => ({
          resumeId,
          institution: e.institution,
          degree: e.degree,
          fieldOfStudy: e.fieldOfStudy ?? "",
          location: e.location ?? "",
          startDate: e.startDate,
          endDate: e.endDate || null,
          current: e.current,
          gpa: e.gpa || null,
          description: e.description || null,
          sortOrder: i,
        })),
      });
    }

    // Replace skills
    await tx.skill.deleteMany({ where: { resumeId } });
    if (body.skills.length > 0) {
      await tx.skill.createMany({
        data: body.skills.map((s, i) => ({
          resumeId,
          name: s.name,
          sortOrder: i,
        })),
      });
    }

    // Replace projects
    await tx.project.deleteMany({ where: { resumeId } });
    if (body.projects.length > 0) {
      await tx.project.createMany({
        data: body.projects.map((p, i) => ({
          resumeId,
          name: p.name,
          description: p.description,
          technologies: p.technologies,
          url: p.url || null,
          githubUrl: p.githubUrl || null,
          startDate: p.startDate || null,
          endDate: p.endDate || null,
          sortOrder: i,
        })),
      });
    }

    // Replace certifications
    await tx.certification.deleteMany({ where: { resumeId } });
    if (body.certifications.length > 0) {
      await tx.certification.createMany({
        data: body.certifications.map((c, i) => ({
          resumeId,
          name: c.name,
          issuer: c.issuer,
          issueDate: c.issueDate,
          expiryDate: c.expiryDate || null,
          credentialUrl: c.credentialUrl || null,
          sortOrder: i,
        })),
      });
    }

    return tx.resume.findUnique({
      where: { id: resumeId },
      include: {
        personalInfo: true,
        workExperiences: { orderBy: { sortOrder: "asc" } },
        educations: { orderBy: { sortOrder: "asc" } },
        skills: { orderBy: { sortOrder: "asc" } },
        projects: { orderBy: { sortOrder: "asc" } },
        certifications: { orderBy: { sortOrder: "asc" } },
      },
    });
  });

  return NextResponse.json(updated);
}

// DELETE /api/resumes/[resumeId]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  const { resumeId } = await params;
  const user = await ensureUserInDb();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resume = await getOwnedResume(resumeId, user.id);
  if (!resume) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.resume.delete({ where: { id: resumeId } });
  return new NextResponse(null, { status: 204 });
}
