"use client";

import { updateBeerAction } from "@/actions/beer";
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
import { Separator } from "@/components/ui/separator";
import { Beer } from "@/db/schema";
import { beerStyles } from "@/lib/constants/beer-style";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { BeerImageUpload } from "./beer-image-upload";

const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL!;

const editBeerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  style: z.string().min(1, "Style is required"),
  abv: z.string().optional(),
  description: z.string().optional(),
});

type EditBeerValues = z.infer<typeof editBeerSchema>;

interface EditBeerFormProps {
  beer: Beer;
  onSuccess?: () => void;
}

export function EditBeerForm({ beer, onSuccess }: EditBeerFormProps) {
  const form = useForm<EditBeerValues>({
    resolver: zodResolver(editBeerSchema),
    defaultValues: {
      name: beer.name,
      style: beer.style ?? "",
      abv: beer.abv?.toString() ?? "",
      description: beer.description ?? "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: EditBeerValues) {
    try {
      const result = await updateBeerAction(beer.id, {
        name: data.name,
        style: data.style,
        abv: parseFloat(data.abv || "0")),
        description: data.description,
      });

      if (!result.success) {
        toast.error(result.error || "Failed to update beer");
        return;
      }

      toast.success("Beer updated successfully");
      onSuccess?.(); // Close drawer/modal
    } catch (error) {
      console.error("Failed to update beer:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update beer"
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <div className="bg-muted relative aspect-square w-full rounded-lg">
            {beer.image ? (
              <Image
                key={beer.image}
                src={`${storageUrl}/${beer.image}`}
                alt={beer.name}
                className="rounded-lg object-cover"
                fill
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground text-sm">No image</p>
              </div>
            )}
            <BeerImageUpload beerId={beer.id} />
          </div>
        </div>

        <Separator className="my-8" />

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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
