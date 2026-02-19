import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { icon: "h-6 w-6", text: "text-sm" },
  md: { icon: "h-7 w-7", text: "text-lg" },
  lg: { icon: "h-9 w-9", text: "text-2xl" },
};

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Document body */}
      <rect
        x="6"
        y="4"
        width="20"
        height="24"
        rx="3"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Text lines */}
      <rect
        x="10"
        y="14"
        width="12"
        height="1.5"
        rx="0.75"
        fill="white"
        opacity="0.7"
      />
      <rect
        x="10"
        y="18"
        width="9"
        height="1.5"
        rx="0.75"
        fill="white"
        opacity="0.5"
      />
      <rect
        x="10"
        y="22"
        width="10"
        height="1.5"
        rx="0.75"
        fill="white"
        opacity="0.5"
      />
      {/* Upward arrow at top */}
      <path
        d="M16 5L21 10L18.5 10L18.5 13L13.5 13L13.5 10L11 10Z"
        fill="white"
        opacity="0.95"
      />
    </svg>
  );
}

export function Logo({ className, iconOnly = false, size = "md" }: LogoProps) {
  const s = sizes[size];

  return (
    <span
      className={cn(
        "flex items-center gap-2 font-bold tracking-tight",
        className
      )}
    >
      <LogoIcon className={cn(s.icon, "text-primary")} />
      {!iconOnly && (
        <span className={s.text}>
          Build<span className="text-primary">My</span>Resume
        </span>
      )}
    </span>
  );
}
