"use client";

import { useState, type KeyboardEvent } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export function SkillsSection() {
  const skills = useResumeStore((s) => s.formState.skills);
  const addSkill = useResumeStore((s) => s.addSkill);
  const removeSkill = useResumeStore((s) => s.removeSkill);
  const [inputValue, setInputValue] = useState("");

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      addSkill(inputValue.trim());
      setInputValue("");
    }
    if (e.key === "Backspace" && !inputValue && skills.length > 0) {
      removeSkill(skills[skills.length - 1].id);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Skills</h2>
      <div className="flex min-h-[40px] flex-wrap gap-2 rounded-md border p-2 focus-within:ring-2 focus-within:ring-ring">
        {skills.map((skill) => (
          <Badge key={skill.id} variant="secondary" className="gap-1">
            {skill.name}
            <button
              onClick={() => removeSkill(skill.id)}
              className="rounded-sm hover:text-destructive focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label={`Remove ${skill.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill…"
          aria-label="Add skill"
          className="h-auto min-w-[100px] flex-1 border-none p-0 shadow-none focus-visible:ring-0"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Press Enter or comma to add a skill, Backspace to remove the last one
      </p>
    </div>
  );
}
