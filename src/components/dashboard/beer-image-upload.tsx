"use client";

import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/image-upload";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useRef } from "react";

interface BeerImageUploadProps {
  beerId: string;
  className?: string;
}

export function BeerImageUpload({ beerId, className }: BeerImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          const extension = file?.type.split("/")[1];
          if (file && extension) {
            const path = `beers/${beerId}/logo.${extension}`;
            const { data, error } = await uploadImage({
              bucket: "logos",
              file,
              path,
            });

            if (error) {
              console.error(error);
              return;
            }

            const response = await fetch(`/api/beers/${beerId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ image: data.fullPath }),
            });

            if (!response.ok) {
              console.error("Failed to update beer");
              return;
            }

            // Invalidate the beer query to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ["beers", beerId] });
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
