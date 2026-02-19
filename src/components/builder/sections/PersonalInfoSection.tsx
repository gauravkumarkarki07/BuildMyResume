"use client";

import { useId } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PersonalInfoSection() {
  const personalInfo = useResumeStore((s) => s.formState.personalInfo);
  const update = useResumeStore((s) => s.updatePersonalInfo);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter your basic contact information and professional summary.
      </p>
      <div className="space-y-3">
        {/* Full Name — full width */}
        <Field label="Full Name" value={personalInfo.fullName} onChange={(v) => update({ fullName: v })} placeholder="John Doe" />

        {/* Email & Phone — 2-column */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email" value={personalInfo.email} onChange={(v) => update({ email: v })} placeholder="john@example.com" type="email" />
          <Field label="Phone" value={personalInfo.phone} onChange={(v) => update({ phone: v })} placeholder="(555) 123-4567" type="tel" />
        </div>

        {/* Location — full width */}
        <Field label="Address" value={personalInfo.location} onChange={(v) => update({ location: v })} placeholder="San Francisco, CA" />

        {/* LinkedIn & Website — 2-column */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="LinkedIn (Optional)" value={personalInfo.linkedin ?? ""} onChange={(v) => update({ linkedin: v || null })} placeholder="linkedin.com/in/johndoe" type="url" />
          <Field label="Website (Optional)" value={personalInfo.website ?? ""} onChange={(v) => update({ website: v || null })} placeholder="johndoe.com" type="url" />
        </div>

        {/* GitHub — full width */}
        <Field label="GitHub (Optional)" value={personalInfo.github ?? ""} onChange={(v) => update({ github: v || null })} placeholder="github.com/johndoe" type="url" />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const id = useId();
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
