"use server";

import { createBreweryAction } from "@/actions/brewery";
import { db } from "@/db";
import { beer, brewery } from "@/db/schema";
import { hasAccessToBrewery } from "@/lib/auth/access";
import {
  createBeerSchema,
  updateBeerSchema,
  type CreateBeerValues,
  type UpdateBeerValues,
} from "@/lib/schemas/beer";
import { and, eq, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- Fetching Actions ---

export async function getBeerAction(id: string) {
  try {
    const beerData = await db.query.beer.findFirst({
      where: eq(beer.id, id),
      with: {
        brewery: {
          columns: { id: true, name: true, slug: true },
        },
      },
    });
    return { success: true, data: beerData };
  } catch (error) {
    console.error("Error fetching beer:", error);
    return { success: false, error: "Failed to fetch beer data." };
  }
}

export async function searchBeersAction(query: string) {
  if (!query || query.length < 1) {
    return { success: true, data: [] };
  }

  try {
    // Split search into words and create conditions for each word
    const searchTerms = query.split(" ").filter(Boolean);
    const conditions = searchTerms.map((term) =>
      or(ilike(beer.name, `%${term}%`), ilike(brewery.name, `%${term}%`))
    );

    const beers = await db
      .select({
        id: beer.id,
        name: beer.name,
        brewery: {
          id: brewery.id,
          name: brewery.name,
          slug: brewery.slug,
        },
      })
      .from(beer)
      .leftJoin(brewery, eq(beer.breweryId, brewery.id))
      .where(and(...conditions))
      .limit(10);

    return { success: true, data: beers };
  } catch (error) {
    console.error("Error searching beers:", error);
    return { success: false, error: "Failed to search beers." };
  }
}

// --- Mutation Actions ---

export async function createBeerAction(data: CreateBeerValues) {
  const validationResult = createBeerSchema.safeParse(data);
  if (!validationResult.success) {
    console.error("Beer validation failed:", validationResult.error.flatten());
    return { success: false, error: "Invalid form data submitted." };
  }
  const validatedData = validationResult.data;

  try {
    let breweryId = validatedData.brewery.id;

    if (!breweryId) {
      if (!validatedData.brewery.name) {
        throw new Error("Brewery name is required");
      }
      const breweryResult = await createBreweryAction({
        name: validatedData.brewery.name,
      });
      if (!breweryResult.success || !breweryResult.data?.id) {
        console.error(
          "Failed to create brewery during beer creation:",
          breweryResult.error
        );
        throw new Error(
          breweryResult.error || "Failed to create associated brewery"
        );
      }
      breweryId = breweryResult.data.id;
    }

    // Ensure breweryId is a string before using in the query
    if (!breweryId) {
      throw new Error("Brewery ID is missing after creation/validation step.");
    }

    // 3. Check if beer already exists for this brewery (breweryId is now string)
    const existingBeer = await db.query.beer.findFirst({
      where: and(
        eq(beer.name, validatedData.name),
        eq(beer.breweryId, breweryId) // Error fixed: breweryId is string
      ),
      columns: { id: true },
    });

    if (existingBeer) {
      return {
        success: false,
        error: "A beer with this name already exists for this brewery",
      };
    }

    // 4. Insert the new beer
    const [newBeer] = await db
      .insert(beer)
      .values({
        name: validatedData.name,
        style: validatedData.style,
        abv:
          validatedData.abv !== undefined ? validatedData.abv.toString() : null,
        description: validatedData.description,
        breweryId,
      })
      .returning();

    if (!newBeer) {
      throw new Error("Database failed to return created beer.");
    }

    // 5. Revalidate relevant paths (ensure breweryId is valid)
    revalidatePath("/beers");
    revalidatePath(`/beers/${newBeer.id}`);
    if (breweryId) {
      // Check again just in case (should always be true here)
      revalidatePath(`/breweries/${breweryId}`);
    }
    revalidatePath("/dashboard/beers");

    return { success: true, data: newBeer };
  } catch (error) {
    console.error("Error creating beer:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create beer",
    };
  }
}

export async function updateBeerAction(id: string, data: UpdateBeerValues) {
  await hasAccessToBrewery();

  // 1. Validate input data
  const validationResult = updateBeerSchema.safeParse(data);
  if (!validationResult.success) {
    console.error(
      "Beer update validation failed:",
      validationResult.error.flatten()
    );
    return { success: false, error: "Invalid form data submitted." };
  }
  const validatedData = validationResult.data;

  // Prevent updating if no data is provided
  if (Object.keys(validatedData).length === 0) {
    return { success: false, error: "No data provided for update." };
  }

  try {
    // 2. Check if the beer exists
    const existingBeer = await db.query.beer.findFirst({
      where: eq(beer.id, id),
      columns: { id: true, breweryId: true }, // Include breweryId for revalidation
    });

    if (!existingBeer) {
      return { success: false, error: "Beer not found." };
    }

    const updateData: Record<string, unknown> = { ...validatedData };
    if (validatedData.abv !== undefined) {
      updateData.abv =
        validatedData.abv !== null ? validatedData.abv.toString() : null;
    }

    // 3. Update the beer in the database
    const [updatedBeer] = await db
      .update(beer)
      .set(updateData)
      .where(eq(beer.id, id))
      .returning();

    if (!updatedBeer) {
      throw new Error("Database failed to return updated beer.");
    }

    // 4. Revalidate relevant paths
    revalidatePath("/beers");
    revalidatePath(`/beers/${updatedBeer.id}`);
    if (existingBeer.breweryId) {
      revalidatePath(`/breweries/${existingBeer.breweryId}`); // Revalidate the brewery page
    }
    revalidatePath("/dashboard/beers"); // Revalidate dashboard list

    return { success: true, data: updatedBeer };
  } catch (error) {
    console.error("Error updating beer:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update beer",
    };
  }
}

// --- Deletion Action ---

export async function deleteBeerAction(id: string) {
  await hasAccessToBrewery();

  try {
    // 1. Find the beer to get its breweryId for revalidation before deleting
    const beerToDelete = await db.query.beer.findFirst({
      where: eq(beer.id, id),
      columns: { id: true, breweryId: true },
    });

    if (!beerToDelete) {
      return { success: false, error: "Beer not found." };
    }

    // 2. Delete the beer
    const [deletedBeer] = await db
      .delete(beer)
      .where(eq(beer.id, id))
      .returning({ id: beer.id });

    if (!deletedBeer) {
      // This case might occur if the beer was deleted between the findFirst and delete calls
      return {
        success: false,
        error: "Failed to delete beer, it might have been deleted already.",
      };
    }

    // 3. Revalidate relevant paths
    revalidatePath("/beers");
    if (beerToDelete.breweryId) {
      revalidatePath(`/breweries/${beerToDelete.breweryId}`); // Revalidate the brewery page
    }
    revalidatePath("/dashboard/beers"); // Revalidate dashboard list
    // No need to revalidate `/beers/[id]` as it's deleted

    return { success: true };
  } catch (error) {
    console.error("Error deleting beer:", error);
    // Handle potential foreign key constraint errors if beers are linked elsewhere
    if (
      error instanceof Error &&
      error.message.includes("violates foreign key constraint")
    ) {
      return {
        success: false,
        error:
          "Cannot delete this beer as it is currently in use (e.g., on a tap list).",
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete beer",
    };
  }
}
