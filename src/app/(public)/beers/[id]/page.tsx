import { getBeer } from "@/lib/beers";
import { notFound } from "next/navigation";

export default async function BeerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const beerData = await getBeer(id);

  if (!beerData) {
    notFound();
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <h1 className="text-4xl font-bold">{beerData.name}</h1>
        <p className="text-muted-foreground text-sm">
          {beerData.brewery?.name}
        </p>
        <p className="text-muted-foreground text-sm">
          {beerData.style}
          {beerData.abv && ` • ${beerData.abv}%`}
        </p>
      </div>
    </div>
  );
}
