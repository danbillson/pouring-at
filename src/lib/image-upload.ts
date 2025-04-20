import { supabase } from "@/lib/supabase";

type UploadImageOptions = {
  bucket: string;
  file: File;
  path: string;
};

export async function uploadImage({ bucket, file, path }: UploadImageOptions) {
  return supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
  });
}
