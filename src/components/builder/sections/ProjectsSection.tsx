"use client";

import { useResumeStore } from "@/store/resumeStore";
import { RepeaterField } from "../shared/RepeaterField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Start Date</Label>
                <Input type="month" value={item.startDate ?? ""} onChange={(e) => update(item.id, { startDate: e.target.value || null })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">End Date</Label>
                <Input type="month" value={item.endDate ?? ""} onChange={(e) => update(item.id, { endDate: e.target.value || null })} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">URL</Label>
              <Input value={item.url ?? ""} onChange={(e) => update(item.id, { url: e.target.value || null })} placeholder="https://..." />
            </div>
          </div>
        )}
      />
    </div>
  );
}
