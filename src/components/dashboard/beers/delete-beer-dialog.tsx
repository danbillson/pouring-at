"use client";

import { deleteBeerAction } from "@/actions/beer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Beer } from "@/db/schema";
import { useTransition } from "react";
import { toast } from "sonner";

interface DeleteBeerDialogProps {
  beer: Beer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteBeerDialog({
  beer,
  open,
  onOpenChange,
}: DeleteBeerDialogProps) {
  const [isPending, startTransition] = useTransition();

  async function onDelete() {
    startTransition(async () => {
      const result = await deleteBeerAction(beer.id);

      if (result.success) {
        toast.success("Beer deleted successfully");
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to delete beer");
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {beer.name}. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={isPending}>
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
