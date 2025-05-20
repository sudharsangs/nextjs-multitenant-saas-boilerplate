"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";

interface ProductionOrder {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    code: string;
    category: {
      id: string;
      name: string;
    };
  };
  quantity: number;
  status: "draft" | "in_progress" | "completed" | "cancelled";
  startDate: string;
  endDate: string | null;
  notes: string;
  companyId: string;
  lastUpdated: string;
}

export default function ViewProductionOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [productionOrder, setProductionOrder] = useState<ProductionOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { id } = params;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<ProductionOrder>(`/production-orders/${id}`);
        if (response.success && response.data) {
          setProductionOrder(response.data);
        } else {
          setError(response.error || 'Failed to load production order');
        }
      } catch (err) {
        console.error('Error loading production order:', err);
        setError('Failed to load production order');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error || !productionOrder) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 container mx-auto p-6">
          <div className="flex items-center gap-2 mb-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Production Order Details</h1>
          </div>
          <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-700">
            <p>{error || 'Production order not found'}</p>
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="mt-4"
            >
              Go Back
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Production Order Details</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(`/manufacturing/production-orders/${id}/edit`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Product Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Product Name</p>
                  <p className="font-medium">{productionOrder.product.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Product Code</p>
                  <p className="font-medium">{productionOrder.product.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{productionOrder.product.category.name}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Order Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="font-medium">{productionOrder.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        productionOrder.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : productionOrder.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : productionOrder.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {productionOrder.status.split("_").map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(" ")}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">
                    {new Date(productionOrder.startDate).toLocaleDateString()}
                  </p>
                </div>
                {productionOrder.endDate && (
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-medium">
                      {new Date(productionOrder.endDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="font-medium whitespace-pre-wrap">{productionOrder.notes}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {new Date(productionOrder.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 