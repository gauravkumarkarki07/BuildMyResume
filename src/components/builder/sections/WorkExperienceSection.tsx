"use client";

import { useResumeStore } from "@/store/resumeStore";
import { RepeaterField } from "../shared/RepeaterField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { WorkExperience } from "@/types";

export function WorkExperienceSection() {
  const items = useResumeStore((s) => s.formState.workExperiences);
  const add = useResumeStore((s) => s.addWorkExperience);
  const update = useResumeStore((s) => s.updateWorkExperience);
  const remove = useResumeStore((s) => s.removeWorkExperience);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Work Experience</h2>
      <RepeaterField
        items={items}
        onAdd={add}
        onRemove={remove}
        addLabel="Add Experience"
        renderItem={(item: WorkExperience) => (
          <div className="space-y-3 pr-8">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor={`${item.id}-company`} className="text-xs">Company</Label>
                <Input id={`${item.id}-company`} value={item.company} onChange={(e) => update(item.id, { company: e.target.value })} placeholder="Company" />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${item.id}-title`} className="text-xs">Title</Label>
                <Input id={`${item.id}-title`} value={item.title} onChange={(e) => update(item.id, { title: e.target.value })} placeholder="Job Title" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor={`${item.id}-location`} className="text-xs">Location</Label>
              <Input id={`${item.id}-location`} value={item.location ?? ""} onChange={(e) => update(item.id, { location: e.target.value })} placeholder="City, State" />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor={`${item.id}-start`} className="text-xs">Start Date</Label>
                <Input id={`${item.id}-start`} type="month" value={item.startDate} onChange={(e) => update(item.id, { startDate: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${item.id}-end`} className="text-xs">End Date</Label>
                <Input id={`${item.id}-end`} type="month" value={item.endDate ?? ""} onChange={(e) => update(item.id, { endDate: e.target.value || null })} disabled={item.current} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={item.current}
                onChange={(e) => update(item.id, { current: e.target.checked, endDate: e.target.checked ? null : item.endDate })}
                className="rounded border-input"
              />
              Currently working here
            </label>
            <div className="space-y-1">
              <Label htmlFor={`${item.id}-desc`} className="text-xs">Description</Label>
              <Textarea id={`${item.id}-desc`} value={item.description} onChange={(e) => update(item.id, { description: e.target.value })} placeholder="Describe your responsibilities..." rows={3} />
            </div>
          </div>
        )}
      />
    </div>
  );
}
