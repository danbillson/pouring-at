import { z } from "zod";

// Schema for creating a brewery
export const createBrewerySchema = z.object({
  name: z.string().min(1, "Name is required"),
  // Add other fields like address later if needed for creation
});

export type CreateBreweryValues = z.infer<typeof createBrewerySchema>;

// TODO: Add schemas for updating breweries if needed later
