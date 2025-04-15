"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useRouter } from "next/navigation";
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
  trigger?: React.ReactNode;
}

export function CreateTapForm({ barId, trigger }: CreateTapFormProps) {
  const router = useRouter();
  const form = useForm<CreateTapValues>({
    resolver: zodResolver(createTapSchema),
    defaultValues: {
      beerId: "",
      barId,
    },
  });

  async function onSubmit(data: CreateTapValues) {
    try {
      const response = await fetch("/api/taps/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create tap");

      router.refresh();
      toast.success("Beer added to tap list");
    } catch (error) {
      console.error("Failed to create tap:", error);
      toast.error("Failed to add beer to tap list");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button>Add a beer</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Beer to Tap List</DialogTitle>
          <DialogDescription>
            Enter the details of the beer to add to the tap list
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-6"
          >
            <FormField
              control={form.control}
              name="beerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beer</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Search for a beer..."
                      autoComplete="off"
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
              {form.formState.isSubmitting ? "Adding..." : "Add Beer"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
