"use client";

import { createBeerAction, updateBeerAction } from "@/actions/beer";
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
import { beerStyles } from "@/lib/constants/beer-style";
import { uploadImage } from "@/lib/storage/image-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Creating..." : "Create Beer"}
    </Button>
  );
}

export function AddBeerForm({ breweryId, onSuccess }: AddBeerFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const form = useForm<AddBeerValues>({
    resolver: zodResolver(addBeerSchema),
    defaultValues: {
      name: "",
      style: "",
      abv: "",
      description: "",
    },
  });

  async function handleSubmitAction() {
    const values = form.getValues();

    try {
      const result = await createBeerAction({
        name: values.name,
        style: values.style,
        abv: values.abv ? parseFloat(values.abv) : undefined,
        description: values.description,
        brewery: {
          id: breweryId,
        },
      });

      if (!result.success || !result.data) {
        toast.error(result.error || "Failed to create beer");
        return;
      }

      toast.success("Beer created successfully");
      const newBeerId = result.data.id;

      if (selectedImage) {
        const extension = selectedImage.type.split("/")[1];
        if (!extension) {
          toast.error("Invalid image file type.");
        } else {
          const path = `beers/${newBeerId}/logo-${Date.now()}.${extension}`;
          const { data: uploadData, error: uploadError } = await uploadImage({
            bucket: "logos",
            file: selectedImage,
            path,
          });

          if (uploadError) {
            console.error("Image upload failed:", uploadError);
            toast.warning("Beer created, but image upload failed.");
          } else if (uploadData?.fullPath) {
            const updateResult = await updateBeerAction(newBeerId, {
              image: uploadData.fullPath,
            });
            if (!updateResult.success) {
              toast.error(
                updateResult.error || "Failed to save image path to beer."
              );
              console.error(
                "Failed to update beer with image path:",
                updateResult.error
              );
            } else {
              toast.success("Beer image saved.");
            }
          }
        }
      }

      form.reset();
      setSelectedImage(null);

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
      <form action={handleSubmitAction} className="space-y-4">
        <ImageUploadInput
          altText="Beer image preview"
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

        <SubmitButton />
      </form>
    </Form>
  );
}
