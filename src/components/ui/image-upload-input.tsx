"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ImageUploadInputProps {
  initialImageUrl?: string | null;
  altText: string;
  onFileSelect: (file: File | null) => void; // Pass null if deselected/cleared
  aspectRatio?: "square" | "video"; // Add more as needed
  className?: string;
}

export function ImageUploadInput({
  initialImageUrl,
  altText,
  onFileSelect,
  aspectRatio = "square",
  className,
}: ImageUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    initialImageUrl ?? undefined
  );

  // Update preview if initialImageUrl changes externally
  useEffect(() => {
    setPreviewUrl(initialImageUrl ?? undefined);
  }, [initialImageUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      onFileSelect(file);
    } else {
      // Handle case where user cancels file selection
      // Revert to initial image if available, otherwise clear
      setPreviewUrl(initialImageUrl ?? undefined);
      onFileSelect(null);
    }
    // Reset input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
  }[aspectRatio];

  return (
    <div
      className={cn(
        "bg-muted relative w-full rounded-lg",
        aspectRatioClass,
        className
      )}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
      />
      {previewUrl ? (
        <Image
          key={previewUrl} // Force re-render if URL changes
          src={previewUrl}
          alt={altText}
          fill
          className="rounded-lg object-cover"
          onError={() => {
            // Handle potential errors loading the preview (e.g., revoked object URL)
            console.warn(`Failed to load image preview: ${previewUrl}`);
            setPreviewUrl(initialImageUrl ?? undefined); // Revert to initial on error
          }}
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground text-sm">Click to add image</p>
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="absolute right-2 bottom-2 size-8 rounded-full border-0"
        onClick={() => inputRef.current?.click()}
        title="Change image"
      >
        <Pencil className="size-4" />
      </Button>
    </div>
  );
}
