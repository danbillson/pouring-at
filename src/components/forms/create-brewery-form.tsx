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
import { createBrewery } from "@/lib/breweries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createBrewerySchema = z.object({
  name: z.string().min(1, "Name is required"),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
});

type CreateBreweryValues = z.infer<typeof createBrewerySchema>;

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
      const result = await createBrewery(data);

      if (!result.success || !result.data) {
        throw new Error(result.error);
      }

      toast.success("Brewery created successfully");
      onSuccess?.(result.data.id);
    } catch (error) {
      console.error("Failed to create brewery:", error);
      toast.error("Failed to create brewery");
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
                <Input placeholder="Enter brewery name" {...field} />
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
                <Input placeholder="Enter address line 1" {...field} />
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
              <FormLabel>Address Line 2</FormLabel>
              <FormControl>
                <Input placeholder="Enter address line 2" {...field} />
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
                <Input placeholder="Enter city" {...field} />
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
                <Input placeholder="Enter postcode" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Creating..." : "Create Brewery"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
