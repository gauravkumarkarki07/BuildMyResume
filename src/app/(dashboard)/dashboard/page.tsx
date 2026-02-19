import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ensureUserInDb } from "@/lib/auth";
import { ResumeGrid } from "@/components/dashboard/ResumeGrid";
import { CreateResumeButton } from "@/components/dashboard/CreateResumeButton";

export default async function DashboardPage() {
  const user = await ensureUserInDb();
  if (!user) redirect("/sign-in");

  const resumes = await db.resume.findMany({
    where: { userId: user.id },
    include: { personalInfo: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Resumes</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your resumes
          </p>
        </div>
        <CreateResumeButton />
      </div>
      <ResumeGrid resumes={resumes} />
    </div>
  );
}
