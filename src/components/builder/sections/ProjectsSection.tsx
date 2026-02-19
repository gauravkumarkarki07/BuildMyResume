"use client";

import { useState, type KeyboardEvent } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { RepeaterField } from "../shared/RepeaterField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { Project } from "@/types";

export function ProjectsSection() {
  const items = useResumeStore((s) => s.formState.projects);
  const add = useResumeStore((s) => s.addProject);
  const update = useResumeStore((s) => s.updateProject);
  const remove = useResumeStore((s) => s.removeProject);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Projects</h2>
      <RepeaterField
        items={items}
        onAdd={add}
        onRemove={remove}
        addLabel="Add Project"
        renderItem={(item: Project) => (
          <div className="space-y-3 pr-8">
            <div className="space-y-1">
              <Label className="text-xs">Project Name</Label>
              <Input value={item.name} onChange={(e) => update(item.id, { name: e.target.value })} placeholder="My Awesome Project" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Textarea value={item.description} onChange={(e) => update(item.id, { description: e.target.value })} placeholder="What does this project do?" rows={3} />
            </div>
            <TechInput projectId={item.id} technologies={item.technologies} />
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Live URL</Label>
                <Input value={item.url ?? ""} onChange={(e) => update(item.id, { url: e.target.value || null })} placeholder="https://..." />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">GitHub URL</Label>
                <Input value={item.githubUrl ?? ""} onChange={(e) => update(item.id, { githubUrl: e.target.value || null })} placeholder="https://github.com/..." />
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}

function TechInput({ projectId, technologies }: { projectId: string; technologies: string[] }) {
  const update = useResumeStore((s) => s.updateProject);
  const [input, setInput] = useState("");

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      if (!technologies.includes(input.trim())) {
        update(projectId, { technologies: [...technologies, input.trim()] });
      }
      setInput("");
    }
  }

  function removeTech(tech: string) {
    update(projectId, { technologies: technologies.filter((t) => t !== tech) });
  }

  return (
    <div className="space-y-1">
      <Label className="text-xs">Technologies</Label>
      <div className="flex flex-wrap gap-1">
        {technologies.map((tech) => (
          <Badge key={tech} variant="outline" className="gap-1 text-xs">
            {tech}
            <button onClick={() => removeTech(tech)}>
              <X className="h-2.5 w-2.5" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add technology..."
        className="mt-1"
      />
    </div>
  );
}
