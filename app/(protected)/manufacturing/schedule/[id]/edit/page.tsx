"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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
import { api } from "@/lib/api-client";
import { ControllerRenderProps } from "react-hook-form";

interface ProductionSchedule {
  id: string;
  productionOrderId: string;
  manufacturingUnitId: string;
  startTime: string;
  endTime: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  resources: string[];
  notes: string | null;
  companyId: string;
}

const formSchema = z.object({
  productionOrderId: z.string().min(1, "Production order is required"),
  manufacturingUnitId: z.string().min(1, "Manufacturing unit is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  resources: z.array(z.string()).min(1, "At least one resource is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditProductionSchedulePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "SCHEDULED",
      resources: [],
      notes: "",
    },
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<ProductionSchedule>(`/production-schedule/${params.id}`);
        if (response.success && response.data) {
          const schedule = response.data;
          form.reset({
            productionOrderId: schedule.productionOrderId,
            manufacturingUnitId: schedule.manufacturingUnitId,
            startTime: new Date(schedule.startTime).toISOString().slice(0, 16),
            endTime: new Date(schedule.endTime).toISOString().slice(0, 16),
            status: schedule.status,
            resources: schedule.resources,
            notes: schedule.notes || "",
          });
        } else {
          setError(response.error || "Failed to load production schedule");
        }
      } catch (err) {
        console.error("Error loading production schedule:", err);
        setError("Failed to load production schedule");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [params.id, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await api.put(`/production-schedule/${params.id}`, values);
      if (response.success) {
        toast.success("Production schedule updated successfully");
        router.push(`/manufacturing/schedule/${params.id}`);
      } else {
        toast.error(response.error || "Failed to update production schedule");
      }
    } catch (err) {
      console.error("Error updating production schedule:", err);
      toast.error("Failed to update production schedule");
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
          <h1 className="text-2xl font-semibold">Edit Production Schedule</h1>
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
        <h1 className="text-2xl font-semibold">Edit Production Schedule</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="productionOrderId"
              render={({ field }: { field: ControllerRenderProps<FormValues, "productionOrderId"> }) => (
                <FormItem>
                  <FormLabel>Production Order</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter production order ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="manufacturingUnitId"
              render={({ field }: { field: ControllerRenderProps<FormValues, "manufacturingUnitId"> }) => (
                <FormItem>
                  <FormLabel>Manufacturing Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter manufacturing unit ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }: { field: ControllerRenderProps<FormValues, "startTime"> }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }: { field: ControllerRenderProps<FormValues, "endTime"> }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }: { field: ControllerRenderProps<FormValues, "status"> }) => (
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
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resources"
              render={({ field }: { field: ControllerRenderProps<FormValues, "resources"> }) => (
                <FormItem>
                  <FormLabel>Resources</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter resources (comma-separated)"
                      value={field.value.join(", ")}
                      onChange={(e) => {
                        const resources = e.target.value
                          .split(",")
                          .map((r) => r.trim())
                          .filter(Boolean);
                        field.onChange(resources);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }: { field: ControllerRenderProps<FormValues, "notes"> }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Input placeholder="Enter notes" {...field} />
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