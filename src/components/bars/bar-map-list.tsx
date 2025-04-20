"use client";

import { BarList } from "@/components/bars/bar-list";
import { BarMap } from "@/components/bars/bar-map";
import { Skeleton } from "@/components/ui/skeleton";
import type { BarWithTaps } from "@/lib/bars";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

type BarMapListProps = {
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

export function BarMapList({ location, style, brewery }: BarMapListProps) {
  const [highlightedBarId, setHighlightedBarId] = useState<string | null>(null);
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["bars", { location, style, brewery }],
    queryFn: () => fetchBars({ location: location || "", style, brewery }),
    enabled: Boolean(location),
  });

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">
          Error loading bars:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  // Combined loading state for map and list
  if (isLoading || !data) {
    return (
      <div className="grid h-full lg:grid-cols-[400px_1fr]">
        <div className="space-y-4 pr-2">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  const bars = data?.bars || [];
  const center = data?.center || { lat: 51.5074, lng: -0.1278 }; // Default center if fetch fails

  return (
    <div className="mx-auto grid h-full w-full max-w-7xl lg:grid-cols-[400px_1fr]">
      <div className="max-h-[600px] overflow-y-auto pb-2 lg:pr-2">
        <BarList
          bars={bars}
          style={style}
          brewery={brewery}
          highlightedBarId={highlightedBarId}
          onListItemHover={setHighlightedBarId}
          onListItemClick={(barId) => {
            router.push(`/bars/${barId}`);
          }}
        />
      </div>
      <div className="h-[600px] w-full">
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
