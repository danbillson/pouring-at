"use client";

import { BeerSearch } from "@/components/search/beer-search";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createTap } from "@/lib/taps";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createTapSchema = z.object({
  beerId: z.string().min(1, "Beer is required"),
  barId: z.string().min(1, "Bar is required"),
});

type CreateTapValues = z.infer<typeof createTapSchema>;

interface CreateTapFormProps {
  barId: string;
  defaultBeerId?: string;
  onSuccess?: () => void;
  onCreateBeer?: () => void;
}

export function CreateTapForm({
  barId,
  defaultBeerId = "",
  onSuccess,
  onCreateBeer,
}: CreateTapFormProps) {
  const form = useForm<CreateTapValues>({
    resolver: zodResolver(createTapSchema),
    defaultValues: {
      beerId: defaultBeerId,
      barId,
    },
  });

  async function onSubmit(data: CreateTapValues) {
    try {
      const result = await createTap(data.barId, data.beerId);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Beer added to tap list");
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create tap:", error);
      toast.error("Failed to add beer to tap list");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="beerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beer</FormLabel>
              <FormControl>
                <BeerSearch
                  value={field.value}
                  onChange={field.onChange}
                  onCreateNew={onCreateBeer}
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
          {form.formState.isSubmitting ? "Adding..." : "Add tap"}
        </Button>
      </form>
    </Form>
  );
}
