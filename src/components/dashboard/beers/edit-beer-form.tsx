"use client";

import { updateBeerAction } from "@/actions/beer";
import { BeerStyleSelect } from "@/components/forms/beer-style-select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUploadInput } from "@/components/ui/image-upload-input";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Beer } from "@/db/schema";
import { uploadImage } from "@/lib/storage/image-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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
      const textUpdateResult = await updateBeerAction(beer.id, {
        name: data.name,
        style: data.style,
        abv: data.abv ? parseFloat(data.abv) : undefined,
        description: data.description,
      });

      if (!textUpdateResult.success) {
        toast.error(textUpdateResult.error || "Failed to update beer details");
        return;
      }

      toast.success("Beer details updated successfully");

      if (selectedImage) {
        const extension = selectedImage.type.split("/")[1];
        if (!extension) {
          toast.error("Invalid image file type.");
        } else {
          const path = `beers/${beer.id}/logo-${Date.now()}.${extension}`;
          const { data: uploadData, error: uploadError } = await uploadImage({
            bucket: "logos",
            file: selectedImage,
            path,
          });

          if (uploadError) {
            console.error("Image upload failed:", uploadError);
            toast.warning("Beer details saved, but image upload failed.");
          } else if (uploadData?.fullPath) {
            const imageUpdateResult = await updateBeerAction(beer.id, {
              image: uploadData.fullPath,
            });

            if (!imageUpdateResult.success) {
              toast.error(
                imageUpdateResult.error ||
                  "Failed to save new image path to beer."
              );
              console.error(
                "Failed to update beer with image path:",
                imageUpdateResult.error
              );
            } else {
              toast.success("Beer image updated successfully.");
            }
          }
        }
      }

      setSelectedImage(null);
      onSuccess?.();
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
        <ImageUploadInput
          altText={beer.name}
          initialImageUrl={beer.image ? `${storageUrl}/${beer.image}` : null}
          onFileSelect={setSelectedImage}
        />

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
