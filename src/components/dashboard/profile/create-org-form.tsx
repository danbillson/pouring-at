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
import { useState } from "react";
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

type CreateOrgFormProps = {
  onSuccess?: (org: any) => void;
};

export function CreateOrgForm({ onSuccess }: CreateOrgFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm<OrgValues>({
    resolver: zodResolver(orgSchema),
    defaultValues: { name: "", slug: "" },
  });

  async function onSubmit(data: OrgValues) {
    setError(null);
    setLoading(true);
    try {
      const org = await organization.create({
        name: data.name,
        slug: data.slug,
      });
      onSuccess?.(org);
    } catch (e: any) {
      setError(e?.message || "Failed to create organization");
    } finally {
      setLoading(false);
    }
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <div className="text-sm text-red-500">{error}</div>}
        <Button
          type="submit"
          className="w-full"
          disabled={loading || form.formState.isSubmitting}
        >
          {loading ? "Creating..." : "Create Organization"}
        </Button>
      </form>
    </Form>
  );
}
