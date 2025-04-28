"use client";

import { updateBreweryAction } from "@/actions/brewery";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Brewery } from "@/db/schema";
import { updateBrewerySchema } from "@/lib/schemas/brewery";
import type { UpdateBreweryValues } from "@/lib/schemas/brewery";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type BreweryDetailsFormData = UpdateBreweryValues;

type BreweryDetailsFormProps = {
  brewery: Brewery;
};

export function BreweryDetailsForm({ brewery }: BreweryDetailsFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<BreweryDetailsFormData>({
    resolver: zodResolver(updateBrewerySchema),
    defaultValues: {
      name: brewery.name,
      addressLine1: brewery.addressLine1 ?? "",
      addressLine2: brewery.addressLine2 ?? "",
      city: brewery.city ?? "",
      postcode: brewery.postcode ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: brewery.name,
      addressLine1: brewery.addressLine1 ?? "",
      addressLine2: brewery.addressLine2 ?? "",
      city: brewery.city ?? "",
      postcode: brewery.postcode ?? "",
    });
  }, [brewery, form]);

  function onSubmit(data: BreweryDetailsFormData) {
    startTransition(async () => {
      try {
        const result = await updateBreweryAction(brewery.id, data);

        if (!result.success) {
          throw new Error(result.error || "Failed to update brewery");
        }

        toast.success("Brewery details updated successfully");
      } catch (error) {
        console.error("Failed to update brewery:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to update brewery"
        );
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brewery Name</FormLabel>
              <FormControl>
                <Input placeholder="Cloudwater Brew Co" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressLine1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1</FormLabel>
              <FormControl>
                <Input placeholder="7-8 Piccadilly Trading Estate" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressLine2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2 (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Manchester" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postcode</FormLabel>
              <FormControl>
                <Input placeholder="M1 2HR" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending || !form.formState.isDirty}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
