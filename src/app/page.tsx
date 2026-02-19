import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <span className="text-lg font-bold">BuildMyResume</span>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Build professional resumes in minutes
        </h1>
        <p className="mt-4 max-w-lg text-lg text-muted-foreground">
          Create, customize, and export beautiful resumes with our easy-to-use
          builder. Choose from multiple templates and download as PDF.
        </p>
        <div className="mt-8 flex gap-3">
          <Button size="lg" asChild>
            <Link href="/sign-up">Start Building</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
