import { Bar, Brewery } from "@/db/schema";

export type VenueType = "bar" | "brewery";

export type Venue = {
  type: VenueType;
} & (Bar | Brewery);
