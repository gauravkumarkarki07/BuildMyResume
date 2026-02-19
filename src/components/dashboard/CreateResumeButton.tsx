"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function CreateResumeButton() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreate() {
    setIsCreating(true);
    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled Resume" }),
      });
      if (res.ok) {
        const resume = await res.json();
        router.push(`/builder/${resume.id}`);
      }
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Button onClick={handleCreate} disabled={isCreating}>
      <Plus className="mr-2 h-4 w-4" />
      {isCreating ? "Creating..." : "New Resume"}
    </Button>
  );
}
