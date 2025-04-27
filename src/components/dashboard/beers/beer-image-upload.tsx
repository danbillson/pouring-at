"use client";

import { updateBeerAction } from "@/actions/beer";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/storage/image-upload";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

interface BeerImageUploadProps {
  beerId: string;
  className?: string;
}

export function BeerImageUpload({ beerId, className }: BeerImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          const extension = file.type.split("/")[1];
          if (!extension) {
            toast.error("Invalid image file type.");
            return;
          }

          const path = `beers/${beerId}/logo-${Date.now()}.${extension}`;
          const { data: uploadData, error: uploadError } = await uploadImage({
            bucket: "logos",
            file,
            path,
          });

          if (uploadError || !uploadData?.fullPath) {
            console.error("Image upload failed:", uploadError);
            toast.error("Failed to upload image.");
            return;
          }

          const updateResult = await updateBeerAction(beerId, {
            image: uploadData.fullPath,
          });

          if (!updateResult.success) {
            console.error(
              "Failed to update beer with image path:",
              updateResult.error
            );
            toast.error(
              updateResult.error || "Failed to save image path to beer."
            );
          } else {
            toast.success("Beer image updated.");
          }
        }}
      />
      <Button
        type="button"
        variant="outline"
        className={cn(
          "absolute right-2 bottom-2 size-8 rounded-full border-0",
          className
        )}
        onClick={() => inputRef.current?.click()}
      >
        <Pencil className="size-4" />
      </Button>
    </>
  );
}
