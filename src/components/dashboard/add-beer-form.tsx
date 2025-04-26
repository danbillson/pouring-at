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
import { beerStyles } from "@/lib/beer-style";
import { createBeer } from "@/lib/beers";
import { uploadImage } from "@/lib/image-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const addBeerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  style: z.string().min(1, "Style is required"),
  abv: z.string().optional(),
  description: z.string().optional(),
});

type AddBeerValues = z.infer<typeof addBeerSchema>;

interface AddBeerFormProps {
  breweryId: string;
  onSuccess?: () => void;
}

export function AddBeerForm({ breweryId, onSuccess }: AddBeerFormProps) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const form = useForm<AddBeerValues>({
    resolver: zodResolver(addBeerSchema),
    defaultValues: {
      name: "",
      style: "",
      abv: "",
      description: "",
    },
  });

  async function onSubmit(data: AddBeerValues) {
    try {
      const result = await createBeer({
        name: data.name,
        style: data.style,
        abv: parseFloat(data.abv || "0"),
        description: data.description,
        breweryId,
      });

      if (!result.success || !result.beer) {
        toast.error(result.error);
        return;
      }

      if (selectedImage) {
        const extension = selectedImage.type.split("/")[1];
        const path = `beers/${result.beer.id}/logo.${extension}`;
        const { data: uploadData, error } = await uploadImage({
          bucket: "logos",
          file: selectedImage,
          path,
        });

        if (error) {
          console.error(error);
          return;
        }

        const imageResponse = await fetch(`/api/beers/${result.beer.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: uploadData.fullPath }),
        });

        if (!imageResponse.ok) {
          console.error("Failed to update beer image");
          return;
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["beers"] });
      toast.success("Beer created successfully");
      onSuccess?.();
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
        <div className="bg-muted relative aspect-square w-full rounded-lg">
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedImage(file);
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
          />
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="absolute inset-0 size-full rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Click to add an image
              </p>
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            className="absolute right-2 bottom-2 size-8 rounded-full border-0"
            onClick={() => inputRef.current?.click()}
          >
            <Pencil className="size-4" />
          </Button>
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

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Creating..." : "Create Beer"}
        </Button>
      </form>
    </Form>
  );
}
