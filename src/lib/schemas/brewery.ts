import { z } from "zod";

export const createBrewerySchema = z.object({
  name: z.string().min(1, "Name is required"),
  addressLine1: z.string().min(1, "Address is required").optional(),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required").optional(),
  postcode: z
    .string()
    .min(1, "Postcode is required")
    .regex(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, {
      message: "Invalid UK postcode format",
    })
    .optional(),
});

export type CreateBreweryValues = z.infer<typeof createBrewerySchema>;

export const updateBrewerySchema = createBrewerySchema
  .extend({
    addressLine1: z.string().min(1, "Address is required").optional(),
    city: z.string().min(1, "City is required").optional(),
    postcode: z
      .string()
      .min(1, "Postcode is required")
      .regex(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, {
        message: "Invalid UK postcode format",
      })
      .optional(),
    logo: z.string().optional(),
    coverImage: z.string().optional(),
  })
  .partial();

export type UpdateBreweryValues = z.infer<typeof updateBrewerySchema>;
