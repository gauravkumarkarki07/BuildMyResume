import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureUserInDb } from "@/lib/auth";

// POST /api/resumes/[resumeId]/export — generate PDF
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
  });

  if (!resume || resume.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // TODO: Implement PDF generation with Puppeteer
  return NextResponse.json(
    { error: "PDF export not yet implemented" },
    { status: 501 }
  );
}
