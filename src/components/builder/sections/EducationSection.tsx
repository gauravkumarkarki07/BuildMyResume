"use client";

import { useResumeStore } from "@/store/resumeStore";
import { RepeaterField } from "../shared/RepeaterField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Education } from "@/types";

export function EducationSection() {
  const items = useResumeStore((s) => s.formState.educations);
  const add = useResumeStore((s) => s.addEducation);
  const update = useResumeStore((s) => s.updateEducation);
  const remove = useResumeStore((s) => s.removeEducation);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Education</h2>
      <RepeaterField
        items={items}
        onAdd={add}
        onRemove={remove}
        addLabel="Add Education"
        renderItem={(item: Education) => (
          <div className="space-y-3 pr-8">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor={`${item.id}-institution`} className="text-xs">Institution</Label>
                <Input id={`${item.id}-institution`} value={item.institution} onChange={(e) => update(item.id, { institution: e.target.value })} placeholder="University" />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${item.id}-degree`} className="text-xs">Degree</Label>
                <Input id={`${item.id}-degree`} value={item.degree} onChange={(e) => update(item.id, { degree: e.target.value })} placeholder="B.S. Computer Science" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor={`${item.id}-field`} className="text-xs">Field of Study</Label>
                <Input id={`${item.id}-field`} value={item.fieldOfStudy ?? ""} onChange={(e) => update(item.id, { fieldOfStudy: e.target.value })} placeholder="Computer Science" />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${item.id}-gpa`} className="text-xs">GPA</Label>
                <Input id={`${item.id}-gpa`} value={item.gpa ?? ""} onChange={(e) => update(item.id, { gpa: e.target.value || null })} placeholder="3.8" />
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
              Currently studying here
            </label>
            <div className="space-y-1">
              <Label htmlFor={`${item.id}-desc`} className="text-xs">Description (optional)</Label>
              <Textarea id={`${item.id}-desc`} value={item.description ?? ""} onChange={(e) => update(item.id, { description: e.target.value || null })} placeholder="Relevant coursework, activities..." rows={2} />
            </div>
          </div>
        )}
      />
    </div>
  );
}
