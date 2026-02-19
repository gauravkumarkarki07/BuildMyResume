import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function ensureUserInDb() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const user = await db.user.upsert({
    where: { clerkId: userId },
    update: {
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
    create: {
      clerkId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
  });

  return user;
}
