"use client";

import { CreateBeerForm } from "@/components/forms/create-beer-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function NewBeerPage() {
  const router = useRouter();

  return (
    <div className="bg-muted min-h-svh p-6 md:p-10">
      <div className="mx-auto w-full max-w-sm md:max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Add a new beer</CardTitle>
            <CardDescription>Enter the details about the beer</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateBeerForm
              onSuccess={(id) => {
                router.push(`/beers/${id}`);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
