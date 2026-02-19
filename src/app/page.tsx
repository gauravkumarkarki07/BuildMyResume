import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import {
  FileText,
  Palette,
  Download,
  Share2,
  Sparkles,
  Shield,
} from "lucide-react";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo size="md" />
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-brand-50 via-background to-background" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,oklch(0.78_0.11_281/0.15),transparent)]" />

        <div className="mx-auto max-w-6xl px-4 pb-20 pt-24 text-center sm:pb-28 sm:pt-32">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            Free &amp; Open Source Resume Builder
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Build a resume that
            <span className="bg-linear-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              {" "}
              gets you hired
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Create polished, ATS-friendly resumes in minutes. Choose a template,
            fill in your details, and export to PDF. It&apos;s that simple.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link href="/sign-up">Start Building — It&apos;s Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base"
              asChild
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>

          {/* Preview mockup */}
          <div className="relative mx-auto mt-16 max-w-4xl">
            <div className="overflow-hidden rounded-xl border bg-card shadow-2xl shadow-brand-500/10">
              <div className="flex h-10 items-center gap-2 border-b bg-muted/50 px-4">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-muted-foreground">
                  buildmyresume.app/builder
                </span>
              </div>
              <div className="grid grid-cols-[200px_1fr] divide-x">
                <div className="space-y-2 p-4">
                  {[
                    "Personal Info",
                    "Summary",
                    "Experience",
                    "Education",
                    "Skills",
                    "Projects",
                  ].map((item, i) => (
                    <div
                      key={item}
                      className={`rounded-md px-3 py-2 text-xs ${
                        i === 0
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center p-8">
                  <div className="h-64 w-full max-w-sm rounded-lg border bg-white shadow-sm">
                    <div className="border-b border-brand-200 p-4">
                      <div className="h-4 w-32 rounded bg-brand-600" />
                      <div className="mt-2 flex gap-2">
                        <div className="h-2 w-16 rounded bg-muted" />
                        <div className="h-2 w-20 rounded bg-muted" />
                        <div className="h-2 w-14 rounded bg-muted" />
                      </div>
                    </div>
                    <div className="space-y-3 p-4">
                      <div className="space-y-1">
                        <div className="h-2 w-full rounded bg-muted" />
                        <div className="h-2 w-3/4 rounded bg-muted" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-2.5 w-24 rounded bg-brand-100" />
                        <div className="h-2 w-full rounded bg-muted" />
                        <div className="h-2 w-5/6 rounded bg-muted" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-2.5 w-20 rounded bg-brand-100" />
                        <div className="h-2 w-full rounded bg-muted" />
                        <div className="h-2 w-2/3 rounded bg-muted" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything you need to land the job
            </h2>
            <p className="mt-3 text-muted-foreground">
              A full toolkit for creating professional resumes, fast.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={FileText}
              title="Smart Builder"
              description="Intuitive form-based editor with live preview. Fill in sections and see your resume take shape in real time."
            />
            <FeatureCard
              icon={Palette}
              title="Multiple Templates"
              description="Choose from Modern, Classic, and Minimal templates. Switch between them instantly to find your style."
            />
            <FeatureCard
              icon={Download}
              title="PDF Export"
              description="Download your resume as a clean, print-ready PDF. Formatted perfectly for A4 paper."
            />
            <FeatureCard
              icon={Share2}
              title="Shareable Link"
              description="Generate a public link to your resume. Share it with recruiters or add it to your portfolio."
            />
            <FeatureCard
              icon={Sparkles}
              title="Auto-Save"
              description="Never lose your work. Changes are automatically saved as you type with visual status indicators."
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Private"
              description="Your data is protected with Clerk authentication. Resumes are private by default."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 px-8 py-14 text-white shadow-xl shadow-brand-600/20">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to build your resume?
            </h2>
            <p className="mt-3 text-brand-100">
              Join thousands of job seekers who landed interviews with resumes
              built here.
            </p>
            <Button
              size="lg"
              className="mt-8 h-12 bg-white px-8 text-base font-semibold text-brand-700 hover:bg-brand-50"
              asChild
            >
              <Link href="/sign-up">Get Started for Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
          <Logo size="sm" />
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BuildMyResume. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md">
      <div className="mb-4 inline-flex rounded-lg bg-brand-50 p-2.5">
        <Icon className="h-5 w-5 text-brand-600" />
      </div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
