"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";

interface BOM {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    code: string;
  };
  version: string;
  status: "draft" | "active" | "archived";
  components: {
    id: string;
    productId: string;
    product: {
      id: string;
      name: string;
      code: string;
    };
    quantity: number;
  }[];
  notes: string;
  companyId: string;
  lastUpdated: string;
}

export default function ViewBOMPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [bom, setBOM] = useState<BOM | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBOM = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<BOM>(`/boms/${params.id}`);
        if (response.success && response.data) {
          setBOM(response.data);
        } else {
          setError(response.error || "Failed to load BOM");
        }
      } catch (err) {
        console.error("Error loading BOM:", err);
        setError("Failed to load BOM");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBOM();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error || !bom) {
    return (
      <div className="p-4">
        <div className="text-red-500">{error || "BOM not found"}</div>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/manufacturing/boms")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to BOMs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/manufacturing/boms")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold">Bill of Materials</h1>
        </div>
        <Button onClick={() => router.push(`/manufacturing/boms/${bom.id}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit BOM
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Product Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Product Name
              </label>
              <div className="mt-1">{bom.product.name}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Product Code
              </label>
              <div className="mt-1">{bom.product.code}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Version
              </label>
              <div className="mt-1">{bom.version}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    bom.status === "active"
                      ? "bg-green-100 text-green-800"
                      : bom.status === "archived"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {bom.status.charAt(0).toUpperCase() + bom.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Last Updated
              </label>
              <div className="mt-1">
                {new Date(bom.lastUpdated).toLocaleString()}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Notes
              </label>
              <div className="mt-1 whitespace-pre-wrap">{bom.notes || "No notes"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Components</h2>
          {bom.components.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No components added to this BOM
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Component</th>
                    <th className="text-left p-4">Code</th>
                    <th className="text-left p-4">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {bom.components.map((component) => (
                    <tr key={component.id} className="border-b">
                      <td className="p-4">{component.product.name}</td>
                      <td className="p-4">{component.product.code}</td>
                      <td className="p-4">{component.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 