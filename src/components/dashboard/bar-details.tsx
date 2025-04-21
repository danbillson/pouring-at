"use client";

import { BarLogoUpload } from "@/components/dashboard/bar-logo-upload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Bar } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";

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
        <div className="bg-muted relative aspect-[21/9] w-full overflow-hidden rounded-lg">
          {bar.coverImage ? (
            <img
              src={`${storageUrl}/${bar.coverImage}`}
              alt={`${bar.name} cover`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground text-sm">No cover image</p>
            </div>
          )}
          {/* TODO: Add BarCoverUpload component */}
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
          <BarLogoUpload barId={bar.id} />
        </div>
      </div>

      <Separator />

      <div className="grid gap-4">
        <div>
          <p className="text-muted-foreground text-sm">Name</p>
          <p>{bar.name}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Address</p>
          <p>
            {bar.addressLine1}
            {bar.addressLine2 && <>, {bar.addressLine2}</>}
            {bar.city && <>, {bar.city}</>}
            {bar.postcode && <>, {bar.postcode}</>}
          </p>
        </div>
        {bar.formattedAddress && (
          <div>
            <p className="text-muted-foreground text-sm">Formatted Address</p>
            <p>{bar.formattedAddress}</p>
          </div>
        )}
        <div>
          <p className="text-muted-foreground text-sm">Verification Status</p>
          <p>{bar.verified ? "Verified" : "Unverified"}</p>
        </div>
      </div>
    </div>
  );
}
