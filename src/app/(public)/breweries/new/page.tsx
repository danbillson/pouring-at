"use client";

import { CreateBreweryForm } from "@/components/forms/create-brewery-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function NewBreweryPage() {
  const router = useRouter();

  return (
    <div className="bg-muted min-h-svh p-6 md:p-10">
      <div className="mx-auto w-full max-w-sm md:max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Add a new brewery</CardTitle>
            <CardDescription>
              Enter the details about the brewery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateBreweryForm
              onSuccess={(id) => {
                router.push(`/breweries/${id}`);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
