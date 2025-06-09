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
import { organization } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const orgSchema = z.object({
  name: z.string().min(2, "Organization name required"),
  slug: z
    .string()
    .min(2, "Slug required")
    .regex(/^[a-z0-9-]+$/, "Lowercase, numbers, dashes only"),
});

type OrgValues = z.infer<typeof orgSchema>;

export function CreateOrgForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [slugExists, setSlugExists] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<OrgValues>({
    resolver: zodResolver(orgSchema),
    defaultValues: { name: "", slug: "" },
  });

  function onSubmit(data: OrgValues) {
    setError(null);
    startTransition(async () => {
      try {
        await organization.create({
          name: data.name,
          slug: data.slug,
        });
        router.push("/dashboard");
      } catch (e: unknown) {
        setError(
          e instanceof Error ? e.message : "Failed to create organization"
        );
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is the name of your organization?</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choose a slug for your organization</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onBlur={async () => {
                    const { data } = await organization.checkSlug({
                      slug: field.value,
                    });
                    setSlugExists(data?.status !== true);
                  }}
                />
              </FormControl>
              {slugExists && (
                <FormMessage>
                  This slug is already taken. Please choose another one.
                </FormMessage>
              )}
            </FormItem>
          )}
        />
        {error && <div className="text-sm text-red-500">{error}</div>}
        <Button
          type="submit"
          className="w-full"
          disabled={isPending || form.formState.isSubmitting}
        >
          {isPending ? "Creating..." : "Create Organization"}
        </Button>
      </form>
    </Form>
  );
}
