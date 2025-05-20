"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

interface ManufacturingUnit {
  id: string;
  name: string;
  type: "ASSEMBLY" | "MACHINING" | "PACKAGING";
  capacity: number;
  status: "ACTIVE" | "MAINTENANCE" | "INACTIVE";
  locationId: string;
  notes: string | null;
  companyId: string;
}

export default function ManufacturingUnitDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [unit, setUnit] = useState<ManufacturingUnit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnit = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<ManufacturingUnit>(
          `/manufacturing-units/${params.id}`
        );
        if (response.success && response.data) {
          setUnit(response.data);
        } else {
          setError(response.error || "Failed to load manufacturing unit");
        }
      } catch (err) {
        console.error("Error loading manufacturing unit:", err);
        setError("Failed to load manufacturing unit");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnit();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this manufacturing unit?")) {
      return;
    }

    try {
      const response = await api.delete(`/manufacturing-units/${params.id}`);
      if (response.success) {
        toast.success("Manufacturing unit deleted successfully");
        router.push("/manufacturing/units");
      } else {
        toast.error(response.error || "Failed to delete manufacturing unit");
      }
    } catch (err) {
      console.error("Error deleting manufacturing unit:", err);
      toast.error("Failed to delete manufacturing unit");
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
          <h1 className="text-2xl font-semibold">Manufacturing Unit Details</h1>
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

  if (!unit) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Manufacturing Unit Details</h1>
        </div>
        <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md text-yellow-700">
          <p>Manufacturing unit not found</p>
          <Button 
            variant="outline" 
            onClick={() => router.push("/manufacturing/units")}
            className="mt-4"
          >
            Back to Units
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manufacturing Unit Details</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/manufacturing/units/${params.id}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="mt-1 text-lg">{unit.name}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Type</h3>
            <p className="mt-1 text-lg">{unit.type}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Capacity</h3>
            <p className="mt-1 text-lg">{unit.capacity} units</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                unit.status === "ACTIVE"
                  ? "bg-green-100 text-green-800"
                  : unit.status === "MAINTENANCE"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {unit.status}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Location ID</h3>
            <p className="mt-1 text-lg">{unit.locationId}</p>
          </div>

          {unit.notes && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Notes</h3>
              <p className="mt-1 text-lg">{unit.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 