"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
import { Pencil, Trash2, FileText } from "lucide-react";
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
    <Card className="group overflow-hidden border-l-4 border-l-primary/60 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="mt-0.5 shrink-0 rounded-lg bg-muted p-2">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold">{resume.title}</h3>
              {resume.personalInfo?.fullName && (
                <p className="truncate text-sm text-muted-foreground">
                  {resume.personalInfo.fullName}
                </p>
              )}
            </div>
          </div>
          <Badge variant="secondary" className="ml-2 shrink-0 capitalize">
            {resume.template}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-xs text-muted-foreground">
          Updated{" "}
          {formatDistanceToNow(new Date(resume.updatedAt), {
            addSuffix: true,
          })}
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          variant="default"
          size="sm"
          className="flex-1 hover:cursor-pointer"
          onClick={() => router.push(`/builder/${resume.id}`)}
        >
          <Pencil className="mr-1.5 h-3 w-3" />
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isDeleting}
              aria-label="Delete resume"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive hover:cursor-pointer"
            >
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
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
