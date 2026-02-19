"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface RepeaterFieldProps<T extends { id: string }> {
  items: T[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  addLabel?: string;
  emptyMessage?: string;
}

export function RepeaterField<T extends { id: string }>({
  items,
  onAdd,
  onRemove,
  renderItem,
  addLabel = "Add Entry",
  emptyMessage = "No entries yet. Click below to add one.",
}: RepeaterFieldProps<T>) {
  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      )}
      {items.map((item, index) => (
        <Card key={item.id} className="group relative p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
          {renderItem(item, index)}
        </Card>
      ))}
      <Button variant="outline" className="w-full" onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" />
        {addLabel}
      </Button>
    </div>
  );
}
