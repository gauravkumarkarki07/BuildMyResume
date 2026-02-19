"use client";

import { useResumeStore } from "@/store/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PersonalInfoSection() {
  const personalInfo = useResumeStore((s) => s.formState.personalInfo);
  const update = useResumeStore((s) => s.updatePersonalInfo);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Personal Info</h2>
      <div className="space-y-3">
        <Field label="Full Name" value={personalInfo.fullName} onChange={(v) => update({ fullName: v })} placeholder="John Doe" />
        <Field label="Email" value={personalInfo.email} onChange={(v) => update({ email: v })} placeholder="john@example.com" type="email" />
        <Field label="Phone" value={personalInfo.phone} onChange={(v) => update({ phone: v })} placeholder="+1 555 000 0000" />
        <Field label="Location" value={personalInfo.location} onChange={(v) => update({ location: v })} placeholder="San Francisco, CA" />
        <Field label="LinkedIn" value={personalInfo.linkedin ?? ""} onChange={(v) => update({ linkedin: v || null })} placeholder="https://linkedin.com/in/..." />
        <Field label="GitHub" value={personalInfo.github ?? ""} onChange={(v) => update({ github: v || null })} placeholder="https://github.com/..." />
        <Field label="Website" value={personalInfo.website ?? ""} onChange={(v) => update({ website: v || null })} placeholder="https://..." />
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
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
