import { supabase } from "@/lib/storage/supabase";

type UploadImageOptions = {
  bucket: string;
  file: File;
  path: string;
};

export async function uploadImage({ bucket, file, path }: UploadImageOptions) {
  return supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });
}
