import { getBeer } from "@/lib/beers";
import Link from "next/link";
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
        <h1 className="text-4xl font-bold">
          {beerData.name}{" "}
          <span className="text-muted-foreground">{beerData.style}</span>
        </h1>
        <Link
          href={`/breweries/${beerData.brewery?.id}`}
          className="text-muted-foreground text-sm hover:underline"
        >
          {beerData.brewery?.name}
        </Link>
        <span className="text-muted-foreground text-sm">
          {beerData.abv && ` • ${beerData.abv}%`}
        </span>
      </div>
    </div>
  );
}
