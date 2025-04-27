"use server";

import { db } from "@/db";
import { brewery } from "@/db/schema";
import {
  createBrewerySchema,
  type CreateBreweryValues,
} from "@/lib/schemas/brewery";
import { revalidatePath } from "next/cache";

export async function createBreweryAction(data: CreateBreweryValues) {
  const validationResult = createBrewerySchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, error: "Invalid form data submitted." };
  }
  const validatedData = validationResult.data;

  try {
    const [newBrewery] = await db
      .insert(brewery)
      .values({
        name: validatedData.name,
      })
      .returning();

    if (!newBrewery) {
      throw new Error("Database failed to return created brewery.");
    }

    // 4. Revalidate relevant paths
    revalidatePath("/breweries");
    revalidatePath(`/breweries/${newBrewery.slug}`); // Revalidate new brewery page
    revalidatePath("/search"); // Breweries might appear in general search
    revalidatePath("/dashboard/brewery"); // If a dashboard exists

    return { success: true, data: newBrewery };
  } catch (error) {
    console.error("Error creating brewery:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create brewery",
    };
  }
}

// TODO: Add updateBreweryAction
// TODO: Add deleteBreweryAction
