"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Beer</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <EditBeerForm beer={beer} onSuccess={() => onOpenChange(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
