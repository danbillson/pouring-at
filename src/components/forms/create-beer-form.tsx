"use client";

import { BrewerySearch } from "@/components/brewery-search";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { beerStyles } from "@/lib/beer-style";
import { createBeer } from "@/lib/beers";
import { createBrewery } from "@/lib/breweries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createBeerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brewery: z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Brewery is required"),
  }),
  style: z.string().min(1, "Style is required"),
  abv: z.string().optional(),
  description: z.string().optional(),
});

type CreateBeerValues = z.infer<typeof createBeerSchema>;

interface CreateBeerFormProps {
  onSuccess?: (beerId: string) => void;
  onBack: () => void;
}

export function CreateBeerForm({ onSuccess, onBack }: CreateBeerFormProps) {
  const [newBrewery, setNewBrewery] = useState(false);
  const form = useForm<CreateBeerValues>({
    resolver: zodResolver(createBeerSchema),
    defaultValues: {
      name: "",
      brewery: {
        name: "",
      },
      style: "",
      abv: "",
      description: "",
    },
  });

  async function onSubmit(data: CreateBeerValues) {
    try {
      let breweryId = data.brewery.id;

      if (!breweryId) {
        const result = await createBrewery({ name: data.brewery.name });

        if (!result.success || !result.data) {
          throw new Error(result.error || "Failed to create brewery");
        }

        breweryId = result.data.id;
      }

      const result = await createBeer({
        name: data.name,
        style: data.style,
        abv: parseFloat(data.abv || "0"),
        description: data.description,
        breweryId,
      });

      toast.success("Beer created successfully");
      onSuccess?.(result.beer.id);
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
            <FormItem>
              <FormLabel>Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(beerStyles).map(([category, styles]) => (
                    <SelectGroup key={category}>
                      <SelectLabel>{category.split("_").join(" ")}</SelectLabel>
                      {styles.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="abv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ABV</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Enter ABV"
                  {...field}
                />
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
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        </div>
      </form>
    </Form>
  );
}
