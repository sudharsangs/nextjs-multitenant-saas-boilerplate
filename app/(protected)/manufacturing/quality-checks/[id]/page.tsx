"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

interface QualityCheck {
  id: string;
  productionOrderId: string;
  inspectorId: string;
  status: "PENDING" | "PASSED" | "FAILED";
  type: "INSPECTION" | "TESTING" | "CERTIFICATION";
  result: string | null;
  notes: string | null;
  companyId: string;
}

export default function QualityCheckDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [check, setCheck] = useState<QualityCheck | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCheck = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<QualityCheck>(
          `/quality-checks/${params.id}`
        );
        if (response.success && response.data) {
          setCheck(response.data);
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
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this quality check?")) {
      return;
    }

    try {
      const response = await api.delete(`/quality-checks/${params.id}`);
      if (response.success) {
        toast.success("Quality check deleted successfully");
        router.push("/manufacturing/quality-checks");
      } else {
        toast.error(response.error || "Failed to delete quality check");
      }
    } catch (err) {
      console.error("Error deleting quality check:", err);
      toast.error("Failed to delete quality check");
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
          <h1 className="text-2xl font-semibold">Quality Check Details</h1>
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

  if (!check) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Quality Check Details</h1>
        </div>
        <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-md text-yellow-700">
          <p>Quality check not found</p>
          <Button 
            variant="outline" 
            onClick={() => router.push("/manufacturing/quality-checks")}
            className="mt-4"
          >
            Back to Checks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quality Check Details</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/manufacturing/quality-checks/${params.id}/edit`)}
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
            <h3 className="text-sm font-medium text-gray-500">Check ID</h3>
            <p className="mt-1 text-lg">{check.id}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Type</h3>
            <p className="mt-1 text-lg">{check.type}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Production Order</h3>
            <p className="mt-1 text-lg">#{check.productionOrderId}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Inspector</h3>
            <p className="mt-1 text-lg">#{check.inspectorId}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                check.status === "PASSED"
                  ? "bg-green-100 text-green-800"
                  : check.status === "FAILED"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {check.status}
            </span>
          </div>

          {check.result && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Result</h3>
              <p className="mt-1 text-lg">{check.result}</p>
            </div>
          )}

          {check.notes && (
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Notes</h3>
              <p className="mt-1 text-lg">{check.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 