import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ensureUserInDb } from "@/lib/auth";

export default async function NewResumePage() {
  const user = await ensureUserInDb();
  if (!user) redirect("/sign-in");

  const resume = await db.resume.create({
    data: {
      userId: user.id,
      title: "Untitled Resume",
    },
  });

  redirect(`/builder/${resume.id}`);
}
