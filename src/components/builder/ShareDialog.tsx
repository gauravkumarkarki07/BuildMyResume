"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ShareDialogProps {
  resumeId: string;
  slug: string;
  isPublic: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDialog({
  resumeId,
  slug,
  isPublic: initialIsPublic,
  open,
  onOpenChange,
}: ShareDialogProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isToggling, setIsToggling] = useState(false);
  const [copied, setCopied] = useState(false);

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/r/${slug}`
      : `/r/${slug}`;

  const handleToggle = useCallback(
    async (checked: boolean) => {
      setIsToggling(true);
      try {
        const res = await fetch(`/api/resumes/${resumeId}/share`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPublic: checked }),
        });
        if (res.ok) {
          setIsPublic(checked);
          toast.success(
            checked
              ? "Resume is now public"
              : "Resume is now private"
          );
        } else {
          toast.error("Failed to update sharing settings");
        }
      } catch {
        toast.error("Failed to update sharing settings");
      } finally {
        setIsToggling(false);
      }
    },
    [resumeId]
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  }, [publicUrl]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Resume</DialogTitle>
          <DialogDescription>
            Make your resume publicly accessible via a shareable link.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Public toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-toggle" className="font-medium">
                Public link
              </Label>
              <p className="text-sm text-muted-foreground">
                Anyone with the link can view your resume
              </p>
            </div>
            <Switch
              id="public-toggle"
              checked={isPublic}
              onCheckedChange={handleToggle}
              disabled={isToggling}
            />
          </div>

          {/* Link display */}
          {isPublic && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Shareable link</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={publicUrl}
                  className="text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  asChild
                >
                  <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
