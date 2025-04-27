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
import { Pencil } from "lucide-react";
import Image from "next/image";
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

  // Use a ref for the form to reset it later if needed
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmitAction() {
    const values = form.getValues();

    try {
      const result = await createBeerAction({
        name: values.name,
        style: values.style,
        abv: parseFloat(values.abv || "0"),
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

      if (selectedImage) {
        const extension = selectedImage.type.split("/")[1];
        if (!extension) {
          toast.error("Invalid image file type.");
        } else {
          const path = `beers/${result.data.id}/logo.${extension}`;
          const { data: uploadData, error: uploadError } = await uploadImage({
            bucket: "logos",
            file: selectedImage,
            path,
          });

          if (uploadError) {
            console.error("Image upload failed:", uploadError);
            toast.warning("Beer created, but image upload failed.");
          } else if (uploadData?.fullPath) {
            // Update the beer record with the image path
            const updateResult = await updateBeerAction(result.data.id, {
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
      setSelectedImage(undefined);
      setPreviewUrl(undefined);

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
      <form ref={formRef} action={handleSubmitAction} className="space-y-4">
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
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="rounded-lg object-cover"
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

        <SubmitButton />
      </form>
    </Form>
  );
}
