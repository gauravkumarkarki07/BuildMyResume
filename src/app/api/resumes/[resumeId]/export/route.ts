import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUserInDb } from "@/lib/auth";

// POST /api/resumes/[resumeId]/export — generate PDF
// Currently uses client-side print-to-PDF. This endpoint exists as a
// placeholder for future server-side PDF generation via Puppeteer.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  const { resumeId } = await params;
  const user = await ensureUserInDb();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resume = await db.resume.findUnique({
    where: { id: resumeId },
    select: { id: true, userId: true, slug: true, isPublic: true },
  });

  if (!resume || resume.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // For now, return the public URL so the client can use print-to-PDF.
  // Server-side Puppeteer generation can be added here later.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return NextResponse.json({
    message: "Use client-side Export PDF button or print the public page.",
    publicUrl: resume.isPublic ? `${appUrl}/r/${resume.slug}` : null,
  });
}
