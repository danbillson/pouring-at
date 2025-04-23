"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Beer } from "@/db/schema";
import { EditBeerForm } from "./edit-beer-form";

interface EditBeerDrawerProps {
  beer: Beer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBeerDrawer({
  beer,
  open,
  onOpenChange,
}: EditBeerDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Beer</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <EditBeerForm beer={beer} onSuccess={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
