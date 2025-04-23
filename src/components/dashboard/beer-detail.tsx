import { Beer } from "@/db/schema";
import { BeerIcon } from "lucide-react";

interface BeerDetailProps {
  beer: Beer;
  brewery: string;
}

export function BeerDetail({ beer, brewery }: BeerDetailProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-muted flex size-10 items-center justify-center rounded-md">
        <BeerIcon className="size-4" />
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
