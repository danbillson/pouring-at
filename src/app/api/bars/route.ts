import { searchBars } from "@/lib/bars";
import { geocodeLocation } from "@/lib/geocoding";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");
  const style = searchParams.get("style");
  const brewery = searchParams.get("brewery");

  if (!location) {
    return NextResponse.json(
      { error: "Location is required" },
      { status: 400 }
    );
  }

  try {
    const coords = await geocodeLocation(location);
    const bars = await searchBars({
      lat: coords.lat,
      lng: coords.lng,
      style: style || undefined,
      brewery: brewery || undefined,
    });

    return NextResponse.json({
      bars,
      location: coords,
    });
  } catch (error) {
    console.error("Error fetching bars:", error);
    return NextResponse.json(
      { error: "Failed to fetch bars" },
      { status: 500 }
    );
  }
}
