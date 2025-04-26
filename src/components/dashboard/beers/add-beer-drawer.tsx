"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddBeerForm } from "./add-beer-form";

interface AddBeerDrawerProps {
  breweryId: string;
}

export function AddBeerDrawer({ breweryId }: AddBeerDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button size="sm" className="w-min">
          <Plus className="mr-2 size-4" />
          New Beer
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add New Beer</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <AddBeerForm breweryId={breweryId} onSuccess={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
