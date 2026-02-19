import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateResumePdf } from "@/lib/pdf";

// GET /api/resumes/[resumeId]/export — generate and download PDF
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  const { resumeId } = await params;

  const resume = await db.resume.findUnique({
    where: { id: resumeId },
    select: { id: true, title: true },
  });

  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const pdfUrl = `${appUrl}/r/${resume.id}?pdf=1`;

  try {
    const pdfBuffer = await generateResumePdf(pdfUrl);

    const safeTitle = resume.title.replace(/[^a-zA-Z0-9 _-]/g, "").trim() || "resume";

    return new Response(pdfBuffer.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeTitle}.pdf"`,
        "Content-Length": String(pdfBuffer.byteLength),
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF. Please try again." },
      { status: 500 }
    );
  }
}
