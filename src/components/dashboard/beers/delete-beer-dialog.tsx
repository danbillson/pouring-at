"use client";

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
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  async function onDelete() {
    try {
      const response = await fetch(`/api/beers/${beer.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete beer");
      }

      await queryClient.invalidateQueries({ queryKey: ["beers"] });
      toast.success("Beer deleted successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete beer:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete beer"
      );
    }
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
