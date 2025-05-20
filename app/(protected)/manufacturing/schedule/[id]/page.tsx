"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";

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

export default function ProductionScheduleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [schedule, setSchedule] = useState<ProductionSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<ProductionSchedule>(
          `/production-schedule/${params.id}`
        );
        if (response.success && response.data) {
          setSchedule(response.data);
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
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this production schedule?")) {
      return;
    }

    try {
      const response = await api.delete(`/production-schedule/${params.id}`);
      if (response.success) {
        toast.success("Production schedule deleted successfully");
        router.push("/manufacturing/schedule");
      } else {
        toast.error(response.error || "Failed to delete production schedule");
      }
    } catch (err) {
      console.error("Error deleting production schedule:", err);
      toast.error("Failed to delete production schedule");
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
          <h1 className="text-2xl font-semibold">Production Schedule</h1>
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

  if (!schedule) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Production Schedule</h1>
        </div>
        <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md text-yellow-700">
          <p>Production schedule not found</p>
          <Button
            variant="outline"
            onClick={() => router.push("/manufacturing/schedule")}
            className="mt-4"
          >
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Production Schedule</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/manufacturing/schedule/${params.id}/edit`)}
          >
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Schedule Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">ID</p>
                <p className="font-medium">{schedule.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Production Order</p>
                <p className="font-medium">#{schedule.productionOrderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Manufacturing Unit</p>
                <p className="font-medium">#{schedule.manufacturingUnitId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    schedule.status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : schedule.status === "CANCELLED"
                      ? "bg-red-100 text-red-800"
                      : schedule.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {schedule.status}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Schedule Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Start Time</p>
                <p className="font-medium">
                  {new Date(schedule.startTime).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Time</p>
                <p className="font-medium">
                  {new Date(schedule.endTime).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Resources</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {schedule.resources.map((resource, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
              {schedule.notes && (
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="font-medium">{schedule.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 