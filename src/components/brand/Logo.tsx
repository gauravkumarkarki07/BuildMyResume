import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { icon: "h-4 w-4", text: "text-sm" },
  md: { icon: "h-5 w-5", text: "text-lg" },
  lg: { icon: "h-7 w-7", text: "text-2xl" },
};

export function Logo({ className, iconOnly = false, size = "md" }: LogoProps) {
  const s = sizes[size];

  return (
    <span className={cn("inline-flex items-center gap-2 font-bold tracking-tight", className)}>
      <span className="inline-flex items-center justify-center rounded-lg bg-primary p-1.5">
        <FileText className={cn(s.icon, "text-primary-foreground")} />
      </span>
      {!iconOnly && (
        <span className={s.text}>
          Build<span className="text-primary">My</span>Resume
        </span>
      )}
    </span>
  );
}
