"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Map, Marker } from "@vis.gl/react-google-maps";

type Bar = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  taps: Array<{
    beer: { id: string; name: string; style: string; abv: number };
    brewery: { id: string; name: string };
  }>;
};

type BarMapProps = {
  center: { lat: number; lng: number };
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
    bars: data.bars as Bar[],
    center: data.location as { lat: number; lng: number },
  };
}

export function BarMap({ location, style, brewery }: BarMapProps) {
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

  if (isLoading || !data) {
    return <Skeleton className="h-full w-full" />;
  }

  const bars = data?.bars || [];
  const center = data?.center || { lat: 0, lng: 0 };

  return (
    <Map
      defaultZoom={13}
      center={center}
      gestureHandling="greedy"
      style={{ width: "100%", height: "100%" }}
    >
      {bars.map((bar) => (
        <Marker
          key={bar.id}
          position={{ lat: bar.lat, lng: bar.lng }}
          title={bar.name}
          onClick={() => {
            // TODO: Show bar details in a popup
            console.log("Bar taps:", bar.taps);
          }}
        />
      ))}
    </Map>
  );
}
