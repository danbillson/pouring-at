"use client";

import { cn } from "@/lib/utils/utils";
import Image from "next/image";

const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL!;

type BarCoverProps = {
  name: string;
  path?: string | null;
  className?: string;
};

export function BarCover({ name, path, className }: BarCoverProps) {
  if (!path) return null;

  return (
    <div className={cn("relative aspect-[21/9] w-full", className)}>
      <Image
        src={`${storageUrl}/${path}`}
        alt={`${name} cover`}
        className="h-full w-full object-cover"
        fill
      />
    </div>
  );
}
