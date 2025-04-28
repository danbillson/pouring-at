import { getBreweryAction } from "@/actions/brewery";
import { notFound } from "next/navigation";

export default async function BreweryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { success, data: breweryData, error } = await getBreweryAction(id);

  if (!success || !breweryData) {
    console.error("Failed to load brewery page:", error);
    notFound();
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <h1 className="text-4xl font-bold">{breweryData.name}</h1>
        <p className="text-muted-foreground text-sm">
          {breweryData.formattedAddress}
        </p>
      </div>
    </div>
  );
}
