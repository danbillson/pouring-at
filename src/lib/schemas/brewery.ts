import { z } from "zod";

export const createBrewerySchema = z.object({
  name: z.string().min(1, "Name is required"),
  // Add address fields from the form schema
  addressLine1: z.string().min(1, "Address is required").optional(), // Optional for action if called internally?
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required").optional(), // Optional for action?
  postcode: z
    .string()
    .min(1, "Postcode is required")
    .regex(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, {
      message: "Invalid UK postcode format",
    })
    .optional(), // Optional for action?
});

export type CreateBreweryValues = z.infer<typeof createBrewerySchema>;
