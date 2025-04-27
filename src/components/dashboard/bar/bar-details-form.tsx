"use client";

import { updateBarAction } from "@/actions/bar";
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
import { updateBarSchema, type UpdateBarValues } from "@/lib/schemas/bar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type BarDetailsFormData = Omit<UpdateBarValues, "slug" | "logo" | "coverImage">;

type BarDetailsFormProps = {
  bar: Bar;
};

export function BarDetailsForm({ bar }: BarDetailsFormProps) {
  const form = useForm<BarDetailsFormData>({
    resolver: zodResolver(updateBarSchema),
    defaultValues: {
      name: bar.name,
      addressLine1: bar.addressLine1 ?? "",
      addressLine2: bar.addressLine2 ?? "",
      city: bar.city ?? "",
      postcode: bar.postcode ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: bar.name,
      addressLine1: bar.addressLine1 ?? "",
      addressLine2: bar.addressLine2 ?? "",
      city: bar.city ?? "",
      postcode: bar.postcode ?? "",
    });
  }, [bar, form]);

  async function onSubmit(data: BarDetailsFormData) {
    try {
      const result = await updateBarAction(bar.id, data);

      if (!result.success) {
        throw new Error(result.error || "Failed to update bar");
      }

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
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
