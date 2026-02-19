"use client";

import { useState, useCallback, useEffect } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { ProfessionalTemplate } from "./templates/ProfessionalTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { ZoomIn, ZoomOut, Maximize2, Minimize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ResumeFormState } from "@/store/resumeStore";

const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  executive: ExecutiveTemplate,
  creative: CreativeTemplate,
} as const;

const ZOOM_STEPS = [0.5, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0];
const DEFAULT_ZOOM_INDEX = ZOOM_STEPS.length - 1;

export function ResumePreview() {
  const formState = useResumeStore((s) => s.formState);
  const Template = TEMPLATE_COMPONENTS[formState.template] ?? ModernTemplate;
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const zoom = ZOOM_STEPS[zoomIndex];

  const handleZoomIn = () => {
    setZoomIndex((prev) => Math.min(prev + 1, ZOOM_STEPS.length - 1));
  };
  const handleZoomOut = () => {
    setZoomIndex((prev) => Math.max(prev - 1, 0));
  };
  const handleResetZoom = () => {
    setZoomIndex(DEFAULT_ZOOM_INDEX);
  };

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    },
    [isFullscreen],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  // Zoom controls shared between normal and fullscreen modes
  const zoomControls = (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleZoomOut}
        disabled={zoomIndex === 0}
        aria-label="Zoom out"
      >
        <ZoomOut className="h-3.5 w-3.5" />
      </Button>
      <button
        onClick={handleResetZoom}
        className="min-w-12 rounded px-1.5 py-0.5 text-center text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
        aria-label="Reset zoom"
      >
        {Math.round(zoom * 100)}%
      </button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleZoomIn}
        disabled={zoomIndex === ZOOM_STEPS.length - 1}
        aria-label="Zoom in"
      >
        <ZoomIn className="h-3.5 w-3.5" />
      </Button>
    </div>
  );

  // Resume page content
  const resumePage = (
    <div
      className="mx-auto origin-top"
      style={{
        width: `${794 * zoom}px`,
        height: `${1123 * zoom}px`,
      }}
    >
      <div
        className="bg-white shadow-lg ring-1 ring-black/5"
        style={{
          width: "794px",
          minHeight: "1123px",
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
        }}
        id="resume-preview"
        role="document"
        aria-label="Resume preview"
      >
        <Template data={formState} />
      </div>
    </div>
  );

  // Fullscreen overlay
  if (isFullscreen) {
    return (
      <>
        {/* Placeholder in the normal flow so the layout doesn't collapse */}
        <div className="flex h-full flex-col items-center justify-center bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Preview is in fullscreen mode
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => setIsFullscreen(false)}
          >
            Exit Fullscreen
          </Button>
        </div>

        {/* Fullscreen overlay */}
        <div className="fixed inset-0 z-50 flex flex-col bg-background">
          {/* Fullscreen toolbar */}
          <div className="flex shrink-0 items-center justify-between border-b px-4 py-2">
            <h3 className="text-sm font-semibold">Live Preview</h3>
            <div className="flex items-center gap-1">
              {zoomControls}
              <div className="ml-1 h-4 w-px bg-border" />
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-7 w-7"
                onClick={() => setIsFullscreen(false)}
                aria-label="Exit fullscreen"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Page indicator */}
          <div className="shrink-0 px-4 py-1.5">
            <span className="text-xs text-muted-foreground">Page 1</span>
          </div>

          {/* Scrollable fullscreen preview */}
          <div className="flex-1 overflow-auto bg-muted/30 px-4 pb-8">
            {resumePage}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Preview toolbar */}
      <div className="flex shrink-0 items-center justify-between border-b bg-background px-4 py-2">
        <h3 className="text-sm font-semibold">Live Preview</h3>
        <div className="flex items-center gap-1">
          {zoomControls}
          <div className="ml-1 h-4 w-px bg-border" />
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 h-7 w-7"
            onClick={() => setIsFullscreen(true)}
            aria-label="Fullscreen preview"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Page indicator */}
      <div className="shrink-0 px-4 py-1.5">
        <span className="text-xs text-muted-foreground">Page 1</span>
      </div>

      {/* Scrollable preview area */}
      <div className="flex-1 overflow-auto px-4 pb-8">{resumePage}</div>
    </div>
  );
}

// Shared type for template components
export type TemplateProps = {
  data: ResumeFormState;
};
