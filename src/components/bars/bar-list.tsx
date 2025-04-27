"use client";

import type { BarWithTaps } from "@/actions/bar";
import { BarCover } from "@/components/bars/bar-cover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
    beers = beers.filter((tap) => tap.brewery.id === brewery);
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
          <Link href={`/bars/${bar.id}`} key={bar.id} className="block">
            <Card
              className={cn(
                "cursor-pointer overflow-hidden transition-colors",
                isHighlighted ? "bg-accent" : "hover:bg-accent/50",
                bar.cover_image && "pt-0"
              )}
              onMouseOver={() => onListItemHover(bar.id)}
              onClick={() => onListItemClick?.(bar.id)}
            >
              <BarCover name={bar.name} path={bar.cover_image} />
              <CardHeader className="flex items-start justify-between">
                <div>
                  <CardTitle className="font-semibold">{bar.name}</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    {bar.distance_km?.toFixed(1)}km away
                  </CardDescription>
                </div>
                <div className="text-right text-sm">
                  <p>{bar.taps.length} beers on tap</p>
                </div>
              </CardHeader>

              {relevantBeers.length > 0 && (
                <CardContent className="mt-4">
                  <p className="text-muted-foreground text-sm font-medium">
                    {style || brewery ? "Matching" : "Recent"} taps:
                  </p>
                  <ul className="mt-2 space-y-1">
                    {relevantBeers.map((tap) => (
                      <li
                        key={`${bar.id}-${tap.beer.id}`}
                        className="flex flex-col items-baseline text-sm"
                      >
                        <p className="font-medium">
                          {tap.beer.name}{" "}
                          <span className="text-muted-foreground">
                            {tap.beer.style}
                          </span>
                        </p>
                        <span className="text-muted-foreground text-xs">
                          {tap.brewery.name}
                          {tap.beer.abv && ` • ${tap.beer.abv}%`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
