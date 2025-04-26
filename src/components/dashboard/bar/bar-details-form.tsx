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
import { Bar } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const updateBarSchema = z.object({
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
});

type UpdateBarValues = z.infer<typeof updateBarSchema>;

type BarDetailsFormProps = {
  bar: Bar;
};

export function BarDetailsForm({ bar }: BarDetailsFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<UpdateBarValues>({
    resolver: zodResolver(updateBarSchema),
    defaultValues: {
      name: bar.name,
      slug: bar.slug ?? "",
      addressLine1: bar.addressLine1 ?? "",
      addressLine2: bar.addressLine2 ?? "",
      city: bar.city ?? "",
      postcode: bar.postcode ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: bar.name,
      slug: bar.slug ?? "",
      addressLine1: bar.addressLine1 ?? "",
      addressLine2: bar.addressLine2 ?? "",
      city: bar.city ?? "",
      postcode: bar.postcode ?? "",
    });
  }, [bar, form]);

  async function onSubmit(data: UpdateBarValues) {
    try {
      const response = await fetch(`/api/bars/${bar.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update bar");
      }

      await queryClient.invalidateQueries({ queryKey: ["bars", bar.id] });
      toast.success("Bar details updated successfully");
    } catch (error) {
      console.error("Failed to update bar:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update bar"
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
              <FormLabel>Bar Name</FormLabel>
              <FormControl>
                <Input placeholder="Mikkeller Bar London" {...field} />
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
                <Input placeholder="mikkeller-bar-london" readOnly {...field} />
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
                <Input placeholder="2-4 Hackney Road" {...field} />
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
                <Input placeholder="London" {...field} />
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
                <Input placeholder="E2 7NS" {...field} />
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
