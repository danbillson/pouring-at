"use client";

import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/image-upload";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useRef } from "react";

type BarLogoUploadProps = {
  barId: string;
};

export function BarLogoUpload({ barId }: BarLogoUploadProps) {
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
            const path = `bars/${barId}/logo.${extension}`;
            const { data, error } = await uploadImage({
              bucket: "logos",
              file,
              path,
            });

            if (error) {
              console.error(error);
              return;
            }

            const response = await fetch(`/api/bars/${barId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                logo: data.fullPath,
              }),
            });

            if (!response.ok) {
              console.error("Failed to update bar");
              return;
            }

            // Invalidate the bar query to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ["bars", barId] });
          }
        }}
      />
      <Button
        variant="outline"
        className="absolute top-0 right-0 size-8 rounded-full border-0"
        onClick={() => inputRef.current?.click()}
      >
        <Pencil className="size-4" />
      </Button>
    </>
  );
}
