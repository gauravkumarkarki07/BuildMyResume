"use client";

import { useResumeStore } from "@/store/resumeStore";
import { RepeaterField } from "../shared/RepeaterField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Certification } from "@/types";

export function CertificationsSection() {
  const items = useResumeStore((s) => s.formState.certifications);
  const add = useResumeStore((s) => s.addCertification);
  const update = useResumeStore((s) => s.updateCertification);
  const remove = useResumeStore((s) => s.removeCertification);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Certifications</h2>
      <RepeaterField
        items={items}
        onAdd={add}
        onRemove={remove}
        addLabel="Add Certification"
        renderItem={(item: Certification) => (
          <div className="space-y-3 pr-8">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Certification Name</Label>
                <Input value={item.name} onChange={(e) => update(item.id, { name: e.target.value })} placeholder="AWS Solutions Architect" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Issuer</Label>
                <Input value={item.issuer} onChange={(e) => update(item.id, { issuer: e.target.value })} placeholder="Amazon Web Services" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Issue Date</Label>
                <Input type="month" value={item.issueDate} onChange={(e) => update(item.id, { issueDate: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Expiry Date</Label>
                <Input type="month" value={item.expiryDate ?? ""} onChange={(e) => update(item.id, { expiryDate: e.target.value || null })} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Certificate URL</Label>
              <Input value={item.certificateUrl ?? ""} onChange={(e) => update(item.id, { certificateUrl: e.target.value || null })} placeholder="https://..." />
            </div>
          </div>
        )}
      />
    </div>
  );
}
