import { getBrewery } from "@/lib/breweries";
import { notFound } from "next/navigation";

export default async function BreweryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const breweryData = await getBrewery(id);

  if (!breweryData) {
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
