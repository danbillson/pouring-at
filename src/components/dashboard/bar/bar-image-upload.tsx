"use client";

import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/storage/image-upload";
import { cn } from "@/lib/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useRef } from "react";

type BarImageUploadProps = {
  barId: string;
  type: "logo" | "cover";
  className?: string;
};

export function BarImageUpload({
  barId,
  type,
  className,
}: BarImageUploadProps) {
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
            const path = `bars/${barId}/${type}.${extension}`;
            const { data, error } = await uploadImage({
              bucket: type === "logo" ? "logos" : "covers",
              file,
              path,
            });

            if (error) {
              console.error(error);
              return;
            }

            const body =
              type === "logo"
                ? { logo: data.fullPath }
                : { coverImage: data.fullPath };

            const response = await fetch(`/api/bars/${barId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
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
        className={cn(
          "absolute top-0 right-0 size-8 rounded-full border-0",
          className
        )}
        onClick={() => inputRef.current?.click()}
      >
        <Pencil className="size-4" />
      </Button>
    </>
  );
}
