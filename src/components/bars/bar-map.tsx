"use client";

import type { BarWithTaps } from "@/actions/bar";
import { Map, Marker } from "@vis.gl/react-google-maps";

type BarMapProps = {
  bars: BarWithTaps[];
  center: { lat: number; lng: number };
  highlightedBarId: string | null;
  onMarkerHover: (barId: string | null) => void;
  onMarkerClick?: (barId: string) => void; // Optional click handler
};

export function BarMap({
  bars,
  center,
  highlightedBarId,
  onMarkerHover,
  onMarkerClick,
}: BarMapProps) {
  return (
    <Map
      key={center.lat + "," + center.lng} // Force re-render when center changes
      defaultZoom={13}
      center={center}
      gestureHandling="greedy"
      style={{ width: "100%", height: "100%" }}
      onMouseout={() => onMarkerHover(null)} // Clear highlight when mouse leaves map
    >
      {bars.map((bar) => (
        <Marker
          key={bar.id}
          position={{ lat: bar.lat, lng: bar.lng }}
          title={bar.name}
          opacity={
            highlightedBarId === null || highlightedBarId === bar.id ? 1 : 0.5
          }
          zIndex={highlightedBarId === bar.id ? 100 : 1} // Bring highlighted marker to front
          onMouseOver={() => onMarkerHover(bar.id)}
          onMouseOut={() => onMarkerHover(null)}
          onClick={() => {
            onMarkerClick?.(bar.id);
            console.log("Map marker clicked:", bar.name);
            console.log("Bar taps:", bar.taps);
          }}
        />
      ))}
    </Map>
  );
}
