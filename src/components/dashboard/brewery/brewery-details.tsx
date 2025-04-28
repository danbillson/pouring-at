import { BreweryDetailsForm } from "@/components/dashboard/brewery/brewery-details-form";
import { BreweryImageUpload } from "@/components/dashboard/brewery/brewery-image-upload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Brewery } from "@/db/schema";
import Image from "next/image";

const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL!;

type BreweryDetailsProps = {
  brewery: Brewery;
};

export function BreweryDetails({ brewery }: BreweryDetailsProps) {
  if (!brewery) {
    return <div>Brewery data not found.</div>;
  }
  return (
    <div className="grid gap-8">
      <div>
        <p className="text-muted-foreground mb-4 text-sm">Cover Image</p>
        <div className="bg-muted relative aspect-[21/9] w-full rounded-lg">
          {brewery.coverImage ? (
            <Image
              src={`${storageUrl}/${brewery.coverImage}`}
              alt={`${brewery.name} cover`}
              className="h-full w-full rounded-lg object-cover"
              fill
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground text-sm">No cover image</p>
            </div>
          )}
          <BreweryImageUpload
            breweryId={brewery.id}
            type="cover"
            className="top-[unset] right-2 bottom-2 size-12"
          />
        </div>
      </div>

      <div>
        <p className="text-muted-foreground mb-4 text-sm">Logo</p>
        <div className="relative w-fit">
          <Avatar className="size-24">
            <AvatarImage
              src={brewery.logo ? `${storageUrl}/${brewery.logo}` : undefined}
            />
            <AvatarFallback className="bg-foreground text-background text-2xl uppercase">
              {brewery.name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <BreweryImageUpload breweryId={brewery.id} type="logo" />
        </div>
      </div>

      <Separator />

      <BreweryDetailsForm brewery={brewery} />
    </div>
  );
}
