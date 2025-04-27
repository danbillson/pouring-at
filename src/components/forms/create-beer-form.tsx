"use client";

import { createBeerAction } from "@/actions/beer";
import { BeerStyleSelect } from "@/components/forms/beer-style-select";
import { BrewerySearch } from "@/components/search/brewery-search";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addBeerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  style: z.string().min(1, "Style is required"),
  abv: z.string().optional(),
  brewery: z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Brewery name is required").optional(),
  }),
});

type AddBeerValues = z.infer<typeof addBeerSchema>;

interface CreateBeerFormProps {
  onSuccess?: (beerId: string) => void;
  onBack?: () => void;
}

export function CreateBeerForm({ onSuccess, onBack }: CreateBeerFormProps) {
  const [newBrewery, setNewBrewery] = useState(false);
  const form = useForm<AddBeerValues>({
    resolver: zodResolver(addBeerSchema),
    defaultValues: {
      name: "",
      brewery: {
        name: "",
      },
      style: "",
      abv: "",
    },
  });

  async function onSubmit(data: AddBeerValues) {
    try {
      const result = await createBeerAction({
        ...data,
        abv: parseFloat(data.abv || "0"),
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to create beer");
      }

      toast.success(`Created ${result.data.name}`);
      onSuccess?.(result.data.id);
      form.reset();
    } catch (error) {
      console.error("Failed to create beer:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create beer"
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {newBrewery ? (
          <FormField
            control={form.control}
            name="brewery"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brewery</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter brewery name"
                    value={field.value.name}
                    onChange={(e) => {
                      field.onChange({ name: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
                <Button
                  type="button"
                  variant="link"
                  className="text-muted-foreground ml-auto inline-block w-fit p-0 underline"
                  onClick={() => setNewBrewery(false)}
                >
                  Search for existing brewery
                </Button>
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="brewery"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brewery</FormLabel>
                <FormControl>
                  <BrewerySearch
                    value={field.value.id}
                    name={field.value.name}
                    onChange={field.onChange}
                    onCreateNew={() => setNewBrewery(true)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter beer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Style</FormLabel>
              <FormControl>
                <BeerStyleSelect
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="abv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ABV (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" placeholder="6.0" {...field} />
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
            {form.formState.isSubmitting ? "Creating..." : "Create Beer"}
          </Button>
          {onBack && (
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
