import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUserInDb } from "@/lib/auth";

// GET /api/resumes — list current user's resumes
export async function GET() {
  const user = await ensureUserInDb();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resumes = await db.resume.findMany({
    where: { userId: user.id },
    include: { personalInfo: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(resumes);
}

// POST /api/resumes — create a new empty resume
export async function POST(req: Request) {
  const user = await ensureUserInDb();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));

  const resume = await db.resume.create({
    data: {
      userId: user.id,
      title: body.title ?? "Untitled Resume",
      template: body.template ?? "modern",
    },
  });

  return NextResponse.json(resume, { status: 201 });
}
