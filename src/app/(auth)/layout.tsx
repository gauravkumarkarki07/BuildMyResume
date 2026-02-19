import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-brand-50 via-background to-background">
      <Link href="/" className="mb-8">
        <Logo size="lg" />
      </Link>
      {children}
    </div>
  );
}
