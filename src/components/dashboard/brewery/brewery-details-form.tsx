"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const updateBrewerySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postcode: z
    .string()
    .min(1, "Postcode is required")
    .regex(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, {
      message: "Invalid UK postcode format",
    }),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type UpdateBreweryValues = z.infer<typeof updateBrewerySchema>;

type BreweryDetailsFormProps = {
  brewery: Brewery;
};

export function BreweryDetailsForm({ brewery }: BreweryDetailsFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<UpdateBreweryValues>({
    resolver: zodResolver(updateBrewerySchema),
    defaultValues: {
      name: brewery.name,
      slug: brewery.slug ?? "",
      addressLine1: brewery.addressLine1 ?? "",
      addressLine2: brewery.addressLine2 ?? "",
      city: brewery.city ?? "",
      postcode: brewery.postcode ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: brewery.name,
      slug: brewery.slug ?? "",
      addressLine1: brewery.addressLine1 ?? "",
      addressLine2: brewery.addressLine2 ?? "",
      city: brewery.city ?? "",
      postcode: brewery.postcode ?? "",
    });
  }, [brewery, form]);

  async function onSubmit(data: UpdateBreweryValues) {
    try {
      const response = await fetch(`/api/breweries/${brewery.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update brewery");
      }

      await queryClient.invalidateQueries({
        queryKey: ["breweries", brewery.id],
      });
      toast.success("Brewery details updated successfully");
    } catch (error) {
      console.error("Failed to update brewery:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update brewery"
      );
    }
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
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="cloudwater" readOnly {...field} />
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
