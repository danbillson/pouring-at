import { Map } from "@vis.gl/react-google-maps";

type BarMapProps = {
  center: { lat: number; lng: number };
};

export function BarMap({ center }: BarMapProps) {
  return (
    <Map
      defaultZoom={13}
      center={center}
      gestureHandling={"greedy"}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
