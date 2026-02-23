import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUserInDb } from "@/lib/auth";
import { resumeFormSchema } from "@/lib/validations/resume";

async function getOwnedResume(resumeId: string, userId: string) {
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

  const rawBody = await req.json().catch(() => null);
  if (!rawBody) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const parsed = resumeFormSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body", details: parsed.error.flatten() }, { status: 400 });
  }
  const body = parsed.data;

  const updated = await db.$transaction(async (tx) => {
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
        data: body.workExperiences.map((w) => ({
          resumeId,
          company: w.company,
          title: w.title,
          location: w.location ?? "",
          startDate: w.startDate,
          endDate: w.endDate || null,
          current: w.current,
          description: w.description,
        })),
      });
    }

    // Replace educations
    await tx.education.deleteMany({ where: { resumeId } });
    if (body.educations.length > 0) {
      await tx.education.createMany({
        data: body.educations.map((e) => ({
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
        })),
      });
    }

    // Replace skills
    await tx.skill.deleteMany({ where: { resumeId } });
    if (body.skills.length > 0) {
      await tx.skill.createMany({
        data: body.skills.map((s) => ({
          resumeId,
          name: s.name,
        })),
      });
    }

    // Replace projects
    await tx.project.deleteMany({ where: { resumeId } });
    if (body.projects.length > 0) {
      await tx.project.createMany({
        data: body.projects.map((p) => ({
          resumeId,
          name: p.name,
          description: p.description,
          url: p.url || null,
          startDate: p.startDate || null,
          endDate: p.endDate || null,
        })),
      });
    }

    // Replace certifications
    await tx.certification.deleteMany({ where: { resumeId } });
    if (body.certifications.length > 0) {
      await tx.certification.createMany({
        data: body.certifications.map((c) => ({
          resumeId,
          name: c.name,
          issuer: c.issuer,
          issueDate: c.issueDate,
          expiryDate: c.expiryDate || null,
          certificateUrl: c.certificateUrl || null,
        })),
      });
    }

    return tx.resume.findUnique({
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
