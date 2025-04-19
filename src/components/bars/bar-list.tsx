"use client";

import { Card } from "@/components/ui/card";
import type { BarWithTaps } from "@/lib/bars";
import { cn } from "@/lib/utils";

type BarListProps = {
  bars: BarWithTaps[];
  style?: string;
  brewery?: string;
  highlightedBarId: string | null;
  onListItemHover: (barId: string | null) => void;
  onListItemClick?: (barId: string) => void; // Optional click handler
};

function getRelevantBeers(bar: BarWithTaps, style?: string, brewery?: string) {
  let beers = bar.taps;

  if (style) {
    beers = beers.filter((tap) => tap.beer.style === style);
  }
  if (brewery) {
    beers = beers.filter((tap) => tap.brewery.name === brewery);
  }

  // Prioritize beers matching the filters, then show others
  const matchingBeers = beers;
  const otherBeers = bar.taps.filter(
    (tap) => !matchingBeers.some((match) => match.beer.id === tap.beer.id)
  );

  return [...matchingBeers, ...otherBeers].slice(0, 4);
}

export function BarList({
  bars,
  style,
  brewery,
  highlightedBarId,
  onListItemHover,
  onListItemClick,
}: BarListProps) {
  if (bars.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-muted-foreground">No bars found matching criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" onMouseLeave={() => onListItemHover(null)}>
      {bars.map((bar) => {
        const relevantBeers = getRelevantBeers(bar, style, brewery);
        const isHighlighted = highlightedBarId === bar.id;

        return (
          <Card
            key={bar.id}
            className={cn(
              "cursor-pointer p-4 transition-colors",
              isHighlighted ? "bg-accent" : "hover:bg-accent/50"
            )}
            onMouseOver={() => onListItemHover(bar.id)}
            onClick={() => onListItemClick?.(bar.id)}
          >
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
                  {style || brewery ? "Matching" : "Featured"} beers:
                </p>
                <ul className="mt-2 space-y-1">
                  {relevantBeers.map((tap) => (
                    <li
                      key={`${bar.id}-${tap.beer.id}`}
                      className="flex items-baseline text-sm"
                    >
                      <p className="font-medium">
                        <span className="text-muted-foreground">
                          {tap.brewery.name}{" "}
                        </span>
                        {tap.beer.name}
                      </p>
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
