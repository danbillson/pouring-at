import { Beer } from "@/db/schema";
import { BeerIcon } from "lucide-react";
import Image from "next/image";

type BeerDetailProps = {
  beer: Beer;
  brewery: string;
};

const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL!;

export function BeerDetail({ beer, brewery }: BeerDetailProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-muted flex size-10 items-center justify-center overflow-hidden rounded-md">
        {beer.image ? (
          <Image
            src={`${storageUrl}/${beer.image}`}
            alt={beer.name}
            width={40}
            height={40}
          />
        ) : (
          <BeerIcon className="size-4" />
        )}
      </div>

      <div className="flex flex-col">
        <h3 className="font-medium">
          {beer.name}{" "}
          <span className="text-muted-foreground">{beer.style}</span>
        </h3>
        <div className="text-muted-foreground text-sm">
          <p>
            {brewery}
            {beer.abv && ` • ${beer.abv}%`}
          </p>
        </div>
      </div>
    </div>
  );
}
