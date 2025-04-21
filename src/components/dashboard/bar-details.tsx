"use client";

import { BarDetailsForm } from "@/components/dashboard/bar-details-form";
import { BarImageUpload } from "@/components/dashboard/bar-image-upload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Bar } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL!;

type BarDetailsProps = {
  bar: Bar;
};

export default function BarDetails({ bar: initialBar }: BarDetailsProps) {
  const {
    data: { bar },
  } = useQuery({
    queryKey: ["bars", initialBar.id],
    queryFn: () =>
      fetch(`/api/bars/${initialBar.id}`).then((res) => res.json()),
    initialData: { bar: initialBar },
  });

  return (
    <div className="grid gap-8">
      <div>
        <p className="text-muted-foreground mb-4 text-sm">Cover Image</p>
        <div className="bg-muted relative aspect-[21/9] w-full rounded-lg">
          {bar.coverImage ? (
            <Image
              src={`${storageUrl}/${bar.coverImage}`}
              alt={`${bar.name} cover`}
              className="h-full w-full rounded-lg object-cover"
              fill
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground text-sm">No cover image</p>
            </div>
          )}
          <BarImageUpload
            barId={bar.id}
            type="cover"
            className="top-[unset] -right-2 -bottom-2 size-12"
          />
        </div>
      </div>

      <div>
        <p className="text-muted-foreground mb-4 text-sm">Logo</p>
        <div className="relative w-fit">
          <Avatar className="size-24">
            <AvatarImage src={`${storageUrl}/${bar.logo}`} />
            <AvatarFallback className="bg-foreground text-background text-2xl uppercase">
              {bar.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <BarImageUpload barId={bar.id} type="logo" />
        </div>
      </div>

      <Separator />

      <BarDetailsForm bar={bar} />
    </div>
  );
}
