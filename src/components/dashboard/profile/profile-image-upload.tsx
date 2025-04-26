"use client";

import { Button } from "@/components/ui/button";
import { updateUser } from "@/lib/auth/auth-client";
import { uploadImage } from "@/lib/storage/image-upload";
import { Pencil } from "lucide-react";
import { useRef } from "react";

type ProfileImageUploadProps = {
  userId: string;
};

export function ProfileImageUpload({ userId }: ProfileImageUploadProps) {
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
          const extension = file?.type.split("/")[1];
          if (file && extension) {
            const path = `users/${userId}/avatar.${extension}`;
            const { data, error } = await uploadImage({
              bucket: "avatars",
              file,
              path,
            });

            if (error) {
              console.error(error);
              return;
            }

            await updateUser({
              image: data.fullPath,
            });
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
