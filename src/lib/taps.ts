"use server";

import { db } from "@/db";
import { tap } from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTaps(barId: string) {
  try {
    return await db.query.tap.findMany({
      with: {
        beer: {
          with: {
            brewery: true,
          },
        },
      },
      where: and(eq(tap.barId, barId), isNull(tap.tappedOff)),
    });
  } catch (error) {
    console.error("Failed to get taps:", error);
    return [];
  }
}

export async function createTap(barId: string, beerId: string) {
  try {
    const existingTap = await db
      .select()
      .from(tap)
      .where(
        and(eq(tap.barId, barId), eq(tap.beerId, beerId), isNull(tap.tappedOff))
      )
      .limit(1);

    if (existingTap.length > 0) {
      return { success: false, error: "This beer is already on tap" };
    }

    await db.insert(tap).values({
      barId,
      beerId,
      tappedOn: new Date(),
    });

    revalidatePath(`/bars/${barId}`, "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to create tap:", error);
    return { success: false, error: "Failed to add beer to tap list" };
  }
}
