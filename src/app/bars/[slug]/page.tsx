import { TapList } from "@/components/tap-list";
import { db } from "@/db";
import { bar } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function BarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [barData] = await db.select().from(bar).where(eq(bar.slug, slug));

  if (!barData) {
    notFound();
  }

  return (
    <div className="flex min-h-svh flex-col items-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <h1 className="text-4xl font-bold">{barData.name}</h1>
        <p className="text-muted-foreground text-sm">
          {barData.formattedAddress}
        </p>

        <TapList barId={barData.id} />
      </div>
    </div>
  );
}
