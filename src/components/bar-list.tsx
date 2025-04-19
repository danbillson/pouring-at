"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { BarWithTaps } from "@/lib/bars";
import { useQuery } from "@tanstack/react-query";

type BarListProps = {
  location?: string;
  style?: string;
  brewery?: string;
};

async function fetchBars(params: {
  location: string;
  style?: string;
  brewery?: string;
}) {
  if (!params.location) return { bars: [], center: { lat: 0, lng: 0 } };

  const searchParams = new URLSearchParams({
    location: params.location,
    ...(params.style && { style: params.style }),
    ...(params.brewery && { brewery: params.brewery }),
  });

  const response = await fetch(`/api/bars?${searchParams}`);
  if (!response.ok) {
    throw new Error("Failed to fetch bars");
  }
  const data = await response.json();
  return {
    bars: data.bars as BarWithTaps[],
    center: data.location as { lat: number; lng: number },
  };
}

function getRelevantBeers(bar: BarWithTaps, style?: string, brewery?: string) {
  let beers = bar.taps;

  if (style) {
    beers = beers.filter((tap) => tap.beer.style === style);
  }
  if (brewery) {
    beers = beers.filter((tap) => tap.brewery.name === brewery);
  }

  return beers.slice(0, 4);
}

export function BarList({ location, style, brewery }: BarListProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["bars", { location, style, brewery }],
    queryFn: () => fetchBars({ location: location || "", style, brewery }),
    enabled: Boolean(location),
  });

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-destructive">
          Error loading bars:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const bars = data?.bars || [];

  if (bars.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-muted-foreground">No bars found in this area</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bars.map((bar) => {
        const relevantBeers = getRelevantBeers(bar, style, brewery);

        return (
          <Card key={bar.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{bar.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {bar.distance_km?.toFixed(1)}km away
                </p>
              </div>
              <div className="text-right text-sm">
                <p>{bar.taps.length} beers on tap</p>
              </div>
            </div>

            {relevantBeers.length > 0 && (
              <div className="mt-4">
                <p className="text-muted-foreground text-sm font-medium">
                  Featured beers:
                </p>
                <ul className="mt-2 space-y-1">
                  {relevantBeers.map((tap) => (
                    <li
                      key={`${bar.id}-${tap.beer.id}`}
                      className="flex items-baseline gap-1.5 text-sm"
                    >
                      <span className="font-medium">{tap.beer.name}</span>
                      <span className="text-muted-foreground">
                        {tap.brewery.name}
                      </span>
                      <span className="text-muted-foreground ml-auto text-xs">
                        {tap.beer.abv}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
