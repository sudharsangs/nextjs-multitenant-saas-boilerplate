"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
}

export default function EditProductionOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [productionOrder, setProductionOrder] = useState<ProductionOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    quantity: 0,
    status: "",
    notes: "",
    endDate: "",
  });

  const { id } = params;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<ProductionOrder>(`/production-orders/${id}`);
        if (response.success && response.data) {
          setProductionOrder(response.data);
          setFormData({
            quantity: response.data.quantity,
            status: response.data.status,
            notes: response.data.notes,
            endDate: response.data.endDate || "",
          });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const response = await api.put(`/production-orders/${id}`, {
        ...formData,
        productId: productionOrder?.productId,
        startDate: productionOrder?.startDate,
      });

      if (response.success) {
        router.push(`/manufacturing/production-orders/${id}`);
      } else {
        setError(response.error || 'Failed to update production order');
      }
    } catch (err) {
      console.error('Error updating production order:', err);
      setError('Failed to update production order');
    } finally {
      setIsSaving(false);
    }
  };

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
            <h1 className="text-2xl font-bold">Edit Production Order</h1>
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
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Production Order</h1>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        quantity: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <p className="font-medium">
                    {new Date(productionOrder.startDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    className="w-full"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 