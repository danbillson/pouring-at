"use client";

import { createBarAction } from "@/actions/bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createBarSchema, type CreateBarValues } from "@/lib/schemas/bar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateBarForm() {
  const router = useRouter();
  const form = useForm<CreateBarValues>({
    resolver: zodResolver(createBarSchema),
    defaultValues: {
      name: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      postcode: "",
    },
  });

  async function onSubmit(data: CreateBarValues) {
    try {
      const result = await createBarAction(data);

      if (!result.success) {
        throw new Error(result.error || "An unknown error occurred");
      }

      toast.success("Bar created successfully!");
      router.push(`/bars/${result.data?.id}`);
      form.reset();
    } catch (error) {
      console.error("Failed to create bar:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create bar"
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Bar</CardTitle>
        <CardDescription>Enter the details of the new bar</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bar Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Mikkeller Bar London"
                      autoComplete="off"
                      {...field}
                    />
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
                    <Input
                      placeholder="2-4 Hackney Road"
                      autoComplete="off"
                      {...field}
                    />
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
                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="" autoComplete="off" {...field} />
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
                    <Input placeholder="London" autoComplete="off" {...field} />
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
                    <Input placeholder="E2 7NS" autoComplete="off" {...field} />
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
              {form.formState.isSubmitting ? "Creating..." : "Create Bar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
