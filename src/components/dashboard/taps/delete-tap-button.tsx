"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { beer, brewery, tap } from "@/db/schema";
import { removeTap } from "@/lib/taps";
import { InferSelectModel } from "drizzle-orm";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type TapWithRelations = InferSelectModel<typeof tap> & {
  beer: InferSelectModel<typeof beer> & {
    brewery: InferSelectModel<typeof brewery>;
  };
};

type DeleteTapButtonProps = {
  tap: TapWithRelations;
};

export function DeleteTapButton({ tap }: DeleteTapButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      const result = await removeTap(tap.id);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Beer removed from tap list");
      setIsOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to remove beer from tap list"
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Remove {tap.beer.name}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Beer from Tap List</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove {tap.beer.name} by{" "}
            {tap.beer.brewery.name} from your tap list? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Removing..." : "Remove Beer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
