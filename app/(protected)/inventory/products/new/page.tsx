"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from "@/components/ui/card";
import { api } from "@/lib/api-client";

interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string | null;
}

const unitTypes = [
  { value: "PIECE", label: "Piece" },
  { value: "KG", label: "Kilogram" },
  { value: "LITER", label: "Liter" },
  { value: "METER", label: "Meter" },
  { value: "SQUARE_METER", label: "Square Meter" },
  { value: "CUBIC_METER", label: "Cubic Meter" },
];

interface ProductFormData {
  name: string;
  code: string;
  description: string;
  categoryId: string;
  hsnCode: string;
  unit: string;
  reorderPoint: string;
  safetyStock: string;
  leadTime: string;
  shelfLife: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    code: "",
    description: "",
    categoryId: "",
    hsnCode: "",
    unit: "PIECE",
    reorderPoint: "",
    safetyStock: "",
    leadTime: "",
    shelfLife: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<Category[]>('/categories');
        if (response.success && response.data) {
          setCategories(response.data);
        } else {
          setError(response.error || 'Failed to load categories');
        }
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        reorderPoint: formData.reorderPoint ? parseInt(formData.reorderPoint, 10) : undefined,
        safetyStock: formData.safetyStock ? parseInt(formData.safetyStock, 10) : undefined,
        leadTime: formData.leadTime ? parseInt(formData.leadTime, 10) : undefined,
        shelfLife: formData.shelfLife ? parseInt(formData.shelfLife, 10) : undefined,
      };

      const response = await api.post('/products', payload);
      
      if (response.success) {
        router.push("/inventory/products");
      } else {
        console.error("Error creating product:", response.error);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-2xl font-bold">Create New Product</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main product information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                  <CardDescription>
                    Basic details about the product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="code" className="text-sm font-medium">
                        Product Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="e.g., PRD-001"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      placeholder="Enter product description"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="categoryId" className="text-sm font-medium">
                        Category
                      </label>
                      <div className="flex gap-2">
                        <select
                          id="categoryId"
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleChange}
                          className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => router.push('/inventory/categories/new')}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="hsnCode" className="text-sm font-medium">
                        HSN Code
                      </label>
                      <input
                        id="hsnCode"
                        name="hsnCode"
                        value={formData.hsnCode}
                        onChange={handleChange}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="e.g., 8473"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Settings</CardTitle>
                  <CardDescription>
                    Configure inventory management parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="reorderPoint" className="text-sm font-medium">
                        Reorder Point
                      </label>
                      <input
                        id="reorderPoint"
                        name="reorderPoint"
                        type="number"
                        value={formData.reorderPoint}
                        onChange={handleChange}
                        min="0"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="Minimum quantity before reorder"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="safetyStock" className="text-sm font-medium">
                        Safety Stock
                      </label>
                      <input
                        id="safetyStock"
                        name="safetyStock"
                        type="number"
                        value={formData.safetyStock}
                        onChange={handleChange}
                        min="0"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="Buffer inventory amount"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="leadTime" className="text-sm font-medium">
                        Lead Time (days)
                      </label>
                      <input
                        id="leadTime"
                        name="leadTime"
                        type="number"
                        value={formData.leadTime}
                        onChange={handleChange}
                        min="0"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="Avg. days to receive order"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="shelfLife" className="text-sm font-medium">
                        Shelf Life (days)
                      </label>
                      <input
                        id="shelfLife"
                        name="shelfLife"
                        type="number"
                        value={formData.shelfLife}
                        onChange={handleChange}
                        min="0"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        placeholder="Product shelf life"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="unit" className="text-sm font-medium">
                      Unit of Measure <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    >
                      {unitTypes.map((unit) => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/inventory/products')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex gap-1"
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save Product"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}