"use client";

import { BreweryDetailsForm } from "@/components/dashboard/brewery-details-form";
import { BreweryImageUpload } from "@/components/dashboard/brewery-image-upload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Brewery } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";

const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL!;

type BreweryDetailsProps = {
  brewery: Brewery;
};

export default function BreweryDetails({
  brewery: initialBrewery,
}: BreweryDetailsProps) {
  const {
    data: { brewery },
  } = useQuery({
    queryKey: ["breweries", initialBrewery.id],
    queryFn: () =>
      fetch(`/api/breweries/${initialBrewery.id}`).then((res) => res.json()),
    initialData: { brewery: initialBrewery },
  });

  return (
    <div className="grid gap-8">
      <div>
        <p className="text-muted-foreground mb-4 text-sm">Cover Image</p>
        <div className="bg-muted relative aspect-[21/9] w-full rounded-lg">
          {brewery.coverImage ? (
            <img
              src={`${storageUrl}/${brewery.coverImage}`}
              alt={`${brewery.name} cover`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground text-sm">No cover image</p>
            </div>
          )}
          <BreweryImageUpload
            brewery={brewery}
            type="cover"
            className="top-[unset] -right-2 -bottom-2 size-12"
          />
        </div>
      </div>

      <div>
        <p className="text-muted-foreground mb-4 text-sm">Logo</p>
        <div className="relative w-fit">
          <Avatar className="size-24">
            <AvatarImage src={`${storageUrl}/${brewery.logo}`} />
            <AvatarFallback className="bg-foreground text-background text-2xl uppercase">
              {brewery.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <BreweryImageUpload brewery={brewery} type="logo" />
        </div>
      </div>

      <Separator />

      <BreweryDetailsForm brewery={brewery} />
    </div>
  );
}
