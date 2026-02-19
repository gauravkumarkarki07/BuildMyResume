import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUserInDb } from "@/lib/auth";

// PATCH /api/resumes/[resumeId]/share — toggle public sharing
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  const { resumeId } = await params;
  const user = await ensureUserInDb();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resume = await db.resume.findUnique({
    where: { id: resumeId },
  });

  if (!resume || resume.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const isPublic = Boolean(body.isPublic);

  const updated = await db.resume.update({
    where: { id: resumeId },
    data: { isPublic },
    select: { slug: true, isPublic: true },
  });

  return NextResponse.json(updated);
}
