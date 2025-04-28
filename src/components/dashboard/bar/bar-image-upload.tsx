"use client";

import { updateBarImageAction } from "@/actions/bar";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/storage/image-upload";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

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
  const [isUploading, setIsUploading] = useState(false);

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
            setIsUploading(true);
            const path = `bars/${barId}/${type}.${extension}`;
            try {
              const { data: uploadData, error: uploadError } =
                await uploadImage({
                  bucket: type === "logo" ? "logos" : "covers",
                  file,
                  path,
                });

              if (uploadError || !uploadData) {
                throw new Error(
                  uploadError?.message || "Failed to upload image"
                );
              }

              const result = await updateBarImageAction({
                barId,
                type,
                path: uploadData.fullPath,
              });

              if (!result.success) {
                throw new Error(result.error || `Failed to update bar ${type}`);
              }

              toast.success(
                `${type === "logo" ? "Logo" : "Cover image"} updated successfully.`
              );
            } catch (error) {
              console.error(`Failed to update bar ${type}:`, error);
              toast.error(
                error instanceof Error
                  ? error.message
                  : `Failed to update ${type}`
              );
            } finally {
              setIsUploading(false);
            }
          }
        }}
      />
      <Button
        variant="secondary"
        className={cn(
          "absolute top-0 right-0 size-8 rounded-full border-0",
          className
        )}
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
      >
        <Pencil className="size-4" />
      </Button>
    </>
  );
}
