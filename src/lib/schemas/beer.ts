import { z } from "zod";

// Schema for creating a beer
export const createBeerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  // Brewery can be existing (id) or new (name only)
  brewery: z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Brewery name is required").optional(),
  }),
  style: z.string().min(1, "Style is required"),
  abv: z.number().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export type CreateBeerValues = z.infer<typeof createBeerSchema>;

// Schema for updating a beer (make fields optional)
export const updateBeerSchema = createBeerSchema
  .partial() // Make all fields optional
  .omit({ brewery: true }); // Brewery shouldn't be changed via this action directly

export type UpdateBeerValues = z.infer<typeof updateBeerSchema>;

// TODO: Add schemas for updating beers if needed later
