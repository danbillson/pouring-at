import { LocationInput } from "@/components/search/location-input";
import { TextLoop } from "@/components/ui/text-loop";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="text-2xl font-bold sm:text-4xl lg:text-6xl">
        Searching for a{" "}
        <TextLoop interval={3}>
          <Em>Brown Ale</Em>
          <Em>Porter</Em>
          <Em>Sour</Em>
          <Em>IPA</Em>
        </TextLoop>
        <br />
        in{" "}
        <TextLoop interval={3}>
          <Em>Newcastle?</Em>
          <Em>London?</Em>
          <Em>Edinburgh?</Em>
          <Em>Manchester?</Em>
        </TextLoop>
      </h1>
      <p className="mt-4 max-w-2xl text-lg">
        We&apos;ve got you covered. Find all of your favourite beers with
        real-time tap lists, personalized recommendations based on your taste,
        and a map to guide you to your next perfect pint.
      </p>
      <div className="mt-10 flex flex-col">
        <h3 className="mb-2 text-lg font-bold">Find bars near you</h3>
        <LocationInput
          placeholder="Enter a town, city or postcode..."
          className="bg-background h-10 px-4 py-2 pl-9 md:text-lg"
        />
      </div>
    </div>
  );
}

function Em({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-foreground text-background inline-block -rotate-1 rounded-sm px-1">
      {children}
    </span>
  );
}
