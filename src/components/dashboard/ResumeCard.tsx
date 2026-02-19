"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import type { Resume, PersonalInfo } from "@/types";

type ResumeWithPersonalInfo = Resume & { personalInfo: PersonalInfo | null };

export function ResumeCard({ resume }: { resume: ResumeWithPersonalInfo }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/resumes/${resume.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">{resume.title}</h3>
            {resume.personalInfo?.fullName && (
              <p className="truncate text-sm text-muted-foreground">
                {resume.personalInfo.fullName}
              </p>
            )}
          </div>
          <Badge variant="secondary" className="ml-2 capitalize">
            {resume.template}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-xs text-muted-foreground">
          Updated {formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true })}
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => router.push(`/builder/${resume.id}`)}
        >
          <Pencil className="mr-1 h-3 w-3" />
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={isDeleting}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete resume?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete &quot;{resume.title}&quot;. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
