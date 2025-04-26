"use client";

import type { BarWithTaps } from "@/actions/bar";
import { BarList } from "@/components/bars/bar-list";
import { BarMap } from "@/components/bars/bar-map";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BarMapListProps {
  bars: BarWithTaps[];
  center: { lat: number; lng: number };
  initialStyle?: string;
  initialBrewery?: string;
}

export function BarMapList({
  bars,
  center,
  initialStyle,
  initialBrewery,
}: BarMapListProps) {
  const [highlightedBarId, setHighlightedBarId] = useState<string | null>(null);
  const router = useRouter();

  if (!bars || bars.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">
          No bars found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid h-full w-full max-w-7xl lg:grid-cols-[400px_1fr]">
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto pb-2 lg:pr-2">
        <BarList
          bars={bars}
          style={initialStyle}
          brewery={initialBrewery}
          highlightedBarId={highlightedBarId}
          onListItemHover={setHighlightedBarId}
          onListItemClick={(barId) => {
            router.push(`/bars/${barId}`);
          }}
        />
      </div>
      <div className="h-[calc(100vh-200px)] w-full">
        <BarMap
          bars={bars}
          center={center}
          highlightedBarId={highlightedBarId}
          onMarkerHover={setHighlightedBarId}
        />
      </div>
    </div>
  );
}
