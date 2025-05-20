"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

const formSchema = z.object({
  productionOrderId: z.string().min(1, "Production order is required"),
  inspectorId: z.string().min(1, "Inspector is required"),
  status: z.enum(["PENDING", "PASSED", "FAILED"]),
  type: z.enum(["INSPECTION", "TESTING", "CERTIFICATION"]),
  result: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function EditQualityCheckPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productionOrderId: "",
      inspectorId: "",
      status: "PENDING",
      type: "INSPECTION",
      result: "",
      notes: "",
    },
  });

  useEffect(() => {
    const fetchCheck = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<FormData>(`/quality-checks/${params.id}`);
        if (response.success && response.data) {
          form.reset(response.data);
        } else {
          setError(response.error || "Failed to load quality check");
        }
      } catch (err) {
        console.error("Error loading quality check:", err);
        setError("Failed to load quality check");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheck();
  }, [params.id, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await api.put(`/quality-checks/${params.id}`, data);
      if (response.success && response.data) {
        toast.success("Quality check updated successfully");
        router.push(`/manufacturing/quality-checks/${params.id}`);
      } else {
        toast.error(response.error || "Failed to update quality check");
      }
    } catch (err) {
      console.error("Error updating quality check:", err);
      toast.error("Failed to update quality check");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Edit Quality Check</h1>
        </div>
        <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-700">
          <p>{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Quality Check</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="productionOrderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Production Order ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter production order ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inspectorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inspector ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter inspector ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INSPECTION">Inspection</SelectItem>
                      <SelectItem value="TESTING">Testing</SelectItem>
                      <SelectItem value="CERTIFICATION">Certification</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PASSED">Passed</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="result"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Result</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter quality check result"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any additional notes"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 