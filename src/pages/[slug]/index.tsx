import { useAuth } from "@clerk/nextjs";
import Map from "google-maps-react-markers";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { BeverageList } from "~/components/beverage-list";
import { Marker } from "~/components/marker";
import { Button } from "~/components/ui/button";
import { Layout } from "~/components/ui/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const Bar: NextPage<{ slug: string }> = ({ slug }) => {
  const { data } = api.bars.getBySlug.useQuery({ slug });
  const { userId } = useAuth();

  if (!data) return <Layout>Sorry, we couldn&apos;t find this bar</Layout>;

  const { bar } = data;

  const isOwner = bar.staff.some(({ staffId }) => staffId === userId);

  return (
    <>
      <Head>
        <title>Pouring at {bar.name}</title>
        <meta
          name="description"
          content={`See all of the beers pouring at ${bar.name}`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex max-w-6xl flex-col">
        <div className="flex w-full flex-col px-8 py-16">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{bar.name}</h1>
              <p className="text-xs text-muted-foreground">
                {bar.line1},{bar.line2 && ` ${bar.line2},`} {bar.city},{" "}
                {bar.postcode}
              </p>
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <Button variant="ghost" asChild>
                  <Link href={`/${bar.slug}/branding`}>Branding</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href={`/${bar.slug}/edit`}>Edit</Link>
                </Button>
              </div>
            )}
          </div>

          <h3 className="mt-8 text-xl font-bold">Tap list</h3>
          {bar.beverages.length === 0 ? (
            <p className="text-muted-foreground">
              Nothing listed at {bar.name} yet, check back soon 🍺
            </p>
          ) : (
            <BeverageList beverages={bar.beverages} />
          )}
        </div>
      </main>

      <div className="h-96 w-screen py-4">
        <Map
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          defaultCenter={{ lng: bar.longitude, lat: bar.latitude }}
          defaultZoom={17}
        >
          <Marker bar={bar} lat={bar.latitude} lng={bar.longitude} />
        </Map>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  await ssg.bars.getBySlug.prefetch({ slug });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default Bar;
