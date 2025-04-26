"use server";

import { db } from "@/db";
import { beer as beerSchema } from "@/db/schema";
import { hasAccessToBrewery } from "@/lib/access";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Server Actions for Beer management

type InsertBeer = typeof beerSchema.$inferInsert;
type UpdateBeerData = Partial<
  Omit<InsertBeer, "id" | "breweryId" | "createdAt">
>;

interface CreateBeerData {
  name: string;
  style: string;
  abv: number;
  description?: string | null;
  breweryId: string;
  // Add image path later if handled here
}

export async function createBeerAction(data: CreateBeerData) {
  const userBrewery = await hasAccessToBrewery();

  // Authorization check
  if (!userBrewery || userBrewery.id !== data.breweryId) {
    return {
      success: false,
      error: "Unauthorized: You do not have access to this brewery.",
    };
  }

  try {
    const beerDataToInsert: InsertBeer = {
      name: data.name,
      style: data.style,
      abv: String(data.abv),
      description: data.description,
      breweryId: data.breweryId,
    };

    const [newBeer] = await db
      .insert(beerSchema)
      .values(beerDataToInsert)
      .returning();

    if (!newBeer) {
      throw new Error("Database failed to return the created beer.");
    }

    revalidatePath("/dashboard/beers");

    return { success: true, beer: newBeer };
  } catch (error) {
    console.error("Failed to create beer:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create beer",
    };
  }
}

export async function updateBeerAction(id: string, data: UpdateBeerData) {
  const userBrewery = await hasAccessToBrewery();

  if (!userBrewery) {
    return {
      success: false,
      error: "Unauthorized: Brewery access required.",
    };
  }

  // Fetch the beer to check ownership
  const existingBeer = await db.query.beer.findFirst({
    where: eq(beerSchema.id, id),
    columns: { breweryId: true },
  });

  if (!existingBeer) {
    return { success: false, error: "Beer not found." };
  }

  // Authorization check: Ensure user owns the brewery associated with the beer
  if (existingBeer.breweryId !== userBrewery.id) {
    return {
      success: false,
      error: "Unauthorized: You do not have access to this beer's brewery.",
    };
  }

  try {
    const [updatedBeer] = await db
      .update(beerSchema)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(beerSchema.id, id))
      .returning();

    if (!updatedBeer) {
      throw new Error("Database failed to return the updated beer.");
    }

    revalidatePath("/dashboard/beers");
    // Also revalidate specific beer page if it exists
    // revalidatePath(`/beers/${id}`);

    return { success: true, beer: updatedBeer };
  } catch (error) {
    console.error("Failed to update beer:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update beer",
    };
  }
}
