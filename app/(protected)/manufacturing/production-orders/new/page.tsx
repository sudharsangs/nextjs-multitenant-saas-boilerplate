"use client";

import React, { useState } from "react";
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

interface Product {
  id: string;
  name: string;
  code: string;
  category: {
    id: string;
    name: string;
  };
}

export default function NewProductionOrderPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 1,
    status: "draft",
    notes: "",
  });

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<Product[]>("/products");
        if (response.success && response.data) {
          setProducts(response.data);
        } else {
          setError(response.error || "Failed to load products");
        }
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Failed to load products");
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/production-orders", {
        ...formData,
        startDate: new Date().toISOString(),
      });

      if (response.success) {
        router.push("/manufacturing/production-orders");
      } else {
        setError(response.error || "Failed to create production order");
      }
    } catch (err) {
      console.error("Error creating production order:", err);
      setError("Failed to create production order");
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold">New Production Order</h1>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Order Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product
                  </label>
                  <Select
                    value={formData.productId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, productId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
                        quantity: parseInt(e.target.value) || 1,
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
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Production Order"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 