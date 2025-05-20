"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
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
}

interface BOMComponent {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
}

type BOMStatus = "draft" | "active" | "archived";

interface BOM {
  id: string;
  productId: string;
  product: Product;
  version: string;
  status: BOMStatus;
  components: BOMComponent[];
  notes: string;
  companyId: string;
}

interface FormData {
  version: string;
  status: BOMStatus;
  notes: string;
  components: BOMComponent[];
}

export default function EditBOMPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [bom, setBOM] = useState<BOM | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    version: "",
    status: "draft",
    notes: "",
    components: [],
  });

  const { id } = params;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [bomResponse, productsResponse] = await Promise.all([
          api.get<BOM>(`/boms/${id}`),
          api.get<Product[]>("/products"),
        ]);

        if (bomResponse.success && bomResponse.data) {
          setBOM(bomResponse.data);
          setFormData({
            version: bomResponse.data.version,
            status: bomResponse.data.status,
            notes: bomResponse.data.notes,
            components: bomResponse.data.components,
          });
        } else {
          setError(bomResponse.error || "Failed to load BOM");
        }

        if (productsResponse.success && productsResponse.data) {
          setProducts(productsResponse.data);
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data");
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
      const response = await api.put(`/boms/${id}`, {
        ...formData,
        productId: bom?.productId,
      });

      if (response.success) {
        router.push(`/manufacturing/boms/${id}`);
      } else {
        setError(response.error || "Failed to update BOM");
      }
    } catch (err) {
      console.error("Error updating BOM:", err);
      setError("Failed to update BOM");
    } finally {
      setIsSaving(false);
    }
  };

  const addComponent = () => {
    setFormData((prev) => ({
      ...prev,
      components: [
        ...prev.components,
        {
          id: `temp-${Date.now()}`,
          productId: "",
          product: { id: "", name: "", code: "" },
          quantity: 1,
        },
      ],
    }));
  };

  const removeComponent = (componentId: string) => {
    setFormData((prev) => ({
      ...prev,
      components: prev.components.filter((c) => c.id !== componentId),
    }));
  };

  const updateComponent = (
    componentId: string,
    field: keyof BOMComponent,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      components: prev.components.map((c) => {
        if (c.id === componentId) {
          if (field === "productId") {
            const product = products.find((p) => p.id === value);
            return {
              ...c,
              productId: value as string,
              product: product || { id: "", name: "", code: "" },
            };
          }
          return { ...c, [field]: value };
        }
        return c;
      }),
    }));
  };

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
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/manufacturing/boms")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold">Edit Bill of Materials</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">BOM Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Version
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({ ...prev, version: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value: BOMStatus) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <Textarea
                  value={formData.notes}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Components</h2>
            <Button type="button" onClick={addComponent}>
              <Plus className="h-4 w-4 mr-2" />
              Add Component
            </Button>
          </div>

          <div className="space-y-4">
            {formData.components.map((component) => (
              <div
                key={component.id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Component
                  </label>
                  <Select
                    value={component.productId}
                    onValueChange={(value: string) =>
                      updateComponent(component.id, "productId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a component" />
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

                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={component.quantity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateComponent(
                        component.id,
                        "quantity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    min="1"
                    required
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeComponent(component.id)}
                  className="mt-6"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}

            {formData.components.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No components added to this BOM
              </div>
            )}
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
  );
} 