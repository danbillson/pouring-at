import { bar, brewery } from "@/db/schema";

export type VenueType = "bar" | "brewery";

export type Venue = {
  id: string;
  type: VenueType;
  name: string;
  slug: string | null;
  logo: string | null;
  verified: boolean;
  formattedAddress: string | null;
} & (
  | {
      type: "bar";
      data: typeof bar.$inferSelect;
    }
  | {
      type: "brewery";
      data: typeof brewery.$inferSelect;
    }
);
