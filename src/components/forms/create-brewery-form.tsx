"use client";

import { createBreweryAction } from "@/actions/brewery";
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
import {
  createBrewerySchema,
  type CreateBreweryValues,
} from "@/lib/schemas/brewery";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateBreweryFormProps {
  onSuccess?: (breweryId: string) => void;
  onCancel?: () => void;
}

export function CreateBreweryForm({
  onSuccess,
  onCancel,
}: CreateBreweryFormProps) {
  const form = useForm<CreateBreweryValues>({
    resolver: zodResolver(createBrewerySchema),
    defaultValues: {
      name: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      postcode: "",
    },
  });

  async function onSubmit(data: CreateBreweryValues) {
    try {
      const result = await createBreweryAction(data);

      if (!result.success || !result.data) {
        throw new Error(
          result.error || "Server returned failure without error message."
        );
      }

      toast.success("Brewery created successfully");
      onSuccess?.(result.data.id);
      form.reset();
    } catch (error) {
      console.error("Failed to create brewery:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create brewery"
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Full Circle Brew Co" {...field} />
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
                <Input placeholder="Hoults Yard" {...field} />
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
                <Input placeholder="Byker" {...field} />
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
                <Input placeholder="Newcastle upon Tyne" {...field} />
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
                <Input placeholder="NE6 2HL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Creating..." : "Create Brewery"}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
